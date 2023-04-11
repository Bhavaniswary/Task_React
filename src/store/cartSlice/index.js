import { createSlice } from "@reduxjs/toolkit";

export const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: [],
    totalItems: 0,
    WishListItems: [],
  },
  reducers: {
    addProduct: (state, action) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      const item = state.cartItems.find(
        (item) => item.id === action.payload.id
      );
      if (item && item.count <= 100) {
        item.count++;
      } else {
        state.cartItems = [...state.cartItems, action.payload];
        state.totalItems += 1;
      }
    },
    removeProduct: (state, action) => {
      const removed = state.cartItems.filter(
        (item) => item.id !== action.payload.id
      );
      state.cartItems = removed;
      state.totalItems -= 1;
    },
    increaseCount: (state, action) => {
      const item = state.cartItems.find(
        (item) => item.id === action.payload.id
      );
      if (item.count <= 100) item.count++;
    },
    decreaseCount: (state, action) => {
      const item = state.cartItems.find(
        (item) => item.id === action.payload.id
      );
      if (item.count > 0) item.count--;
    },
    addToWishList: (state, action) => {
      const item = state.WishListItems.find(
        (item) => item.id === action.payload.id
      );
      if (!item) state.WishListItems = [...state.WishListItems, action.payload];
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  addProduct,
  removeProduct,
  increaseCount,
  decreaseCount,
  addToWishList,
  incrementByAmount,
} = cartSlice.actions;

export default cartSlice.reducer;
