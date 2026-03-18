import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Order, User } from "@/lib/models";
import { verifyAdminKey } from "@/lib/auth";

export async function GET(request) {
  try {
    // Verify admin authentication
    if (!verifyAdminKey(request)) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 20;
    const skip = (page - 1) * limit;

    await connectDB();

    // Build query
    const query = {};
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
      .populate("user", "name mobile email")
      .populate("items.product", "name images")
      .sort({ orderDate: -1 })
      .skip(skip)
      .limit(limit);

    const totalOrders = await Order.countDocuments(query);
    const totalPages = Math.ceil(totalOrders / limit);

    // Get order statistics
    const stats = await Order.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalAmount: { $sum: "$totalAmount" },
        },
      },
    ]);

    return NextResponse.json({
      success: true,
      data: {
        orders,
        stats,
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
    console.error("Get admin orders error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
