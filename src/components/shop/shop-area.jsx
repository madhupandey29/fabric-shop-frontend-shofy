/* ----------------------------------------------------------------------
   ShopArea – product grid + sidebar filter
   -------------------------------------------------------------------- */
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';

import ShopLoader            from '../loader/shop/shop-loader';
import ErrorMsg              from '../common/error-msg';
import ShopFilterOffCanvas   from '../common/shop-filter-offcanvas';
import ShopContent           from './shop-content';
import ShopHiddenSidebarArea from './shop-hidden-sidebar-area';

/* ─────────── all backend queries ─────────── */
import {
  useGetAllNewProductsQuery,
  useGetPriceUptoQuery,
  useGetGsmUptoQuery,
  useGetOzUptoQuery,
  useGetQuantityUptoQuery,
  useGetPurchasePriceUptoQuery,
} from '@/redux/features/newProductApi';

/* ------------------------------------------------------------------ */
/*  CONSTANT – sidebar-key ➜ product-field map                        */
/*  Declared once (module scope) so React-Hook lint stays silent       */
/* ------------------------------------------------------------------ */
const PROPERTY_MAP = Object.freeze({
  category     : 'category',      // object or id
  color        : 'color',         // ARRAY
  content      : 'content',
  design       : 'design',
  structure    : 'substructure',
  finish       : 'subfinish',
  groupcode    : 'groupcode',
  vendor       : 'vendor',
  suitablefor  : 'subsuitable',
  motifsize    : 'motif',
  substructure : 'substructure',
  subfinish    : 'subfinish',
  subsuitable  : 'subsuitable',
});

/* ==================================================================
   COMPONENT
   ================================================================== */
