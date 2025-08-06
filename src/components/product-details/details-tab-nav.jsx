/* ---------------------------------------------------------------------- */
/*  details-tab-nav.jsx – Description / Additional-info tabs              */
/* ---------------------------------------------------------------------- */
'use client';

import React, { useRef, useEffect, memo } from 'react';

/* ───── lookup hooks (RTK Query) ─────────────────────────────────────── */
import { useGetSubstructureQuery }   from '@/redux/features/substructureApi';
import { useGetSubfinishQuery }      from '@/redux/features/subfinishApi';
import { useGetSubsuitableQuery }    from '@/redux/features/subsuitableApi';

import { useGetContentByIdQuery }    from '@/redux/features/contentApi';
import { useGetDesignByIdQuery }     from '@/redux/features/designApi';
import { useGetMotifSizeByIdQuery }  from '@/redux/features/motifSizeApi';
import { useGetCategoryByIdQuery }   from '@/redux/features/categoryApi';
import { useGetVendorByIdQuery }     from '@/redux/features/vendorApi';

/* ───── small tab button component ───────────────────────────────────── */
const NavItem = memo(function NavItem({
  id,
  title,
  active = false,
  linkRef,
  onClick,
}) {
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

/* --------------------------------------------------------------------- */
/*  Main component                                                       */
/* --------------------------------------------------------------------- */
export default function DetailsTabNav({ product = {} }) {
  /* ─── pull all props we need ──────────────────────────────────────── */
  const {
    /* description may arrive under two names */
    description,
    productdescription,

    sku,
    price,
    width,
    gsm,
    oz,

    categoryId,
    structureId,
    contentId,
    finishId,
    designId,
    motifsizeId,
    suitableforId,
    vendorId,
  } = product;

  /* prefer `description`, else fallback to `productdescription` */
  const fullDescription =
    (description && description.trim()) ||
    (productdescription && productdescription.trim()) ||
    '';

  /* ─── look-ups (always call hooks, skip = true avoids HTTP) ───────── */
  const { data: category    } = useGetCategoryByIdQuery(categoryId,   { skip: !categoryId });
  const { data: substructure} = useGetSubstructureQuery(structureId,  { skip: !structureId });
  const { data: content     } = useGetContentByIdQuery(contentId,     { skip: !contentId });
  const { data: subfinish   } = useGetSubfinishQuery(finishId,        { skip: !finishId });
  const { data: design      } = useGetDesignByIdQuery(designId,       { skip: !designId });
  const { data: motif       } = useGetMotifSizeByIdQuery(motifsizeId, { skip: !motifsizeId });
  const { data: subsuitable } = useGetSubsuitableQuery(suitableforId, { skip: !suitableforId });
  const { data: vendor      } = useGetVendorByIdQuery(vendorId,       { skip: !vendorId });

  /* ─── moving underline marker ─────────────────────────────────────── */
  const activeRef = useRef(null);
  const markerRef = useRef(null);
  const moveMarker = el => {
    if (el && markerRef.current) {
      markerRef.current.style.left  = `${el.offsetLeft}px`;
      markerRef.current.style.width = `${el.offsetWidth}px`;
    }
  };
  useEffect(() => { moveMarker(activeRef.current); }, []);

  /* ─── build rows for “Additional information” ─────────────────────── */
  const money = n => (typeof n === 'number' ? `₹ ${n.toLocaleString('en-IN')}` : undefined);

  const rows = [
    { label: 'SKU',            value: sku },
    { label: 'Price',          value: money(price) },
    { label: 'Width',          value: width },
    { label: 'GSM',            value: gsm },
    { label: 'OZ',             value: oz },
    { label: 'Category',       value: category?.data?.name },
    { label: 'Sub-structure',  value: substructure?.data?.name },
    { label: 'Content',        value: content?.data?.name },
    { label: 'Sub-finish',     value: subfinish?.data?.name },
    { label: 'Design',         value: design?.data?.name },
    { label: 'Motif',          value: motif?.data?.name },
    { label: 'Sub-suitable',   value: subsuitable?.data?.name },
    { label: 'Vendor',         value: vendor?.data?.name },
  ].filter(r => r.value !== undefined && r.value !== '');

  const half = Math.ceil(rows.length / 2);

  /* ─── render ───────────────────────────────────────────────────────── */
  return (
    <div className="tp-product-details-tab-nav tp-tab">
      {/* tab header ----------------------------------------------------- */}
      <nav>
        <div
          className="nav nav-tabs justify-content-center p-relative tp-product-tab"
          role="tablist"
        >
          <NavItem
            active
            id="desc"
            title="Description"
            linkRef={activeRef}
            onClick={e => moveMarker(e.currentTarget)}
          />
          <NavItem
            id="additional"
            title="Additional information"
            onClick={e => moveMarker(e.currentTarget)}
          />
          <span ref={markerRef} className="tp-product-details-tab-line" />
        </div>
      </nav>

      {/* tab panes ------------------------------------------------------ */}
      <div className="tab-content" id="navPresentationTabContent">
        {/* Description -------------------------------------------------- */}
        <div
          className="tab-pane fade show active"
          id="nav-desc"
          role="tabpanel"
          tabIndex={-1}
        >
          <div className="tp-product-details-desc-wrapper pt-60">
            {/* detect html vs plain text */}
            { /<[a-z][\s\S]*>/i.test(fullDescription)
              ? <div dangerouslySetInnerHTML={{ __html: fullDescription }} />
              : <p>{fullDescription}</p>}
          </div>
        </div>

        {/* Additional information -------------------------------------- */}
        <div
          className="tab-pane fade"
          id="nav-additional"
          role="tabpanel"
          tabIndex={-1}
        >
          <div className="tp-product-details-additional-info">
            <div className="row">
              {[rows.slice(0, half), rows.slice(half)].map((col, idx) => (
                <div className="col-xl-6" key={idx}>
                  <table>
                    <tbody>
                      {col.map(({ label, value }) => (
                        <tr key={label}>
                          <td>{label}</td>
                          <td>{value}</td>
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
