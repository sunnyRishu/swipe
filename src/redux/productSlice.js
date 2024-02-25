import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
  name: "products",
  initialState: [],
  reducers: {
    addProduct: (state, action) => {
        //console.log(state, "state product")
      state.push(action.payload);
    },
    deleteProduct: (state, action) => {
      return state.filter((product) => product.itemId !== action.payload);
    },
    updateProduct: (state, action) => {
      const index = state.findIndex((product) => product?.itemId.toString() === action.payload.id.toString());
      //console.log(state[index], "product", "index", index, action.payload.id)
      if (index !== -1) {
        state[index] = action.payload.updatedProd;
      }
    },
  },
});

export const { addProduct, deleteProduct, updateProduct } = productSlice.actions;

export const selectProductList = (state) => state.products;

export default productSlice.reducer;