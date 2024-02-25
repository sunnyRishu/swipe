import { useSelector } from "react-redux";
import { selectInvoiceList } from "./invoicesSlice";
import { selectProductList } from "./productSlice";

export const useInvoiceListData = () => {
  const invoiceList = useSelector(selectInvoiceList);

  const getOneInvoice = (receivedId) => {
    const invoiceData = invoiceList.find(
      (invoice) => invoice.id.toString() === receivedId.toString()
    ) || null
    //console.log(invoiceData, "invoice data")
    return (
      invoiceData
    );
  };

  const listSize = invoiceList.length;

  return {
    invoiceList,
    getOneInvoice,
    listSize,
  };
};

export const useProduct = () => {
  const productList = useSelector(selectProductList);

  const productSize = productList.length;

  return {
    productList,
    productSize,
  };
};
