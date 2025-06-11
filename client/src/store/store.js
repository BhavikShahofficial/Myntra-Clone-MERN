import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import productSlice from "./ProductSlice";
import shoppingCartSlice from "./cartSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productSlice,
    cart: shoppingCartSlice,
  },
});

export default store;
