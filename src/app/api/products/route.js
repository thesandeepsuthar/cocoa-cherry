import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Product, Category } from '@/lib/models';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 12;
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') === 'asc' ? 1 : -1;
    const skip = (page - 1) * limit;

    await connectDB();

    // Build query
    const query = { isActive: true };
    
    if (category) {
      query.category = category;
    }
    
    if (search) {
      query.$text = { $search: search };
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder;

    // Get products with pagination
    const products = await Product.find(query)
      .populate('category', 'name')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const totalProducts = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / limit);

    // Get categories for filtering
    const categories = await Category.find({ isActive: true }).select('name');

    return NextResponse.json({
      success: true,
      data: {
        products,
        categories,
        pagination: {
          currentPage: page,
          totalPages,
          totalProducts,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Get products error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    // This would be admin-only in production
    const { name, description, price, originalPrice, images, category, stock, tags, weight, dimensions } = await request.json();

    // Validate required fields
    if (!name || !description || !price || !category) {
      return NextResponse.json(
        { success: false, message: 'Name, description, price, and category are required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return NextResponse.json(
        { success: false, message: 'Category not found' },
        { status: 404 }
      );
    }

    const product = await Product.create({
      name,
      description,
      price,
      originalPrice,
      images,
      category,
      stock: stock || 0,
      tags,
      weight,
      dimensions
    });

    await product.populate('category', 'name');

    return NextResponse.json({
      success: true,
      message: 'Product created successfully',
      data: { product }
    });

  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}