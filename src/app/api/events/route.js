import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Event } from '@/lib/models';
import { verifyAdminKey } from '@/lib/auth';
import { sanitizeString, validateRequired } from '@/lib/security';
import { validateImage } from '@/lib/imageProcessor';
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

    // Validate cover image
    const coverValidation = validateImage(coverImage, 20);
    if (!coverValidation.valid) {
      return NextResponse.json(
        { success: false, error: `Cover image: ${coverValidation.error}` },
        { status: 400 }
      );
    }

    // Validate additional images if provided
    if (images && Array.isArray(images) && images.length > 0) {
      for (const img of images) {
        const imgValidation = validateImage(img, 20);
        if (!imgValidation.valid) {
          return NextResponse.json(
            { success: false, error: `Invalid image in images array: ${imgValidation.error}` },
            { status: 400 }
          );
        }
      }
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
        maxWidth: 1920,
        maxHeight: 1920,
        quality: 85,
        format: 'avif', // Use AVIF format for better compression
      });
      console.log(`✅ Cover image uploaded to Cloudinary: ${coverImageResult.url}`);
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
          maxWidth: 1920,
          maxHeight: 1920,
          quality: 85,
          format: 'avif', // Use AVIF format for better compression
        });
        imagePublicIds = imagesResults.map(result => result.public_id);
        console.log(`✅ ${imagesResults.length} additional images uploaded to Cloudinary`);
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
