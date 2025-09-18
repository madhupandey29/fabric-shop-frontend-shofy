"use client";

import React from "react";
import ProductDetailsArea   from "@/components/product-details/product-details-area";
import ProductDetailsLoader from "@/components/loader/prd-details-loader";
import ErrorMsg             from "@/components/common/error-msg";
import { useGetSingleNewProductQuery } from "@/redux/features/newProductApi";

/* ---------------------------------------------
   Types
---------------------------------------------- */
type Maybe<T> = T | null | undefined;

type IdOrObj = string | { _id?: string; name?: string };

type BackendProduct = {
  _id: string;
  slug: string;
  name?: string;
  title?: string;

  image?: string;
  image1?: string;
  image2?: string;

  video?: string;
  videoThumbnail?: string;

  salesPrice?: number;
  description?: string;
  productdescription?: string;
  status?: string;
  sku?: string;

  category?: IdOrObj;
  substructure?: IdOrObj;
  content?: IdOrObj;
  subfinish?: IdOrObj;
  design?: IdOrObj;
  motif?: IdOrObj;
  subsuitable?: IdOrObj;
  vendor?: IdOrObj;
  groupcode?: IdOrObj;

  gsm?: number;
  oz?: number;
  productIdentifier?: string;
  cm?: number;
  inch?: number;

  tags?: string[];
  offerDate?: { endDate: string | null } | null;
  additionalInformation?: unknown[]; // keep loose if this varies
};

type ImageEntry =
  | { img: string; type: "image" }
  | { img: string; type: "video" };

type FrontendProduct = {
  _id: string;
  slug: string;
  title?: string;
  img: string;
  imageURLs: ImageEntry[];
  videoId: string;
  price?: number;
  description: string;
  status: string;
  sku?: string;

  categoryId: string;
  structureId: string;
  contentId: string;
  finishId: string;
  designId: string;
  motifsizeId: string;
  suitableforId: string;
  vendorId: string;
  groupcodeId: string;

  gsm?: number;
  oz?: number;
  productIdentifier?: string;
  width: string;

  tags: string[];
  offerDate: { endDate: string | null };
  additionalInformation: unknown[];
};

/* ---------------------------------------------
   Helpers
---------------------------------------------- */
const asId = (v: Maybe<IdOrObj>): string =>
  typeof v === "string" ? v : v?._id ?? "";

function buildImages(p: BackendProduct): ImageEntry[] {
  const images: ImageEntry[] = [];
  if (p.image)  images.push({ img: p.image,  type: "image" });
  if (p.image1) images.push({ img: p.image1, type: "image" });
  if (p.image2) images.push({ img: p.image2, type: "image" });

  if (p.video && p.videoThumbnail) {
    images.push({ img: p.videoThumbnail, type: "video" });
  }
  return images;
}

/* ---------------------------------------------
   Mapper
---------------------------------------------- */
function mapBackendProductToFrontend(p: BackendProduct): FrontendProduct {
  return {
    _id: p._id,
    slug: p.slug,
    title: p.name || p.title,
    img: p.image || "",
    imageURLs: buildImages(p),
    videoId: p.video || "",
    price: p.salesPrice,
    description: p.description || p.productdescription || "",
    status: p.status || "in-stock",
    sku: p.sku,

    categoryId:    asId(p.category),
    structureId:   asId(p.substructure),
    contentId:     asId(p.content),
    finishId:      asId(p.subfinish),
    designId:      asId(p.design),
    motifsizeId:   asId(p.motif),
    suitableforId: asId(p.subsuitable),
    vendorId:      asId(p.vendor),
    groupcodeId:   asId(p.groupcode),

    gsm: p.gsm,
    oz: p.oz,
    productIdentifier: p.productIdentifier,
    width: p.cm ? `${p.cm} cm` : p.inch ? `${p.inch} inch` : "N/A",

    tags: p.tags ?? [],
    offerDate: p.offerDate ?? { endDate: null },
    additionalInformation: (p.additionalInformation ?? []) as unknown[],
  };
}

/* ---------------------------------------------
   Component
---------------------------------------------- */
export default function ProductDetailsClient({ slug }: { slug: string }) {
  const { data, isLoading, isError } = useGetSingleNewProductQuery(slug, { skip: !slug });

  if (isLoading)   return <ProductDetailsLoader loading />;
  if (isError)     return <ErrorMsg msg="There was an error" />;

  // API shape safety: support either {data: {...}} or {data: [...]}
  const raw = (data as { data?: BackendProduct | BackendProduct[] } | undefined)?.data;
  const backendProduct: BackendProduct | undefined = Array.isArray(raw) ? raw[0] : raw;

  if (!backendProduct) return <ErrorMsg msg="No product found!" />;

  const product = mapBackendProductToFrontend(backendProduct);
  return <ProductDetailsArea product={product} />;
}
