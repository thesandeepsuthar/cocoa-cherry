import { NextResponse } from "next/server";
import connectDB from "../../../lib/mongodb";
import { Hero } from "../../../lib/models";
import { verifyAdminKey } from "../../../lib/auth";
import { validateImage } from "../../../lib/imageProcessor";
import { uploadToCloudinary } from "../../../lib/cloudinary";

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

    // Upload image to Cloudinary
    let cloudinaryResult = null;
    try {
      cloudinaryResult = await uploadToCloudinary(imageData, {
        folder: 'cocoa-cherry/hero',
        maxWidth: 1920,
        maxHeight: 1080,
        quality: 90,
        format: 'avif', // Use AVIF format for better compression
      });
      console.log(`✅ Hero image uploaded to Cloudinary: ${cloudinaryResult.url}`);
    } catch (uploadError) {
      console.error('Cloudinary upload error:', uploadError);
      return NextResponse.json(
        { success: false, error: 'Failed to upload image to Cloudinary' },
        { status: 500 },
      );
    }

    // If setting as active, deactivate others first
    if (isActive) {
      await Hero.updateMany({}, { isActive: false });
    }

    // Create and save the new hero document
    const newHero = new Hero({
      imageData: cloudinaryResult.secure_url,
      publicId: cloudinaryResult.public_id,
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
      cloudinary: {
        url: cloudinaryResult.url,
        public_id: cloudinaryResult.public_id,
        size: `${(cloudinaryResult.bytes / 1024).toFixed(1)}KB`,
      },
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
    let cloudinaryInfo = null;

    // Upload new image to Cloudinary if provided
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

      // Upload image to Cloudinary
      try {
        const cloudinaryResult = await uploadToCloudinary(imageData, {
          folder: 'cocoa-cherry/hero',
          maxWidth: 1920,
          maxHeight: 1080,
          quality: 90,
          format: 'avif',
        });
        
        updateData.imageData = cloudinaryResult.secure_url;
        updateData.publicId = cloudinaryResult.public_id;
        cloudinaryInfo = {
          url: cloudinaryResult.url,
          public_id: cloudinaryResult.public_id,
          size: `${(cloudinaryResult.bytes / 1024).toFixed(1)}KB`,
        };
        console.log(`✅ Hero image uploaded to Cloudinary: ${cloudinaryResult.url}`);
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
        return NextResponse.json(
          { success: false, error: 'Failed to upload image to Cloudinary' },
          { status: 500 },
        );
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

    // If setting as active, deactivate others BEFORE updating
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

    const response = {
      success: true,
      data: updatedHero,
      message: "Hero image updated successfully",
    };

    if (cloudinaryInfo) {
      response.cloudinary = cloudinaryInfo;
    }

    return NextResponse.json(response);
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

    const heroImage = await Hero.findById(id);

    if (!heroImage) {
      return NextResponse.json(
        { success: false, error: "Hero image not found" },
        { status: 404 },
      );
    }

    // Delete from Cloudinary if public_id exists
    if (heroImage.publicId) {
      try {
        const { deleteFromCloudinary } = await import("../../../lib/cloudinary");
        await deleteFromCloudinary(heroImage.publicId);
        console.log(`✅ Hero image deleted from Cloudinary: ${heroImage.publicId}`);
      } catch (cloudinaryError) {
        console.warn(`⚠️ Failed to delete from Cloudinary: ${cloudinaryError.message}`);
        // Continue with database deletion even if Cloudinary deletion fails
      }
    }

    // Delete from database
    await Hero.findByIdAndDelete(id);

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
