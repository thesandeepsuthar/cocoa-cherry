import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Wishlist, Product, Cart } from '@/lib/models';
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

    await connectDB();

    const wishlist = await Wishlist.findOne({ user: authResult.user._id })
      .populate('products.product', 'name price images stock isActive');

    if (!wishlist) {
      return NextResponse.json({
        success: true,
        data: {
          wishlist: {
            products: []
          }
        }
      });
    }

    // Filter out inactive products
    wishlist.products = wishlist.products.filter(item => item.product && item.product.isActive);
    await wishlist.save();

    return NextResponse.json({
      success: true,
      data: { wishlist }
    });

  } catch (error) {
    console.error('Get wishlist error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const authResult = await authenticateUser(request);
    
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, message: authResult.message },
        { status: 401 }
      );
    }

    const { productId } = await request.json();

    if (!productId) {
      return NextResponse.json(
        { success: false, message: 'Product ID is required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if product exists and is active
    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return NextResponse.json(
        { success: false, message: 'Product not found or unavailable' },
        { status: 404 }
      );
    }

    // Find or create wishlist
    let wishlist = await Wishlist.findOne({ user: authResult.user._id });
    
    if (!wishlist) {
      wishlist = new Wishlist({ user: authResult.user._id, products: [] });
    }

    // Check if product already in wishlist
    const existingProduct = wishlist.products.find(
      item => item.product.toString() === productId
    );

    if (existingProduct) {
      return NextResponse.json(
        { success: false, message: 'Product already in wishlist' },
        { status: 400 }
      );
    }

    // Add product to wishlist
    wishlist.products.push({
      product: productId,
      addedAt: new Date()
    });

    await wishlist.save();
    await wishlist.populate('products.product', 'name price images stock isActive');

    return NextResponse.json({
      success: true,
      message: 'Product added to wishlist',
      data: { wishlist }
    });

  } catch (error) {
    console.error('Add to wishlist error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}