import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Review } from '@/lib/models';
import { verifyAdminKey, rateLimitResponse } from '@/lib/auth';
import { 
  validateReviewData, 
  checkRateLimit, 
  getClientIP,
  sanitizeString 
} from '@/lib/security';

// GET - Fetch all reviews
// Public: only approved reviews
// Admin: all reviews
export async function GET(request) {
  try {
    await connectDB();
    
    const isAdmin = verifyAdminKey(request);
    
    let query = {};
    if (!isAdmin) {
      // Public users only see approved reviews
      query = { isApproved: true };
    }
    
    const reviews = await Review.find(query).sort({ isFeatured: -1, createdAt: -1 });
    
    return NextResponse.json({
      success: true,
      data: reviews,
    });
  } catch (error) {
    console.error('Reviews GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

// POST - Submit new review (Public - anyone can submit)
export async function POST(request) {
  try {
    // Rate limiting - 5 reviews per IP per hour
    const clientIP = getClientIP(request);
    const rateLimit = checkRateLimit(`review:${clientIP}`, 5, 3600000); // 5 per hour
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        rateLimitResponse(rateLimit.resetTime),
        { status: 429 }
      );
    }

    await connectDB();
    const body = await request.json();
    
    // Validate and sanitize input
    const validation = validateReviewData(body);
    
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.errors.join('. ') },
        { status: 400 }
      );
    }

    const { name, email, cakeType, rating, review } = validation.sanitized;

    const newReview = await Review.create({
      name,
      email,
      cakeType,
      rating,
      review,
      avatarData: null, // Don't allow user-uploaded avatars for security
      isApproved: false, // Requires admin approval
      isFeatured: false,
    });

    return NextResponse.json({
      success: true,
      data: { id: newReview._id },
      message: 'Review submitted successfully. It will be visible after approval.',
    });
  } catch (error) {
    console.error('Reviews POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit review' },
      { status: 500 }
    );
  }
}
