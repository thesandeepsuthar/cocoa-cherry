import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Cart, Menu } from "@/lib/models";
import { authenticateUser } from "@/lib/middleware/auth";

export async function PUT(request, { params }) {
  try {
    const authResult = await authenticateUser(request);

    if (!authResult.success) {
      return NextResponse.json(
        { success: false, message: authResult.message },
        { status: 401 },
      );
    }

    const { productId } = await params;
    const { quantity } = await request.json();

    if (!quantity || quantity < 1) {
      return NextResponse.json(
        { success: false, message: "Quantity must be at least 1" },
        { status: 400 },
      );
    }

    await connectDB();

    const cart = await Cart.findOne({ user: authResult.user._id });

    if (!cart) {
      return NextResponse.json(
        { success: false, message: "Cart not found" },
        { status: 404 },
      );
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId,
    );

    if (itemIndex === -1) {
      return NextResponse.json(
        { success: false, message: "Item not found in cart" },
        { status: 404 },
      );
    }

    const menuItem = await Menu.findById(productId);

    cart.items[itemIndex].quantity = quantity;

    if (menuItem && menuItem.isActive) {
      cart.items[itemIndex].price = menuItem.discountPrice || menuItem.price;
    }

    await cart.save();
    await cart.populate({
      path: "items.product",
      model: "Menu",
      select: "name price imageData discountPrice isActive",
    });

    return NextResponse.json({
      success: true,
      message: "Cart updated successfully",
      data: { cart },
    });
  } catch (error) {
    console.error("Update cart error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const authResult = await authenticateUser(request);

    if (!authResult.success) {
      return NextResponse.json(
        { success: false, message: authResult.message },
        { status: 401 },
      );
    }

    const { productId } = await params;

    await connectDB();

    const cart = await Cart.findOne({ user: authResult.user._id });

    if (!cart) {
      return NextResponse.json(
        { success: false, message: "Cart not found" },
        { status: 404 },
      );
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId,
    );

    await cart.save();
    await cart.populate({
      path: "items.product",
      model: "Menu",
      select: "name price imageData discountPrice isActive",
    });

    return NextResponse.json({
      success: true,
      message: "Product removed from cart",
      data: { cart },
    });
  } catch (error) {
    console.error("Remove from cart error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}
