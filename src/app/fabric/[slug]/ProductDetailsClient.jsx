"use client";

import React from "react";
import ProductDetailsArea from "@/components/product-details/product-details-area";
import ProductDetailsLoader from "@/components/loader/prd-details-loader";
import ErrorMsg from "@/components/common/error-msg";
import { useGetSingleNewProductQuery } from "@/redux/features/newProductApi";

/* ---------------------------------------------
   Helpers (pure JS, no TypeScript)
---------------------------------------------- */

/**
 * Return the _id if v is an object with {_id}, or the string itself
 * if v is already an id string. Otherwise return "".
 */
const asId = (v) => {
  if (typeof v === "string") return v;
  if (v && typeof v === "object" && typeof v._id === "string") return v._id;
  return "";
};

/**
 * Build gallery entries for the product.
 * Each entry is { img: string, type: "image" | "video" }.
 */
const buildImages = (p) => {
  const images = [];
  if (p && p.image) images.push({ img: p.image, type: "image" });
  if (p && p.image1) images.push({ img: p.image1, type: "image" });
  if (p && p.image2) images.push({ img: p.image2, type: "image" });

  if (p && p.video && p.videoThumbnail) {
    images.push({ img: p.videoThumbnail, type: "video" });
  }
  return images;
};

/**
 * Safely join tags array to a string array if needed elsewhere.
 * (Kept here in case you extend mapping later.)
 */
const ensureArray = (maybeArr) => (Array.isArray(maybeArr) ? maybeArr : []);

/**
 * Derive a normalized width string from cm/inch fields.
 */
const deriveWidth = (p) => {
  if (!p) return "N/A";
  if (p.cm != null && p.cm !== "") return `${p.cm} cm`;
  if (p.inch != null && p.inch !== "") return `${p.inch} inch`;
  return "N/A";
};

/* ---------------------------------------------
   Mapper (pure JS)
---------------------------------------------- */

/**
 * Map raw backend product to the shape expected by <ProductDetailsArea />
 */
const mapBackendProductToFrontend = (p) => {
  if (!p || typeof p !== "object") return null;

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

    categoryId: asId(p.category),
    structureId: asId(p.substructure),
    contentId: asId(p.content),
    finishId: asId(p.subfinish),
    designId: asId(p.design),
    motifsizeId: asId(p.motif),
    suitableforId: asId(p.subsuitable),
    vendorId: asId(p.vendor),
    groupcodeId: asId(p.groupcode),

    gsm: p.gsm,
    oz: p.oz,
    productIdentifier: p.productIdentifier,
    width: deriveWidth(p),

    tags: ensureArray(p.tags),
    offerDate: p.offerDate || { endDate: null },
    additionalInformation: ensureArray(p.additionalInformation),
  };
};

/* ---------------------------------------------
   Component (pure JS)
---------------------------------------------- */

export default function ProductDetailsClient({ slug }) {
  // If slug isn't available, don't call the API
  const { data, isLoading, isError } = useGetSingleNewProductQuery(slug, {
    skip: !slug,
  });

  if (isLoading) return <ProductDetailsLoader loading />;
  if (isError) return <ErrorMsg msg="There was an error" />;

  // API shape safety: data?.data can be an object or an array
  const raw = data && data.data;
  const backendProduct = Array.isArray(raw) ? raw[0] : raw;

  if (!backendProduct) return <ErrorMsg msg="No product found!" />;

  const product = mapBackendProductToFrontend(backendProduct);
  if (!product) return <ErrorMsg msg="No product found!" />;

  return <ProductDetailsArea product={product} />;
}
