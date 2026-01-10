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

    if (typeof body.isActive === 'boolean') {
      updateData.isActive = body.isActive;
    }

    // Handle order swapping
    let swappedWith = null;
    if (typeof body.order === 'number') {
      const targetOrder = body.order;
      
      // Get current item to find its current order
      const currentItem = await Gallery.findById(id);
      if (!currentItem) {
        return NextResponse.json(
          { success: false, error: 'Image not found' },
          { status: 404 }
        );
      }

      const currentOrder = currentItem.order;

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
          
          console.log(`🔄 Order swapped: "${currentItem.caption}" (${currentOrder}→${targetOrder}) ↔ "${itemWithTargetOrder.caption}" (${targetOrder}→${currentOrder})`);
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
      compression: compressionInfo,
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
