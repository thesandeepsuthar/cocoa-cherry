import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Menu } from '@/lib/models';
import { verifyAdminKey } from '@/lib/auth';
import { sanitizeString, validateBase64Image } from '@/lib/security';
import mongoose from 'mongoose';

// Validate MongoDB ObjectId
function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

// GET - Fetch single menu item
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    
    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid menu item ID' },
        { status: 400 }
      );
    }

    await connectDB();
    const menuItem = await Menu.findById(id);
    
    if (!menuItem) {
      return NextResponse.json(
        { success: false, error: 'Menu item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: menuItem,
    });
  } catch (error) {
    console.error('Menu GET by ID error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch menu item' },
      { status: 500 }
    );
  }
}

// PUT - Update menu item (Admin only)
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
        { success: false, error: 'Invalid menu item ID' },
        { status: 400 }
      );
    }

    await connectDB();
    const body = await request.json();

    // Build update object with validation
    const updateData = { updatedAt: new Date() };

    if (body.imageData) {
      const imageValidation = validateBase64Image(body.imageData, 20);
      if (!imageValidation.valid) {
        return NextResponse.json(
          { success: false, error: imageValidation.error },
          { status: 400 }
        );
      }
      updateData.imageData = body.imageData;
    }

    if (body.name !== undefined) {
      updateData.name = sanitizeString(body.name).slice(0, 100);
    }

    if (body.description !== undefined) {
      updateData.description = sanitizeString(body.description).slice(0, 500);
    }

    if (body.badge !== undefined) {
      updateData.badge = body.badge ? sanitizeString(body.badge).slice(0, 50) : null;
    }

    if (typeof body.price === 'number') {
      updateData.price = body.price;
    }

    if (body.discountPrice !== undefined) {
      updateData.discountPrice = typeof body.discountPrice === 'number' ? body.discountPrice : null;
    }

    if (body.priceUnit !== undefined) {
      updateData.priceUnit = body.priceUnit;
    }

    if (typeof body.isActive === 'boolean') {
      updateData.isActive = body.isActive;
    }

    // Handle order swapping
    let swappedWith = null;
    if (typeof body.order === 'number') {
      const targetOrder = body.order;
      
      const currentItem = await Menu.findById(id);
      if (!currentItem) {
        return NextResponse.json(
          { success: false, error: 'Menu item not found' },
          { status: 404 }
        );
      }

      const currentOrder = currentItem.order;

      if (currentOrder !== targetOrder) {
        const itemWithTargetOrder = await Menu.findOne({ 
          order: targetOrder, 
          _id: { $ne: id }
        });

        if (itemWithTargetOrder) {
          await Menu.findByIdAndUpdate(
            itemWithTargetOrder._id,
            { order: currentOrder, updatedAt: new Date() }
          );
          
          swappedWith = {
            id: itemWithTargetOrder._id,
            name: itemWithTargetOrder.name,
            oldOrder: targetOrder,
            newOrder: currentOrder,
          };
          
          console.log(`🔄 Order swapped: "${currentItem.name}" (${currentOrder}→${targetOrder}) ↔ "${itemWithTargetOrder.name}" (${targetOrder}→${currentOrder})`);
        }
      }

      updateData.order = targetOrder;
    }

    const updatedMenuItem = await Menu.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updatedMenuItem) {
      return NextResponse.json(
        { success: false, error: 'Menu item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedMenuItem,
      swappedWith: swappedWith,
      message: swappedWith 
        ? `Order swapped with "${swappedWith.name}"` 
        : 'Menu item updated successfully',
    });
  } catch (error) {
    console.error('Menu PUT error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update menu item' },
      { status: 500 }
    );
  }
}

// DELETE - Delete menu item (Admin only)
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
        { success: false, error: 'Invalid menu item ID' },
        { status: 400 }
      );
    }

    await connectDB();

    const deletedMenuItem = await Menu.findByIdAndDelete(id);

    if (!deletedMenuItem) {
      return NextResponse.json(
        { success: false, error: 'Menu item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Menu item deleted successfully',
    });
  } catch (error) {
    console.error('Menu DELETE error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete menu item' },
      { status: 500 }
    );
  }
}
