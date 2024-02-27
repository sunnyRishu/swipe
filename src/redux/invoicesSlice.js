import { createSlice } from "@reduxjs/toolkit";

const invoicesSlice = createSlice({
  name: "invoices",
  initialState: [],
  reducers: {
    addInvoice: (state, action) => {
      state.push(action.payload);
    },
    deleteInvoice: (state, action) => {
      return state.filter((invoice) => invoice.id !== action.payload);
    },
    updateInvoice: (state, action) => {
      const index = state.findIndex(
        (invoice) => invoice.id.toString() === action.payload.id
      );
      if (index !== -1) {
        state[index] = action.payload.updatedInvoice;
      }
    },
    // updating the redux state for invoice whenever the products are getting updated
    updateInvoiceOnProductEdit: (state, action) => {
      const updatedProductId = action.payload.id;
      const updatedProductData = action.payload.updatedProductData;

      // Iterating over invoices and updating products if necessary
      state.forEach(invoice => {
        invoice.items.forEach(item => {
          if (item.itemId.toString() === updatedProductId.toString()) {
            // Updating relevant properties of the item in the invoice
            Object.keys(updatedProductData).forEach(key => {
              item[key] = updatedProductData[key];
            });
          }
        });
      });
    },
    // updating the redux state for invoice whenever the products are getting deleted
    updateInvoiceOnProductDelete: (state, action) => {
      const deletedProductId = action.payload;

      state.forEach(invoice => {
        invoice.items = invoice?.items.filter(item => item?.itemId !== deletedProductId);
      });
    },
  },
});

export const {
  addInvoice,
  deleteInvoice,
  updateInvoice,
  updateInvoiceOnProductEdit,
  updateInvoiceOnProductDelete,
} = invoicesSlice.actions;

export const selectInvoiceList = (state) => state.invoices;

export default invoicesSlice.reducer;
