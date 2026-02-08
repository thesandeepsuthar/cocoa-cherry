import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Category } from '@/lib/models';
import { verifyAdminKey } from '@/lib/auth';
import { sanitizeString, validateRequired } from '@/lib/security';

// GET - list all active categories (public)
export async function GET() {
  try {
    await connectDB();
    const categories = await Category.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    console.error('Categories GET error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch categories' }, { status: 500 });
  }
}

// POST - create new category (admin)
export async function POST(request) {
  try {
    if (!verifyAdminKey(request)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();

    const required = validateRequired(body, ['name']);
    if (!required.valid) {
      return NextResponse.json({ success: false, error: required.error }, { status: 400 });
    }

    const name = sanitizeString(body.name).slice(0, 100);
    const description = body.description ? sanitizeString(body.description).slice(0, 300) : null;
    const order = typeof body.order === 'number' ? body.order : 0;

    // Ensure unique
    const existing = await Category.findOne({ name });
    if (existing) {
      return NextResponse.json({ success: false, error: 'Category with this name already exists' }, { status: 409 });
    }

    const category = await Category.create({ name, description, order });
    return NextResponse.json({ success: true, data: category, message: 'Category created' });
  } catch (error) {
    console.error('Categories POST error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create category' }, { status: 500 });
  }
}
