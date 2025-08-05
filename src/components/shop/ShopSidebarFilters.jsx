import React, { useState, useEffect } from 'react';
import { useGetFilterOptionsQuery } from '@/redux/api/apiSlice';

/* -------------------------------------------------------------------------- */
/*  CONSTANTS & HELPERS                                                       */
/* -------------------------------------------------------------------------- */
const FILTERS = [
  { key: 'category',     label: 'Category',     api: 'category/' },
  { key: 'color',        label: 'Color',        api: 'color/'    },
  { key: 'content',      label: 'Content',      api: 'content/'  },
  { key: 'design',       label: 'Design',       api: 'design/'   },
  {
    key: 'structure',    label: 'Structure',    api: 'structure/',
    sub: { key: 'substructure', label: 'Substructure', api: 'substructure/' }
  },
  {
    key: 'finish',       label: 'Finish',       api: 'finish/',
    sub: { key: 'subfinish', label: 'Sub Finish', api: 'subfinish/' }
  },
  { key: 'groupcode',    label: 'Group Code',   api: 'groupcode/' },
  { key: 'vendor',       label: 'Vendor',       api: 'vendor/'    },
  {
    key: 'suitablefor',  label: 'Suitable For', api: 'suitablefor/',
    sub: { key: 'subsuitable', label: 'Sub Suitable', api: 'subsuitable/' }
  },
  { key: 'motifsize',    label: 'Motif Size',   api: 'motif/'     }
];

const getOptions = (data = []) =>
  Array.isArray(data)
    ? data
    : data?.data        ?? // common “data” envelope
      data?.results     ?? // RTK/Strapi style
      [];

/* -------------------------------------------------------------------------- */
/*  PARENT COMPONENT                                                          */
/* -------------------------------------------------------------------------- */
const ShopSidebarFilters = ({ onFilterChange, selected = {} }) => {
  const [openKey, setOpenKey] = useState(null);
  const [expandedSub, setExpandedSub] = useState({});

  const toggleAccordion   = key            => setOpenKey(k => (k === key ? null : key));
  const toggleSubAccordion = (pKey, sKey)  =>
    setExpandedSub(prev => ({ ...prev, [pKey]: prev[pKey] === sKey ? null : sKey }));

  const handleCheckbox = (filterKey, value) => {
    const current = selected[filterKey] ?? [];
    const next    = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];

    onFilterChange({ ...selected, [filterKey]: next });
  };

  return (
    <div className="tp-shop-sidebar mr-10">
      <h3 className="tp-shop-widget-title">Filter</h3>

      <div className="tp-shop-widget-content">
        {FILTERS.map(filter => (
          <FilterSection
            key={filter.key}
            filter={filter}
            isOpen={openKey === filter.key}
            expandedSub={expandedSub[filter.key]}
            selected={selected}
            onToggle={() => toggleAccordion(filter.key)}
            onToggleSub={() => toggleSubAccordion(filter.key, filter.sub?.key)}
            onCheckbox={handleCheckbox}
          />
        ))}
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*  CHILD COMPONENT – ONE PER FILTER                                          */
/* -------------------------------------------------------------------------- */
const FilterSection = ({
  filter,
  isOpen,
  expandedSub,
  selected,
  onToggle,
  onToggleSub,
  onCheckbox
}) => {
  const {
    data: response,
    isLoading,
    error,
  } = useGetFilterOptionsQuery(filter.api, {
    skip: !isOpen && !expandedSub
  });

  const options = getOptions(response);

  /* optional debug */
  useEffect(() => {
    if (error)   console.error(`Error fetching ${filter.key}:`, error);
    if (response) console.log(`Fetched ${filter.key}:`, response);
  }, [error, response, filter.key]);

  return (
    <div className="tp-shop-widget mb-30">
      {/* ── Main accordion header ── */}
      <div
        className="tp-shop-widget-title no-border d-flex justify-content-between align-items-center"
        style={{ cursor: 'pointer' }}
        onClick={onToggle}
      >
        <span>{filter.label}</span>
        <span>{isOpen ? '−' : '+'}</span>
      </div>

      {/* ── Main accordion body ── */}
      {isOpen && (
        <div className="tp-shop-widget-options mt-2">
          <div className="d-flex flex-column">
            {isLoading && <div className="text-muted small">Loading…</div>}
            {error      && <div className="text-danger small">Error loading options</div>}
            {!isLoading && !error && options.length === 0 && (
              <div className="text-muted small">No options available</div>
            )}

            {!isLoading && !error && options.map(opt => {
              const value = opt._id ?? opt.id ?? opt.name;
              return (
                <label
                  key={value}
                  className="d-flex align-items-center mb-2"
                >
                  <input
                    type="checkbox"
                    className="me-2"
                    name={filter.key}
                    checked={(selected[filter.key] ?? []).includes(value)}
                    onChange={() => onCheckbox(filter.key, value)}
                  />
                  <span>{opt.name ?? opt.parent ?? opt.title}</span>
                </label>
              );
            })}
          </div>

          {/* ── Optional sub-filter ── */}
          {filter.sub && (
            <div className="tp-shop-widget-subfilter mt-3">
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

/* -------------------------------------------------------------------------- */
/*  REUSABLE SUB-FILTER COMPONENT                                             */
/* -------------------------------------------------------------------------- */
const SubFilter = ({ api, filterKey, selected, onSelect }) => {
  const { data, isLoading, error } = useGetFilterOptionsQuery(api);
  const options = getOptions(data);

  if (isLoading)   return <div className="text-muted small ps-3">Loading sub-options…</div>;
  if (error)       return <div className="text-danger small ps-3">Error loading sub-options</div>;
  if (!options.length)
                   return <div className="text-muted small ps-3">No sub-options available</div>;

  return (
    <div className="ps-3 mt-2">
      {options.map(opt => {
        const value = opt._id ?? opt.id ?? opt.name;
        return (
          <label
            key={value}
            className="d-flex align-items-center mb-2"
          >
            <input
              type="checkbox"
              className="me-2"
              name={filterKey}
              checked={selected.includes(value)}
              onChange={() => onSelect(filterKey, value)}
            />
            <span>{opt.name ?? opt.parent ?? opt.title}</span>
          </label>
        );
      })}
    </div>
  );
};

export default ShopSidebarFilters;
