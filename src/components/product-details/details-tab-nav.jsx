/* ---------------------------------------------------------------------- */
/*  details-tab-nav.jsx – Description / Additional-info tabs              */
/* ---------------------------------------------------------------------- */
'use client';

import React, { useRef, useEffect, useMemo, useState, memo } from 'react';

/* lookups (only used if some items are id-based) */
import { useGetSubstructureQuery }   from '@/redux/features/substructureApi';
import { useGetSubfinishQuery }      from '@/redux/features/subfinishApi';
import { useGetSubsuitableQuery }    from '@/redux/features/subsuitableApi';
import { useGetContentByIdQuery }    from '@/redux/features/contentApi';
import { useGetDesignByIdQuery }     from '@/redux/features/designApi';
import { useGetMotifSizeByIdQuery }  from '@/redux/features/motifSizeApi';
import { useGetCategoryByIdQuery }   from '@/redux/features/categoryApi';

/* SEO (for SKU) */
import { useGetSeoByProductQuery }   from '@/redux/features/seoApi';

/* product (single, populated) */
import { useGetSingleProductQuery }  from '@/redux/features/productApi';

/* ───── small tab btn ───── */
const NavItem = memo(function NavItem({ id, title, active = false, linkRef, onClick }) {
  return (
    <button
      ref={linkRef}
      className={`nav-link ${active ? 'active' : ''}`}
      id={`nav-${id}-tab`}
      data-bs-toggle="tab"
      data-bs-target={`#nav-${id}`}
      type="button"
      role="tab"
      aria-controls={`nav-${id}`}
      aria-selected={active}
      tabIndex={-1}
      onClick={onClick}
    >
      {title}
    </button>
  );
});

/* ───── helpers ───── */
const nonEmpty = (v) => {
  if (Array.isArray(v)) return v.length > 0;
  return v !== undefined && v !== null && (typeof v === 'number' || String(v).trim() !== '');
};
const pick  = (...xs) => xs.find(nonEmpty);
const money = (n) => (typeof n === 'number' ? `₹ ${n.toLocaleString('en-IN')}` : undefined);

/* normalize any shape -> array of strings */
const toNameArray = (raw) => {
  const src = raw ?? [];
  if (Array.isArray(src)) {
    return src
      .map((item) => {
        if (item == null) return '';
        if (typeof item === 'string' || typeof item === 'number') return String(item);
        return item.name ?? item.label ?? item.value ?? item.colorName ?? item.colour ?? '';
      })
      .filter((s) => s && String(s).trim() !== '');
  }
  if (typeof src === 'object') {
    const v = src.name ?? src.label ?? src.value ?? src.colorName ?? src.colour;
    return v ? [String(v)] : [];
  }
  return String(src).trim() ? [String(src)] : [];
};

const looksLikeIdArray = (raw) =>
  Array.isArray(raw) && raw.length > 0 && raw.every((x) => typeof x === 'string' && x.length >= 12);

