import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Gallery } from '@/lib/models';
import { verifyAdminKey } from '@/lib/auth';
import { sanitizeString, validateRequired } from '@/lib/security';
import { uploadToCloudinary } from '@/lib/cloudinary';

// GET - Fetch all gallery images (Public)
export async function GET() {
  try {
    await connectDB();
    
    // First, get sorted IDs without loading imageData into memory
    const sortedIds = await Gallery.find({ isActive: true })
      .select('_id order createdAt')
      .sort({ order: 1, createdAt: -1 })
      .lean();
    
    // Then fetch full documents in the sorted order
    const ids = sortedIds.map(doc => doc._id);
    const imagesMap = new Map();
    
    // Fetch all images
    const images = await Gallery.find({ _id: { $in: ids } }).lean();
    images.forEach(img => imagesMap.set(img._id.toString(), img));
    
    // Return in sorted order
    const sortedImages = ids.map(id => imagesMap.get(id.toString())).filter(Boolean);
    
    return NextResponse.json({
      success: true,
      data: sortedImages,
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
      console.log(`✅ Image uploaded to Cloudinary: ${cloudinaryResult.url}`);
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
