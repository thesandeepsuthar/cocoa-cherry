// Security utilities for input validation and sanitization

/**
 * Sanitize string input to prevent XSS attacks
 * Escapes HTML special characters
 */
export function sanitizeString(str) {
  if (typeof str !== 'string') return '';
  
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
}

/**
 * Sanitize object - recursively sanitize all string values
 */
export function sanitizeObject(obj) {
  if (typeof obj !== 'object' || obj === null) {
    return typeof obj === 'string' ? sanitizeString(obj) : obj;
  }
  
  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeString(value);
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeObject(value);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
}

/**
 * Validate email format
 */
export function isValidEmail(email) {
  if (typeof email !== 'string') return false;
  // RFC 5322 compliant email regex
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email) && email.length <= 254;
}

/**
 * Validate phone number (basic validation)
 */
export function isValidPhone(phone) {
  if (typeof phone !== 'string') return false;
  // Remove spaces, dashes, and parentheses
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  // Should be 10-15 digits, optionally starting with +
  return /^\+?[0-9]{10,15}$/.test(cleaned);
}


/**
 * Validate URL format
 */
export function isValidUrl(url) {
  if (typeof url !== 'string') return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Rate limiting store (in-memory for simplicity)
 * For production, use Redis or similar
 */
const rateLimitStore = new Map();

/**
 * Simple rate limiter
 * @param {string} identifier - IP address or user ID
 * @param {number} maxRequests - Maximum requests allowed
 * @param {number} windowMs - Time window in milliseconds
 * @returns {{ allowed: boolean, remaining: number, resetTime: number }}
 */
export function checkRateLimit(identifier, maxRequests = 10, windowMs = 60000) {
  const now = Date.now();
  const key = identifier;
  
  // Clean up old entries periodically
  if (Math.random() < 0.01) {
    for (const [k, v] of rateLimitStore.entries()) {
      if (now > v.resetTime) {
        rateLimitStore.delete(k);
      }
    }
  }

  const record = rateLimitStore.get(key);
  
  if (!record || now > record.resetTime) {
    // Create new record
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + windowMs,
    });
    return { allowed: true, remaining: maxRequests - 1, resetTime: now + windowMs };
  }

  if (record.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetTime: record.resetTime };
  }

  record.count++;
  return { allowed: true, remaining: maxRequests - record.count, resetTime: record.resetTime };
}

/**
 * Get client IP from request headers
 */
export function getClientIP(request) {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  if (realIP) {
    return realIP;
  }
  return 'unknown';
}

/**
 * Validate required fields
 */
export function validateRequired(obj, requiredFields) {
  const missing = [];
  for (const field of requiredFields) {
    if (obj[field] === undefined || obj[field] === null || obj[field] === '') {
      missing.push(field);
    }
  }
  return {
    valid: missing.length === 0,
    missing,
    error: missing.length > 0 ? `Missing required fields: ${missing.join(', ')}` : null,
  };
}

/**
 * Sanitize and validate review data
 */
export function validateReviewData(data) {
  const errors = [];
  
  // Required fields
  const required = validateRequired(data, ['name', 'email', 'rating', 'review']);
  if (!required.valid) {
    errors.push(required.error);
  }

  // Email validation
  if (data.email && !isValidEmail(data.email)) {
    errors.push('Invalid email format');
  }

  // Rating validation
  if (data.rating !== undefined) {
    const rating = Number(data.rating);
    if (isNaN(rating) || rating < 1 || rating > 5) {
      errors.push('Rating must be between 1 and 5');
    }
  }

  // Review length
  if (data.review && data.review.length > 1000) {
    errors.push('Review must be less than 1000 characters');
  }

  // Name length
  if (data.name && data.name.length > 100) {
    errors.push('Name must be less than 100 characters');
  }

  return {
    valid: errors.length === 0,
    errors,
    sanitized: {
      name: sanitizeString(data.name || ''),
      email: sanitizeString(data.email || '').toLowerCase(),
      cakeType: sanitizeString(data.cakeType || ''),
      rating: Number(data.rating) || 0,
      review: sanitizeString(data.review || ''),
    },
  };
}

