'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
// internal
import { Cart, QuickView, Wishlist } from '@/svg';
import { handleProductModal } from '@/redux/features/productModalSlice';
import { add_cart_product } from '@/redux/features/cartSlice';
import { add_to_wishlist } from '@/redux/features/wishlist-slice';

const ProductItem = ({ product }) => {
  const dispatch = useDispatch();
  
  
  // handle add product
  const handleAddProduct = (prd) => {
    dispatch(add_cart_product(prd));
  };
  
  // handle wishlist product
  const handleWishlistProduct = (prd) => {
    dispatch(add_to_wishlist(prd));
  };

  // handle modal
  const handleModal = (prd) => {
    dispatch(handleProductModal(prd));
  };

  // Check if the URL is from Cloudinary
  const isCloudinaryUrl = (url) => {
    return url && (url.includes('res.cloudinary.com') || url.startsWith('https://'));
  };

  // Get the first available image URL
  const getImageUrl = () => {
    // If it's already a full URL (Cloudinary or other external source), return as is
    if (isCloudinaryUrl(product.image)) {
      return product.image;
    }
    
    // For local development or non-Cloudinary URLs
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
    
    // Clean up the base URL and image path to prevent double slashes
    const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    const cleanImagePath = (path) => path ? path.replace(/^\/+/, '') : '';
    
    if (product.image) {
      return `${cleanBaseUrl}/uploads/${cleanImagePath(product.image)}`;
    }
    if (product.image1) {
      return `${cleanBaseUrl}/uploads/${cleanImagePath(product.image1)}`;
    }
    if (product.image2) {
      return `${cleanBaseUrl}/uploads/${cleanImagePath(product.image2)}`;
    }
    
    return '/assets/img/product/default-product-img.jpg';
  };
  
  const imageUrl = getImageUrl();
  const isCloudinary = isCloudinaryUrl(imageUrl);
  const slug = product.slug;

  return (
    <div className="tp-product-item-2 mb-40">
      <div className="tp-product-thumb-2 p-relative z-index-1 fix">
        <Link href={`/fabric/${slug}`}>
          <div style={{ position: 'relative', width: '100%', height: '342px' }}>
            <Image
              src={imageUrl}
              alt={product.name || "product image"}
              fill
              style={{ objectFit: 'contain' }}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 282px"
              unoptimized={isCloudinary} // Disable Next.js optimization for Cloudinary images
              priority={false}
              loading="lazy"
              onError={(e) => {
                e.target.onerror = null; // Prevent infinite loop
                e.target.src = '/assets/img/product/default-product-img.jpg';
              }}
            />
          </div>
        </Link>
        <div className="tp-product-badge">
          {product.discount && <span className="product-hot">Hot</span>}
        </div>
        <div className="tp-product-action-2 tp-product-action-blackStyle">
          <div className="tp-product-action-item-2 d-flex flex-column">
            <button
              type="button"
              onClick={() => handleAddProduct(product)}
              className="tp-product-action-btn-2 tp-product-add-cart-btn"
            >
              <Cart />
              <span className="tp-product-tooltip tp-product-tooltip-right">
                Add to Cart
              </span>
            </button>
            <button
              type="button"
              onClick={() => handleWishlistProduct(product)}
              className="tp-product-action-btn-2 tp-product-add-to-wishlist-btn"
            >
              <Wishlist />
              <span className="tp-product-tooltip tp-product-tooltip-right">
                Add To Wishlist
              </span>
            </button>
            <button
              type="button"
              onClick={() => handleModal(product)}
              className="tp-product-action-btn-2 tp-product-quick-view-btn"
            >
              <QuickView />
              <span className="tp-product-tooltip tp-product-tooltip-right">
                Quick View
              </span>
            </button>
          </div>
        </div>
      </div>
      <div className="tp-product-content-2 pt-15">
        <div className="tp-product-tag-2">
          <a href="#">{product.category.name || 'Unknown Category'}</a>
        </div>
        <h3 className="tp-product-title-2">
          <Link href={`/fabric/${slug}`}><span
      dangerouslySetInnerHTML={{ __html: product.name }}
    /></Link>
        </h3>
        {/* <div className="tp-product-price-wrapper-2">
          <span className="tp-product-price-2 new-price">${product.salesPrice}</span>
          {product.purchasePrice > product.salesPrice && (
            <span className="tp-product-price-2 old-price">
              ${product.purchasePrice}
            </span>
          )}
        </div> */}
      </div>
    </div>
  );
};

export default ProductItem;
