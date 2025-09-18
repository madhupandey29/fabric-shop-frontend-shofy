// app/fabric/[slug]/page.tsx
import type { Metadata } from "next";
import Wrapper   from "@/layout/wrapper";
import HeaderTwo from "@/layout/headers/header-2";
import Footer    from "@/layout/footers/footer";
import ProductClient from "./ProductDetailsClient";

// ✅ ISR window: 30 days
export const revalidate = 60 * 60 * 24 * 30; // 2592000

function apiHeaders() {
  return {
    "x-api-key": process.env.NEXT_PUBLIC_API_KEY ?? "",
    "x-admin-email": process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? "",
    "Content-Type": "application/json",
  };
}

// Small helper
const firstNonEmpty = (...v: Array<string | undefined | null>) =>
  v.find((x) => x != null && x !== "");

// ✅ Metadata also respects ISR (same 30d window)
export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const { slug } = params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/product/slug/${slug}`,
    {
      headers: apiHeaders(),
      next: { revalidate }, // <- cache metadata fetch for 30 days
    }
  );

  if (!res.ok) {
    return { title: "Product not found", description: "" };
  }

  const payload = await res.json();
  const product = Array.isArray(payload?.data) ? payload.data[0] : payload?.data ?? {};

  const siteURL   = process.env.NEXT_PUBLIC_SITE_URL || "";
  const canonical = `${siteURL}/fabric/${slug}`;

  const title = firstNonEmpty(
    product?.seoTitle,
    product?.name,
    product?.title,
    slug.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
  ) || "Product";

  const description = firstNonEmpty(
    product?.seoDescription,
    product?.productdescription,
    ""
  ) || "";

  const image = firstNonEmpty(
    product?.seoImage,
    product?.img,
    product?.image1,
    product?.image2
  );

  const keywords = firstNonEmpty(
    product?.seoKeywords,
    Array.isArray(product?.tags) ? product.tags.join(", ") : undefined,
    product?.category?.name
  ) || undefined;

  return {
    title,
    description,
    keywords,
    alternates: { canonical },
    openGraph: {
      type: "website",
      url: canonical,
      title,
      description,
      images: image ? [{ url: image }] : [],
      locale: "en_US",
      siteName: "AGE Fabrics",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined,
    },
    other: {
      robots: "index,follow",
      "theme-color": "#ffffff",
    },
  };
}

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = params;

  return (
    <Wrapper>
      <HeaderTwo style_2 />
      <ProductClient slug={slug} />
      <Footer primary_style />
    </Wrapper>
  );
}
