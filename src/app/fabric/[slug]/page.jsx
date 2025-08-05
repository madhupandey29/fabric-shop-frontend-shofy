/* ------------------------------------------------------------------ */
/*  app/fabric/[slug]/page.jsx  –  dynamic SEO from product API        */
/* ------------------------------------------------------------------ */
import Wrapper       from '@/layout/wrapper';
import HeaderTwo     from '@/layout/headers/header-2';
import Footer        from '@/layout/footers/footer';
import ProductClient from './ProductDetailsClient';

export const revalidate = 600;                 // 10-minute ISR

/* identical headers to your RTK slice */
function apiHeaders() {
  return {
    'x-api-key'    : process.env.NEXT_PUBLIC_API_KEY,
    'Content-Type' : 'application/json',
    'x-admin-email': process.env.NEXT_PUBLIC_ADMIN_EMAIL,
  };
}

/* little helper */
const firstNonEmpty = (...v) => v.find(x => x != null && x !== '');

export async function generateMetadata({ params }) {
  /* cache slug to avoid Next.js warning */
  const slug = params.slug;

  /* 1️⃣  fetch the product (your sample response) */
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/product/slug/${slug}`,
    { headers: apiHeaders(), next: { revalidate } }
  );

  if (!res.ok) return { title: 'Product not found', description: '' };

  /** The backend returns { success, data: [ … ] } */
  const payload = await res.json();
  const product = Array.isArray(payload.data)
    ? payload.data[0]
    : payload.data;

  console.log('[SEO] product →', product);      // inspect once

  /* 2️⃣  derive SEO fields from the product itself */
  const siteURL     = process.env.NEXT_PUBLIC_SITE_URL || '';
  const canonical   = `${siteURL}/fabric/${slug}`;

  const title       = firstNonEmpty(
    product.seoTitle,            // if you add it later
    product.name,
    product.title,
    slug.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
  );

  const description = firstNonEmpty(
    product.seoDescription,
    product.productdescription,
    ''
  );

  const image       = firstNonEmpty(
    product.seoImage,
    product.img,
    product.image1,
    product.image2
  );

  const keywords = firstNonEmpty(
    product.seoKeywords,
    product.tags?.join(', '),
    product.category?.name
  );

  /* 3️⃣  return the Metadata object */
  return {
    title,
    description,
    keywords,

    alternates: { canonical },

    openGraph: {
      type:  'website',
      url:   canonical,
      title,
      description,
      images: image ? [{ url: image }] : [],
      locale: 'en_US',
      siteName: 'AGE Fabrics',
    },

    twitter: {
      card:  'summary_large_image',
      title,
      description,
      images: image ? [image] : undefined,
    },

    other: {
      robots:        'index,follow',
      'theme-color': '#ffffff',
    },
  };
}

/* -------------------- page body ---------------------------------- */
export default async function Page({ params }) {
  return (
    <Wrapper>
      <HeaderTwo style_2 />
      <ProductClient slug={params.slug} />
      <Footer primary_style />
    </Wrapper>
  );
}
