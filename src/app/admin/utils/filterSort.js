/**
 * Filter and sort utility functions for admin panel
 */

/**
 * Filter items based on search term and status
 */
export function filterItems(items, searchTerm, filterStatus, searchFields = ['name', 'title']) {
  let filtered = [...items];

  // Apply search filter
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filtered = filtered.filter((item) => {
      return searchFields.some((field) => {
        const value = item[field];
        return value && value.toString().toLowerCase().includes(term);
      });
    });
  }

  // Apply status filter
  if (filterStatus !== 'all') {
    const isActive = filterStatus === 'active';
    filtered = filtered.filter((item) => {
      // Handle different status field names
      if ('isActive' in item) return item.isActive === isActive;
      if ('isApproved' in item) return item.isApproved === isActive;
      if ('isPublished' in item) return item.isPublished === isActive;
      return true;
    });
  }

  return filtered;
}

/**
 * Sort items based on sort option
 */
export function sortItems(items, sortBy) {
  const sorted = [...items];

  switch (sortBy) {
    case 'newest':
      return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    case 'oldest':
      return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    
    case 'name-asc':
      return sorted.sort((a, b) => {
        const nameA = (a.name || a.title || '').toLowerCase();
        const nameB = (b.name || b.title || '').toLowerCase();
        return nameA.localeCompare(nameB);
      });
    
    case 'name-desc':
      return sorted.sort((a, b) => {
        const nameA = (a.name || a.title || '').toLowerCase();
        const nameB = (b.name || b.title || '').toLowerCase();
        return nameB.localeCompare(nameA);
      });
    
    case 'rating-high':
      return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    
    case 'rating-low':
      return sorted.sort((a, b) => (a.rating || 0) - (b.rating || 0));
    
    case 'price-high':
      return sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
    
    case 'price-low':
      return sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
    
    default:
      return sorted;
  }
}

/**
 * Combined filter and sort
 */
export function filterAndSort(items, searchTerm, filterStatus, sortBy, searchFields) {
  const filtered = filterItems(items, searchTerm, filterStatus, searchFields);
  return sortItems(filtered, sortBy);
}
