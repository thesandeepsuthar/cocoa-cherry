import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { User } from '@/lib/models';
import { authenticateUser } from '@/lib/middleware/auth';

export async function GET(request) {
  try {
    const authResult = await authenticateUser(request);
    
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, message: authResult.message },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: authResult.user._id,
          mobile: authResult.user.mobile,
          name: authResult.user.name,
          email: authResult.user.email,
          address: authResult.user.address,
          createdAt: authResult.user.createdAt
        }
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const authResult = await authenticateUser(request);
    
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, message: authResult.message },
        { status: 401 }
      );
    }

    const { name, email, address } = await request.json();

    // Validate input
    if (!name || name.trim().length < 2) {
      return NextResponse.json(
        { success: false, message: 'Please provide a valid name' },
        { status: 400 }
      );
    }

    if (email && !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    await connectDB();

    // Update user profile
    const updatedUser = await User.findByIdAndUpdate(
      authResult.user._id,
      {
        name: name.trim(),
        email: email?.trim() || undefined,
        address: address || undefined
      },
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: {
          id: updatedUser._id,
          mobile: updatedUser.mobile,
          name: updatedUser.name,
          email: updatedUser.email,
          address: updatedUser.address,
          createdAt: updatedUser.createdAt
        }
      }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}