import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Reel } from '@/lib/models';
import { verifyAdminKey } from '@/lib/auth';
import { sanitizeString, validateRequired, isValidUrl } from '@/lib/security';
import { uploadToCloudinary } from '@/lib/cloudinary';

// GET - Fetch all reels (Public)
export async function GET() {
  try {
    await connectDB();
    const reels = await Reel.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    
    return NextResponse.json({
      success: true,
      data: reels,
    });
  } catch (error) {
    console.error('Reels GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch reels' },
      { status: 500 }
    );
  }
}

// POST - Add new reel (Admin only)
export async function POST(request) {
  try {
    if (!verifyAdminKey(request)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    const body = await request.json();
    
    // Validate required fields
    const required = validateRequired(body, ['videoUrl', 'thumbnailData', 'caption']);
    if (!required.valid) {
      return NextResponse.json(
        { success: false, error: required.error },
        { status: 400 }
      );
    }

    const { videoUrl, thumbnailData, caption, order } = body;

    // Validate video URL
    if (!isValidUrl(videoUrl)) {
      return NextResponse.json(
        { success: false, error: 'Invalid video URL format' },
        { status: 400 }
      );
    }

    // Upload thumbnail to Cloudinary
    let thumbnailResult = null;
    try {
      thumbnailResult = await uploadToCloudinary(thumbnailData, {
        folder: 'cocoa-cherry/reels',
      });
      console.log(`✅ Reel thumbnail uploaded to Cloudinary: ${thumbnailResult.url}`);
    } catch (uploadError) {
      console.error('Cloudinary upload error:', uploadError);
      return NextResponse.json(
        { success: false, error: 'Failed to upload thumbnail to Cloudinary' },
        { status: 500 }
      );
    }

    // Sanitize caption
    const sanitizedCaption = sanitizeString(caption);
    if (sanitizedCaption.length > 200) {
      return NextResponse.json(
        { success: false, error: 'Caption must be less than 200 characters' },
        { status: 400 }
      );
    }

    const newReel = await Reel.create({
      videoUrl: videoUrl.trim(),
      thumbnailData: thumbnailResult.secure_url,
      thumbnailPublicId: thumbnailResult.public_id,
      caption: sanitizedCaption,
      order: typeof order === 'number' ? order : 0,
    });

    return NextResponse.json({
      success: true,
      data: newReel,
      cloudinary: {
        url: thumbnailResult.url,
        public_id: thumbnailResult.public_id,
        size: `${(thumbnailResult.bytes / 1024).toFixed(1)}KB`,
      },
      message: 'Reel added successfully',
    });
  } catch (error) {
    console.error('Reels POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add reel' },
      { status: 500 }
    );
  }
}
