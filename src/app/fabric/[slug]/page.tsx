// app/fabric/[slug]/page.tsx
import type { Metadata } from "next";
import Wrapper from "@/layout/wrapper";
import HeaderTwo from "@/layout/headers/header-2";
import Footer from "@/layout/footers/footer";
import ProductClient from "./ProductDetailsClient";

// ✅ ISR window: 30 days (2592000 seconds)
export const revalidate = 2_592_000;

function apiHeaders() {
  return {
    "x-api-key": process.env.NEXT_PUBLIC_API_KEY ?? "",
    "x-admin-email": process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? "",
    "Content-Type": "application/json",
  };
}

const firstNonEmpty = (...v: Array<string | undefined | null>) =>
  v.find((x) => x != null && x !== "");

/** ✅ Metadata also respects ISR (same 30d window) */
export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const { slug } = params;

  const apiBase = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/+$/, "");
  const res = await fetch(`${apiBase}/product/slug/${slug}`, {
    headers: apiHeaders(),
    next: { revalidate }, // cache metadata fetch for 30 days
  });

  if (!res.ok) {
    return { title: "Product not found", description: "" };
  }

  const payload = await res.json();
  const product = Array.isArray(payload?.data) ? payload.data[0] : payload?.data ?? {};

  const siteURL = process.env.NEXT_PUBLIC_SITE_URL || "";
  const canonical = `${siteURL}/fabric/${slug}`;

  const title =
    firstNonEmpty(
      product?.seoTitle,
      product?.name,
      product?.title,
      slug.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    ) || "Product";

  const description =
    firstNonEmpty(product?.seoDescription, product?.productdescription, "") || "";

  const ogImage =
    firstNonEmpty(product?.seoImage, product?.image, product?.image1, product?.image2) || undefined;

  const keywords =
    firstNonEmpty(
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
      images: ogImage ? [{ url: ogImage }] : [],
      locale: "en_US",
      siteName: "AGE Fabrics",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
    other: {
      robots: "index,follow",
      "theme-color": "#ffffff",
    },
  };
}

export default async function Page(
  { params }: { params: { slug: string } }
) {
  const { slug } = params;

  return (
    <Wrapper>
      <HeaderTwo style_2 />
      <ProductClient slug={slug} />
      <Footer primary_style />
    </Wrapper>
  );
}
