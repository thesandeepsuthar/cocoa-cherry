import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Gallery } from '@/lib/models';
import { verifyAdminKey } from '@/lib/auth';
import { sanitizeString } from '@/lib/security';
import { compressWithPreset, validateImage } from '@/lib/imageProcessor';
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

    // Build update object with only allowed fields
    const updateData = { updatedAt: new Date() };
    let compressionInfo = null;

    // If new image is provided, validate and compress it
    if (body.imageData) {
      const imageValidation = validateImage(body.imageData, 20);
      if (!imageValidation.valid) {
        return NextResponse.json(
          { success: false, error: imageValidation.error },
          { status: 400 }
        );
      }

      // Compress the image
      try {
        const result = await compressWithPreset(body.imageData, 'gallery');
        updateData.imageData = result.base64;
        compressionInfo = {
          originalSize: `${(result.originalSize / 1024).toFixed(1)}KB`,
          compressedSize: `${(result.compressedSize / 1024).toFixed(1)}KB`,
          savings: result.savings,
        };
        console.log(`✅ Image compressed: ${compressionInfo.originalSize} → ${compressionInfo.compressedSize} (${compressionInfo.savings} saved)`);
      } catch (compressionError) {
        console.error('⚠️ Compression failed, using original:', compressionError.message);
        updateData.imageData = body.imageData;
      }
    }

    if (body.caption !== undefined) {
      updateData.caption = sanitizeString(body.caption).slice(0, 200);
    }

    if (body.alt !== undefined) {
      updateData.alt = sanitizeString(body.alt).slice(0, 200);
    }

    if (typeof body.order === 'number') {
      updateData.order = body.order;
    }

    if (typeof body.isActive === 'boolean') {
      updateData.isActive = body.isActive;
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
      compression: compressionInfo,
      message: 'Image updated successfully',
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
