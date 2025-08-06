
'use client';

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';


import { useGetSubstructureQuery }   from '@/redux/features/substructureApi';
import { useGetContentByIdQuery }    from '@/redux/features/contentApi';
import { useGetSubfinishQuery }      from '@/redux/features/subfinishApi';

import { add_to_wishlist } from '@/redux/features/wishlist-slice';


const StructureInfo = ({ id }) => {
  const { data, isLoading, isError } = useGetSubstructureQuery(id, { skip: !id });
  if (!id) return null;
  const value = isLoading ? 'Loading…' : (isError || !data?.data?.name) ? 'N/A' : data.data.name;
  return (
    <div className="tp-product-details-query-item d-flex align-items-center">
      <span>Structure: </span><p>{value}</p>
    </div>
  );
};

const ContentInfo = ({ id }) => {
  const { data, isLoading, isError } = useGetContentByIdQuery(id, { skip: !id });
  if (!id) return null;
  const value = isLoading ? 'Loading…' : (isError || !data?.data?.name) ? 'N/A' : data.data.name;
  return (
    <div className="tp-product-details-query-item d-flex align-items-center">
      <span>Content: </span><p>{value}</p>
    </div>
  );
};

const FinishInfo = ({ id }) => {
  const { data, isLoading, isError } = useGetSubfinishQuery(id, { skip: !id });
  if (!id) return null;
  const value = isLoading ? 'Loading…' : (isError || !data?.data?.name) ? 'N/A' : data.data.name;
  return (
    <div className="tp-product-details-query-item d-flex align-items-center">
      <span>Finish: </span><p>{value}</p>
    </div>
  );
};


const DetailsWrapper = ({ productItem = {} }) => {
  const {
    _id,
    /* sku, */
    title,
    category,
    newCategoryId,
    description,
    status,
   /*  price = 0,
    discount = 0, */

    structureId,     
    contentId,
    finishId,        
    gsm,
    width,
  } = productItem;

  const dispatch = useDispatch();
  const { wishlist } = useSelector(state => state.wishlist);
  const isInWishlist = wishlist.some(prd => prd._id === _id);

  const toggleWishlist = () => dispatch(add_to_wishlist(productItem));

  return (
    <div className="tp-product-details-wrapper">
      <div className="tp-product-details-category">
        <span>{category?.name || newCategoryId?.name}</span>
      </div>

      <h3 className="tp-product-details-title">{title}</h3>

      <div className="tp-product-details-inventory d-flex align-items-center mb-10">
        <div className="tp-product-details-stock mb-10">
          <span>{status}</span>
        </div>
      </div>

      <p>Description: {description}</p>

     
     {/*  <div className="tp-product-details-price-wrapper mb-20">
        {discount > 0 ? (
          <>
            <span className="tp-product-details-price old-price">
              {price.toFixed(2)}
            </span>
            <span className="tp-product-details-price new-price">
              {(price - (price * discount) / 100).toFixed(2)}
            </span>
          </>
        ) : (
          <span className="tp-product-details-price new-price">
            {price.toFixed(2)}
          </span>
        )}
      </div> */}

     
      <div className="tp-product-details-query" style={{ marginBottom: 20 }}>
        <div className="tp-product-details-query-item d-flex align-items-center">
{/*           <span>SKU:  </span><p>{sku}</p>
 */}        </div>

        <StructureInfo id={structureId} />
        <ContentInfo   id={contentId}   />

        <div className="tp-product-details-query-item d-flex align-items-center">
          <span>GSM: </span><p>{gsm}</p>
        </div>
        <div className="tp-product-details-query-item d-flex align-items-center">
          <span>Width: </span><p>{width}</p>
        </div>

        <FinishInfo    id={finishId}    />
      </div>

     
      <div className="tp-product-details-action-wrapper">
        <div
          className="tp-product-details-action-item-wrapper d-flex align-items-center"
          style={{ gap: 10 }}
        >
          <div className="d-flex" style={{ flexGrow: 1, gap: 10 }}>
            <button className="tp-product-details-buy-now-btn w-100 py-1 px-1 text-sm rounded transition-all">
              Request Sample
            </button>
            <button className="tp-product-details-buy-now-btn w-100 py-1 px-1 text-sm rounded transition-all">
              Request Quote
            </button>
          </div>

          
          <button
            type="button"
            onClick={toggleWishlist}
            className={`tp-product-details-wishlist-btn tp-details-btn-hover ${isInWishlist ? 'active' : ''}`}
            aria-label="Add to Wishlist"
            style={{
              background: '#fff',
              border: '1px solid #E4E8EB',
              borderRadius: '50%',
              padding: 8,
              fontSize: 24,
              color: isInWishlist ? 'red' : '#bbb',
              transition: 'color .2s',
              lineHeight: 1,
            }}
            onMouseOver={e => (e.currentTarget.style.color = 'red')}
            onMouseOut={e => (e.currentTarget.style.color = isInWishlist ? 'red' : '#bbb')}
          >
            <i className={isInWishlist ? 'fas fa-heart' : 'far fa-heart'} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailsWrapper;
