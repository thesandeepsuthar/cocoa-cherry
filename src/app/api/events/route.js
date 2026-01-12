import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Event } from '@/lib/models';
import { verifyAdminKey } from '@/lib/auth';
import { sanitizeString, validateRequired } from '@/lib/security';
import { compressWithPreset, validateImage } from '@/lib/imageProcessor';

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

    // Validate and compress cover image
    const coverValidation = validateImage(coverImage, 20);
    if (!coverValidation.valid) {
      return NextResponse.json(
        { success: false, error: `Cover image: ${coverValidation.error}` },
        { status: 400 }
      );
    }

    let compressedCoverImage = coverImage;
    let compressionInfo = null;

    try {
      const result = await compressWithPreset(coverImage, 'gallery');
      compressedCoverImage = result.base64;
      compressionInfo = {
        originalSize: `${(result.originalSize / 1024).toFixed(1)}KB`,
        compressedSize: `${(result.compressedSize / 1024).toFixed(1)}KB`,
        savings: result.savings,
      };
      console.log(`✅ Cover image compressed: ${compressionInfo.savings} saved`);
    } catch (compressionError) {
      console.error('⚠️ Cover compression failed, using original:', compressionError.message);
    }

    // Compress additional images if provided
    let compressedImages = [];
    if (images && Array.isArray(images) && images.length > 0) {
      for (const img of images) {
        try {
          const imgValidation = validateImage(img, 20);
          if (imgValidation.valid) {
            const result = await compressWithPreset(img, 'gallery');
            compressedImages.push(result.base64);
          }
        } catch (err) {
          // Skip invalid images
          console.error('⚠️ Image compression failed, skipping:', err.message);
        }
      }
    }

    // Sanitize text inputs
    const sanitizedTitle = sanitizeString(title);
    const sanitizedVenue = sanitizeString(venue);
    const sanitizedDescription = description ? sanitizeString(description) : '';
    const sanitizedHighlights = highlights ? sanitizeString(highlights) : '';

    // Create event
    const newEvent = await Event.create({
      title: sanitizedTitle,
      venue: sanitizedVenue,
      date: new Date(date),
      description: sanitizedDescription,
      images: compressedImages,
      coverImage: compressedCoverImage,
      highlights: sanitizedHighlights,
      order: typeof order === 'number' ? order : 0,
    });

    return NextResponse.json({
      success: true,
      data: newEvent,
      compression: compressionInfo,
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
