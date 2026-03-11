"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

// Stat Card Component
function StatCard({ icon, label, value, subtitle, color = "rose", trend }) {
  const colorClasses = {
    rose: "from-rose/20 to-rose-dark/20 text-rose",
    blue: "from-blue-500/20 to-blue-600/20 text-blue-400",
    green: "from-emerald-500/20 to-emerald-600/20 text-emerald-400",
    yellow: "from-yellow-500/20 to-yellow-600/20 text-yellow-400",
    purple: "from-purple-500/20 to-purple-600/20 text-purple-400",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-noir-light rounded-xl p-4 sm:p-6 border border-cream/10 hover:border-cream/20 transition-all"
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className={`w-12 h-12 rounded-lg bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center`}
        >
          <span className="material-symbols-outlined text-2xl">{icon}</span>
        </div>
        {trend && (
          <div
            className={`flex items-center gap-1 text-xs font-medium ${
              trend > 0 ? "text-emerald-400" : "text-red-400"
            }`}
          >
            <span className="material-symbols-outlined text-sm">
              {trend > 0 ? "trending_up" : "trending_down"}
            </span>
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div>
        <p className="text-2xl sm:text-3xl font-bold text-cream mb-1">
          {value}
        </p>
        <p className="text-sm text-cream-muted">{label}</p>
        {subtitle && <p className="text-xs text-cream/40 mt-1">{subtitle}</p>}
      </div>
    </motion.div>
  );
}

// Activity Item Component
function ActivityItem({ icon, title, subtitle, time, color = "rose" }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-cream/5 transition-colors">
      <div
        className={`w-10 h-10 rounded-lg bg-${color}/20 flex items-center justify-center flex-shrink-0`}
      >
        <span className={`material-symbols-outlined text-${color} text-lg`}>
          {icon}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-cream truncate">{title}</p>
        <p className="text-xs text-cream-muted truncate">{subtitle}</p>
      </div>
      <span className="text-xs text-cream/40 whitespace-nowrap">{time}</span>
    </div>
  );
}

// Loading Skeleton
function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="bg-noir-light rounded-xl h-32 border border-cream/10"
          />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-noir-light rounded-xl h-96 border border-cream/10" />
        <div className="bg-noir-light rounded-xl h-96 border border-cream/10" />
      </div>
    </div>
  );
}

