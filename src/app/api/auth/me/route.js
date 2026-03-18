import { NextResponse } from "next/server";
import { authenticateUser } from "@/lib/middleware/auth";

export async function GET(request) {
  try {
    const authResult = await authenticateUser(request);

    if (!authResult.success) {
      return NextResponse.json(
        { success: false, message: authResult.message },
        { status: 401 },
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: authResult.user._id,
          mobile: authResult.user.mobile,
          name: authResult.user.name,
          email: authResult.user.email,
          address: authResult.user.address,
          isAdmin: authResult.user.isAdmin || false,
          createdAt: authResult.user.createdAt,
        },
      },
    });
  } catch (error) {
    console.error("Get user error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
