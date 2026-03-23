import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Order } from "@/lib/models";
import { verifyAdminKey } from "@/lib/auth";
import {
  sendOrderStatusUpdateMessage,
  sendOrderDeliveryMessage,
} from "@/lib/utils/whatsapp";

export async function GET(request, { params }) {
  try {
    // Unwrap params in Next.js 15+
    const { orderId } = await params;

    // Verify admin authentication
    if (!verifyAdminKey(request)) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    await connectDB();

    // Support both MongoDB _id and orderId string
    let order;
    if (orderId.match(/^[0-9a-fA-F]{24}$/)) {
      order = await Order.findById(orderId)
        .populate("user", "name mobile email address")
        .populate("items.product", "name images");
    } else {
      order = await Order.findOne({ orderId })
        .populate("user", "name mobile email address")
        .populate("items.product", "name images");
    }

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: { order },
    });
  } catch (error) {
    console.error("Get admin order error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PUT(request, { params }) {
  try {
    // Unwrap params in Next.js 15+
    const { orderId } = await params;

    // Verify admin authentication
    if (!verifyAdminKey(request)) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }
    const { status, deliveryDate, notes } = await request.json();

    if (
      !status ||
      ![
        "pending",
        "confirmed",
        "preparing",
        "ready",
        "out_for_delivery",
        "completed",
        "cancelled",
      ].includes(status)
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid status" },
        { status: 400 },
      );
    }

    await connectDB();

    // Support both MongoDB _id and orderId string
    let order;
    if (orderId.match(/^[0-9a-fA-F]{24}$/)) {
      order = await Order.findById(orderId);
    } else {
      order = await Order.findOne({ orderId });
    }

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 },
      );
    }

    // Update order
    const previousStatus = order.status;
    order.status = status;
    if (deliveryDate) order.deliveryDate = new Date(deliveryDate);
    if (notes) order.notes = notes;

    // Set payment status for completed orders
    if (status === "completed" && order.paymentMethod === "cod") {
      order.paymentStatus = "paid";
    }

    await order.save();

    await order.populate("user", "name mobile email address");
    await order.populate("items.product", "name images");

    // Send WhatsApp notification to user
    if (order.user?.mobile && status !== previousStatus) {
      if (status === "completed") {
        sendOrderDeliveryMessage(order.user.mobile, order).catch((err) =>
          console.error("WhatsApp delivery notification error:", err),
        );
      } else if (status === "cancelled") {
        sendOrderStatusUpdateMessage(order.user.mobile, order, status).catch(
          (err) => console.error("WhatsApp order cancellation error:", err),
        );
      } else {
        sendOrderStatusUpdateMessage(order.user.mobile, order, status).catch(
          (err) => console.error("WhatsApp order status update error:", err),
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: "Order updated successfully",
      data: { order },
    });
  } catch (error) {
    console.error("Update admin order error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
