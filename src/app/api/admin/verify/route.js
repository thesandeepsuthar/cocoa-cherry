import { NextResponse } from 'next/server';
import { verifyAdminKey } from '@/lib/auth';
import { checkRateLimit, getClientIP } from '@/lib/security';

// POST - Verify admin key and create session
export async function POST(request) {
  try {
    const clientIP = getClientIP(request);
    
    // Rate limiting: 5 attempts per 15 minutes
    const rateLimit = checkRateLimit(`admin-verify-${clientIP}`, 5, 15 * 60 * 1000);
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: 'Too many attempts. Please try again later.',
          retryAfter: Math.ceil((rateLimit.resetTime - Date.now()) / 1000),
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { key } = body;

    if (!key || typeof key !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Admin key is required' },
        { status: 400 }
      );
    }

    // Verify the admin key
    const isValid = verifyAdminKey(key);

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid admin key' },
        { status: 401 }
      );
    }

    // Create a secure session cookie
    // Using httpOnly cookie for security (can't be accessed via JavaScript)
    const response = NextResponse.json({
      success: true,
      message: 'Authentication successful',
    });

    // Set httpOnly cookie that expires in 24 hours
    // In production, use secure: true and sameSite: 'strict'
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/',
    };

    response.cookies.set('admin_session', 'authenticated', cookieOptions);

    return response;
  } catch (error) {
    console.error('Admin verification error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET - Check if admin session is valid
export async function GET(request) {
  try {
    // Check cookie from request headers (for API routes)
    const cookieHeader = request.headers.get('cookie') || '';
    const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
      const [name, value] = cookie.trim().split('=');
      if (name) acc[name] = value;
      return acc;
    }, {});
    
    if (cookies.admin_session === 'authenticated') {
      return NextResponse.json({
        success: true,
        authenticated: true,
      });
    }

    return NextResponse.json({
      success: false,
      authenticated: false,
    });
  } catch (error) {
    console.error('Admin session check error:', error);
    return NextResponse.json(
      { success: false, authenticated: false },
      { status: 500 }
    );
  }
}
