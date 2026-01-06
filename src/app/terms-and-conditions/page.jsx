'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

export default function TermsAndConditions() {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      content: `By accessing and using the Cocoa&Cherry website and services, you accept and agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services.`
    },
    {
      title: "2. Products and Services",
      content: `Cocoa&Cherry provides custom cake and bakery services. All products are freshly baked to order. We specialize in:
      • Custom birthday cakes
      • Wedding cakes
      • Anniversary cakes
      • Photo cakes
      • Designer fondant cakes
      • Eggless cake options
      
      Product images on our website are for illustration purposes. Actual products may vary slightly in appearance.`
    },
    {
      title: "3. Orders and Payment",
      content: `• All orders must be placed at least 48-72 hours in advance for custom cakes.
      • A minimum 50% advance payment is required to confirm your order.
      • Full payment must be completed before or at the time of delivery.
      • We accept Cash, UPI, and Bank Transfer payments.
      • Prices are subject to change without prior notice.
      • Custom design charges may apply based on complexity.`
    },
    {
      title: "4. Delivery Policy",
      content: `• We provide delivery services within Ahmedabad city limits.
      • We use Porter for safe and timely delivery of your cakes.
      • Delivery charges are calculated based on distance and will be communicated at the time of order.
      • Please ensure someone is available to receive the order at the delivery address.
      • We are not responsible for delays caused by traffic, weather, or other unforeseen circumstances.
      • Self-pickup is available from our location in Isanpur, Ahmedabad.`
    },
    {
      title: "5. Cancellation and Refund Policy",
      content: `• Orders can be cancelled up to 48 hours before the scheduled delivery/pickup time for a full refund.
      • Cancellations made within 48 hours will incur a 50% cancellation fee.
      • No refunds will be provided for cancellations made within 24 hours of delivery.
      • Custom orders with specific designs may have different cancellation terms.
      • Refunds will be processed within 5-7 business days.`
    },
    {
      title: "6. Quality and Storage",
      content: `• All our products are made with premium quality ingredients including imported Belgian chocolate.
      • We are FSSAI certified and follow strict hygiene protocols.
      • Cakes should be refrigerated upon receipt and consumed within 2-3 days for best taste.
      • Please inform us of any allergies at the time of ordering.
      • We are not liable for any reactions caused by undisclosed allergies.`
    },
    {
      title: "7. Intellectual Property",
      content: `• All content on this website including images, logos, and designs are the property of Cocoa&Cherry.
      • You may not use, reproduce, or distribute any content without our written permission.
      • Customer photos shared on our social media are used with implied consent for promotional purposes.`
    },
    {
      title: "8. Limitation of Liability",
      content: `• Cocoa&Cherry shall not be liable for any indirect, incidental, or consequential damages.
      • Our maximum liability is limited to the amount paid for the specific order.
      • We are not responsible for damage to cakes after delivery has been completed.`
    },
    {
      title: "9. Privacy Policy",
      content: `• We collect personal information (name, phone, address) solely for order processing and delivery.
      • Your information is kept confidential and not shared with third parties except delivery partners.
      • We may use your contact information to send order updates and promotional offers.
      • You can opt-out of promotional communications at any time.`
    },
    {
      title: "10. Contact Information",
      content: `For any questions or concerns regarding these terms, please contact us:
      
      📍 Address: 9/A, Dholeshwar Mahadev Rd, Ganesh Park Society, Rajeswari Society, Isanpur, Ahmedabad, Gujarat 380008
      
      📞 Phone: +91 97127 52469
      
      📧 Email: thakarjhanvi140@gmail.com
      
      📱 Instagram: @cocoa_cherry_`
    },
    {
      title: "11. Changes to Terms",
      content: `Cocoa&Cherry reserves the right to modify these Terms and Conditions at any time. Changes will be effective immediately upon posting on this website. Continued use of our services constitutes acceptance of the modified terms.`
    }
  ];

  return (
    <main className="min-h-screen bg-background-light">
      {/* Header */}
      <header className="bg-cocoa text-white py-4 sticky top-0 z-50">
        <div className="px-4 sm:px-6 md:px-10 flex justify-center">
          <div className="max-w-[1100px] w-full flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10">
                <Image
                  src="/logo.svg"
                  alt="Cocoa&Cherry Logo"
                  width={40}
                  height={40}
                  className="w-full h-full"
                />
              </div>
              <span className="text-xl font-bold font-serif">
                Cocoa<span style={{ color: '#c9a86c' }}>&amp;</span>Cherry
              </span>
            </Link>
            <Link
              href="/"
              className="flex items-center gap-2 text-sm hover:text-gold transition-colors"
            >
              <span className="material-symbols-outlined text-lg">arrow_back</span>
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="px-4 sm:px-6 md:px-10 py-12 flex justify-center">
        <div className="max-w-[900px] w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-cocoa mb-4 font-serif">
              Terms & Conditions
            </h1>
            <p className="text-accent mb-8">
              Last updated: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>

            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 md:p-10">
              <p className="text-accent mb-8 leading-relaxed">
                Welcome to Cocoa&Cherry! These terms and conditions outline the rules and regulations 
                for the use of our website and services. Please read these terms carefully before 
                placing an order or using our services.
              </p>

              <div className="space-y-8">
                {sections.map((section, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    className="border-b border-secondary pb-6 last:border-0"
                  >
                    <h2 className="text-xl font-bold text-cocoa mb-3">{section.title}</h2>
                    <p className="text-accent leading-relaxed whitespace-pre-line">{section.content}</p>
                  </motion.div>
                ))}
              </div>

              <div className="mt-10 p-6 bg-background-light rounded-xl text-center">
                <p className="text-accent mb-4">
                  By placing an order with Cocoa&Cherry, you acknowledge that you have read, 
                  understood, and agree to these Terms and Conditions.
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full font-bold hover:bg-cocoa transition-colors"
                >
                  <span className="material-symbols-outlined">home</span>
                  Back to Home
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-cocoa text-white/60 py-6 text-center text-sm">
        <p>© {new Date().getFullYear()} Cocoa&Cherry. All rights reserved.</p>
      </footer>
    </main>
  );
}

