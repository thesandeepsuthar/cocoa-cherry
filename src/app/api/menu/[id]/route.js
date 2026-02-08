import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Menu, Category } from '@/lib/models';
import { verifyAdminKey } from '@/lib/auth';
import { sanitizeString } from '@/lib/security';
import { uploadToCloudinary, deleteFromCloudinary } from '@/lib/cloudinary';
import mongoose from 'mongoose';

// Validate MongoDB ObjectId
function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

// Helper: findOrCreate category by name
async function findOrCreateCategoryByName(name) {
  if (!name) return null;
  const sanitized = sanitizeString(name).slice(0, 100);
  let category = await Category.findOne({ name: sanitized });
  if (!category) {
    category = await Category.create({ name: sanitized });
  }
  return category;
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
    const menuItem = await Menu.findById(id).populate({ path: 'category', select: 'name', strictPopulate: false });
    
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
    
    console.log('Menu PUT received:', { id, body });

    // Get current menu item to check for existing Cloudinary public_id
    const currentMenuItem = await Menu.findById(id);
    if (!currentMenuItem) {
      return NextResponse.json(
        { success: false, error: 'Menu item not found' },
        { status: 404 }
      );
    }

    // Build update object with validation
    const updateData = { updatedAt: new Date() };
    let cloudinaryResult = null;

    if (body.imageData) {
      // Delete old image from Cloudinary if it exists
      if (currentMenuItem.publicId) {
        try {
          await deleteFromCloudinary(currentMenuItem.publicId);
          console.log(`🗑️ Deleted old menu image from Cloudinary: ${currentMenuItem.publicId}`);
        } catch (deleteError) {
          console.error('⚠️ Failed to delete old image from Cloudinary:', deleteError.message);
        }
      }

      // Upload new image to Cloudinary
      try {
        cloudinaryResult = await uploadToCloudinary(body.imageData, {
          folder: 'cocoa-cherry/menu',
        });
        updateData.imageData = cloudinaryResult.secure_url;
        updateData.publicId = cloudinaryResult.public_id;
        console.log(`✅ New menu image uploaded to Cloudinary: ${cloudinaryResult.url}`);
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
        return NextResponse.json(
          { success: false, error: 'Failed to upload image to Cloudinary' },
          { status: 500 }
        );
      }
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

    // Handle category update: accept categoryId (ObjectId), categoryName (string), or null to unset
    if (body.categoryId !== undefined) {
      console.log('Updating category with categoryId:', body.categoryId);
      if (body.categoryId === null || body.categoryId === '') {
        updateData.category = null;
      } else if (isValidObjectId(body.categoryId)) {
        updateData.category = body.categoryId;
        console.log('Category set to:', body.categoryId);
      }
    } else if (body.categoryName !== undefined) {
      console.log('Updating category with categoryName:', body.categoryName);
      if (body.categoryName === null || body.categoryName === '') {
        updateData.category = null;
      } else {
        const cat = await findOrCreateCategoryByName(body.categoryName);
        if (cat) updateData.category = cat._id;
      }
    }
    
    console.log('UpdateData before save:', updateData);

    // Handle order swapping
    let swappedWith = null;
    if (typeof body.order === 'number') {
      const targetOrder = body.order;
      const currentOrder = currentMenuItem.order;

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
          
          console.log(`🔄 Order swapped: "${currentMenuItem.name}" (${currentOrder}→${targetOrder}) ↔ "${itemWithTargetOrder.name}" (${targetOrder}→${currentOrder})`);
        }
      }

      updateData.order = targetOrder;
    }

    const updatedMenuItem = await Menu.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).populate({ path: 'category', select: 'name', strictPopulate: false });

    if (!updatedMenuItem) {
      return NextResponse.json(
        { success: false, error: 'Menu item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedMenuItem,
      cloudinary: cloudinaryResult ? {
        url: cloudinaryResult.url,
        public_id: cloudinaryResult.public_id,
        size: `${(cloudinaryResult.bytes / 1024).toFixed(1)}KB`,
      } : null,
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

    // Delete image from Cloudinary if public_id exists
    if (deletedMenuItem.publicId) {
      try {
        await deleteFromCloudinary(deletedMenuItem.publicId);
        console.log(`🗑️ Deleted menu image from Cloudinary: ${deletedMenuItem.publicId}`);
      } catch (deleteError) {
        console.error('⚠️ Failed to delete image from Cloudinary:', deleteError.message);
      }
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