export default function ShopArea({ shop_right = false, hidden_sidebar = false }) {
  /* ────── URL params ───────────────────────────────────────────── */
  const p               = useSearchParams();
  const category        = p.get('category');
  const minPrice        = p.get('minPrice');
  const maxPrice        = p.get('maxPrice');
  const filterColor     = p.get('color');
  const filterStructure = p.get('structure');
  const filterContent   = p.get('content');
  const filterFinish    = p.get('finish');
  const gsm             = p.get('gsm');
  const oz              = p.get('oz');
  const quantity        = p.get('quantity');
  const purchasePrice   = p.get('purchasePrice');

  /* ────── local UI state ───────────────────────────────────────── */
  const [priceValue,      setPriceValue]      = useState([0, 1000]);
  const [selectValue,     setSelectValue]     = useState('');
  const [currPage,        setCurrPage]        = useState(1);
  const [selectedFilters, setSelectedFilters] = useState({});

  /* ────── data queries (hooks always defined) ──────────────────── */
  const gsmQ           = useGetGsmUptoQuery(gsm,          { skip: !gsm });
  const ozQ            = useGetOzUptoQuery(oz,            { skip: !oz });
  const quantityQ      = useGetQuantityUptoQuery(quantity, { skip: !quantity });
  const purchasePriceQ = useGetPurchasePriceUptoQuery(purchasePrice, { skip: !purchasePrice });
  const priceQ         = useGetPriceUptoQuery(minPrice, {
                          skip: !(minPrice && maxPrice && minPrice === maxPrice),
                        });
  const allQ           = useGetAllNewProductsQuery(undefined, {
                          skip: gsm || oz || quantity || purchasePrice ||
                                (minPrice && maxPrice && minPrice === maxPrice),
                        });

  /* pick active query result (priority chain) */
  let products, isLoading, isError;
  ({ data: products, isLoading, isError } =
    gsm            ? gsmQ :
    oz             ? ozQ  :
    quantity       ? quantityQ :
    purchasePrice  ? purchasePriceQ :
    (minPrice && maxPrice && minPrice === maxPrice) ? priceQ :
    allQ);

  /* ────── event handlers ───────────────────────────────────────── */
  const handleFilterChange = obj => {
    setCurrPage(1);
    setSelectedFilters(obj);
  };

  const handleSlider = val => {
    setCurrPage(1);
    setPriceValue(val);
  };

  const handleSelect = e => setSelectValue(e.value);

  /* ────── adjust price slider max when products load ───────────── */
  useEffect(() => {
    if (!isLoading && !isError && products?.data?.length) {
      const max = products.data.reduce(
        (m, pr) => Math.max(m, Number(pr.salesPrice) || 0),
        0,
      );
      if (max > priceValue[1]) setPriceValue(([lo]) => [lo, max]);
    }
  }, [isLoading, isError, products, priceValue]);

  /* props passed to child components */
  const otherProps = {
    priceFilterValues: { priceValue, handleChanges: handleSlider, setPriceValue },
    selectHandleFilter: handleSelect,
    currPage, setCurrPage,
    selectedFilters, handleFilterChange,
  };

  /* ================================================================ */
  /*   derive filteredProducts (heavy work)                           */
  /* ================================================================ */
  const filteredProducts = useMemo(() => {
    if (isLoading || isError || !products?.data) return [];

    let items = products.data;

    /* 1 ▸ sidebar checkbox filters */
    const active = Object.entries(selectedFilters).filter(([, arr]) => arr.length);
    if (active.length) {
      items = items.filter(pr =>
        active.every(([fKey, values]) => {
          const prop = PROPERTY_MAP[fKey];
          if (!prop || !pr[prop]) return false;

          const field = pr[prop];

          // colour & similar (array of refs)
          if (Array.isArray(field)) {
            const ids = field.map(x => x._id ?? x);
            return ids.some(id => values.includes(id));
          }

          // single ref / id
          const id = field._id ?? field;
          return values.includes(id);
        }),
      );
    }

    /* 2 ▸ sort select */
    if (selectValue === 'Low to High') {
      items = items.slice().sort((a, b) => +a.salesPrice - +b.salesPrice);
    } else if (selectValue === 'High to Low') {
      items = items.slice().sort((a, b) => +b.salesPrice - +a.salesPrice);
    } else if (selectValue === 'New Added') {
      items = items.slice().sort((a, b) =>
        new Date(b.published_at) - new Date(a.published_at),
      );
    }

    /* 3 ▸ query-string filters */
    const slugify = s => s?.toLowerCase().replace('&', '').split(' ').join('-');

    if (category)       items = items.filter(p => slugify(p.category?.name) === category);
    if (filterColor)    items = items.filter(p => p.color?.some(c => slugify(c.name) === filterColor));
    if (filterStructure)items = items.filter(p => slugify(p.substructure?.name) === filterStructure);
    if (filterContent)  items = items.filter(p => slugify(p.content?.name) === filterContent);
    if (filterFinish)   items = items.filter(p => slugify(p.subfinish?.name) === filterFinish);

    if (minPrice && maxPrice)
      items = items.filter(p => +p.salesPrice >= +minPrice && +p.salesPrice <= +maxPrice);

    return items;
  }, [
    isLoading, isError, products,
    selectedFilters, selectValue,
    category, filterColor, filterStructure, filterContent, filterFinish,
    minPrice, maxPrice,
  ]);

  /* ================================================================ */
  /*   render                                                          */
  /* ================================================================ */
  let content;
  if (isLoading)                content = <ShopLoader loading />;
  else if (isError)             content = <ErrorMsg msg="There was an error" />;
  else if (!filteredProducts.length)
                               content = <ErrorMsg msg="No Products found!" />;
  else {
    content = hidden_sidebar ? (
      <ShopHiddenSidebarArea
        all_products={products.data}
        products={filteredProducts}
        otherProps={otherProps}
      />
    ) : (
      <ShopContent
        all_products={products.data}
        products={filteredProducts}
        otherProps={otherProps}
        shop_right={shop_right}
        hidden_sidebar={hidden_sidebar}
      />
    );
  }

  return (
    <>
      {content}

      {/* Off-canvas filter (only when we have data) */}
      {!isLoading && !isError && products?.data?.length > 0 && (
        <ShopFilterOffCanvas
          all_products={products.data}
          otherProps={otherProps}
          right_side={shop_right}
        />
      )}
    </>
  );
}
