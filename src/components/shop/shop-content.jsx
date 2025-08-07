'use client';
import React, { useState, useEffect } from 'react';
import Pagination                      from '@/ui/Pagination';
import ProductItem                     from '../products/fashion/product-item';
import ShopListItem                    from './shop-list-item';
import ShopTopLeft                     from './shop-top-left';
import ShopTopRight                    from './shop-top-right';
import PriceFilter                     from './shop-filter/price-filter';
import StatusFilter                    from './shop-filter/status-filter';
import ShopSidebarFilters              from './ShopSidebarFilters';
import ResetButton                     from './shop-filter/reset-button';
import PopularProductImages            from '@/components/products/fashion/popular-product-images';
import WeeksFeaturedImages             from '@/components/products/fashion/weeks-featured-images';
import {
  useGetPopularNewProductsQuery,
  useGetTopRatedQuery,
} from '@/redux/features/newProductApi';

const ShopContent = ({
  all_products = [],
  products     = [],
  otherProps,
  shop_right,
  hidden_sidebar,
}) => {
  const {
    priceFilterValues,
    selectHandleFilter,
    currPage, setCurrPage,
    selectedFilters,
    handleFilterChange,
  } = otherProps;

  const { setPriceValue } = priceFilterValues;
  const [filteredRows, setFilteredRows] = useState(products);
  const [pageStart,    setPageStart]    = useState(0);
  const [countOfPage,  setCountOfPage]  = useState(12);

  // reset pagination when products changes
  useEffect(() => {
    setFilteredRows(products);
    setPageStart(0);
    setCurrPage(1);
  }, [products, setCurrPage]);

  // popular & top-rated
  const { data: popData, isLoading: popLoading }     = useGetPopularNewProductsQuery();
  const { data: topData, isLoading: topLoading }     = useGetTopRatedQuery();
  const popularProducts   = popData?.data  || [];
  const topRatedProducts  = topData?.data  || [];

  const paginatedData = (items, start, cnt) => {
    setFilteredRows(items);
    setPageStart(start);
    setCountOfPage(cnt);
  };

  // max slider cap
  const maxPrice = all_products.reduce((m, p) => Math.max(m, +p.salesPrice||0), 1000);

  return (
    <section className="tp-shop-area pb-120">
      <div className="container">
        <div className="row">
          {/* desktop sidebar */}
          {!shop_right && !hidden_sidebar && (
            <aside className="col-xl-3 col-lg-4 d-none d-lg-block">
              <PriceFilter priceFilterValues={priceFilterValues} maxPrice={maxPrice} />
              <StatusFilter setCurrPage={setCurrPage} />
              <ShopSidebarFilters
                selected={selectedFilters}
                onFilterChange={handleFilterChange}
              />
              <ResetButton
                setPriceValues={setPriceValue}
                maxPrice={maxPrice}
                handleFilterChange={handleFilterChange}
              />

              <div className="tp-shop-widget mb-30">
                <h3 className="tp-shop-widget-title">Popular</h3>
                <PopularProductImages
                  products={popularProducts.map(x => x.product)}
                  loading={popLoading}
                />
              </div>

              <div className="tp-shop-widget mb-30">
                <h3 className="tp-shop-widget-title">Top Rated</h3>
                <WeeksFeaturedImages
                  products={topRatedProducts.map(x => x.product)}
                  loading={topLoading}
                />
              </div>
            </aside>
          )}

          {/* main */}
          <div className={hidden_sidebar ? 'col-xl-12 col-lg-12' : 'col-xl-9 col-lg-8 col-12'}>
            <div className="tp-shop-main-wrapper">
              <div className="tp-shop-top mb-45">
                <div className="row">
                  <div className="col-xl-6">
                    <ShopTopLeft
                      showing={
                        filteredRows.slice(pageStart, pageStart + countOfPage).length
                      }
                      total={all_products.length}
                    />
                  </div>
                  <div className="col-xl-6">
                    <ShopTopRight selectHandleFilter={selectHandleFilter} />
                  </div>
                </div>
              </div>

              {filteredRows.length === 0 ? (
                <h2 className="text-center">No products found</h2>
              ) : (
                <div className="tp-shop-items-wrapper tp-shop-item-primary">
                  <div className="tab-content" id="productTabContent">
                    <div
                      className="tab-pane fade show active"
                      id="grid-tab-pane"
                      role="tabpanel"
                      aria-labelledby="grid-tab"
                    >
                      <div className="row">
                        {filteredRows.slice(pageStart, pageStart + countOfPage).map((item) => (
                          <div key={item._id} className="col-xl-4 col-md-6 col-sm-6">
                            <ProductItem product={item} />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div
                      className="tab-pane fade"
                      id="list-tab-pane"
                      role="tabpanel"
                      aria-labelledby="list-tab"
                    >
                      <div className="tp-shop-list-wrapper tp-shop-item-primary mb-70">
                        {filteredRows.slice(pageStart, pageStart + countOfPage).map((item) => (
                          <ShopListItem key={item._id} product={item} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {filteredRows.length > 0 && (
                <div className="tp-shop-pagination mt-20">
                  <Pagination
                    items={filteredRows}
                    countOfPage={countOfPage}
                    paginatedData={paginatedData}
                    currPage={currPage}
                    setCurrPage={setCurrPage}
                  />
                </div>
              )}
            </div>
          </div>

          {/* right sidebar */}
          {shop_right && (
            <aside className="col-xl-3 col-lg-4 d-none d-lg-block">
              {/* same sidebar JSX as above */}
            </aside>
          )}
        </div>
      </div>
    </section>
  );
};

export default ShopContent;
