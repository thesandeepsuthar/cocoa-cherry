import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { OtpVerification } from "@/lib/models";
import { generateOTP, sendOTP, validateMobile } from "@/lib/utils/otp";

export async function POST(request) {
  try {
    const { mobile } = await request.json();

    // Validate mobile number
    if (!mobile || !validateMobile(mobile)) {
      return NextResponse.json(
        {
          success: false,
          message: "Please provide a valid 10-digit mobile number",
        },
        { status: 400 },
      );
    }

    await connectDB();

    // Check for recent OTP requests (rate limiting)
    const recentOtp = await OtpVerification.findOne({
      mobile,
      createdAt: { $gte: new Date(Date.now() - 60 * 1000) }, // Within last minute
    });

    if (recentOtp) {
      return NextResponse.json(
        {
          success: false,
          message: "Please wait before requesting another OTP",
        },
        { status: 429 },
      );
    }

    // Generate and save OTP
    const otp = generateOTP();

    // Delete any existing OTPs for this mobile
    await OtpVerification.deleteMany({ mobile });

    // Create new OTP record
    await OtpVerification.create({
      mobile,
      otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    });

    // Send OTP
    const smsResult = await sendOTP(mobile, otp);

    if (!smsResult.success) {
      return NextResponse.json(
        { success: false, message: "Failed to send OTP. Please try again." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "OTP sent successfully",
      data: { mobile },
    });
  } catch (error) {
    console.error("Send OTP error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
