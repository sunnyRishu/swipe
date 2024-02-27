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
      //console.log(index, "index")
      if (index !== -1) {
        //console.log("updated invoide in slice", action.payload.updatedInvoice)
        state[index] = action.payload.updatedInvoice;
      }
    },
    updateInvoiceOnProductEdit: (state, action) => {
      const updatedProductId = action.payload.id;
      const updatedProductData = action.payload.updatedProductData;

      // Iterate over invoices and update products if necessary
      state.forEach(invoice => {
        invoice.items.forEach(item => {
          if (item.itemId.toString() === updatedProductId.toString()) {
            // Update relevant properties of the item in the invoice
            Object.keys(updatedProductData).forEach(key => {
              item[key] = updatedProductData[key];
            });
          }
        });
      });
    },
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
