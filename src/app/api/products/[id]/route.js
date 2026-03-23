import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Product } from "@/lib/models";

export async function GET(request, { params }) {
  try {
    const { id } = params;

    await connectDB();

    const product = await Product.findById(id).populate("category", "name");

    if (!product || !product.isActive) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: { product },
    });
  } catch (error) {
    console.error("Get product error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
