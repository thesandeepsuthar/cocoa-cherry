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

// 🚀 PERFORMANCE: Simple in-memory cache for public reviews
let cachedPublicReviews = null;
let cacheTime = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// GET - Fetch all reviews
// Public: only approved reviews (cached)
// Admin: all reviews (no cache)
export async function GET(request) {
  try {
    await connectDB();
    
    const isAdmin = verifyAdminKey(request);
    
    // 🚀 PERFORMANCE: Use cache for public requests
    if (!isAdmin) {
      const now = Date.now();
      if (cachedPublicReviews && (now - cacheTime) < CACHE_TTL) {
        return NextResponse.json({
          success: true,
          data: cachedPublicReviews,
          cached: true,
        });
      }
    }
    
    let query = {};
    if (!isAdmin) {
      query = { isApproved: true };
    }
    
    // 🚀 PERFORMANCE: Use projection to only fetch needed fields and lean() for plain objects
    const reviews = await Review.find(query)
      .select(isAdmin 
        ? '-__v' // Admin gets all fields except __v
        : 'name cakeType rating review isFeatured createdAt avatarData' // Public gets limited fields
      )
      .sort({ isFeatured: -1, createdAt: -1 })
      .lean(); // Convert to plain JS objects (faster)
    
    // 🚀 PERFORMANCE: Cache public reviews
    if (!isAdmin) {
      cachedPublicReviews = reviews;
      cacheTime = Date.now();
    }
    
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
      avatarData: null,
      isApproved: false,
      isFeatured: false,
    });

    // 🚀 PERFORMANCE: Invalidate cache when new review is added
    cachedPublicReviews = null;

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
