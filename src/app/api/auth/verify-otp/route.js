import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { User, OtpVerification } from "@/lib/models";
import { generateToken } from "@/lib/utils/jwt";
import { validateMobile } from "@/lib/utils/otp";

export async function POST(request) {
  try {
    const { mobile, otp, name, email } = await request.json();

    // Validate input
    if (!mobile || !validateMobile(mobile)) {
      return NextResponse.json(
        {
          success: false,
          message: "Please provide a valid 10-digit mobile number",
        },
        { status: 400 },
      );
    }

    if (!otp || otp.length !== 6) {
      return NextResponse.json(
        { success: false, message: "Please provide a valid 6-digit OTP" },
        { status: 400 },
      );
    }

    await connectDB();

    // Find and validate OTP
    const otpRecord = await OtpVerification.findOne({
      mobile,
      otp,
      isUsed: false,
      expiresAt: { $gt: new Date() },
    });

    if (!otpRecord) {
      // Increment attempts for existing OTP
      await OtpVerification.updateOne(
        { mobile, isUsed: false },
        { $inc: { attempts: 1 } },
      );

      return NextResponse.json(
        { success: false, message: "Invalid or expired OTP" },
        { status: 400 },
      );
    }

    // Check attempts limit
    if (otpRecord.attempts >= 3) {
      await OtpVerification.updateOne({ _id: otpRecord._id }, { isUsed: true });

      return NextResponse.json(
        {
          success: false,
          message: "Too many failed attempts. Please request a new OTP.",
        },
        { status: 400 },
      );
    }

    // Mark OTP as used
    await OtpVerification.updateOne({ _id: otpRecord._id }, { isUsed: true });

    // Check if user exists
    let user = await User.findOne({ mobile });
    let isNewUser = false;

    if (!user) {
      // New user registration
      // Name and email are optional during initial OTP verification
      // If name is not provided, use mobile number as temporary display name
      const displayName =
        name && name.trim().length >= 2 ? name.trim() : mobile;

      user = await User.create({
        mobile,
        name: displayName,
        email: email?.trim() || undefined,
      });
      isNewUser = true;
    }

    // Generate JWT token
    const token = generateToken({
      userId: user._id,
      mobile: user.mobile,
    });

    // Create response with token in cookie
    const response = NextResponse.json({
      success: true,
      message: isNewUser ? "Registration successful" : "Login successful",
      data: {
        user: {
          id: user._id,
          mobile: user.mobile,
          name: user.name,
          email: user.email,
          address: user.address,
          isAdmin: user.isAdmin || false,
        },
        isNewUser,
      },
    });

    // Set HTTP-only cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error("Verify OTP error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
