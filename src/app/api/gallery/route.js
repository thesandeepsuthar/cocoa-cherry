import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Gallery } from '@/lib/models';
import { verifyAdminKey } from '@/lib/auth';
import { sanitizeString, validateRequired } from '@/lib/security';
import { uploadToCloudinary } from '@/lib/cloudinary';

// In-memory cache for gallery images
let galleryCache = null;
let galleryCacheTimestamp = 0;
const GALLERY_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// GET - Fetch all gallery images (Public)
export async function GET() {
  try {
    // Check cache first
    const now = Date.now();
    if (galleryCache && (now - galleryCacheTimestamp) < GALLERY_CACHE_TTL) {
      return NextResponse.json({
        success: true,
        data: galleryCache,
        cached: true,
      });
    }

    await connectDB();
    
    // Optimized query with projection and lean()
    const images = await Gallery.find({ isActive: true })
      .select('imageData publicId caption alt order createdAt updatedAt')
      .sort({ order: 1, createdAt: -1 })
      .lean(); // Convert to plain JS objects for better performance
    
    // Update cache
    galleryCache = images;
    galleryCacheTimestamp = now;
    
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

    // Sanitize text inputs
    const sanitizedCaption = sanitizeString(caption);
    const sanitizedAlt = sanitizeString(alt || caption);

    if (sanitizedCaption.length > 200) {
      return NextResponse.json(
        { success: false, error: 'Caption must be less than 200 characters' },
        { status: 400 }
      );
    }

    // Upload image to Cloudinary
    let cloudinaryResult = null;
    try {
      cloudinaryResult = await uploadToCloudinary(imageData, {
        folder: 'cocoa-cherry/gallery',
      });
    } catch (uploadError) {
      console.error('Cloudinary upload error:', uploadError);
      return NextResponse.json(
        { success: false, error: 'Failed to upload image to Cloudinary' },
        { status: 500 }
      );
    }

    // Store Cloudinary URL in database
    const newImage = await Gallery.create({
      imageData: cloudinaryResult.secure_url, // Store Cloudinary URL
      publicId: cloudinaryResult.public_id, // Store public_id for future deletion
      caption: sanitizedCaption,
      alt: sanitizedAlt,
      order: typeof order === 'number' ? order : 0,
    });

    // Invalidate cache
    galleryCache = null;

    return NextResponse.json({
      success: true,
      data: newImage,
      cloudinary: {
        url: cloudinaryResult.url,
        public_id: cloudinaryResult.public_id,
        size: `${(cloudinaryResult.bytes / 1024).toFixed(1)}KB`,
      },
      message: 'Image uploaded and added successfully',
    });
  } catch (error) {
    console.error('Gallery POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add image' },
      { status: 500 }
    );
  }
}
