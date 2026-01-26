import { NextResponse } from "next/server";
import connectDB from "../../../lib/mongodb";
import { Hero } from "../../../lib/models";
import { verifyAdminKey } from "../../../lib/auth";

// GET /api/hero - Get all hero images
export async function GET(request) {
  try {
    await connectToDatabase();

    const heroImages = await Hero.find({})
      .sort({ order: 1, createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: heroImages,
    });
  } catch (error) {
    console.error("Error fetching hero images:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch hero images" },
      { status: 500 },
    );
  }
}

// POST /api/hero - Create new hero image
export async function POST(request) {
  try {
    // Verify admin key
    if (!verifyAdminKey(request)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    await connectToDatabase();

    const formData = await request.formData();
    const imageData = formData.get("imageData");
    const title = formData.get("title") || "Artisanal Cakes";
    const subtitle = formData.get("subtitle") || "Handcrafted with Love";
    const alt = formData.get("alt") || "Hero image for Cocoa & Cherry bakery";
    const isActive = formData.get("isActive") === "true";

    if (!imageData) {
      return NextResponse.json(
        { success: false, error: "Image data is required" },
        { status: 400 },
      );
    }

    // If setting as active, deactivate others
    if (isActive) {
      await Hero.updateMany({}, { isActive: false });
    }

    const newHero = new Hero({
      imageData,
      title,
      subtitle,
      alt,
      isActive,
    });

    const savedHero = await newHero.save();

    return NextResponse.json({
      success: true,
      data: savedHero,
      message: "Hero image created successfully",
    });
  } catch (error) {
    console.error("Error creating hero image:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create hero image" },
      { status: 500 },
    );
  }
}

// PUT /api/hero/[id] - Update hero image
export async function PUT(request) {
  try {
    // Verify admin key
    if (!verifyAdminKey(request)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    await connectToDatabase();

    const formData = await request.formData();
    const id = formData.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Hero ID is required" },
        { status: 400 },
      );
    }

    const updateData = {};

    if (formData.get("imageData"))
      updateData.imageData = formData.get("imageData");
    if (formData.get("title")) updateData.title = formData.get("title");
    if (formData.get("subtitle"))
      updateData.subtitle = formData.get("subtitle");
    if (formData.get("alt")) updateData.alt = formData.get("alt");
    if (formData.get("isActive") !== null)
      updateData.isActive = formData.get("isActive") === "true";
    if (formData.get("order") !== null)
      updateData.order = parseInt(formData.get("order"));

    // If setting as active, deactivate others
    if (updateData.isActive) {
      await Hero.updateMany({ _id: { $ne: id } }, { isActive: false });
    }

    const updatedHero = await Hero.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedHero) {
      return NextResponse.json(
        { success: false, error: "Hero image not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedHero,
      message: "Hero image updated successfully",
    });
  } catch (error) {
    console.error("Error updating hero image:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update hero image" },
      { status: 500 },
    );
  }
}

// DELETE /api/hero/[id] - Delete hero image
export async function DELETE(request) {
  try {
    // Verify admin key
    if (!verifyAdminKey(request)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Hero ID is required" },
        { status: 400 },
      );
    }

    const deletedHero = await Hero.findByIdAndDelete(id);

    if (!deletedHero) {
      return NextResponse.json(
        { success: false, error: "Hero image not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Hero image deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting hero image:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete hero image" },
      { status: 500 },
    );
  }
}
