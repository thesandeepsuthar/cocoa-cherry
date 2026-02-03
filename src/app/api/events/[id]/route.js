import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Event } from '@/lib/models';
import { verifyAdminKey } from '@/lib/auth';
import { sanitizeString } from '@/lib/security';
import { validateImage } from '@/lib/imageProcessor';
import { uploadToCloudinary, uploadMultipleToCloudinary, deleteFromCloudinary } from '@/lib/cloudinary';
import mongoose from 'mongoose';

// Validate MongoDB ObjectId
function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

// GET - Fetch single event
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    
    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid event ID' },
        { status: 400 }
      );
    }

    await connectDB();
    const event = await Event.findById(id);
    
    if (!event) {
      return NextResponse.json(
        { success: false, error: 'Event not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: event,
    });
  } catch (error) {
    console.error('Event GET by ID error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch event' },
      { status: 500 }
    );
  }
}

// PUT - Update event (Admin only)
export async function PUT(request, { params }) {
  try {
    if (!verifyAdminKey(request)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    
    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid event ID' },
        { status: 400 }
      );
    }

    await connectDB();
    const body = await request.json();

    const event = await Event.findById(id);
    if (!event) {
      return NextResponse.json(
        { success: false, error: 'Event not found' },
        { status: 404 }
      );
    }

    // Build update object with only allowed fields
    const updateData = { updatedAt: new Date() };

    // Handle cover image update
    if (body.coverImage) {
      // Check if it's a new image (base64) or existing URL
      const isNewImage = body.coverImage.startsWith('data:') || (body.coverImage.includes('base64') && !body.coverImage.includes('cloudinary'));
      
      if (isNewImage) {
        const imageValidation = validateImage(body.coverImage, 20);
        if (!imageValidation.valid) {
          return NextResponse.json(
            { success: false, error: `Cover image: ${imageValidation.error}` },
            { status: 400 }
          );
        }

        try {
          const coverImageResult = await uploadToCloudinary(body.coverImage, {
            folder: 'cocoa-cherry/events',
            maxWidth: 1920,
            maxHeight: 1920,
            quality: 85,
            format: 'avif',
          });
          updateData.coverImage = coverImageResult.secure_url;
          updateData.coverImagePublicId = coverImageResult.public_id;
          console.log(`✅ Cover image uploaded to Cloudinary: ${coverImageResult.url}`);
        } catch (uploadError) {
          console.error('Cloudinary upload error:', uploadError);
          return NextResponse.json(
            { success: false, error: 'Failed to upload cover image' },
            { status: 500 }
          );
        }
      } else {
        // It's already a Cloudinary URL, keep it
        updateData.coverImage = body.coverImage;
      }
    }

    // Handle additional images update
    if (body.images && Array.isArray(body.images) && body.images.length > 0) {
      const newImages = [];
      const existingImages = [];

      // Separate new images from existing ones
      body.images.forEach(img => {
        if (img.startsWith('data:') || (img.includes('base64') && !img.includes('cloudinary'))) {
          newImages.push(img);
        } else {
          existingImages.push(img);
        }
      });

      // Upload new images to Cloudinary
      if (newImages.length > 0) {
        // Validate new images
        for (const img of newImages) {
          const imgValidation = validateImage(img, 20);
          if (!imgValidation.valid) {
            return NextResponse.json(
              { success: false, error: `Invalid image: ${imgValidation.error}` },
              { status: 400 }
            );
          }
        }

        try {
          const imagesResults = await uploadMultipleToCloudinary(newImages, {
            folder: 'cocoa-cherry/events',
            maxWidth: 1920,
            maxHeight: 1920,
            quality: 85,
            format: 'avif',
          });

          // Combine existing and newly uploaded images
          const allImageUrls = [
            ...existingImages,
            ...imagesResults.map(r => r.secure_url),
          ];
          const allPublicIds = [
            ...(event.imagePublicIds || []),
            ...imagesResults.map(r => r.public_id),
          ];

          updateData.images = allImageUrls;
          updateData.imagePublicIds = allPublicIds;
          console.log(`✅ ${imagesResults.length} images uploaded to Cloudinary`);
        } catch (uploadError) {
          console.error('Cloudinary upload error:', uploadError);
          return NextResponse.json(
            { success: false, error: 'Failed to upload images' },
            { status: 500 }
          );
        }
      } else {
        // Only existing images, no new uploads
        updateData.images = existingImages;
      }
    }

    // Handle text fields
    if (body.title !== undefined) {
      updateData.title = sanitizeString(body.title).slice(0, 150);
    }

    if (body.venue !== undefined) {
      updateData.venue = sanitizeString(body.venue).slice(0, 200);
    }

    if (body.description !== undefined) {
      updateData.description = sanitizeString(body.description).slice(0, 1000);
    }

    if (body.highlights !== undefined) {
      updateData.highlights = sanitizeString(body.highlights).slice(0, 200);
    }

    if (body.date !== undefined) {
      updateData.date = new Date(body.date);
    }

    if (typeof body.isActive === 'boolean') {
      updateData.isActive = body.isActive;
    }

    // Handle order swapping
    let swappedWith = null;
    if (typeof body.order === 'number') {
      const targetOrder = body.order;
      const currentOrder = event.order;

      if (currentOrder !== targetOrder) {
        const itemWithTargetOrder = await Event.findOne({ 
          order: targetOrder, 
          _id: { $ne: id }
        });

        if (itemWithTargetOrder) {
          await Event.findByIdAndUpdate(
            itemWithTargetOrder._id,
            { order: currentOrder, updatedAt: new Date() }
          );
          
          swappedWith = {
            id: itemWithTargetOrder._id,
            title: itemWithTargetOrder.title,
            oldOrder: targetOrder,
            newOrder: currentOrder,
          };
          
          console.log(`🔄 Order swapped: "${event.title}" (${currentOrder}→${targetOrder}) ↔ "${itemWithTargetOrder.title}" (${targetOrder}→${currentOrder})`);
        }
      }

      updateData.order = targetOrder;
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updatedEvent) {
      return NextResponse.json(
        { success: false, error: 'Event not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedEvent,
      swappedWith: swappedWith,
      message: swappedWith 
        ? `Order swapped with "${swappedWith.title}"` 
        : 'Event updated successfully',
    });
  } catch (error) {
    console.error('Event PUT error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update event' },
      { status: 500 }
    );
  }
}

