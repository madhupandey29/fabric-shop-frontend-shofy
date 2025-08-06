import React, { useState, useEffect } from 'react';
import { useGetFilterOptionsQuery } from '@/redux/api/apiSlice';

/* -------------------------------------------------------------------------- */
/*  COLLECTIONS THAT MATCH THE PRODUCT SCHEMA                                 */
/* -------------------------------------------------------------------------- */
const FILTERS = [
  { key: 'category',     label: 'Category',     api: 'category/'      },
  { key: 'color',        label: 'Color',        api: 'color/'         },
  { key: 'content',      label: 'Content',      api: 'content/'       },
  { key: 'design',       label: 'Design',       api: 'design/'        },

  /* products hold substructure / subfinish / subsuitable  */
  { key: 'structure',    label: 'Structure',    api: 'substructure/',
    sub: { key: 'substructure', label: 'Sub-structure', api: 'substructure/' }},

  { key: 'finish',       label: 'Finish',       api: 'subfinish/',
    sub: { key: 'subfinish', label: 'Sub-finish', api: 'subfinish/' }},

  { key: 'groupcode',    label: 'Group Code',   api: 'groupcode/'     },
  { key: 'vendor',       label: 'Vendor',       api: 'vendor/'        },

  { key: 'suitablefor',  label: 'Suitable For', api: 'subsuitable/',
    sub: { key: 'subsuitable', label: 'Sub-suitable', api: 'subsuitable/' }},

  { key: 'motifsize',    label: 'Motif Size',   api: 'motif/'         },
];

/* fallback helper */
const getOptions = (d = []) =>
  Array.isArray(d) ? d : d?.data ?? d?.results ?? [];

/* -------------------------------------------------------------------------- */

const ShopSidebarFilters = ({ onFilterChange, selected = {} }) => {
  const [open, setOpen]       = useState(null);
  const [openSub, setOpenSub] = useState({});

  const toggle = key      => setOpen(k => (k === key ? null : key));
  const toggleSub = (p,s) => setOpenSub(o => ({ ...o, [p]: o[p] === s ? null : s }));

  const handleTick = (filterKey, value) => {
    const cur  = selected[filterKey] ?? [];
    const next = cur.includes(value) ? cur.filter(v => v !== value) : [...cur, value];
    onFilterChange({ ...selected, [filterKey]: next });
  };

  return (
    <div className="tp-shop-sidebar mr-10">
      <h3 className="tp-shop-widget-title">Filter</h3>

      <div className="tp-shop-widget-content">
        {FILTERS.map(f => (
          <FilterSection
            key={f.key}
            filter={f}
            isOpen={open === f.key}
            expandedSub={openSub[f.key]}
            selected={selected}
            onToggle={() => toggle(f.key)}
            onToggleSub={() => toggleSub(f.key, f.sub?.key)}
            onCheckbox={handleTick}
          />
        ))}
      </div>
    </div>
  );
};

/* one filter section ------------------------------------------------------- */
const FilterSection = ({
  filter, isOpen, expandedSub, selected,
  onToggle, onToggleSub, onCheckbox,
}) => {
  const { data, isLoading, error } = useGetFilterOptionsQuery(filter.api, {
    skip: !isOpen && !expandedSub,
  });
  const options = getOptions(data);

  useEffect(() => {
  }, [error, filter.key]);

  return (
    <div className="tp-shop-widget mb-30">
      <div
        className="tp-shop-widget-title no-border d-flex justify-content-between align-items-center"
        style={{ cursor: 'pointer' }}
        onClick={onToggle}
      >
        <span>{filter.label}</span> <span>{isOpen ? '−' : '+'}</span>
      </div>

      {isOpen && (
        <div className="tp-shop-widget-options mt-2">
          {isLoading && <div className="small text-muted">Loading…</div>}
          {error && <div className="small text-danger">Error loading</div>}
          {!isLoading && !error && !options.length && (
            <div className="small text-muted">No options</div>
          )}

          {!isLoading && !error && options.map(o => {
            const value = o._id ?? o.id ?? o.name;
            return (
              <label key={value} className="d-flex align-items-center mb-2">
                <input
                  type="checkbox"
                  className="me-2"
                  checked={(selected[filter.key] ?? []).includes(value)}
                  onChange={() => onCheckbox(filter.key, value)}
                />
                <span>{o.name ?? o.parent ?? o.title}</span>
              </label>
            );
          })}

          {filter.sub && (
            <div className="mt-3">
              <div
                className="tp-shop-widget-title no-border d-flex justify-content-between align-items-center"
                style={{ cursor: 'pointer', fontSize: '0.95em' }}
                onClick={onToggleSub}
              >
                <span>{filter.sub.label}</span>
                <span>{expandedSub ? '−' : '+'}</span>
              </div>

              {expandedSub && (
                <SubFilter
                  api={filter.sub.api}
                  filterKey={filter.sub.key}
                  selected={selected[filter.sub.key] ?? []}
                  onSelect={onCheckbox}
                />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/* sub-filter --------------------------------------------------------------- */
const SubFilter = ({ api, filterKey, selected, onSelect }) => {
  const { data, isLoading, error } = useGetFilterOptionsQuery(api);
  const options = getOptions(data);

  if (isLoading) return <div className="small text-muted ps-3">Loading…</div>;
  if (error)     return <div className="small text-danger ps-3">Error</div>;
  if (!options.length)
                 return <div className="small text-muted ps-3">No options</div>;

  return (
    <div className="ps-3 mt-2">
      {options.map(o => {
        const value = o._id ?? o.id ?? o.name;
        return (
          <label key={value} className="d-flex align-items-center mb-2">
            <input
              type="checkbox"
              className="me-2"
              checked={selected.includes(value)}
              onChange={() => onSelect(filterKey, value)}
            />
            <span>{o.name ?? o.parent ?? o.title}</span>
          </label>
        );
      })}
    </div>
  );
};

export default ShopSidebarFilters;
