import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Review, Menu, Category, Gallery, Event, Reel, Hero } from '@/lib/models';
import { verifyAdminKey } from '@/lib/auth';

// GET - Fetch dashboard statistics
export async function GET(request) {
  try {
    // Verify admin key
    if (!verifyAdminKey(request)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    // Fetch all counts in parallel
    const [
      totalReviews,
      pendingReviews,
      approvedReviews,
      totalMenuItems,
      activeMenuItems,
      totalCategories,
      totalGalleryImages,
      totalEvents,
      totalReels,
      totalHeroImages,
      recentReviews,
      recentMenuItems,
      topRatedReviews,
    ] = await Promise.all([
      // Reviews
      Review.countDocuments(),
      Review.countDocuments({ isApproved: false }),
      Review.countDocuments({ isApproved: true }),
      
      // Menu
      Menu.countDocuments(),
      Menu.countDocuments({ isActive: true }),
      
      // Categories
      Category.countDocuments(),
      
      // Gallery
      Gallery.countDocuments({ isActive: true }),
      
      // Events
      Event.countDocuments({ isActive: true }),
      
      // Reels
      Reel.countDocuments({ isActive: true }),
      
      // Hero
      Hero.countDocuments({ isActive: true }),
      
      // Recent reviews (last 5)
      Review.find()
        .select('name rating review isApproved createdAt')
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
      
      // Recent menu items (last 5)
      Menu.find()
        .select('name price isActive createdAt')
        .populate({ path: 'category', select: 'name' })
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
      
      // Top rated reviews
      Review.find({ isApproved: true })
        .select('name rating review createdAt')
        .sort({ rating: -1, createdAt: -1 })
        .limit(5)
        .lean(),
    ]);

    // Calculate average rating
    const ratingStats = await Review.aggregate([
      { $match: { isApproved: true } },
      {
        $group: {
          _id: null,
          avgRating: { $avg: '$rating' },
          totalRatings: { $sum: 1 },
        },
      },
    ]);

    const averageRating = ratingStats.length > 0 ? ratingStats[0].avgRating : 0;

    // Get rating distribution
    const ratingDistribution = await Review.aggregate([
      { $match: { isApproved: true } },
      {
        $group: {
          _id: '$rating',
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: -1 } },
    ]);

    // Calculate this month's stats
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const [
      reviewsThisMonth,
      menuItemsThisMonth,
      galleryImagesThisMonth,
    ] = await Promise.all([
      Review.countDocuments({ createdAt: { $gte: startOfMonth } }),
      Menu.countDocuments({ createdAt: { $gte: startOfMonth } }),
      Gallery.countDocuments({ createdAt: { $gte: startOfMonth } }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          totalReviews,
          pendingReviews,
          approvedReviews,
          totalMenuItems,
          activeMenuItems,
          totalCategories,
          totalGalleryImages,
          totalEvents,
          totalReels,
          totalHeroImages,
          averageRating: averageRating.toFixed(1),
        },
        thisMonth: {
          reviews: reviewsThisMonth,
          menuItems: menuItemsThisMonth,
          galleryImages: galleryImagesThisMonth,
        },
        recentActivity: {
          reviews: recentReviews,
          menuItems: recentMenuItems,
        },
        topRated: topRatedReviews,
        ratingDistribution: ratingDistribution.map(r => ({
          rating: r._id,
          count: r.count,
        })),
      },
    });
  } catch (error) {
    console.error('Dashboard GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}
