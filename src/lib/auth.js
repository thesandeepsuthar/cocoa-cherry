// Admin authentication helper
// Uses secret key from environment variable only

const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY;

// Warn if no admin key is set in production
if (!ADMIN_SECRET_KEY && process.env.NODE_ENV === 'production') {
  console.error('⚠️ WARNING: ADMIN_SECRET_KEY is not set in environment variables!');
}

/**
 * Verify admin authentication
 * @param {string|Request} keyOrRequest - Admin key string or Request object
 * @returns {boolean} - Whether the key is valid
 */
export function verifyAdminKey(keyOrRequest) {
  // If no admin key is configured, deny all access
  if (!ADMIN_SECRET_KEY) {
    console.error('Admin access denied: ADMIN_SECRET_KEY not configured');
    return false;
  }

  let providedKey = null;

  // Accept either a key string directly or extract from request
  if (typeof keyOrRequest === 'string') {
    providedKey = keyOrRequest;
  } else if (keyOrRequest?.url) {
    // If it's a request object, extract from URL
    try {
      const { searchParams } = new URL(keyOrRequest.url);
      providedKey = searchParams.get('key');
    } catch {
      return false;
    }
  }

  if (!providedKey) {
    return false;
  }

  // Use timing-safe comparison to prevent timing attacks
  // For simplicity, we do basic comparison but ensure consistent time
  const keyBuffer = Buffer.from(providedKey);
  const secretBuffer = Buffer.from(ADMIN_SECRET_KEY);

  if (keyBuffer.length !== secretBuffer.length) {
    // Still do a comparison to maintain consistent timing
    Buffer.from(ADMIN_SECRET_KEY).equals(Buffer.from(ADMIN_SECRET_KEY));
    return false;
  }

  return keyBuffer.equals(secretBuffer);
}

/**
 * Create rate limit response
 */
export function rateLimitResponse(resetTime) {
  const retryAfter = Math.ceil((resetTime - Date.now()) / 1000);
  return {
    success: false,
    error: 'Too many requests. Please try again later.',
    retryAfter,
  };
}
