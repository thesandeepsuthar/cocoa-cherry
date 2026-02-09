import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { RateList } from '@/lib/models';
import { verifyAdminKey } from '@/lib/auth';
import { sanitizeString } from '@/lib/security';
import mongoose from 'mongoose';

// Validate MongoDB ObjectId
function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

// GET - Fetch single rate list item
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    
    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid item ID' },
        { status: 400 }
      );
    }

    await connectDB();
    const item = await RateList.findById(id);
    
    if (!item) {
      return NextResponse.json(
        { success: false, error: 'Item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    console.error('Error fetching rate list item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch item' },
      { status: 500 }
    );
  }
}

// PUT - Update rate list item (admin only)
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
        { success: false, error: 'Invalid item ID' },
        { status: 400 }
      );
    }
    
    await connectDB();
    const body = await request.json();

    // Build update object with validation
    const updateData = { updatedAt: new Date() };

    if (body.category !== undefined) {
      updateData.category = sanitizeString(body.category).slice(0, 50);
    }

    if (body.item !== undefined) {
      updateData.item = sanitizeString(body.item).slice(0, 100);
    }

    if (body.description !== undefined) {
      updateData.description = sanitizeString(body.description).slice(0, 300);
    }

    if (typeof body.price === 'number' && body.price >= 0) {
      updateData.price = body.price;
    }

    if (body.discountPrice !== undefined) {
      if (body.discountPrice === null) {
        updateData.discountPrice = null;
      } else if (typeof body.discountPrice === 'number' && body.discountPrice >= 0) {
        updateData.discountPrice = body.discountPrice;
      }
    }

    if (body.unit !== undefined) {
      const allowedUnits = ['per kg', 'per piece', 'per box', 'per dozen', 'per set', 'per serving'];
      updateData.unit = allowedUnits.includes(body.unit) ? body.unit : 'per kg';
    }

    if (typeof body.isAvailable === 'boolean') {
      updateData.isAvailable = body.isAvailable;
    }

    // Handle order swapping
    let swappedWith = null;
    if (typeof body.order === 'number') {
      const targetOrder = body.order;
      
      const currentItem = await RateList.findById(id);
      if (!currentItem) {
        return NextResponse.json(
          { success: false, error: 'Item not found' },
          { status: 404 }
        );
      }

      const currentOrder = currentItem.order;

      if (currentOrder !== targetOrder) {
        // For RateList, also match by category when swapping
        const itemWithTargetOrder = await RateList.findOne({ 
          order: targetOrder, 
          category: currentItem.category, // Same category
          _id: { $ne: id }
        });

        if (itemWithTargetOrder) {
          await RateList.findByIdAndUpdate(
            itemWithTargetOrder._id,
            { order: currentOrder, updatedAt: new Date() }
          );
          
          swappedWith = {
            id: itemWithTargetOrder._id,
            item: itemWithTargetOrder.item,
            oldOrder: targetOrder,
            newOrder: currentOrder,
          }; 
        }
      }

      updateData.order = targetOrder;
    }

    const item = await RateList.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!item) {
      return NextResponse.json(
        { success: false, error: 'Item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      data: item,
      swappedWith: swappedWith,
      message: swappedWith 
        ? `Order swapped with "${swappedWith.item}"` 
        : 'Item updated successfully',
    });
  } catch (error) {
    console.error('Error updating rate list item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update item' },
      { status: 500 }
    );
  }
}

// DELETE - Delete rate list item (admin only)
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
        { success: false, error: 'Invalid item ID' },
        { status: 400 }
      );
    }
    
    await connectDB();
    
    const item = await RateList.findByIdAndDelete(id);

    if (!item) {
      return NextResponse.json(
        { success: false, error: 'Item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting rate list item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete item' },
      { status: 500 }
    );
  }
}