/* ---------------------------------------------------------------------- */
export default function DetailsTabNav({ product = {} }) {
  const {
    description,
    productdescription,

    price, width, gsm, oz, cm, inch, um, currency, quantity,

    categoryId, structureId, contentId, finishId,
    designId, motifsizeId, suitableforId,

    category, substructure, content, design, subfinish,
      groupcode, motif,

    slug, _id,
  } = product;

  const fullDescription = pick(description, productdescription) || '';

  /* ─── SEO for SKU ─── */
  const { data: seoResp } = useGetSeoByProductQuery(_id, { skip: !_id });
  const seoDoc = Array.isArray(seoResp?.data) ? seoResp?.data?.[0] : (seoResp?.data || seoResp);
  const seoSku = pick(
    seoDoc?.identifier,
    seoDoc?.sku,
    seoDoc?.productIdentifier,
    seoDoc?.productCode,
    seoDoc?.code
  );
  const skuValue = pick(seoSku, groupcode?.name, slug, _id);

  /* ─── FALLBACK fetches when product prop is missing fields ─── */
  const needsColor       = !(Array.isArray(product?.color) && product.color.length);
  const needsSubsuitable = !(Array.isArray(product?.subsuitable) || product?.subsuitable?.name);

  // 1) try /product/single-product/:id via RTK
  const { data: singleResp } = useGetSingleProductQuery(_id, {
    skip: !_id || (!needsColor && !needsSubsuitable),
  });
  const singleById = singleResp?.data || singleResp?.product || singleResp;

  // 2) if still missing color, try /product/slug/:slug via fetch (no backend change)
  const [singleBySlug, setSingleBySlug] = useState(null);
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
  const API_KEY  = process.env.NEXT_PUBLIC_API_KEY;

  useEffect(() => {
    let cancel = false;
    async function fetchBySlug() {
      if (!slug) return;
      try {
        const res = await fetch(`${API_BASE}/product/slug/${slug}`, {
          headers: { 'x-api-key': API_KEY, 'Content-Type': 'application/json' },
          credentials: 'include',
        });
        if (!res.ok) return;
        const json = await res.json(); // { status: 1, data: product }
        if (!cancel) setSingleBySlug(json?.data || null);
      } catch (_) {
        if (!cancel) setResolvedColorNames([]);
      }
    }
    if ((needsColor || needsSubsuitable) && !singleById && slug) {
      fetchBySlug();
    }
    return () => { cancel = true; };
  }, [slug, needsColor, needsSubsuitable, singleById, API_BASE, API_KEY]);

  // choose first available full object
  const full = singleById || singleBySlug || {};

  /* ─── COLOR resolve ─── */
  const rawColor = product?.color ?? full?.color; // can be populated array, id array, or undefined
  const immediateColorNames = toNameArray(rawColor);

  const [resolvedColorNames, setResolvedColorNames] = useState([]);
  useEffect(() => {
    let cancel = false;

    async function hydrateFromIds(ids) {
      try {
        const uniq = [...new Set(ids)];
        const reqs = uniq.map((id) =>
          fetch(`${API_BASE}/color/${id}`, {
            headers: { 'x-api-key': API_KEY, 'Content-Type': 'application/json' },
            credentials: 'include',
          }).then(r => r.ok ? r.json() : null)
        );
        const results = await Promise.all(reqs);
        const names = results
          ?.map(r => r?.data?.name)
          .filter(Boolean) || [];
        if (!cancel) setResolvedColorNames(names);
      } catch (_) {
        if (!cancel) setResolvedColorNames([]);
      }
    }

    if (immediateColorNames.length === 0 && looksLikeIdArray(rawColor)) {
      hydrateFromIds(rawColor);
    } else {
      setResolvedColorNames([]);
    }
    return () => { cancel = true; };
  }, [API_BASE, API_KEY, rawColor, immediateColorNames.length]);

  const colorNames = immediateColorNames.length ? immediateColorNames : resolvedColorNames;

  /* ─── SUBSUITABLE normalize ─── */
  const subsuitableNames = toNameArray(product?.subsuitable ?? full?.subsuitable);

  /* ─── optional id lookups ─── */
  const { data: catL    } = useGetCategoryByIdQuery(categoryId,   { skip: !categoryId });
  const { data: subL    } = useGetSubstructureQuery(structureId,  { skip: !structureId });
  const { data: contL   } = useGetContentByIdQuery(contentId,     { skip: !contentId });
  const { data: finL    } = useGetSubfinishQuery(finishId,        { skip: !finishId });
  const { data: desL    } = useGetDesignByIdQuery(designId,       { skip: !designId });
  const { data: motifL  } = useGetMotifSizeByIdQuery(motifsizeId, { skip: !motifsizeId });
  const { data: suitL   } = useGetSubsuitableQuery(suitableforId, { skip: !suitableforId });

  const categoryName      = pick(category?.name,      catL?.data?.name);
  const substructureName  = pick(substructure?.name,  subL?.data?.name);
  const contentName       = pick(content?.name,       contL?.data?.name);
  const subfinishName     = pick(subfinish?.name,     finL?.data?.name);
  const designName        = pick(design?.name,        desL?.data?.name);
  const motifName         = pick(motif?.name,         motifL?.data?.name, motifL?.data?.size);
  const subsuitableNameFB = pick(suitL?.data?.name);

  /* underline marker */
  const activeRef = useRef(null);
  const markerRef = useRef(null);
  const moveMarker = (el) => {
    if (el && markerRef.current) {
      markerRef.current.style.left  = `${el.offsetLeft}px`;
      markerRef.current.style.width = `${el.offsetWidth}px`;
    }
  };
  useEffect(() => { moveMarker(activeRef.current); }, []);

  /* rows */
  const rowsBase = useMemo(() => ([
    { label: 'SKU',            value: skuValue },
    { label: 'Price',          value: money(price) },
    { label: 'Width (cm)',     value: cm ?? width },
    { label: 'Width (inch)',   value: inch },
    { label: 'GSM',            value: gsm },
    { label: 'OZ',             value: oz },
    { label: 'U/M',            value: um },
    { label: 'Currency',       value: currency },
    { label: 'Quantity',       value: quantity },
    { label: 'Category',       value: categoryName },
    { label: 'Sub-structure',  value: substructureName },
    { label: 'Content',        value: contentName },
    { label: 'Sub-finish',     value: subfinishName },
    { label: 'Design',         value: designName },
    { label: 'Motif',          value: motifName },
  ].filter((r) => nonEmpty(r.value))), [
    skuValue, price, cm, width, inch, gsm, oz, um, currency, quantity,
    categoryName, substructureName, contentName, subfinishName, designName, motifName
  ]);

  const rows = [
    { label: 'Color',        value: colorNames.length ? colorNames : '—' },
    { label: 'Suitable For', value: (subsuitableNames.length ? subsuitableNames
                                 : (subsuitableNameFB ? [subsuitableNameFB] : [])) || '—' },
    ...rowsBase,
  ];

  const half = Math.ceil(rows.length / 2);

  return (
    <div className="tp-product-details-tab-nav tp-tab">
      {/* tab header */}
      <nav>
        <div className="nav nav-tabs justify-content-center p-relative tp-product-tab" role="tablist">
          <NavItem active id="desc" title="Description" linkRef={activeRef} onClick={(e) => moveMarker(e.currentTarget)} />
          <NavItem id="additional" title="Additional information" onClick={(e) => moveMarker(e.currentTarget)} />
          <span ref={markerRef} className="tp-product-details-tab-line" />
        </div>
      </nav>

      {/* tab panes */}
      <div className="tab-content" id="navPresentationTabContent">
        <div className="tab-pane fade show active" id="nav-desc" role="tabpanel" tabIndex={-1}>
          <div className="tp-product-details-desc-wrapper pt-60">
            { /<[a-z][\s\S]*>/i.test(fullDescription)
              ? <div dangerouslySetInnerHTML={{ __html: fullDescription }} />
              : <p>{fullDescription}</p>}
          </div>
        </div>

        <div className="tab-pane fade" id="nav-additional" role="tabpanel" tabIndex={-1}>
          <div className="tp-product-details-additional-info">
            <div className="row">
              {[rows.slice(0, half), rows.slice(half)].map((col, idx) => (
                <div className="col-xl-6" key={idx}>
                  <table>
                    <tbody>
                      {col.map(({ label, value }) => (
                        <tr key={label}>
                          <td>{label}</td>
                          <td>
                            {Array.isArray(value) ? (
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                {value.map((v) => (
                                  <span key={v} style={{
                                    display: 'inline-block',
                                    padding: '4px 8px',
                                    borderRadius: '999px',
                                    border: '1px solid #e5e7eb',
                                    background: '#fff',
                                    fontSize: 12,
                                  }}>
                                    {v}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              String(value)
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
