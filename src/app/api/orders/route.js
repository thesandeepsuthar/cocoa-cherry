import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Order, Cart, Product, User } from "@/lib/models";
import { authenticateUser } from "@/lib/middleware/auth";
import { sendOrderConfirmationMessage } from "@/lib/utils/whatsapp";

export async function GET(request) {
  try {
    const authResult = await authenticateUser(request);

    if (!authResult.success) {
      return NextResponse.json(
        { success: false, message: authResult.message },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    await connectDB();

    // Build query
    const query = { user: authResult.user._id };
    if (
      status &&
      [
        "pending",
        "confirmed",
        "preparing",
        "ready",
        "out_for_delivery",
        "completed",
        "cancelled",
      ].includes(status)
    ) {
      query.status = status;
    }

    // Get orders with pagination
    const orders = await Order.find(query)
      .populate("items.product", "name images")
      .sort({ orderDate: -1 })
      .skip(skip)
      .limit(limit);

    const totalOrders = await Order.countDocuments(query);
    const totalPages = Math.ceil(totalOrders / limit);

    return NextResponse.json({
      success: true,
      data: {
        orders,
        pagination: {
          currentPage: page,
          totalPages,
          totalOrders,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      },
    });
  } catch (error) {
    console.error("Get orders error:", error);
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

    const {
      shippingAddress,
      paymentMethod = "cod",
      notes,
    } = await request.json();

    // Validate shipping address
    if (
      !shippingAddress ||
      !shippingAddress.name ||
      !shippingAddress.mobile ||
      !shippingAddress.street ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.pincode
    ) {
      return NextResponse.json(
        { success: false, message: "Complete shipping address is required" },
        { status: 400 },
      );
    }

    // Validate mobile number
    if (!/^[0-9]{10}$/.test(shippingAddress.mobile)) {
      return NextResponse.json(
        {
          success: false,
          message: "Please provide a valid 10-digit mobile number",
        },
        { status: 400 },
      );
    }

    await connectDB();

    // Get user's cart
    const cart = await Cart.findOne({ user: authResult.user._id }).populate(
      "items.product",
      "name price stock isActive",
    );

    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { success: false, message: "Cart is empty" },
        { status: 400 },
      );
    }

    // Validate cart items and stock
    const orderItems = [];
    let totalAmount = 0;

    for (const item of cart.items) {
      if (!item.product || !item.product.isActive) {
        return NextResponse.json(
          {
            success: false,
            message: `Product ${item.product?.name || "Unknown"} is no longer available`,
          },
          { status: 400 },
        );
      }

      if (item.product.stock < item.quantity) {
        return NextResponse.json(
          {
            success: false,
            message: `Insufficient stock for ${item.product.name}`,
          },
          { status: 400 },
        );
      }

      const subtotal = item.product.price * item.quantity;
      orderItems.push({
        product: item.product._id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        subtotal,
      });

      totalAmount += subtotal;
    }

    // Create order with generated orderId
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    const orderId = `ORD${timestamp}${random}`;

    const order = await Order.create({
      orderId,
      user: authResult.user._id,
      items: orderItems,
      totalAmount,
      paymentMethod,
      shippingAddress: {
        ...shippingAddress,
        country: shippingAddress.country || "India",
      },
      notes,
    });

    // Update product stock
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock: -item.quantity },
      });
    }

    // Clear cart
    await Cart.findByIdAndDelete(cart._id);

    // Populate order for response
    await order.populate("items.product", "name images");
    await order.populate("user", "name mobile");

    // Send WhatsApp order confirmation
    sendOrderConfirmationMessage(order.user.mobile, order).catch((err) =>
      console.error("WhatsApp order confirmation error:", err),
    );

    return NextResponse.json({
      success: true,
      message: "Order placed successfully",
      data: { order },
    });
  } catch (error) {
    console.error("Create order error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
