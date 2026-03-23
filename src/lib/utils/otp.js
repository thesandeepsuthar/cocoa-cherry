// Generate 6-digit OTP
export function generateOTP() {
  // For testing, always return 112233
  if (process.env.NODE_ENV === "development") {
    return "112233";
  }
  // In production, generate random OTP
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Simulate sending OTP (in production, integrate with SMS service like Twilio, AWS SNS, etc.)
export async function sendOTP(mobile, otp) {
  try {
    // For development, just log the OTP
    console.log(`OTP for ${mobile}: ${otp}`);

    // In production, replace with actual SMS service
    // Example with Twilio:
    // const client = twilio(accountSid, authToken);
    // await client.messages.create({
    //   body: `Your OTP is: ${otp}. Valid for 10 minutes.`,
    //   from: '+1234567890',
    //   to: `+91${mobile}`
    // });

    return { success: true, message: "OTP sent successfully" };
  } catch (error) {
    console.error("Error sending OTP:", error);
    return { success: false, message: "Failed to send OTP" };
  }
}

// Validate mobile number format
export function validateMobile(mobile) {
  const mobileRegex = /^[0-9]{10}$/;
  return mobileRegex.test(mobile);
}
