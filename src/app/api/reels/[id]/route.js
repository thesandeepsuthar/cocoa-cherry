import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Reel } from '@/lib/models';
import { verifyAdminKey } from '@/lib/auth';
import { sanitizeString, isValidUrl } from '@/lib/security';
import { uploadToCloudinary, deleteFromCloudinary } from '@/lib/cloudinary';
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

    const reel = await Reel.findById(id);
    if (!reel) {
      return NextResponse.json(
        { success: false, error: 'Reel not found' },
        { status: 404 }
      );
    }

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

    // Handle thumbnail upload to Cloudinary
    if (body.thumbnailData) {
      // Check if it's a Cloudinary URL or needs to be uploaded
      const isCloudinaryUrl = body.thumbnailData.includes('cloudinary.com');
      
      if (!isCloudinaryUrl) {
        try {
          const thumbnailResult = await uploadToCloudinary(body.thumbnailData, {
            folder: 'cocoa-cherry/reels',
          });
          updateData.thumbnailData = thumbnailResult.secure_url;
          updateData.thumbnailPublicId = thumbnailResult.public_id;
          console.log(`✅ Reel thumbnail uploaded to Cloudinary: ${thumbnailResult.url}`);
        } catch (uploadError) {
          console.error('Cloudinary upload error:', uploadError);
          return NextResponse.json(
            { success: false, error: 'Failed to upload thumbnail' },
            { status: 500 }
          );
        }
      } else {
        // It's already a Cloudinary URL, keep it
        updateData.thumbnailData = body.thumbnailData;
      }
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
      const currentOrder = reel.order;

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
          
          console.log(`🔄 Order swapped: "${reel.caption}" (${currentOrder}→${targetOrder}) ↔ "${itemWithTargetOrder.caption}" (${targetOrder}→${currentOrder})`);
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

    const reel = await Reel.findById(id);
    if (!reel) {
      return NextResponse.json(
        { success: false, error: 'Reel not found' },
        { status: 404 }
      );
    }

    // Delete thumbnail from Cloudinary if public_id exists
    if (reel.thumbnailPublicId) {
      try {
        await deleteFromCloudinary(reel.thumbnailPublicId);
        console.log(`✅ Reel thumbnail deleted from Cloudinary: ${reel.thumbnailPublicId}`);
      } catch (cloudinaryError) {
        console.warn(`⚠️ Failed to delete thumbnail from Cloudinary: ${cloudinaryError.message}`);
      }
    }

    const deletedReel = await Reel.findByIdAndDelete(id);

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
