import { verifyToken, getTokenFromRequest } from '../utils/jwt.js';
import { User } from '../models/index.js';
import connectDB from '../mongodb.js';

export async function authenticateUser(request) {
  try {
    const token = getTokenFromRequest(request);
    
    if (!token) {
      return { success: false, message: 'No token provided' };
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return { success: false, message: 'Invalid token' };
    }

    await connectDB();
    const user = await User.findById(decoded.userId).select('-__v');
    
    if (!user || !user.isActive) {
      return { success: false, message: 'User not found or inactive' };
    }

    return { success: true, user };
  } catch (error) {
    console.error('Authentication error:', error);
    return { success: false, message: 'Authentication failed' };
  }
}

export function createAuthResponse(message, status = 401) {
  return new Response(
    JSON.stringify({ success: false, message }),
    { 
      status,
      headers: { 'Content-Type': 'application/json' }
    }
  );
}