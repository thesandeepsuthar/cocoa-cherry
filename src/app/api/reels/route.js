import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Reel } from '@/lib/models';
import { verifyAdminKey } from '@/lib/auth';
import { sanitizeString, validateRequired, isValidUrl } from '@/lib/security';
import { compressWithPreset, validateImage } from '@/lib/imageProcessor';

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

    // Validate thumbnail image
    const imageValidation = validateImage(thumbnailData, 20);
    if (!imageValidation.valid) {
      return NextResponse.json(
        { success: false, error: imageValidation.error },
        { status: 400 }
      );
    }

    // ========================================
    // COMPRESS THUMBNAIL USING SHARP
    // Reduces size by 60-90% while keeping quality
    // ========================================
    let compressedThumbnail = thumbnailData;
    let compressionInfo = null;

    try {
      const result = await compressWithPreset(thumbnailData, 'thumbnail');
      compressedThumbnail = result.base64;
      compressionInfo = {
        originalSize: `${(result.originalSize / 1024).toFixed(1)}KB`,
        compressedSize: `${(result.compressedSize / 1024).toFixed(1)}KB`,
        savings: result.savings,
      };
      console.log(`✅ Thumbnail compressed: ${compressionInfo.originalSize} → ${compressionInfo.compressedSize} (${compressionInfo.savings} saved)`);
    } catch (compressionError) {
      console.error('⚠️ Compression failed, using original:', compressionError.message);
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
      thumbnailData: compressedThumbnail,
      caption: sanitizedCaption,
      order: typeof order === 'number' ? order : 0,
    });

    return NextResponse.json({
      success: true,
      data: newReel,
      compression: compressionInfo,
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
