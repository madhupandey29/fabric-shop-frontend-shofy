'use client'
import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from 'next/navigation';
import ShopLoader from "../loader/shop/shop-loader";
import ErrorMsg from "../common/error-msg";
import ShopFilterOffCanvas from "../common/shop-filter-offcanvas";
import ShopContent from "./shop-content";
import ShopHiddenSidebarArea from "./shop-hidden-sidebar-area";
import {
  useGetAllNewProductsQuery,
  useGetPriceUptoQuery,
  useGetGsmUptoQuery,
  useGetOzUptoQuery,
  useGetQuantityUptoQuery,
  useGetPurchasePriceUptoQuery
} from '@/redux/features/newProductApi';

const ShopArea = ({ shop_right = false, hidden_sidebar = false }) => {
  const searchParams = useSearchParams();
  const category = searchParams.get('category');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const filterColor = searchParams.get('color');
  const filterStructure = searchParams.get('structure');
  const filterContent = searchParams.get('content');
  const filterFinish = searchParams.get('finish');
  const gsm = searchParams.get('gsm');
  const oz = searchParams.get('oz');
  const quantity = searchParams.get('quantity');
  const purchasePrice = searchParams.get('purchasePrice');
  const [priceValue, setPriceValue] = useState([0, 1000]);
  const [selectValue, setSelectValue] = useState("");
  const [currPage, setCurrPage] = useState(1);
  const [selectedFilters, setSelectedFilters] = useState({});

  // Call all hooks unconditionally
  const gsmQuery = useGetGsmUptoQuery(gsm, { skip: !gsm });
  const ozQuery = useGetOzUptoQuery(oz, { skip: !oz });
  const quantityQuery = useGetQuantityUptoQuery(quantity, { skip: !quantity });
 const purchasePriceQuery = useGetPurchasePriceUptoQuery(purchasePrice, { skip: !purchasePrice });
  const priceQuery = useGetPriceUptoQuery(minPrice, {skip: !(minPrice && maxPrice && minPrice === maxPrice),});
  const allProductsQuery = useGetAllNewProductsQuery(undefined, {
  skip: gsm || oz || quantity || purchasePrice || (minPrice && maxPrice && minPrice === maxPrice), });
  // Decide which API result to use (priority order)
  let products = null;
  let isLoading = false;
  let isError = false;

  if (gsm) {
    products = gsmQuery.data;
    isLoading = gsmQuery.isLoading;
    isError = gsmQuery.isError;
  } else if (oz) {
    products = ozQuery.data;
    isLoading = ozQuery.isLoading;
    isError = ozQuery.isError;
  } else if (quantity) {
    products = quantityQuery.data;
    isLoading = quantityQuery.isLoading;
    isError = quantityQuery.isError;
  } else if (purchasePrice) {
    products = purchasePriceQuery.data;
    isLoading = purchasePriceQuery.isLoading;
    isError = purchasePriceQuery.isError;
  } else if (minPrice && maxPrice && minPrice === maxPrice) {
    products = priceQuery.data;
    isLoading = priceQuery.isLoading;
    isError = priceQuery.isError;
  } else {
    products = allProductsQuery.data;
    isLoading = allProductsQuery.isLoading;
    isError = allProductsQuery.isError;
  }

  const handleFilterChange = (newFilters) => {
    setCurrPage(1);
    setSelectedFilters(newFilters);
  };

  // Load the maximum price once the products have been loaded
  useEffect(() => {
    if (!isLoading && !isError && products?.data?.length > 0) {
      const maxPrice = products.data.reduce((max, product) => {
        const price = Number(product.salesPrice) || 0;
        return price > max ? price : max;
      }, 0);
      if (maxPrice > priceValue[1]) {
        setPriceValue([priceValue[0], maxPrice]);
      }
    }
  }, [isLoading, isError, products, priceValue]);

  const handleChanges = (val) => {
    setCurrPage(1);
    setPriceValue(val);
  };

  const selectHandleFilter = (e) => {
    setSelectValue(e.value);
  };

  const otherProps = {
    priceFilterValues: {
      priceValue,
      handleChanges,
      setPriceValue,
    },
    selectHandleFilter,
    currPage,
    setCurrPage,
    selectedFilters,
    handleFilterChange,
  };

  // Filtering and rendering logic (same as before)
  const filteredProducts = useMemo(() => {
    if (isLoading || isError || !products?.data) return [];
    let product_items = products.data;
    const activeFilters = Object.entries(selectedFilters).filter(([, values]) => values.length > 0);
    if (activeFilters.length > 0) {
      product_items = product_items.filter((product) => {
        return activeFilters.every(([filterKey, selectedValues]) => {
          const productPropertyMap = {
            category: "newCategoryId",
            color: "colorId",
            content: "contentId",
            design: "designId",
            structure: "structureId",
            finish: "finishId",
            groupcode: "groupCodeId",
            vendor: "vendorId",
            suitablefor: "suitableforId",
            motifsize: "motifsizeId",
            substructure: "subStructureId",
            subfinish: "subFinishId",
            subsuitable: "subSuitableforId",
          };
          const propertyKey = productPropertyMap[filterKey];
          if (!product[propertyKey]) return false;
          const value = product[propertyKey]?._id || product[propertyKey];
          return selectedValues.includes(value);
        });
      });
    }
    // select short filtering
    if (selectValue) {
      if (selectValue === "Default Sorting") {
        product_items = products.data;
      } else if (selectValue === "Low to High") {
        product_items = products.data
          .slice()
          .sort((a, b) => Number(a.salesPrice) - Number(b.salesPrice));
      } else if (selectValue === "High to Low") {
        product_items = products.data
          .slice()
          .sort((a, b) => Number(b.salesPrice) - Number(a.salesPrice));
      } else if (selectValue === "New Added") {
        product_items = products.data
          .slice()
          .sort((a, b) => new Date(b.published_at) - new Date(a.published_at));
      } else {
        product_items = products.data;
      }
    }
    // category filter
    if (category) {
      product_items = product_items.filter(
        (p) =>
          p.newCategoryId?.name?.toLowerCase().replace("&", "").split(" ").join("-") ===
          category
      );
    }
    // color filter
    if (filterColor) {
      product_items = product_items.filter((product) => {
        if (product.colorId) {
          return product.colorId.name.toLowerCase().split(" ").join("-") === filterColor;
        }
        return false;
      });
    }
    // structure filter
    if (filterStructure) {
      product_items = product_items.filter((product) => {
        if (product.structureId) {
          return product.structureId.name.toLowerCase().split(" ").join("-") === filterStructure;
        }
        return false;
      });
    }
    // content filter
    if (filterContent) {
      product_items = product_items.filter((product) => {
        if (product.contentId) {
          return product.contentId.name.toLowerCase().split(" ").join("-") === filterContent;
        }
        return false;
      });
    }
    // finish filter
    if (filterFinish) {
      product_items = product_items.filter((product) => {
        if (product.finishId) {
          return product.finishId.name.toLowerCase().split(" ").join("-") === filterFinish;
        }
        return false;
      });
    }
    if(minPrice && maxPrice){
      product_items = product_items.filter((p) => Number(p.salesPrice) >= Number(minPrice) && 
      Number(p.salesPrice) <= Number(maxPrice))
    }
    return product_items;
  }, [isLoading, isError, products, selectedFilters, selectValue, category, filterColor, filterStructure, filterContent, filterFinish, minPrice, maxPrice]);

  let content = null;
  if (isLoading) {
    content = <ShopLoader loading={isLoading} />;
  }
  if (!isLoading && isError) {
    content = <div className="pb-80 text-center">
      <ErrorMsg msg="There was an error" />
    </div>;
  }
  if (!isLoading && !isError && filteredProducts.length === 0) {
    content = <ErrorMsg msg="No Products found!" />;
  }
  if (!isLoading && !isError && filteredProducts.length > 0) {
    let product_items = filteredProducts;
    content = (
      <>
        {hidden_sidebar ? (
          <ShopHiddenSidebarArea
            all_products={products.data}
            products={product_items}
            otherProps={otherProps}
          />
        ) : (
          <ShopContent
            all_products={products.data}
            products={product_items}
            otherProps={otherProps}
            shop_right={shop_right}
            hidden_sidebar={hidden_sidebar}
          />
        )}
        <ShopFilterOffCanvas
          all_products={products.data}
          otherProps={otherProps}
        />
      </>
    );
  }
  return <>{content}</>;
};

export default ShopArea;
