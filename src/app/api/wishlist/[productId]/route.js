import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Wishlist, Product, Cart } from '@/lib/models';
import { authenticateUser } from '@/lib/middleware/auth';

export async function DELETE(request, { params }) {
  try {
    const authResult = await authenticateUser(request);
    
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, message: authResult.message },
        { status: 401 }
      );
    }

    const { productId } = params;

    await connectDB();

    // Find wishlist
    const wishlist = await Wishlist.findOne({ user: authResult.user._id });
    
    if (!wishlist) {
      return NextResponse.json(
        { success: false, message: 'Wishlist not found' },
        { status: 404 }
      );
    }

    // Remove product from wishlist
    wishlist.products = wishlist.products.filter(
      item => item.product.toString() !== productId
    );

    await wishlist.save();
    await wishlist.populate('products.product', 'name price images stock isActive');

    return NextResponse.json({
      success: true,
      message: 'Product removed from wishlist',
      data: { wishlist }
    });

  } catch (error) {
    console.error('Remove from wishlist error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request, { params }) {
  try {
    const authResult = await authenticateUser(request);
    
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, message: authResult.message },
        { status: 401 }
      );
    }

    const { productId } = params;
    const { quantity = 1 } = await request.json();

    await connectDB();

    // Check if product exists and is active
    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return NextResponse.json(
        { success: false, message: 'Product not found or unavailable' },
        { status: 404 }
      );
    }

    // Check stock
    if (product.stock < quantity) {
      return NextResponse.json(
        { success: false, message: 'Insufficient stock' },
        { status: 400 }
      );
    }

    // Find wishlist
    const wishlist = await Wishlist.findOne({ user: authResult.user._id });
    
    if (!wishlist) {
      return NextResponse.json(
        { success: false, message: 'Wishlist not found' },
        { status: 404 }
      );
    }

    // Check if product is in wishlist
    const productInWishlist = wishlist.products.find(
      item => item.product.toString() === productId
    );

    if (!productInWishlist) {
      return NextResponse.json(
        { success: false, message: 'Product not found in wishlist' },
        { status: 404 }
      );
    }

    // Find or create cart
    let cart = await Cart.findOne({ user: authResult.user._id });
    
    if (!cart) {
      cart = new Cart({ user: authResult.user._id, items: [] });
    }

    // Check if product already in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );

    if (existingItemIndex > -1) {
      // Update quantity
      const newQuantity = cart.items[existingItemIndex].quantity + quantity;
      
      if (product.stock < newQuantity) {
        return NextResponse.json(
          { success: false, message: 'Insufficient stock for requested quantity' },
          { status: 400 }
        );
      }

      cart.items[existingItemIndex].quantity = newQuantity;
    } else {
      // Add new item to cart
      cart.items.push({
        product: productId,
        quantity,
        price: product.price
      });
    }

    await cart.save();

    // Remove from wishlist
    wishlist.products = wishlist.products.filter(
      item => item.product.toString() !== productId
    );
    await wishlist.save();

    await cart.populate('items.product', 'name price images stock isActive');
    await wishlist.populate('products.product', 'name price images stock isActive');

    return NextResponse.json({
      success: true,
      message: 'Product moved to cart',
      data: { cart, wishlist }
    });

  } catch (error) {
    console.error('Move to cart error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}