"use client";

import { motion } from "framer-motion";

export default function SearchFilter({
  searchTerm,
  onSearchChange,
  filterStatus,
  onFilterChange,
  sortBy,
  onSortChange,
  showStatusFilter = true,
  showSortOptions = true,
  placeholder = "Search...",
}) {
  return (
    <div className="mb-4 sm:mb-6 space-y-3">
      {/* Search Input */}
      <div className="relative">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-cream/40">
          search
        </span>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
          className="w-full h-11 pl-11 pr-4 rounded-lg border border-cream/10 bg-noir-light text-cream placeholder:text-cream/40 focus:ring-2 focus:ring-rose/20 focus:border-rose transition-all"
        />
        {searchTerm && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-cream/40 hover:text-cream transition-colors"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        )}
      </div>

      {/* Filters Row */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Status Filter */}
        {showStatusFilter && (
          <div className="flex-1">
            <select
              value={filterStatus}
              onChange={(e) => onFilterChange(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-cream/10 bg-noir-light text-cream focus:ring-2 focus:ring-rose/20 focus:border-rose transition-all text-sm"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        )}

        {/* Sort Options */}
        {showSortOptions && (
          <div className="flex-1">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-cream/10 bg-noir-light text-cream focus:ring-2 focus:ring-rose/20 focus:border-rose transition-all text-sm"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
            </select>
          </div>
        )}

        {/* Clear Filters Button */}
        {(searchTerm || filterStatus !== "all" || sortBy !== "newest") && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => {
              onSearchChange("");
              onFilterChange("all");
              onSortChange("newest");
            }}
            className="px-4 h-10 rounded-lg border border-cream/20 text-cream text-sm hover:bg-cream/5 transition-colors whitespace-nowrap"
          >
            Clear Filters
          </motion.button>
        )}
      </div>
    </div>
  );
}