export default function Dashboard({ adminKey, showToast }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/dashboard?key=${adminKey}`);
      const data = await res.json();
      if (data.success) {
        setStats(data.data);
      } else {
        showToast(data.error || "Failed to load dashboard", "error");
      }
    } catch (error) {
      console.error("Dashboard error:", error);
      showToast("Failed to load dashboard", "error");
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  if (loading) return <LoadingSkeleton />;
  if (!stats) return null;

  const { overview, thisMonth, recentActivity, topRated, ratingDistribution } =
    stats;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2
            className="text-2xl sm:text-3xl font-bold text-cream mb-1"
            style={{ fontFamily: "var(--font-cinzel)" }}
          >
            Dashboard
          </h2>
          <p className="text-sm text-cream-muted">
            Welcome back! Here's what's happening with your business.
          </p>
        </div>
        <button
          onClick={fetchDashboardData}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-cream/20 text-cream text-sm hover:bg-cream/5 transition-colors"
        >
          <span className="material-symbols-outlined text-lg">refresh</span>
          Refresh
        </button>
      </div>

      {/* Overview Stats */}
      <div>
        <h3 className="text-lg font-bold text-cream mb-4">Overview</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon="rate_review"
            label="Total Reviews"
            value={overview.totalReviews}
            subtitle={`${overview.pendingReviews} pending approval`}
            color="rose"
          />
          <StatCard
            icon="restaurant_menu"
            label="Menu Items"
            value={overview.totalMenuItems}
            subtitle={`${overview.activeMenuItems} active`}
            color="blue"
          />
          <StatCard
            icon="photo_library"
            label="Gallery Images"
            value={overview.totalGalleryImages}
            color="green"
          />
          <StatCard
            icon="star"
            label="Average Rating"
            value={overview.averageRating}
            subtitle={`From ${overview.approvedReviews} reviews`}
            color="yellow"
          />
          <StatCard
            icon="celebration"
            label="Events"
            value={overview.totalEvents}
            color="purple"
          />
          <StatCard
            icon="movie"
            label="Reels"
            value={overview.totalReels}
            color="rose"
          />
          <StatCard
            icon="category"
            label="Categories"
            value={overview.totalCategories}
            color="blue"
          />
          <StatCard
            icon="image"
            label="Hero Images"
            value={overview.totalHeroImages}
            color="green"
          />
        </div>
      </div>

      {/* This Month Stats */}
      <div>
        <h3 className="text-lg font-bold text-cream mb-4">This Month</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            icon="add_circle"
            label="New Reviews"
            value={thisMonth.reviews}
            color="rose"
          />
          <StatCard
            icon="add_circle"
            label="New Menu Items"
            value={thisMonth.menuItems}
            color="blue"
          />
          <StatCard
            icon="add_circle"
            label="New Gallery Images"
            value={thisMonth.galleryImages}
            color="green"
          />
        </div>
      </div>

      {/* Recent Activity & Top Rated */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Reviews */}
        <div className="bg-noir-light rounded-xl p-4 sm:p-6 border border-cream/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-cream">Recent Reviews</h3>
            <span className="material-symbols-outlined text-cream/40">
              rate_review
            </span>
          </div>
          <div className="space-y-2">
            {recentActivity.reviews.length > 0 ? (
              recentActivity.reviews.map((review) => (
                <ActivityItem
                  key={review._id}
                  icon="person"
                  title={review.name}
                  subtitle={`${review.rating} ⭐ - ${review.isApproved ? "Approved" : "Pending"}`}
                  time={formatTimeAgo(review.createdAt)}
                  color={review.isApproved ? "green" : "yellow"}
                />
              ))
            ) : (
              <p className="text-sm text-cream-muted text-center py-8">
                No recent reviews
              </p>
            )}
          </div>
        </div>

        {/* Recent Menu Items */}
        <div className="bg-noir-light rounded-xl p-4 sm:p-6 border border-cream/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-cream">Recent Menu Items</h3>
            <span className="material-symbols-outlined text-cream/40">
              restaurant_menu
            </span>
          </div>
          <div className="space-y-2">
            {recentActivity.menuItems.length > 0 ? (
              recentActivity.menuItems.map((item) => (
                <ActivityItem
                  key={item._id}
                  icon="restaurant"
                  title={item.name}
                  subtitle={`${item.category?.name || "Uncategorized"} - ₹${item.price}`}
                  time={formatTimeAgo(item.createdAt)}
                  color="blue"
                />
              ))
            ) : (
              <p className="text-sm text-cream-muted text-center py-8">
                No recent menu items
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Top Rated Reviews */}
      <div className="bg-noir-light rounded-xl p-4 sm:p-6 border border-cream/10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-cream">Top Rated Reviews</h3>
          <span className="material-symbols-outlined text-cream/40">star</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {topRated.length > 0 ? (
            topRated.map((review) => (
              <div
                key={review._id}
                className="p-4 rounded-lg bg-noir border border-cream/10"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-cream">{review.name}</p>
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-400 text-sm">
                      {review.rating}
                    </span>
                    <span className="material-symbols-outlined text-yellow-400 text-sm">
                      star
                    </span>
                  </div>
                </div>
                <p className="text-xs text-cream-muted line-clamp-2">
                  {review.review}
                </p>
                <p className="text-xs text-cream/40 mt-2">
                  {formatTimeAgo(review.createdAt)}
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-cream-muted text-center py-8 col-span-full">
              No reviews yet
            </p>
          )}
        </div>
      </div>

      {/* Rating Distribution */}
      {ratingDistribution.length > 0 && (
        <div className="bg-noir-light rounded-xl p-4 sm:p-6 border border-cream/10">
          <h3 className="text-lg font-bold text-cream mb-4">
            Rating Distribution
          </h3>
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((rating) => {
              const data = ratingDistribution.find((r) => r.rating === rating);
              const count = data ? data.count : 0;
              const percentage =
                overview.approvedReviews > 0
                  ? (count / overview.approvedReviews) * 100
                  : 0;

              return (
                <div key={rating} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 w-16">
                    <span className="text-sm text-cream">{rating}</span>
                    <span className="material-symbols-outlined text-yellow-400 text-sm">
                      star
                    </span>
                  </div>
                  <div className="flex-1 h-6 bg-noir rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.5, delay: rating * 0.1 }}
                      className="h-full bg-gradient-to-r from-rose to-rose-dark"
                    />
                  </div>
                  <span className="text-sm text-cream-muted w-16 text-right">
                    {count} ({percentage.toFixed(0)}%)
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
