// app/fabric/[slug]/page.tsx
import type { Metadata } from "next";
import Wrapper from "@/layout/wrapper";
import HeaderTwo from "@/layout/headers/header-2";
import Footer from "@/layout/footers/footer";
import ProductClient from "./ProductDetailsClient";

/* -------------------------------------------------
   ISR / Caching
-------------------------------------------------- */
// Revalidate this route (and metadata fetches) every 30 days
export const revalidate = 2_592_000; // 30d

/* -------------------------------------------------
   Utils
-------------------------------------------------- */
function buildApiHeaders(): Record<string, string> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const apiKey = process.env.NEXT_PUBLIC_API_KEY ?? "";
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? "";
  if (apiKey) headers["x-api-key"] = apiKey;
  if (adminEmail) headers["x-admin-email"] = adminEmail;
  return headers;
}

const firstNonEmpty = (...v: Array<string | undefined | null>) =>
  v.find((x) => x != null && x !== "");

/* -------------------------------------------------
   Metadata (respects ISR)
-------------------------------------------------- */
// ⚠️ Do NOT type the param shape here; let Next supply the constraint.
export async function generateMetadata(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { params }: any
): Promise<Metadata> {
  // Narrow locally (safe & keeps build happy)
  const { slug } = (params ?? {}) as { slug?: string };
  const apiBase = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/+$/, "");
  const siteURL = (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/+$/, "");

  if (!slug) {
    return {
      title: "Product",
      description: "",
      alternates: { canonical: siteURL ? `${siteURL}/fabric` : undefined },
    };
  }

  if (!apiBase) {
    return {
      title: "Product",
      description: "",
      alternates: { canonical: siteURL ? `${siteURL}/fabric/${slug}` : undefined },
    };
  }

  try {
    const res = await fetch(`${apiBase}/product/slug/${encodeURIComponent(slug)}`, {
      headers: buildApiHeaders(),
      next: { revalidate },
    });

    if (!res.ok) {
      return {
        title: "Product not found",
        description: "",
        alternates: { canonical: siteURL ? `${siteURL}/fabric/${slug}` : undefined },
      };
    }

    const payload = await res.json();
    const product = Array.isArray(payload?.data) ? payload.data[0] : payload?.data ?? {};

    const canonical = siteURL ? `${siteURL}/fabric/${slug}` : undefined;

    const title =
      firstNonEmpty(
        product?.seoTitle,
        product?.name,
        product?.title,
        slug.replace(/[-_]/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase())
      ) || "Product";

    const description =
      firstNonEmpty(product?.seoDescription, product?.productdescription, "") || "";

    const ogImage =
      firstNonEmpty(product?.seoImage, product?.image, product?.image1, product?.image2) ||
      undefined;

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
  } catch {
    return {
      title: "Product",
      description: "",
      alternates: { canonical: siteURL ? `${siteURL}/fabric/${slug}` : undefined },
    };
  }
}

/* -------------------------------------------------
   Page
-------------------------------------------------- */
// ⚠️ Do NOT type the param shape here either.
export default async function Page(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props: any
) {
  // Narrow locally
  const { slug } = (props?.params ?? {}) as { slug?: string };

  return (
    <Wrapper>
      <HeaderTwo style_2 />
      {/* If slug might be undefined, guard or assert */}
      <ProductClient slug={slug ?? ""} />
      <Footer primary_style />
    </Wrapper>
  );
}
