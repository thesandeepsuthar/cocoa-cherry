import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Gallery } from '@/lib/models';
import { verifyAdminKey } from '@/lib/auth';
import { sanitizeString } from '@/lib/security';
import { uploadToCloudinary, deleteFromCloudinary, extractPublicId } from '@/lib/cloudinary';
import mongoose from 'mongoose';

// Validate MongoDB ObjectId
function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

// GET - Fetch single gallery image
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    
    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid image ID' },
        { status: 400 }
      );
    }

    await connectDB();
    const image = await Gallery.findById(id);
    
    if (!image) {
      return NextResponse.json(
        { success: false, error: 'Image not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: image,
    });
  } catch (error) {
    console.error('Gallery GET by ID error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch image' },
      { status: 500 }
    );
  }
}

// PUT - Update gallery image (Admin only)
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
        { success: false, error: 'Invalid image ID' },
        { status: 400 }
      );
    }

    await connectDB();
    const body = await request.json();

    // Get current image to check for existing Cloudinary public_id
    const currentImage = await Gallery.findById(id);
    if (!currentImage) {
      return NextResponse.json(
        { success: false, error: 'Image not found' },
        { status: 404 }
      );
    }

    // Build update object with only allowed fields
    const updateData = { updatedAt: new Date() };
    let cloudinaryResult = null;

    // If new image is provided, upload to Cloudinary
    if (body.imageData) {
      // Delete old image from Cloudinary if it exists
      if (currentImage.publicId) {
        try {
          await deleteFromCloudinary(currentImage.publicId);
          console.log(`🗑️ Deleted old image from Cloudinary: ${currentImage.publicId}`);
        } catch (deleteError) {
          console.error('⚠️ Failed to delete old image from Cloudinary:', deleteError.message);
          // Continue with upload even if deletion fails
        }
      }

      // Upload new image to Cloudinary
      try {
        cloudinaryResult = await uploadToCloudinary(body.imageData, {
          folder: 'cocoa-cherry/gallery',
        });
        updateData.imageData = cloudinaryResult.secure_url;
        updateData.publicId = cloudinaryResult.public_id;
        console.log(`✅ New image uploaded to Cloudinary: ${cloudinaryResult.url}`);
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
        return NextResponse.json(
          { success: false, error: 'Failed to upload image to Cloudinary' },
          { status: 500 }
        );
      }
    }

    if (body.caption !== undefined) {
      updateData.caption = sanitizeString(body.caption).slice(0, 200);
    }

    if (body.alt !== undefined) {
      updateData.alt = sanitizeString(body.alt).slice(0, 200);
    }

    if (typeof body.isActive === 'boolean') {
      updateData.isActive = body.isActive;
    }

    // Handle order swapping
    let swappedWith = null;
    if (typeof body.order === 'number') {
      const targetOrder = body.order;
      const currentOrder = currentImage.order;

      // Only swap if order is actually changing
      if (currentOrder !== targetOrder) {
        // Find the item that currently has the target order
        const itemWithTargetOrder = await Gallery.findOne({ 
          order: targetOrder, 
          _id: { $ne: id } // Exclude current item
        });

        if (itemWithTargetOrder) {
          // Swap: Give the other item our current order
          await Gallery.findByIdAndUpdate(
            itemWithTargetOrder._id,
            { order: currentOrder, updatedAt: new Date() }
          );
          
          swappedWith = {
            id: itemWithTargetOrder._id,
            caption: itemWithTargetOrder.caption,
            oldOrder: targetOrder,
            newOrder: currentOrder,
          };
          
          console.log(`🔄 Order swapped: "${currentImage.caption}" (${currentOrder}→${targetOrder}) ↔ "${itemWithTargetOrder.caption}" (${targetOrder}→${currentOrder})`);
        }
      }

      updateData.order = targetOrder;
    }

    const updatedImage = await Gallery.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updatedImage) {
      return NextResponse.json(
        { success: false, error: 'Image not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedImage,
      cloudinary: cloudinaryResult ? {
        url: cloudinaryResult.url,
        public_id: cloudinaryResult.public_id,
        size: `${(cloudinaryResult.bytes / 1024).toFixed(1)}KB`,
      } : null,
      swappedWith: swappedWith,
      message: swappedWith 
        ? `Order swapped with "${swappedWith.caption}"` 
        : 'Image updated successfully',
    });
  } catch (error) {
    console.error('Gallery PUT error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update image' },
      { status: 500 }
    );
  }
}

// DELETE - Delete gallery image (Admin only)
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
        { success: false, error: 'Invalid image ID' },
        { status: 400 }
      );
    }

    await connectDB();

    const deletedImage = await Gallery.findByIdAndDelete(id);

    if (!deletedImage) {
      return NextResponse.json(
        { success: false, error: 'Image not found' },
        { status: 404 }
      );
    }

    // Delete image from Cloudinary if public_id exists
    if (deletedImage.publicId) {
      try {
        await deleteFromCloudinary(deletedImage.publicId);
        console.log(`🗑️ Deleted image from Cloudinary: ${deletedImage.publicId}`);
      } catch (deleteError) {
        console.error('⚠️ Failed to delete image from Cloudinary:', deleteError.message);
        // Continue even if Cloudinary deletion fails
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Image deleted successfully',
    });
  } catch (error) {
    console.error('Gallery DELETE error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete image' },
      { status: 500 }
    );
  }
}
