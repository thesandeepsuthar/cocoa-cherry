// Admin authentication helper
// Uses secret key from environment variable only

const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY;

// Warn if no admin key is set in production
if (!ADMIN_SECRET_KEY && process.env.NODE_ENV === 'production') {
  console.error('⚠️ WARNING: ADMIN_SECRET_KEY is not set in environment variables!');
}

/**
 * Parse cookies from Cookie header string
 * @param {string} cookieHeader - Cookie header value
 * @returns {Object} - Parsed cookies object
 */
function parseCookies(cookieHeader) {
  const cookies = {};
  if (!cookieHeader) return cookies;
  
  cookieHeader.split(';').forEach(cookie => {
    const [name, ...rest] = cookie.trim().split('=');
    if (name) {
      cookies[name] = rest.join('=');
    }
  });
  
  return cookies;
}

/**
 * Verify admin authentication
 * Supports both session cookies (new method) and query parameters (legacy)
 * @param {string|Request} keyOrRequest - Admin key string or Request object
 * @returns {boolean} - Whether the key is valid
 */
export function verifyAdminKey(keyOrRequest) {
  // If no admin key is configured, deny all access
  if (!ADMIN_SECRET_KEY) {
    console.error('Admin access denied: ADMIN_SECRET_KEY not configured');
    return false;
  }

  // If it's a string, verify it directly
  if (typeof keyOrRequest === 'string') {
    return verifyKeyString(keyOrRequest);
  }

  // If it's a Request object, check session cookie first, then query param
  if (keyOrRequest && typeof keyOrRequest === 'object') {
    // Check for session cookie (new secure method)
    // Extract from Cookie header
    const cookieHeader = keyOrRequest.headers?.get?.('cookie') || keyOrRequest.headers?.cookie;
    if (cookieHeader) {
      const cookies = parseCookies(cookieHeader);
      if (cookies.admin_session === 'authenticated') {
        return true;
      }
    }

    // Also check if cookies are available via Next.js cookies() API
    if (keyOrRequest.cookies) {
      const session = keyOrRequest.cookies.get?.('admin_session');
      if (session?.value === 'authenticated') {
        return true;
      }
    }

    // Fall back to query parameter (legacy support)
    if (keyOrRequest.url) {
      try {
        const { searchParams } = new URL(keyOrRequest.url);
        const providedKey = searchParams.get('key');
        if (providedKey) {
          return verifyKeyString(providedKey);
        }
      } catch {
        return false;
      }
    }
  }

  return false;
}

/**
 * Verify admin key string using timing-safe comparison
 * @param {string} providedKey - The key to verify
 * @returns {boolean} - Whether the key is valid
 */
function verifyKeyString(providedKey) {
  if (!providedKey || typeof providedKey !== 'string') {
    return false;
  }

  // Use timing-safe comparison to prevent timing attacks
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
