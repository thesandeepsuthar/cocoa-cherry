import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Reel } from '@/lib/models';
import { verifyAdminKey } from '@/lib/auth';
import { sanitizeString, validateBase64Image, isValidUrl } from '@/lib/security';
import mongoose from 'mongoose';

// Validate MongoDB ObjectId
function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

// GET - Fetch single reel
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    
    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid reel ID' },
        { status: 400 }
      );
    }

    await connectDB();
    const reel = await Reel.findById(id);
    
    if (!reel) {
      return NextResponse.json(
        { success: false, error: 'Reel not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: reel,
    });
  } catch (error) {
    console.error('Reel GET by ID error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch reel' },
      { status: 500 }
    );
  }
}

// PUT - Update reel (Admin only)
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
        { success: false, error: 'Invalid reel ID' },
        { status: 400 }
      );
    }

    await connectDB();
    const body = await request.json();

    // Build update object with validation
    const updateData = { updatedAt: new Date() };

    if (body.videoUrl !== undefined) {
      if (!isValidUrl(body.videoUrl)) {
        return NextResponse.json(
          { success: false, error: 'Invalid video URL format' },
          { status: 400 }
        );
      }
      updateData.videoUrl = body.videoUrl.trim();
    }

    if (body.thumbnailData) {
      const imageValidation = validateBase64Image(body.thumbnailData, 20);
      if (!imageValidation.valid) {
        return NextResponse.json(
          { success: false, error: imageValidation.error },
          { status: 400 }
        );
      }
      updateData.thumbnailData = body.thumbnailData;
    }

    if (body.caption !== undefined) {
      updateData.caption = sanitizeString(body.caption).slice(0, 200);
    }

    if (typeof body.isActive === 'boolean') {
      updateData.isActive = body.isActive;
    }

    // Handle order swapping
    let swappedWith = null;
    if (typeof body.order === 'number') {
      const targetOrder = body.order;
      
      const currentItem = await Reel.findById(id);
      if (!currentItem) {
        return NextResponse.json(
          { success: false, error: 'Reel not found' },
          { status: 404 }
        );
      }

      const currentOrder = currentItem.order;

      if (currentOrder !== targetOrder) {
        const itemWithTargetOrder = await Reel.findOne({ 
          order: targetOrder, 
          _id: { $ne: id }
        });

        if (itemWithTargetOrder) {
          await Reel.findByIdAndUpdate(
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

    const updatedReel = await Reel.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updatedReel) {
      return NextResponse.json(
        { success: false, error: 'Reel not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedReel,
      swappedWith: swappedWith,
      message: swappedWith 
        ? `Order swapped with "${swappedWith.caption}"` 
        : 'Reel updated successfully',
    });
  } catch (error) {
    console.error('Reel PUT error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update reel' },
      { status: 500 }
    );
  }
}

// DELETE - Delete reel (Admin only)
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
        { success: false, error: 'Invalid reel ID' },
        { status: 400 }
      );
    }

    await connectDB();

    const deletedReel = await Reel.findByIdAndDelete(id);

    if (!deletedReel) {
      return NextResponse.json(
        { success: false, error: 'Reel not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Reel deleted successfully',
    });
  } catch (error) {
    console.error('Reel DELETE error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete reel' },
      { status: 500 }
    );
  }
}
