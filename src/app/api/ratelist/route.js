import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { RateList } from '@/lib/models';
import { verifyAdminKey } from '@/lib/auth';
import { sanitizeString, validateRequired } from '@/lib/security';

// GET - Fetch all rate list items (public)
export async function GET() {
  try {
    await connectDB();
    
    const items = await RateList.find({ isAvailable: true }).sort({ category: 1, order: 1, item: 1 });
    
    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    console.error('Error fetching rate list:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch rate list' },
      { status: 500 }
    );
  }
}

// POST - Add new rate list item (admin only)
export async function POST(request) {
  try {
    if (!verifyAdminKey(request)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    await connectDB();
    
    const body = await request.json();
    
    // Validate required fields
    const required = validateRequired(body, ['category', 'item', 'price']);
    if (!required.valid) {
      return NextResponse.json(
        { success: false, error: required.error },
        { status: 400 }
      );
    }

    const { category, item, description, price, discountPrice, unit, isAvailable, order } = body;
    
    // Validate price
    if (typeof price !== 'number' || price < 0) {
      return NextResponse.json(
        { success: false, error: 'Price must be a positive number' },
        { status: 400 }
      );
    }

    // Validate discount price
    if (discountPrice !== undefined && discountPrice !== null) {
      if (typeof discountPrice !== 'number' || discountPrice < 0) {
        return NextResponse.json(
          { success: false, error: 'Discount price must be a positive number' },
          { status: 400 }
        );
      }
      if (discountPrice >= price) {
        return NextResponse.json(
          { success: false, error: 'Discount price must be less than original price' },
          { status: 400 }
        );
      }
    }

    // Sanitize text inputs
    const sanitizedCategory = sanitizeString(category);
    const sanitizedItem = sanitizeString(item);
    const sanitizedDescription = sanitizeString(description || '');

    if (sanitizedCategory.length > 50) {
      return NextResponse.json(
        { success: false, error: 'Category must be less than 50 characters' },
        { status: 400 }
      );
    }

    if (sanitizedItem.length > 100) {
      return NextResponse.json(
        { success: false, error: 'Item name must be less than 100 characters' },
        { status: 400 }
      );
    }

    if (sanitizedDescription.length > 300) {
      return NextResponse.json(
        { success: false, error: 'Description must be less than 300 characters' },
        { status: 400 }
      );
    }

    // Validate unit
    const allowedUnits = ['per kg', 'per piece', 'per box', 'per dozen', 'per set', 'per serving'];
    const sanitizedUnit = unit && allowedUnits.includes(unit) ? unit : 'per kg';
    
    const newItem = await RateList.create({
      category: sanitizedCategory,
      item: sanitizedItem,
      description: sanitizedDescription,
      price,
      discountPrice: discountPrice || null,
      unit: sanitizedUnit,
      isAvailable: isAvailable !== false,
      order: typeof order === 'number' ? order : 0,
    });
    
    return NextResponse.json({ success: true, data: newItem }, { status: 201 });
  } catch (error) {
    console.error('Error creating rate list item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create rate list item' },
      { status: 500 }
    );
  }
}
