import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Cart, Menu } from "@/lib/models";
import { authenticateUser } from "@/lib/middleware/auth";

export async function GET(request) {
  try {
    const authResult = await authenticateUser(request);

    if (!authResult.success) {
      return NextResponse.json(
        { success: false, message: authResult.message },
        { status: 401 },
      );
    }

    await connectDB();

    const cart = await Cart.findOne({ user: authResult.user._id }).populate({
      path: "items.product",
      model: "Menu",
      select: "name price imageData discountPrice isActive",
    });

    if (!cart) {
      return NextResponse.json({
        success: true,
        data: {
          cart: {
            items: [],
            totalAmount: 0,
            totalItems: 0,
          },
        },
      });
    }

    // Filter out inactive products/items
    cart.items = cart.items.filter(
      (item) => item.product && item.product.isActive,
    );

    // Recalculate totals if items were filtered
    if (cart.isModified("items")) {
      await cart.save();
    }

    return NextResponse.json({
      success: true,
      data: { cart },
    });
  } catch (error) {
    console.error("Get cart error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const authResult = await authenticateUser(request);

    if (!authResult.success) {
      return NextResponse.json(
        { success: false, message: authResult.message },
        { status: 401 },
      );
    }

    const { productId, quantity = 1 } = await request.json();

    if (!productId) {
      return NextResponse.json(
        { success: false, message: "Product ID is required" },
        { status: 400 },
      );
    }

    if (quantity < 1) {
      return NextResponse.json(
        { success: false, message: "Quantity must be at least 1" },
        { status: 400 },
      );
    }

    await connectDB();

    // Check if menu item exists
    const menuItem = await Menu.findById(productId);

    if (!menuItem) {
      return NextResponse.json(
        { success: false, message: "Menu item not found or unavailable" },
        { status: 404 },
      );
    }

    if (!menuItem.isActive) {
      return NextResponse.json(
        { success: false, message: "Menu item not available" },
        { status: 404 },
      );
    }

    const price = menuItem.discountPrice || menuItem.price;

    // Find or create cart
    let cart = await Cart.findOne({ user: authResult.user._id });
    if (!cart) {
      cart = new Cart({ user: authResult.user._id, items: [] });
    }

    // Check if menu item already in cart
    const existingItemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId,
    );

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      cart.items.push({
        product: productId,
        quantity,
        price,
      });
    }

    await cart.save();

    await cart.populate({
      path: "items.product",
      model: "Menu",
      select: "name price imageData discountPrice isActive",
    });

    return NextResponse.json({
      success: true,
      message: "Item added to cart",
      data: { cart },
    });
  } catch (error) {
    console.error("Add to cart error:", error.message, error);
    return NextResponse.json(
      { success: false, message: error.message, errorType: error.name },
      { status: 500 },
    );
  }
}
