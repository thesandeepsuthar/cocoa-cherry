import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Category } from '@/lib/models';
import { verifyAdminKey } from '@/lib/auth';
import { sanitizeString } from '@/lib/security';
import mongoose from 'mongoose';

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

// GET single category
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    if (!isValidObjectId(id)) return NextResponse.json({ success: false, error: 'Invalid ID' }, { status: 400 });
    await connectDB();
    const category = await Category.findById(id);
    if (!category) return NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: category });
  } catch (error) {
    console.error('Category GET error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch category' }, { status: 500 });
  }
}

// PUT update category (admin)
export async function PUT(request, { params }) {
  try {
    if (!verifyAdminKey(request)) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    const { id } = await params;
    if (!isValidObjectId(id)) return NextResponse.json({ success: false, error: 'Invalid ID' }, { status: 400 });
    await connectDB();
    const body = await request.json();

    const update = {};
    if (body.name !== undefined) update.name = sanitizeString(body.name).slice(0, 100);
    if (body.description !== undefined) update.description = body.description ? sanitizeString(body.description).slice(0, 300) : null;
    if (typeof body.order === 'number') update.order = body.order;
    if (typeof body.isActive === 'boolean') update.isActive = body.isActive;

    const updated = await Category.findByIdAndUpdate(id, update, { new: true });
    if (!updated) return NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: updated, message: 'Category updated' });
  } catch (error) {
    console.error('Category PUT error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update category' }, { status: 500 });
  }
}

// DELETE category (admin)
export async function DELETE(request, { params }) {
  try {
    if (!verifyAdminKey(request)) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    const { id } = await params;
    if (!isValidObjectId(id)) return NextResponse.json({ success: false, error: 'Invalid ID' }, { status: 400 });
    await connectDB();
    const deleted = await Category.findByIdAndDelete(id);
    if (!deleted) return NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 });
    return NextResponse.json({ success: true, message: 'Category deleted' });
  } catch (error) {
    console.error('Category DELETE error:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete category' }, { status: 500 });
  }
}
