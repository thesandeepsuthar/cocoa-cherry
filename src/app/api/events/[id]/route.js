import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Event } from '@/lib/models';
import { verifyAdminKey } from '@/lib/auth';
import { sanitizeString } from '@/lib/security';
import { compressWithPreset, validateImage } from '@/lib/imageProcessor';
import mongoose from 'mongoose';

// Validate MongoDB ObjectId
function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

// GET - Fetch single event
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    
    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid event ID' },
        { status: 400 }
      );
    }

    await connectDB();
    const event = await Event.findById(id);
    
    if (!event) {
      return NextResponse.json(
        { success: false, error: 'Event not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: event,
    });
  } catch (error) {
    console.error('Event GET by ID error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch event' },
      { status: 500 }
    );
  }
}

// PUT - Update event (Admin only)
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
        { success: false, error: 'Invalid event ID' },
        { status: 400 }
      );
    }

    await connectDB();
    const body = await request.json();

    // Build update object with only allowed fields
    const updateData = { updatedAt: new Date() };
    let compressionInfo = null;

    // Handle cover image update
    if (body.coverImage) {
      const imageValidation = validateImage(body.coverImage, 20);
      if (!imageValidation.valid) {
        return NextResponse.json(
          { success: false, error: `Cover image: ${imageValidation.error}` },
          { status: 400 }
        );
      }

      try {
        const result = await compressWithPreset(body.coverImage, 'gallery');
        updateData.coverImage = result.base64;
        compressionInfo = {
          originalSize: `${(result.originalSize / 1024).toFixed(1)}KB`,
          compressedSize: `${(result.compressedSize / 1024).toFixed(1)}KB`,
          savings: result.savings,
        };
      } catch (compressionError) {
        console.error('⚠️ Cover compression failed, using original:', compressionError.message);
        updateData.coverImage = body.coverImage;
      }
    }

    // Handle additional images update
    if (body.images && Array.isArray(body.images)) {
      const compressedImages = [];
      for (const img of body.images) {
        try {
          const imgValidation = validateImage(img, 20);
          if (imgValidation.valid) {
            const result = await compressWithPreset(img, 'gallery');
            compressedImages.push(result.base64);
          }
        } catch (err) {
          console.error('⚠️ Image compression failed, skipping:', err.message);
        }
      }
      updateData.images = compressedImages;
    }

    // Handle text fields
    if (body.title !== undefined) {
      updateData.title = sanitizeString(body.title).slice(0, 150);
    }

    if (body.venue !== undefined) {
      updateData.venue = sanitizeString(body.venue).slice(0, 200);
    }

    if (body.description !== undefined) {
      updateData.description = sanitizeString(body.description).slice(0, 1000);
    }

    if (body.highlights !== undefined) {
      updateData.highlights = sanitizeString(body.highlights).slice(0, 200);
    }

    if (body.date !== undefined) {
      updateData.date = new Date(body.date);
    }

    if (typeof body.isActive === 'boolean') {
      updateData.isActive = body.isActive;
    }

    // Handle order swapping
    let swappedWith = null;
    if (typeof body.order === 'number') {
      const targetOrder = body.order;
      
      const currentItem = await Event.findById(id);
      if (!currentItem) {
        return NextResponse.json(
          { success: false, error: 'Event not found' },
          { status: 404 }
        );
      }

      const currentOrder = currentItem.order;

      if (currentOrder !== targetOrder) {
        const itemWithTargetOrder = await Event.findOne({ 
          order: targetOrder, 
          _id: { $ne: id }
        });

        if (itemWithTargetOrder) {
          await Event.findByIdAndUpdate(
            itemWithTargetOrder._id,
            { order: currentOrder, updatedAt: new Date() }
          );
          
          swappedWith = {
            id: itemWithTargetOrder._id,
            title: itemWithTargetOrder.title,
            oldOrder: targetOrder,
            newOrder: currentOrder,
          };
          
          console.log(`🔄 Order swapped: "${currentItem.title}" (${currentOrder}→${targetOrder}) ↔ "${itemWithTargetOrder.title}" (${targetOrder}→${currentOrder})`);
        }
      }

      updateData.order = targetOrder;
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updatedEvent) {
      return NextResponse.json(
        { success: false, error: 'Event not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedEvent,
      compression: compressionInfo,
      swappedWith: swappedWith,
      message: swappedWith 
        ? `Order swapped with "${swappedWith.title}"` 
        : 'Event updated successfully',
    });
  } catch (error) {
    console.error('Event PUT error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update event' },
      { status: 500 }
    );
  }
}

// DELETE - Delete event (Admin only)
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
        { success: false, error: 'Invalid event ID' },
        { status: 400 }
      );
    }

    await connectDB();

    const deletedEvent = await Event.findByIdAndDelete(id);

    if (!deletedEvent) {
      return NextResponse.json(
        { success: false, error: 'Event not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Event deleted successfully',
    });
  } catch (error) {
    console.error('Event DELETE error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete event' },
      { status: 500 }
    );
  }
}
