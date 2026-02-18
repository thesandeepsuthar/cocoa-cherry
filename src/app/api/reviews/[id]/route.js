import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Review } from '@/lib/models';
import { verifyAdminKey } from '@/lib/auth';
import { sanitizeString, isValidEmail } from '@/lib/security';
import { uploadToCloudinary, deleteFromCloudinary } from '@/lib/cloudinary';
import mongoose from 'mongoose';

// Validate MongoDB ObjectId
function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

// GET - Fetch single review by ID (Admin only)
export async function GET(request, { params }) {
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
    const review = await Review.findById(id);
    
    if (!review) {
      return NextResponse.json(
        { success: false, error: 'Review not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: review,
    });
  } catch (error) {
    console.error('Review GET by ID error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch review' },
      { status: 500 }
    );
  }
}

// PUT - Update review (Admin only - full edit capabilities)
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

    // Get current review
    const currentReview = await Review.findById(id);
    if (!currentReview) {
      return NextResponse.json(
        { success: false, error: 'Review not found' },
        { status: 404 }
      );
    }

    // Build update object with validation
    const updateData = { updatedAt: new Date() };
    let cloudinaryResult = null;

    // Update name
    if (body.name !== undefined) {
      const sanitizedName = sanitizeString(body.name);
      if (sanitizedName.length === 0) {
        return NextResponse.json(
          { success: false, error: 'Name is required' },
          { status: 400 }
        );
      }
      if (sanitizedName.length > 100) {
        return NextResponse.json(
          { success: false, error: 'Name must be less than 100 characters' },
          { status: 400 }
        );
      }
      updateData.name = sanitizedName;
    }

    // Update email
    if (body.email !== undefined) {
      const sanitizedEmail = sanitizeString(body.email).toLowerCase();
      if (!isValidEmail(sanitizedEmail)) {
        return NextResponse.json(
          { success: false, error: 'Invalid email format' },
          { status: 400 }
        );
      }
      updateData.email = sanitizedEmail;
    }

    // Update cake type
    if (body.cakeType !== undefined) {
      updateData.cakeType = sanitizeString(body.cakeType).slice(0, 100);
    }

    // Update rating
    if (body.rating !== undefined) {
      const rating = Number(body.rating);
      if (isNaN(rating) || rating < 1 || rating > 5) {
        return NextResponse.json(
          { success: false, error: 'Rating must be between 1 and 5' },
          { status: 400 }
        );
      }
      updateData.rating = rating;
    }

    // Update review text
    if (body.review !== undefined) {
      const sanitizedReview = sanitizeString(body.review);
      if (sanitizedReview.length === 0) {
        return NextResponse.json(
          { success: false, error: 'Review text is required' },
          { status: 400 }
        );
      }
      if (sanitizedReview.length > 1000) {
        return NextResponse.json(
          { success: false, error: 'Review must be less than 1000 characters' },
          { status: 400 }
        );
      }
      updateData.review = sanitizedReview;
    }

    // Update avatar image
    if (body.avatarData !== undefined) {
      if (body.avatarData === null || body.avatarData === '') {
        // Remove avatar
        if (currentReview.avatarPublicId) {
          try {
            await deleteFromCloudinary(currentReview.avatarPublicId);
          } catch (deleteError) {
            console.warn('⚠️ Failed to delete old avatar from Cloudinary:', deleteError.message);
          }
        }
        updateData.avatarData = null;
        updateData.avatarPublicId = null;
      } else {
        // Check if it's a Cloudinary URL or needs to be uploaded
        const isCloudinaryUrl = body.avatarData.includes('cloudinary.com');
        
        if (!isCloudinaryUrl) {
          // Delete old avatar if exists
          if (currentReview.avatarPublicId) {
            try {
              await deleteFromCloudinary(currentReview.avatarPublicId);
            } catch (deleteError) {
              console.warn('⚠️ Failed to delete old avatar from Cloudinary:', deleteError.message);
            }
          }

          // Upload new avatar to Cloudinary
          try {
            cloudinaryResult = await uploadToCloudinary(body.avatarData, {
              folder: 'cocoa-cherry/reviews/avatars',
            });
            updateData.avatarData = cloudinaryResult.secure_url;
            updateData.avatarPublicId = cloudinaryResult.public_id;
          } catch (uploadError) {
            console.error('Cloudinary upload error:', uploadError);
            return NextResponse.json(
              { success: false, error: 'Failed to upload avatar to Cloudinary' },
              { status: 500 }
            );
          }
        } else {
          // It's already a Cloudinary URL, keep it
          updateData.avatarData = body.avatarData;
        }
      }
    }

    // Update approval status
    if (typeof body.isApproved === 'boolean') {
      updateData.isApproved = body.isApproved;
    }
    
    // Update featured status
    if (typeof body.isFeatured === 'boolean') {
      updateData.isFeatured = body.isFeatured;
    }

    const updatedReview = await Review.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedReview) {
      return NextResponse.json(
        { success: false, error: 'Review not found' },
        { status: 404 }
      );
    }

    const response = {
      success: true,
      data: updatedReview,
      message: 'Review updated successfully',
    };

    if (cloudinaryResult) {
      response.cloudinary = {
        url: cloudinaryResult.url,
        public_id: cloudinaryResult.public_id,
        size: `${(cloudinaryResult.bytes / 1024).toFixed(1)}KB`,
      };
    }

    return NextResponse.json(response);
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
