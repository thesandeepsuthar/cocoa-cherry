import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Order } from '@/lib/models';
import { authenticateUser } from '@/lib/middleware/auth';

export async function GET(request, { params }) {
  try {
    const authResult = await authenticateUser(request);
    
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, message: authResult.message },
        { status: 401 }
      );
    }

    const { orderId } = params;

    await connectDB();

    const order = await Order.findOne({ 
      orderId, 
      user: authResult.user._id 
    }).populate('items.product', 'name images');

    if (!order) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { order }
    });

  } catch (error) {
    console.error('Get order error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const authResult = await authenticateUser(request);
    
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, message: authResult.message },
        { status: 401 }
      );
    }

    const { orderId } = params;
    const { action } = await request.json();

    await connectDB();

    const order = await Order.findOne({ 
      orderId, 
      user: authResult.user._id 
    });

    if (!order) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }

    // Only allow cancellation of pending orders
    if (action === 'cancel') {
      if (order.status !== 'pending') {
        return NextResponse.json(
          { success: false, message: 'Only pending orders can be cancelled' },
          { status: 400 }
        );
      }

      order.status = 'cancelled';
      await order.save();

      return NextResponse.json({
        success: true,
        message: 'Order cancelled successfully',
        data: { order }
      });
    }

    return NextResponse.json(
      { success: false, message: 'Invalid action' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Update order error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}