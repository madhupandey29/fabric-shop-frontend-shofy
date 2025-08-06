'use client';
import React                     from 'react';
import Image                     from 'next/image';
import Link                      from 'next/link';
import { Swiper, SwiperSlide }   from 'swiper/react';
import { Scrollbar }             from 'swiper/modules';
import { useDispatch, useSelector } from 'react-redux';

import { TextShapeLine }                 from '@/svg';
import ErrorMsg                          from '@/components/common/error-msg';
import { HomeTwoPopularPrdLoader }       from '@/components/loader';
import { useGetPopularNewProductsQuery } from '@/redux/features/newProductApi';
import { add_cart_product }              from '@/redux/features/cartSlice';
import { notifyError }                   from '@/utils/toast';


function absoluteUrl(src) {
  if (!src) return '/assets/img/product/product-1.jpg';

  if (/^https?:\/\//i.test(src)) return src;

  const path = src.replace(/^\/+/, '');
  const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';

  return `${base}/${path}`;
}

const SLIDER_OPTS = {
  slidesPerView: 5,
  spaceBetween: 20,
  loop: false,
  centeredSlides: false,
  scrollbar: {
    el: '.swiper-scrollbar',
    draggable: true,
    dragClass: 'tp-swiper-scrollbar-drag',
    snapOnRelease: true,
  },
  breakpoints: {
    1200: { slidesPerView: 5 },
    992:  { slidesPerView: 4 },
    768:  { slidesPerView: 3 },
    576:  { slidesPerView: 2 },
    0:    { slidesPerView: 1 },
  },
  lazy: true,
  keyboard: { enabled: true, onlyInViewport: true },
};

// ─── component ───────────────────────────────────────────────────────────────
export default function PopularProducts() {
  /* data ------------------------------------------------------------------- */
  const { data, isError, isLoading } = useGetPopularNewProductsQuery();
  const { cart_products }            = useSelector(s => s.cart);
  const dispatch                     = useDispatch();

  /* actions ---------------------------------------------------------------- */
  const addToCart = prd => {
    if (prd.status === 'out-of-stock') {
      notifyError('This product is out of stock');
      return;
    }
    dispatch(add_cart_product(prd));
  };

  let carousel = <ErrorMsg msg="No Products found!" />;
  if (isLoading) carousel = <HomeTwoPopularPrdLoader loading />;
  if (!isLoading && isError) carousel = <ErrorMsg msg="There was an error" />;

  if (!isLoading && !isError && data?.data?.length) {
    const items = data.data;

    carousel = (
      <Swiper {...SLIDER_OPTS} modules={[Scrollbar]} className="tp-category-slider-active-2 mb-50">
        {items.map((item, idx) => (
          <SwiperSlide key={item._id} className="tp-category-item-2 text-center">
            {/* thumbnail */}
            <div className="tp-category-thumb-2">
              <Link href={`/product-details/${item._id}`}>
                <Image
                  src={absoluteUrl(item.image)}
                  alt={item.name ?? 'product-img'}
                  layout="responsive"
                  width={224}
                  height={260}
                  style={{ objectFit: 'contain' }}
                  sizes="(max-width:600px) 100vw, 224px"
                  priority={idx === 0}
                  loading={idx === 0 ? undefined : 'lazy'}
                  quality={60}
                  className="fashion-popular-img swiper-lazy"
                />
                {idx !== 0 && <div className="swiper-lazy-preloader" />}
              </Link>
            </div>

            {/* content */}
            <div className="tp-category-content-2">
              <span>From ${item.salesPrice || item.purchasePrice || 0}</span>
              <h3 className="tp-category-title-2">
                <Link href={`/product-details/${item._id}`}>
                  {item.name?.slice(0, 15) ?? 'Product'}
                </Link>
              </h3>
              <div className="tp-category-btn-2">
                {cart_products.some(p => p._id === item._id) ? (
                  <Link href="/cart" className="tp-btn tp-btn-border">View Cart</Link>
                ) : (
                  /* eslint-disable-next-line jsx-a11y/anchor-is-valid */
                  <a onClick={() => addToCart(item)} className="tp-btn tp-btn-border">
                    Add to Cart
                  </a>
                )}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    );
  }

  return (
    <section className="tp-category-area pb-95 pt-95">
      <div className="container">
        <div className="row">
          <div className="col-xl-12">
            <div className="tp-section-title-wrapper-2 text-center mb-50">
              <span className="tp-section-title-pre-2">
                Most Loved by Designers
                <TextShapeLine />
              </span>
              <h3 className="tp-section-title-2">Our Top-Rated Yarns &amp; Weaves</h3>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-xl-12">
            <div className="tp-category-slider-2 p-relative">
              {carousel}
              <div className="swiper-scrollbar tp-swiper-scrollbar tp-swiper-scrollbar-drag" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
