import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Product } from "@/lib/models";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://cocoa-cherry.vercel.app";

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    await connectDB();

    const product = await Product.findById(id).populate("category", "name");

    if (!product || !product.isActive) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 },
      );
    }

    const productSchema = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Product",
          "@id": `${siteUrl}/api/products/${id}/#product`,
          name: product.name,
          description: product.description,
          image: product.images?.[0]?.url || `${siteUrl}/logo.svg`,
          url: `${siteUrl}/menu`,
          brand: {
            "@type": "Brand",
            name: "Cocoa&Cherry",
          },
          offers: {
            "@type": "Offer",
            url: `${siteUrl}/menu`,
            priceCurrency: "INR",
            price: product.price,
            priceValidUntil: new Date(
              new Date().setFullYear(new Date().getFullYear() + 1),
            )
              .toISOString()
              .split("T")[0],
            availability:
              product.stock > 0
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock",
            seller: {
              "@type": "Organization",
              name: "Cocoa&Cherry",
            },
          },
          aggregateRating: product.rating
            ? {
                "@type": "AggregateRating",
                ratingValue: product.rating,
                reviewCount: product.reviewCount || 0,
              }
            : undefined,
          ...(product.weight && { weight: product.weight }),
          ...(product.tags && { keywords: product.tags.join(", ") }),
        },
        {
          "@type": "BreadcrumbList",
          "@id": `${siteUrl}/menu/#breadcrumb`,
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: siteUrl,
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Menu",
              item: `${siteUrl}/menu`,
            },
            {
              "@type": "ListItem",
              position: 3,
              name: product.name,
              item: `${siteUrl}/menu`,
            },
          ],
        },
      ],
    };

    return NextResponse.json({
      success: true,
      data: { product, schema: productSchema },
    });
  } catch (error) {
    console.error("Get product error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
