"use client";
import React from 'react';
import ProductDetailsArea from '@/components/product-details/product-details-area';
import { useGetSingleNewProductQuery } from '@/redux/features/newProductApi';
import ErrorMsg from '@/components/common/error-msg';
import ProductDetailsLoader from '@/components/loader/prd-details-loader';

/* --- helper: map backend to the shape your UI needs ---------------- */
function mapBackendProductToFrontend(product) {
  const images = [
    product.image  && { img: product.image,  type: 'image' },
    product.image1 && { img: product.image1, type: 'image' },
    product.image2 && { img: product.image2, type: 'image' },
  ].filter(Boolean);

  if (product.video && product.videoThumbnail) {
    images.push({ img: product.videoThumbnail, type: 'video' });
  }

  return {
    _id:      product._id,
    slug:     product.slug,
    title:    product.name || product.title,
    img:      product.image || '',
    imageURLs: images,
    videoId:  product.video || '',
    price:    product.salesPrice,
    description: product.description,
    status:   product.status || 'in-stock',
    sku:      product.sku,
    category: { name: product.newCategoryId?.name || 'Default Category' },
    tags:     product.tags || [],
    offerDate: product.offerDate || { endDate: null },
    additionalInformation: product.additionalInformation || [],
    structureId:  product.structureId?._id   || product.structureId  || '',
    contentId:    product.contentId?._id     || product.contentId    || '',
    finishId:     product.finishId?._id      || product.finishId     || '',
    designId:     product.designId?._id      || product.designId     || '',
    colorId:      product.colorId?._id       || product.colorId      || '',
    motifsizeId:  product.motifsizeId?._id   || product.motifsizeId  || '',
    suitableforId:product.suitableforId?._id || product.suitableforId|| '',
    vendorId:     product.vendorId?._id      || product.vendorId     || '',
    groupcodeId:  product.groupcodeId?._id   || product.groupcodeId  || '',
    gsm:          product.gsm,
    oz:           product.oz,
    productIdentifier: product.productIdentifier,
    width:
      product.cm   ? `${product.cm} cm`
    : product.inch ? `${product.inch} inch`
    : 'N/A',
  };
}

export default function ProductDetailsClient({ slug }) {
  const {
    data,
    isLoading,
    isError,
  } = useGetSingleNewProductQuery(slug, { skip: !slug });

  if (isLoading)   return <ProductDetailsLoader loading />;
  if (isError)     return <ErrorMsg msg="There was an error" />;
  if (!data?.data) return <ErrorMsg msg="No product found!" />;

  const mapped = mapBackendProductToFrontend(data.data);
  return <ProductDetailsArea product={mapped} />;
}
