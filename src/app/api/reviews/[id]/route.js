import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Review } from '@/lib/models';
import { verifyAdminKey } from '@/lib/auth';
import mongoose from 'mongoose';

// Validate MongoDB ObjectId
function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

// PUT - Update review (Admin only - for approval/featuring)
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
        { success: false, error: 'Invalid review ID' },
        { status: 400 }
      );
    }

    await connectDB();
    const body = await request.json();

    // Only allow specific fields to be updated by admin
    const allowedUpdates = {};
    
    if (typeof body.isApproved === 'boolean') {
      allowedUpdates.isApproved = body.isApproved;
    }
    
    if (typeof body.isFeatured === 'boolean') {
      allowedUpdates.isFeatured = body.isFeatured;
    }

    if (Object.keys(allowedUpdates).length === 0) {
      return NextResponse.json(
        { success: false, error: 'No valid fields to update' },
        { status: 400 }
      );
    }

    allowedUpdates.updatedAt = new Date();

    const updatedReview = await Review.findByIdAndUpdate(
      id,
      allowedUpdates,
      { new: true }
    );

    if (!updatedReview) {
      return NextResponse.json(
        { success: false, error: 'Review not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedReview,
      message: 'Review updated successfully',
    });
  } catch (error) {
    console.error('Review PUT error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update review' },
      { status: 500 }
    );
  }
}

// DELETE - Delete review (Admin only)
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
        { success: false, error: 'Invalid review ID' },
        { status: 400 }
      );
    }

    await connectDB();

    const deletedReview = await Review.findByIdAndDelete(id);

    if (!deletedReview) {
      return NextResponse.json(
        { success: false, error: 'Review not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Review deleted successfully',
    });
  } catch (error) {
    console.error('Review DELETE error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete review' },
      { status: 500 }
    );
  }
}
