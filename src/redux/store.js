import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./api/apiSlice";
import { seoApi } from "./features/seoApi";
import authSlice from "./features/auth/authSlice";
import cartSlice from "./features/cartSlice";
import compareSlice from "./features/compareSlice";
import productModalSlice from "./features/productModalSlice";
import shopFilterSlice from "./features/shop-filter-slice";
import wishlistSlice from "./features/wishlist-slice";
import orderSlice from "./features/order/orderSlice";

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    [seoApi.reducerPath]: seoApi.reducer,
    auth: authSlice,
    productModal: productModalSlice,
    shopFilter: shopFilterSlice,
    cart: cartSlice,
    wishlist: wishlistSlice,
    compare: compareSlice,
    order: orderSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      apiSlice.middleware,
      seoApi.middleware,
    ]),
});

export default store;
