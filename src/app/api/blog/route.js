import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Blog } from '@/lib/models';
import { verifyAdminKey } from '@/lib/auth';
import { sanitizeString, validateRequired } from '@/lib/security';
import { uploadToCloudinary } from '@/lib/cloudinary';

// Helper: Generate slug from title
function generateSlug(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Helper: Calculate read time
function calculateReadTime(content) {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

// GET - Fetch all blogs (Public)
export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit')) || 10;
    const category = searchParams.get('category');
    const includeInactive = searchParams.get('includeInactive') === 'true';
    
    // Admin can see all blogs including inactive ones
    const isAdmin = verifyAdminKey(request);
    
    const query = {};
    if (!isAdmin || !includeInactive) {
      query.isActive = true;
      query.isPublished = true;
    }
    if (category) {
      query.category = category;
    }
    
    const blogs = await Blog.find(query)
      .sort({ publishedAt: -1, order: 1 })
      .limit(limit)
      .select('-content') // Don't send full content in list
      .lean();
    
    return NextResponse.json({
      success: true,
      data: blogs,
    });
  } catch (error) {
    console.error('Blog GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch blogs' },
      { status: 500 }
    );
  }
}

// POST - Add new blog (Admin only)
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
    
    const { title, excerpt, content, coverImage, author, publishedAt, tags, category, seoTitle, seoDescription, order } = body;
    
    // Validate required fields
    const required = validateRequired(body, ['title', 'excerpt', 'content', 'coverImage']);
    if (!required.valid) {
      return NextResponse.json(
        { success: false, error: required.error },
        { status: 400 }
      );
    }

    // Sanitize inputs (but NOT content - we want to preserve HTML)
    const sanitizedTitle = sanitizeString(title);
    const sanitizedExcerpt = sanitizeString(excerpt);
    // Don't sanitize content - we want to preserve HTML for rich text
    const sanitizedContent = content; // Keep HTML as-is
    
    if (sanitizedTitle.length > 200) {
      return NextResponse.json(
        { success: false, error: 'Title must be less than 200 characters' },
        { status: 400 }
      );
    }

    if (sanitizedExcerpt.length > 300) {
      return NextResponse.json(
        { success: false, error: 'Excerpt must be less than 300 characters' },
        { status: 400 }
      );
    }

    // Generate slug
    let slug = body.slug || generateSlug(sanitizedTitle);
    
    // Check if slug exists
    const existingBlog = await Blog.findOne({ slug });
    if (existingBlog) {
      slug = `${slug}-${Date.now()}`;
    }

    // Upload image to Cloudinary
    let cloudinaryResult = null;
    try {
      cloudinaryResult = await uploadToCloudinary(coverImage, {
        folder: 'cocoa-cherry/blog',
      });
    } catch (uploadError) {
      console.error('Cloudinary upload error:', uploadError);
      return NextResponse.json(
        { success: false, error: 'Failed to upload image to Cloudinary' },
        { status: 500 }
      );
    }

    // Calculate read time
    const readTime = calculateReadTime(sanitizedContent);

    // Process tags
    const processedTags = tags && Array.isArray(tags) 
      ? tags.map(tag => sanitizeString(tag).toLowerCase()).filter(Boolean)
      : [];

    const newBlog = await Blog.create({
      title: sanitizedTitle,
      slug,
      excerpt: sanitizedExcerpt,
      content: sanitizedContent, // HTML content preserved
      coverImage: cloudinaryResult.secure_url,
      coverImagePublicId: cloudinaryResult.public_id,
      author: author ? sanitizeString(author) : 'Cocoa&Cherry Team',
      publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
      readTime,
      tags: processedTags,
      category: category ? sanitizeString(category) : 'General',
      seoTitle: seoTitle ? sanitizeString(seoTitle) : null,
      seoDescription: seoDescription ? sanitizeString(seoDescription) : null,
      order: typeof order === 'number' ? order : 0,
    });

    return NextResponse.json({
      success: true,
      data: newBlog,
      cloudinary: {
        url: cloudinaryResult.secure_url,
        public_id: cloudinaryResult.public_id,
        size: `${(cloudinaryResult.bytes / 1024).toFixed(1)}KB`,
      },
      message: 'Blog added successfully',
    });
  } catch (error) {
    console.error('Blog POST error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to add blog' },
      { status: 500 }
    );
  }
}