// DELETE - Delete event (Admin only)
export async function DELETE(request, { params }) {
  try {
    if (!verifyAdminKey(request)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    
    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid event ID' },
        { status: 400 }
      );
    }

    await connectDB();

    const event = await Event.findById(id);
    if (!event) {
      return NextResponse.json(
        { success: false, error: 'Event not found' },
        { status: 404 }
      );
    }

    // Delete cover image from Cloudinary if public_id exists
    if (event.coverImagePublicId) {
      try {
        await deleteFromCloudinary(event.coverImagePublicId);
        console.log(`✅ Cover image deleted from Cloudinary: ${event.coverImagePublicId}`);
      } catch (cloudinaryError) {
        console.warn(`⚠️ Failed to delete cover image: ${cloudinaryError.message}`);
      }
    }

    // Delete additional images from Cloudinary
    if (event.imagePublicIds && Array.isArray(event.imagePublicIds)) {
      try {
        for (const publicId of event.imagePublicIds) {
          await deleteFromCloudinary(publicId);
        }
        console.log(`✅ ${event.imagePublicIds.length} images deleted from Cloudinary`);
      } catch (cloudinaryError) {
        console.warn(`⚠️ Failed to delete images: ${cloudinaryError.message}`);
      }
    }

    const deletedEvent = await Event.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: 'Event deleted successfully',
    });
  } catch (error) {
    console.error('Event DELETE error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete event' },
      { status: 500 }
    );
  }
}
