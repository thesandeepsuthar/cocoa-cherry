import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Event } from '@/lib/models';
import { verifyAdminKey } from '@/lib/auth';
import { sanitizeString, validateRequired } from '@/lib/security';
import { uploadToCloudinary, uploadMultipleToCloudinary } from '@/lib/cloudinary';

// GET - Fetch all events (Public)
export async function GET() {
  try {
    await connectDB();
    
    const events = await Event.find({ isActive: true })
      .sort({ order: 1, date: -1 })
      .lean();
    
    return NextResponse.json({
      success: true,
      data: events,
    });
  } catch (error) {
    console.error('Events GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

// POST - Add new event (Admin only)
export async function POST(request) {
  try {
    // Verify admin key
    if (!verifyAdminKey(request)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    const body = await request.json();
    
    const { title, venue, date, description, images, coverImage, highlights, order } = body;
    
    // Validate required fields
    const required = validateRequired(body, ['title', 'venue', 'date', 'coverImage']);
    if (!required.valid) {
      return NextResponse.json(
        { success: false, error: required.error },
        { status: 400 }
      );
    }

    // Sanitize text inputs
    const sanitizedTitle = sanitizeString(title);
    const sanitizedVenue = sanitizeString(venue);
    const sanitizedDescription = description ? sanitizeString(description) : '';
    const sanitizedHighlights = highlights ? sanitizeString(highlights) : '';

    // Upload cover image to Cloudinary
    let coverImageResult = null;
    try {
      coverImageResult = await uploadToCloudinary(coverImage, {
        folder: 'cocoa-cherry/events',
      });
    } catch (uploadError) {
      console.error('Cloudinary upload error:', uploadError);
      return NextResponse.json(
        { success: false, error: 'Failed to upload cover image to Cloudinary' },
        { status: 500 }
      );
    }

    // Upload additional images to Cloudinary if provided
    let imagesResults = [];
    let imagePublicIds = [];
    if (images && Array.isArray(images) && images.length > 0) {
      try {
        imagesResults = await uploadMultipleToCloudinary(images, {
          folder: 'cocoa-cherry/events',
        });
        imagePublicIds = imagesResults.map(result => result.public_id);
      } catch (uploadError) {
        console.error('Cloudinary multiple upload error:', uploadError);
        return NextResponse.json(
          { success: false, error: 'Failed to upload images to Cloudinary' },
          { status: 500 }
        );
      }
    }

    // Create event
    const newEvent = await Event.create({
      title: sanitizedTitle,
      venue: sanitizedVenue,
      date: new Date(date),
      description: sanitizedDescription,
      images: imagesResults.map(result => result.secure_url),
      imagePublicIds: imagePublicIds,
      coverImage: coverImageResult.secure_url,
      coverImagePublicId: coverImageResult.public_id,
      highlights: sanitizedHighlights,
      order: typeof order === 'number' ? order : 0,
    });

    return NextResponse.json({
      success: true,
      data: newEvent,
      cloudinary: {
        coverImage: {
          url: coverImageResult.url,
          public_id: coverImageResult.public_id,
          size: `${(coverImageResult.bytes / 1024).toFixed(1)}KB`,
        },
        images: imagesResults.map(result => ({
          url: result.url,
          public_id: result.public_id,
          size: `${(result.bytes / 1024).toFixed(1)}KB`,
        })),
      },
      message: 'Event added successfully',
    });
  } catch (error) {
    console.error('Events POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add event' },
      { status: 500 }
    );
  }
}

// PUT - Update event (Admin only)
export async function PUT(request) {
  try {
    if (!verifyAdminKey(request)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    
    // Get ID from URL path
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const id = pathParts[pathParts.length - 1];

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Event ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { title, venue, date, description, images, coverImage, highlights, order } = body;

    const event = await Event.findById(id);
    if (!event) {
      return NextResponse.json(
        { success: false, error: 'Event not found' },
        { status: 404 }
      );
    }

    const updateData = {};

    // Update cover image if provided
    if (coverImage) {
      // Check if it's a Cloudinary URL or needs to be uploaded
      const isCloudinaryUrl = coverImage.includes('cloudinary.com');
      
      if (!isCloudinaryUrl) {
        try {
          const coverImageResult = await uploadToCloudinary(coverImage, {
            folder: 'cocoa-cherry/events',
          });
          updateData.coverImage = coverImageResult.secure_url;
          updateData.coverImagePublicId = coverImageResult.public_id;
        } catch (uploadError) {
          console.error('Cloudinary upload error:', uploadError);
          return NextResponse.json(
            { success: false, error: 'Failed to upload cover image' },
            { status: 500 }
          );
        }
      } else {
        // It's already a Cloudinary URL, keep it
        updateData.coverImage = coverImage;
      }
    }

    // Update additional images if provided
    if (images && Array.isArray(images) && images.length > 0) {
      const newImages = [];
      const existingImages = [];

      // Separate new images from existing ones
      images.forEach(img => {
        if (img.includes('cloudinary.com')) {
          existingImages.push(img);
        } else {
          newImages.push(img);
        }
      });

      // Upload new images to Cloudinary
      if (newImages.length > 0) {
        try {
          const imagesResults = await uploadMultipleToCloudinary(newImages, {
            folder: 'cocoa-cherry/events',
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

    // Update text fields
    if (title) updateData.title = sanitizeString(title);
    if (venue) updateData.venue = sanitizeString(venue);
    if (date) updateData.date = new Date(date);
    if (description !== undefined) updateData.description = sanitizeString(description);
    if (highlights !== undefined) updateData.highlights = sanitizeString(highlights);
    if (order !== undefined) updateData.order = order;

    const updatedEvent = await Event.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    return NextResponse.json({
      success: true,
      data: updatedEvent,
      message: 'Event updated successfully',
    });
  } catch (error) {
    console.error('Events PUT error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update event' },
      { status: 500 }
    );
  }
}

// DELETE - Delete event (Admin only)
export async function DELETE(request) {
  try {
    if (!verifyAdminKey(request)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Event ID is required' },
        { status: 400 }
      );
    }

    const event = await Event.findById(id);
    if (!event) {
      return NextResponse.json(
        { success: false, error: 'Event not found' },
        { status: 404 }
      );
    }

    // Delete images from Cloudinary
    if (event.coverImagePublicId) {
      try {
        const { deleteFromCloudinary } = await import('@/lib/cloudinary');
        await deleteFromCloudinary(event.coverImagePublicId);
      } catch (error) {
        console.warn(`⚠️ Failed to delete cover image: ${error.message}`);
      }
    }

    if (event.imagePublicIds && Array.isArray(event.imagePublicIds)) {
      try {
        const { deleteFromCloudinary } = await import('@/lib/cloudinary');
        for (const publicId of event.imagePublicIds) {
          await deleteFromCloudinary(publicId);
        }
      } catch (error) {
        console.warn(`⚠️ Failed to delete images: ${error.message}`);
      }
    }

    // Delete from database
    await Event.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: 'Event deleted successfully',
    });
  } catch (error) {
    console.error('Events DELETE error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete event' },
      { status: 500 }
    );
  }
}
