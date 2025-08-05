'use client';
import React, { useRef, useEffect, memo } from 'react';

import { useGetStructureQuery }     from '@/redux/features/structureApi';
import { useGetContentByIdQuery }   from '@/redux/features/contentApi';
import { useGetFinishByIdQuery }    from '@/redux/features/finishApi';
import { useGetDesignByIdQuery }    from '@/redux/features/designApi';
import { useGetMotifSizeByIdQuery } from '@/redux/features/motifSizeApi';
import { useGetSuitableForByIdQuery } from '@/redux/features/suitableForApi';
import { useGetCategoryByIdQuery }  from '@/redux/features/categoryApi';

/* ------------------------------------------------ NavItem (presentational) */
const NavItem = memo(function NavItem({
  active = false,
  id,
  title,
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

/* ------------------------------------------------ DetailsTabNav */
export default function DetailsTabNav({ product }) {
  // ─── product props ───────────────────────────────────────────────
  const {
    description,
    oz,
    productIdentifier,

    categoryId,
    structureId,
    contentId,
    finishId,
    designId,
    motifsizeId,
    suitableforId,
  } = product ?? {};

  // ─── queries (skipped if id falsy) ───────────────────────────────
  const { data: category     } = useGetCategoryByIdQuery(categoryId,     { skip: !categoryId });
  const { data: structure    } = useGetStructureQuery(structureId,       { skip: !structureId });
  const { data: content      } = useGetContentByIdQuery(contentId,       { skip: !contentId });
  const { data: finish       } = useGetFinishByIdQuery(finishId,         { skip: !finishId });
  const { data: design       } = useGetDesignByIdQuery(designId,         { skip: !designId });
  const { data: motifsize    } = useGetMotifSizeByIdQuery(motifsizeId,   { skip: !motifsizeId });
  const { data: suitablefor  } = useGetSuitableForByIdQuery(suitableforId,{ skip: !suitableforId });

  // ─── tab-marker refs ─────────────────────────────────────────────
  const activeRef = useRef(null);
  const markerRef = useRef(null);

  const moveMarker = el => {
    if (el && markerRef.current) {
      markerRef.current.style.left  = `${el.offsetLeft}px`;
      markerRef.current.style.width = `${el.offsetWidth}px`;
    }
  };

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    moveMarker(activeRef.current);
  }, []);        //  activeRef & moveMarker are stable
  /* eslint-enable react-hooks/exhaustive-deps */

  // ─── info rows ───────────────────────────────────────────────────
  const infoItems = [
    { label: 'Category',      value: category?.data?.name },
    { label: 'Structure',     value: structure?.data?.name },
    { label: 'Content',       value: content?.data?.name },
    { label: 'Finish',        value: finish?.data?.name },
    { label: 'Design',        value: design?.data?.name },
    { label: 'Motif Size',    value: motifsize?.data?.name },
    { label: 'Suitable For',  value: suitablefor?.data?.name },
    { label: 'OZ',            value: oz },
    { label: 'Product ID',    value: productIdentifier },
  ].filter(i => i.value);

  const half = Math.ceil(infoItems.length / 2);

  // ─── render ──────────────────────────────────────────────────────
  return (
    <div className="tp-product-details-tab-nav tp-tab">
      <nav>
        <div
          className="nav nav-tabs justify-content-center p-relative tp-product-tab"
          id="navPresentationTab"
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
          <span
            ref={markerRef}
            id="productTabMarker"
            className="tp-product-details-tab-line"
          />
        </div>
      </nav>

      <div className="tab-content" id="navPresentationTabContent">
        {/* Description */}
        <div
          className="tab-pane fade show active"
          id="nav-desc"
          role="tabpanel"
          aria-labelledby="nav-desc-tab"
          tabIndex={-1}
        >
          <div className="tp-product-details-desc-wrapper pt-60">
            <p>{description}</p>
          </div>
        </div>

        {/* Additional information */}
        <div
          className="tab-pane fade"
          id="nav-additional"
          role="tabpanel"
          aria-labelledby="nav-additional-tab"
          tabIndex={-1}
        >
          <div className="tp-product-details-additional-info">
            <div className="row">
              {[infoItems.slice(0, half), infoItems.slice(half)].map((col, idx) => (
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
