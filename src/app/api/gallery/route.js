import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Gallery } from '@/lib/models';
import { verifyAdminKey } from '@/lib/auth';
import { sanitizeString, validateBase64Image, validateRequired } from '@/lib/security';

// GET - Fetch all gallery images (Public)
export async function GET() {
  try {
    await connectDB();
    const images = await Gallery.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    
    return NextResponse.json({
      success: true,
      data: images,
    });
  } catch (error) {
    console.error('Gallery GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch gallery' },
      { status: 500 }
    );
  }
}

// POST - Add new gallery image (Admin only)
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
    
    const { imageData, caption, alt, order } = body;
    
    // Validate required fields
    const required = validateRequired(body, ['imageData', 'caption']);
    if (!required.valid) {
      return NextResponse.json(
        { success: false, error: required.error },
        { status: 400 }
      );
    }

    // Validate image size and format (max 5MB)
    const imageValidation = validateBase64Image(imageData, 20);
    if (!imageValidation.valid) {
      return NextResponse.json(
        { success: false, error: imageValidation.error },
        { status: 400 }
      );
    }

    // Sanitize text inputs
    const sanitizedCaption = sanitizeString(caption);
    const sanitizedAlt = sanitizeString(alt || caption);

    if (sanitizedCaption.length > 200) {
      return NextResponse.json(
        { success: false, error: 'Caption must be less than 200 characters' },
        { status: 400 }
      );
    }

    const newImage = await Gallery.create({
      imageData,
      caption: sanitizedCaption,
      alt: sanitizedAlt,
      order: typeof order === 'number' ? order : 0,
    });

    return NextResponse.json({
      success: true,
      data: newImage,
      message: 'Image added successfully',
    });
  } catch (error) {
    console.error('Gallery POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add image' },
      { status: 500 }
    );
  }
}
