import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Blog } from '@/lib/models';
import { verifyAdminKey } from '@/lib/auth';
import { sanitizeString } from '@/lib/security';
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

// GET - Fetch single blog by slug
export async function GET(request, { params }) {
  try {
    const { slug } = await params;
    await connectDB();
    
    // Check if admin is requesting (for editing)
    const isAdmin = verifyAdminKey(request);
    
    // Admin can fetch any blog (including inactive/unpublished)
    // Public users can only fetch active and published blogs
    const query = { slug };
    if (!isAdmin) {
      query.isActive = true;
      query.isPublished = true;
    }
    
    const blog = await Blog.findOne(query).lean();
    
    if (!blog) {
      return NextResponse.json(
        { success: false, error: 'Blog not found' },
        { status: 404 }
      );
    }

    // Only increment views for public requests
    if (!isAdmin) {
      await Blog.findByIdAndUpdate(blog._id, { $inc: { views: 1 } });
    }

    return NextResponse.json({
      success: true,
      data: blog,
    });
  } catch (error) {
    console.error('Blog GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch blog' },
      { status: 500 }
    );
  }
}

// PUT - Update blog (Admin only)
export async function PUT(request, { params }) {
  try {
    if (!verifyAdminKey(request)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { slug } = await params;
    await connectDB();
    const body = await request.json();
    
    const blog = await Blog.findOne({ slug });
    if (!blog) {
      return NextResponse.json(
        { success: false, error: 'Blog not found' },
        { status: 404 }
      );
    }

    const { title, excerpt, content, coverImage, author, publishedAt, tags, category, seoTitle, seoDescription, order, isPublished } = body;

    // Sanitize inputs
    const updateData = {};
    
    if (title !== undefined) {
      const sanitizedTitle = sanitizeString(title);
      if (sanitizedTitle.length > 200) {
        return NextResponse.json(
          { success: false, error: 'Title must be less than 200 characters' },
          { status: 400 }
        );
      }
      updateData.title = sanitizedTitle;
      
      // Update slug if title changed
      if (title !== blog.title) {
        let newSlug = generateSlug(sanitizedTitle);
        const existingBlog = await Blog.findOne({ slug: newSlug, _id: { $ne: blog._id } });
        if (existingBlog) {
          newSlug = `${newSlug}-${Date.now()}`;
        }
        updateData.slug = newSlug;
      }
    }

    if (excerpt !== undefined) {
      const sanitizedExcerpt = sanitizeString(excerpt);
      if (sanitizedExcerpt.length > 300) {
        return NextResponse.json(
          { success: false, error: 'Excerpt must be less than 300 characters' },
          { status: 400 }
        );
      }
      updateData.excerpt = sanitizedExcerpt;
    }

    if (content !== undefined) {
      // Store content as raw text - no sanitization, no HTML encoding
      updateData.content = content;
      updateData.readTime = calculateReadTime(content);
    }

    if (coverImage !== undefined && coverImage !== blog.coverImage) {
      try {
        const cloudinaryResult = await uploadToCloudinary(coverImage, {
          folder: 'cocoa-cherry/blog',
        });
        updateData.coverImage = cloudinaryResult.secure_url;
        updateData.coverImagePublicId = cloudinaryResult.public_id;
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
        return NextResponse.json(
          { success: false, error: 'Failed to upload image to Cloudinary' },
          { status: 500 }
        );
      }
    }

    if (author !== undefined) {
      updateData.author = sanitizeString(author);
    }

    if (publishedAt !== undefined) {
      updateData.publishedAt = new Date(publishedAt);
    }

    if (tags !== undefined && Array.isArray(tags)) {
      updateData.tags = tags.map(tag => sanitizeString(tag).toLowerCase()).filter(Boolean);
    }

    if (category !== undefined) {
      updateData.category = sanitizeString(category);
    }

    if (seoTitle !== undefined) {
      updateData.seoTitle = seoTitle ? sanitizeString(seoTitle) : null;
    }

    if (seoDescription !== undefined) {
      updateData.seoDescription = seoDescription ? sanitizeString(seoDescription) : null;
    }

    if (order !== undefined) {
      updateData.order = typeof order === 'number' ? order : 0;
    }

    if (isPublished !== undefined) {
      updateData.isPublished = Boolean(isPublished);
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      blog._id,
      updateData,
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      success: true,
      data: updatedBlog,
      message: 'Blog updated successfully',
    });
  } catch (error) {
    console.error('Blog PUT error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update blog' },
      { status: 500 }
    );
  }
}

// DELETE - Delete blog (Admin only)
export async function DELETE(request, { params }) {
  try {
    if (!verifyAdminKey(request)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { slug } = await params;
    await connectDB();
    
    const blog = await Blog.findOne({ slug });
    if (!blog) {
      return NextResponse.json(
        { success: false, error: 'Blog not found' },
        { status: 404 }
      );
    }

    // Hard delete: Actually remove from database
    await Blog.findByIdAndDelete(blog._id);

    // Optional: Delete cover image from Cloudinary
    if (blog.coverImagePublicId) {
      try {
        const { deleteFromCloudinary } = await import('@/lib/cloudinary');
        await deleteFromCloudinary(blog.coverImagePublicId);
      } catch (cloudinaryError) {
        console.warn('⚠️ Failed to delete cover image from Cloudinary:', cloudinaryError.message);
        // Continue even if Cloudinary deletion fails
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Blog deleted successfully',
    });
  } catch (error) {
    console.error('Blog DELETE error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete blog' },
      { status: 500 }
    );
  }
}
