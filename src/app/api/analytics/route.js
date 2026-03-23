import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Order, Review, User, Product } from "@/lib/models";

export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '30'; // days
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));
    
    // Orders analytics
    const ordersData = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          count: { $sum: 1 },
          revenue: { $sum: "$totalAmount" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Order status distribution
    const orderStatusData = await Order.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    // Reviews analytics (with fallback for missing Review model)
    let reviewsData = [];
    let ratingDistribution = [];
    try {
      reviewsData = await Review.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
            },
            count: { $sum: 1 },
            avgRating: { $avg: "$rating" }
          }
        },
        { $sort: { _id: 1 } }
      ]);

      // Rating distribution
      ratingDistribution = await Review.aggregate([
        {
          $group: {
            _id: "$rating",
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]);
    } catch (reviewError) {
      console.log("Reviews data not available:", reviewError.message);
    }

    // User registrations (with fallback)
    let userRegistrations = [];
    try {
      userRegistrations = await User.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]);
    } catch (userError) {
      console.log("User data not available:", userError.message);
    }

    // Top products by orders - using correct field names (with fallback)
    let topProducts = [];
    try {
      topProducts = await Order.aggregate([
        { $unwind: "$items" },
        {
          $group: {
            _id: "$items.product",
            totalOrdered: { $sum: "$items.quantity" },
            revenue: { $sum: "$items.subtotal" }
          }
        },
        {
          $lookup: {
            from: "products",
            localField: "_id",
            foreignField: "_id",
            as: "product"
          }
        },
        { $unwind: "$product" },
        {
          $project: {
            name: "$product.name",
            totalOrdered: 1,
            revenue: 1
          }
        },
        { $sort: { totalOrdered: -1 } },
        { $limit: 10 }
      ]);
    } catch (productError) {
      console.log("Product data not available:", productError.message);
    }

    return NextResponse.json({
      success: true,
      data: {
        orders: ordersData,
        orderStatus: orderStatusData,
        reviews: reviewsData,
        ratingDistribution,
        userRegistrations,
        topProducts
      }
    });

  } catch (error) {
    console.error("Analytics API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch analytics data", details: error.message },
      { status: 500 }
    );
  }
}