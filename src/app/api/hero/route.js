import { NextResponse } from "next/server";
import connectDB from "../../../lib/mongodb";
import { Hero } from "../../../lib/models";
import { verifyAdminKey } from "../../../lib/auth";
import { compressWithPreset, validateImage } from "../../../lib/imageProcessor";

// GET /api/hero - Get all hero images
export async function GET(request) {
  try {
    await connectDB();

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

    await connectDB();

    const formData = await request.formData();
    const imageData = formData.get("imageData");
    const title = formData.get("title") || "Artisanal Cakes";
    const subtitle = formData.get("subtitle") || "Handcrafted with Love";
    const alt = formData.get("alt") || "Hero image for Cocoa & Cherry bakery";
    const isActive = formData.get("isActive") === "true";
    const order = parseInt(formData.get("order")) || 0;

    if (!imageData) {
      return NextResponse.json(
        { success: false, error: "Image data is required" },
        { status: 400 },
      );
    }

    // Validate image format and size (max 20MB upload)
    const imageValidation = validateImage(imageData, 20);
    if (!imageValidation.valid) {
      return NextResponse.json(
        { success: false, error: imageValidation.error },
        { status: 400 },
      );
    }

    // ========================================
    // COMPRESS IMAGE USING SHARP
    // Reduces size by 60-90% while keeping quality
    // Hero images use 'gallery' preset (1200x1200, quality 80)
    // ========================================
    let compressedImageData = imageData;
    let compressionInfo = null;

    try {
      const result = await compressWithPreset(imageData, 'gallery');
      compressedImageData = result.base64;
      compressionInfo = {
        originalSize: `${(result.originalSize / 1024).toFixed(1)}KB`,
        compressedSize: `${(result.compressedSize / 1024).toFixed(1)}KB`,
        savings: result.savings,
      };
      console.log(`✅ Hero image compressed: ${compressionInfo.originalSize} → ${compressionInfo.compressedSize} (${compressionInfo.savings} saved)`);
    } catch (compressionError) {
      // If compression fails, use original image
      console.error('⚠️ Compression failed, using original:', compressionError.message);
    }

    // If setting as active, deactivate others
    if (isActive) {
      await Hero.updateMany({}, { isActive: false });
    }

    const newHero = new Hero({
      imageData: compressedImageData,
      title,
      subtitle,
      alt,
      isActive,
      order,
    });

    const savedHero = await newHero.save();

    return NextResponse.json({
      success: true,
      data: savedHero,
      compression: compressionInfo,
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

    await connectDB();

    const formData = await request.formData();
    const id = formData.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Hero ID is required" },
        { status: 400 },
      );
    }

    const updateData = {};

    // Compress image if provided
    if (formData.get("imageData")) {
      const imageData = formData.get("imageData");
      
      // Validate image
      const imageValidation = validateImage(imageData, 20);
      if (!imageValidation.valid) {
        return NextResponse.json(
          { success: false, error: imageValidation.error },
          { status: 400 },
        );
      }

      // Compress image
      try {
        const result = await compressWithPreset(imageData, 'gallery');
        updateData.imageData = result.base64;
        console.log(`✅ Hero image compressed: ${(result.originalSize / 1024).toFixed(1)}KB → ${(result.compressedSize / 1024).toFixed(1)}KB (${result.savings} saved)`);
      } catch (compressionError) {
        console.error('⚠️ Compression failed, using original:', compressionError.message);
        updateData.imageData = imageData; // Use original if compression fails
      }
    }
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

    await connectDB();

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
