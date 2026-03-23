const WHATSAPP_API_URL = "https://graph.facebook.com/v18.0";

async function getWhatsAppCredentials() {
  return {
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID,
    accessToken: process.env.WHATSAPP_ACCESS_TOKEN,
    businessAccountId: process.env.WHATSAPP_BUSINESS_ACCOUNT_ID,
  };
}

export async function sendWhatsAppMessage(mobile, message, type = "text") {
  try {
    const { phoneNumberId, accessToken } = await getWhatsAppCredentials();

    if (!phoneNumberId || !accessToken) {
      console.log("WhatsApp credentials not configured, skipping message");
      return { success: false, message: "WhatsApp not configured" };
    }

    const formattedMobile = mobile.startsWith("+91") ? mobile : `+91${mobile}`;

    const payload = {
      messaging_product: "whatsapp",
      to: formattedMobile,
      type: type,
    };

    if (type === "text") {
      payload.text = { body: message };
    }

    const response = await fetch(
      `${WHATSAPP_API_URL}/${phoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("WhatsApp API error:", data);
      return {
        success: false,
        message: data.error?.message || "Failed to send message",
      };
    }

    return { success: true, messageId: data.messages?.[0]?.id };
  } catch (error) {
    console.error("Error sending WhatsApp message:", error);
    return { success: false, message: error.message };
  }
}

export async function sendWelcomeMessage(mobile, name) {
  const message = `Welcome to Cocoa&Cherry! 🎂

Hi ${name || "there"},

Thank you for joining us! We're thrilled to have you as our valued customer.

At Cocoa & Cherry, we specialize in creating delicious custom cakes and desserts made with love and the finest ingredients.

Browse our collection and order your favorite cake today!

Best regards,
Cocoa & Cherry Team
FSSAI Certified Home Bakery`;

  return sendWhatsAppMessage(mobile, message);
}

export async function sendOrderConfirmationMessage(mobile, order) {
  const itemsList = order.items
    .map((item) => `${item.name} x${item.quantity}`)
    .join("\n• ");

  const message = `Order Confirmed! 🎉

Dear ${order.shippingAddress?.name || "Customer"},

Your order has been successfully placed!

Order ID: ${order.orderId}
Date: ${new Date(order.orderDate).toLocaleDateString("en-IN")}

Items:
• ${itemsList}

Total: ₹${order.totalAmount}
Payment: Cash on Delivery

We'll notify you as your order progresses!

Cocoa & Cherry
FSSAI Certified Home Bakery`;

  return sendWhatsAppMessage(mobile, message);
}

export async function sendOrderStatusUpdateMessage(mobile, order, newStatus) {
  const statusMessages = {
    confirmed: "Your order has been confirmed and is being prepared with care.",
    preparing: "Our chefs are now preparing your delicious cake!",
    ready: "Your order is ready and will be dispatched soon.",
    out_for_delivery: "Your order is out for delivery!",
    completed:
      "Thank you! Your order has been delivered. We hope you enjoy your cake!",
    cancelled:
      "Your order has been cancelled. Contact us if you need any assistance.",
  };

  const message = `Order Update 📋

Order ID: ${order.orderId}

Status: ${newStatus.toUpperCase()}
${statusMessages[newStatus] || ""}

Thank you for choosing Cocoa & Cherry!

Cocoa & Cherry
FSSAI Certified Home Bakery`;

  return sendWhatsAppMessage(mobile, message);
}

export async function sendOrderDeliveryMessage(mobile, order) {
  const message = `Delivery Complete! 🎂

Dear ${order.shippingAddress?.name || "Customer"},

Your order (${order.orderId}) has been delivered!

We hope you enjoy your delicious cake from Cocoa & Cherry!

Please share your feedback and spread the word about us.

Thank you for choosing Cocoa & Cherry!

Cocoa & Cherry
FSSAI Certified Home Bakery`;

  return sendWhatsAppMessage(mobile, message);
}
