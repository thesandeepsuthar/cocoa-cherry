import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Menu } from '@/lib/models';
import { verifyAdminKey } from '@/lib/auth';
import { sanitizeString, validateRequired } from '@/lib/security';
import { compressWithPreset, validateImage } from '@/lib/imageProcessor';

// GET - Fetch all menu items (Public)
export async function GET() {
  try {
    await connectDB();
    const menuItems = await Menu.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    
    return NextResponse.json({
      success: true,
      data: menuItems,
    });
  } catch (error) {
    console.error('Menu GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch menu' },
      { status: 500 }
    );
  }
}

// POST - Add new menu item (Admin only)
export async function POST(request) {
  try {
    if (!verifyAdminKey(request)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    const body = await request.json();
    
    // Validate required fields
    const required = validateRequired(body, ['name', 'description', 'imageData']);
    if (!required.valid) {
      return NextResponse.json(
        { success: false, error: required.error },
        { status: 400 }
      );
    }

    const { name, description, imageData, badge, price, discountPrice, priceUnit, order } = body;

    // Validate image
    const imageValidation = validateImage(imageData, 20);
    if (!imageValidation.valid) {
      return NextResponse.json(
        { success: false, error: imageValidation.error },
        { status: 400 }
      );
    }

    // ========================================
    // COMPRESS IMAGE USING SHARP
    // Reduces size by 60-90% while keeping quality
    // ========================================
    let compressedImageData = imageData;
    let compressionInfo = null;

    try {
      const result = await compressWithPreset(imageData, 'menu');
      compressedImageData = result.base64;
      compressionInfo = {
        originalSize: `${(result.originalSize / 1024).toFixed(1)}KB`,
        compressedSize: `${(result.compressedSize / 1024).toFixed(1)}KB`,
        savings: result.savings,
      };
      console.log(`✅ Menu image compressed: ${compressionInfo.originalSize} → ${compressionInfo.compressedSize} (${compressionInfo.savings} saved)`);
    } catch (compressionError) {
      console.error('⚠️ Compression failed, using original:', compressionError.message);
    }

    // Sanitize text inputs
    const sanitizedName = sanitizeString(name);
    const sanitizedDescription = sanitizeString(description);
    const sanitizedBadge = badge ? sanitizeString(badge) : null;

    if (sanitizedName.length > 100) {
      return NextResponse.json(
        { success: false, error: 'Name must be less than 100 characters' },
        { status: 400 }
      );
    }

    if (sanitizedDescription.length > 500) {
      return NextResponse.json(
        { success: false, error: 'Description must be less than 500 characters' },
        { status: 400 }
      );
    }

    const newMenuItem = await Menu.create({
      name: sanitizedName,
      description: sanitizedDescription,
      imageData: compressedImageData,
      badge: sanitizedBadge,
      price: typeof price === 'number' ? price : null,
      discountPrice: typeof discountPrice === 'number' ? discountPrice : null,
      priceUnit: priceUnit || 'per kg',
      order: typeof order === 'number' ? order : 0,
    });

    return NextResponse.json({
      success: true,
      data: newMenuItem,
      compression: compressionInfo,
      message: 'Menu item added successfully',
    });
  } catch (error) {
    console.error('Menu POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add menu item' },
      { status: 500 }
    );
  }
}
