import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import InvoiceItem from "./InvoiceItem";
import InvoiceModal from "./InvoiceModal";
import { BiArrowBack } from "react-icons/bi";
import InputGroup from "react-bootstrap/InputGroup";
import { useDispatch } from "react-redux";
import { addInvoice, updateInvoice, updateInvoiceOnProductEdit } from "../redux/invoicesSlice";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import generateRandomId from "../utils/generateRandomId";
import { useInvoiceListData, useProduct } from "../redux/hooks";
import ProductItem from "./ProductItem";
import { addProduct, deleteProduct, updateProduct } from "../redux/productSlice";

const InvoiceForm = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const isCopy = location.pathname.includes("create");
  const isEdit = location.pathname.includes("edit");

  const [isOpen, setIsOpen] = useState(false);
  const [copyId, setCopyId] = useState("");
  const { getOneInvoice, listSize } = useInvoiceListData();
  const { productList } = useProduct();
  const [products, setProducts] = useState(() => {
    if (isEdit) {
      const invoiceItemIds = getOneInvoice(params.id).items.map((item) => item?.itemId);
      return [...productList.filter((product) => !invoiceItemIds.includes(product?.itemId)), {
        itemId: (+new Date() + Math.floor(Math.random() * 999999)).toString(36),
        itemName: "",
        itemDescription: "",
        itemPrice: "1.00",
        itemQuantity: 1,
        itemGroup: "Labor",
      }];
    } else {
      return [...productList, {
        itemId: (+new Date() + Math.floor(Math.random() * 999999)).toString(36),
        itemName: "",
        itemDescription: "",
        itemPrice: "1.00",
        itemQuantity: 1,
        itemGroup: "Labor",
      }];
    }
  });
  const [formData, setFormData] = useState(
    isEdit
      ? getOneInvoice(params.id)
      : isCopy && params.id
      ? {
          ...getOneInvoice(params.id),
          id: generateRandomId(),
          invoiceNumber: listSize + 1,
        }
      : {
          id: generateRandomId(),
          currentDate: new Date().toLocaleDateString(),
          invoiceNumber: listSize + 1,
          dateOfIssue: "",
          billTo: "",
          billToEmail: "",
          billToAddress: "",
          billFrom: "",
          billFromEmail: "",
          billFromAddress: "",
          notes: "",
          total: "0.00",
          subTotal: "0.00",
          taxRate: "",
          taxAmount: "0.00",
          discountRate: "",
          discountAmount: "0.00",
          currency: "$",
          items: [
            {
              itemId: 0,
              itemName: "",
              itemDescription: "",
              itemPrice: "1.00",
              itemQuantity: 1,
            },
          ],
        }
  );

  useEffect(() => {
    handleCalculateTotal();
  }, []);

  const handleRowDel = (itemToDelete) => {
    const updatedItems = formData.items.filter(
      (item) => item.itemId !== itemToDelete.itemId
    );
    setFormData({ ...formData, items: updatedItems });
    handleCalculateTotal();

    const removedItem = productList.filter((p) => p.itemId === itemToDelete.itemId);

    if(removedItem.length > 0){
      setProducts([removedItem[0], ...products])
    }
  };

  const handleDelProduct = (productId) => {
    dispatch(deleteProduct(productId));
    const updatedProds = products.filter((p) => p.itemId !== productId);
    setProducts(updatedProds);
  }

  const handleAddEvent = () => {
    const id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
    const newItem = {
      itemId: id,
      itemName: "",
      itemDescription: "",
      itemPrice: "1.00",
      itemQuantity: 1,
    };
    setFormData({
      ...formData,
      items: [...formData.items, newItem],
    });
    handleCalculateTotal();
  };

  const handleAddToItem = (prod) => {
    setFormData({
      ...formData,
      items: [prod, ...formData.items]
    })

    //console.log("products before updating: ", products)

    const updatedProds = products.filter((p) => p.itemId !== prod.itemId);
    //console.log(updatedProds, "updated products");
    setProducts(updatedProds);
    handleCalculateTotal();
  }

  const handleAddProduct = () => {
    const lastProd = products[products.length - 1];
    if(lastProd.itemName === "" || lastProd.itemDescription === ""){
      alert("Product Name or Description cannot be empty!!!");
      return;
    }
    const id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
    const newItem = {
      itemId: id,
      itemName: "",
      itemDescription: "",
      itemPrice: "1.00",
      itemQuantity: 1,
      itemGroup: "Labor",
    };
    //console.log("product added", newItem)
    const updatedProducts = [...products, newItem]
    setProducts(updatedProducts)
    dispatch(addProduct(updatedProducts[updatedProducts.length - 2]));
    handleCalculateTotal();
  }

  const handleCalculateTotal = () => {
    setFormData((prevFormData) => {
      let subTotal = 0;

      prevFormData.items.forEach((item) => {
        subTotal +=
          parseFloat(item.itemPrice).toFixed(2) * parseInt(item.itemQuantity);
      });

      const taxAmount = parseFloat(
        subTotal * (prevFormData.taxRate / 100)
      ).toFixed(2);
      const discountAmount = parseFloat(
        subTotal * (prevFormData.discountRate / 100)
      ).toFixed(2);
      const total = (
        subTotal -
        parseFloat(discountAmount) +
        parseFloat(taxAmount)
      ).toFixed(2);

      return {
        ...prevFormData,
        subTotal: parseFloat(subTotal).toFixed(2),
        taxAmount,
        discountAmount,
        total,
      };
    });
  };

  const onItemizedItemEdit = (evt, id) => {
    const updatedItems = formData.items.map((oldItem) => {
      if (oldItem.itemId === id) {
        return { ...oldItem, [evt.target.name]: evt.target.value };
      }
      return oldItem;
    });

    setFormData({ ...formData, items: updatedItems });
    //console.log(productList, "product list")
    const isProduct = productList.findIndex((p) => p?.itemId.toString() === id);
    //console.log(isProduct, "isproduct while editeng")
    if(isProduct !== -1){
      let updatedProduct = formData.items.filter((data) => data.itemId === id);
      //console.log(updatedProduct, "before manipulation updated product");
      updatedProduct = {...updatedProduct[0], [evt.target.name]: evt.target.value}
      //console.log(updatedProduct, "updatedProduct");
      dispatch(updateProduct({ id: id, updatedProd: updatedProduct }))
    }
    handleCalculateTotal();
  };

  const onProductizedItemEdit = (evt, id) => {
    console.log("updating product item", evt.target.name, evt.target.value)
    let updatedProd;
    const updatedProducts = products.map((p) => {
      if(p?.itemId === id){
        updatedProd = {
          ...p,
          [evt.target.name]: evt.target.value
        }
        return updatedProd
      }
      return p
    })
    console.log(id, updatedProd, "updated prod")
    setProducts(updatedProducts)
    handleCalculateTotal();
    dispatch(updateProduct({id, updatedProd}))
    dispatch(updateInvoiceOnProductEdit({id, updatedProductData: updatedProd}))
  }

  const editField = (name, value) => {
    setFormData({ ...formData, [name]: value });
    handleCalculateTotal();
  };

  const onCurrencyChange = (selectedOption) => {
    setFormData({ ...formData, currency: selectedOption.currency });
  };

  const openModal = (event) => {
    event.preventDefault();
    handleCalculateTotal();
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleAddInvoice = () => {
    if (isEdit) {
      //console.log(formData, "is edit form data", params.id)
      dispatch(updateInvoice({ id: params.id, updatedInvoice: formData }));
      alert("Invoice updated successfuly 🥳");
    } else if (isCopy) {
      dispatch(addInvoice({ id: generateRandomId(), ...formData }));
      alert("Invoice added successfuly 🥳");
    } else {
      dispatch(addInvoice(formData));
      alert("Invoice added successfuly 🥳");
    }
    navigate("/");
  };

  const handleCopyInvoice = () => {
    const recievedInvoice = getOneInvoice(copyId);
    if (recievedInvoice) {
      setFormData({
        ...recievedInvoice,
        id: formData.id,
        invoiceNumber: formData.invoiceNumber,
      });
    } else {
      alert("Invoice does not exists!!!!!");
    }
  };

  return (
    <Form onSubmit={openModal}>
      <div className="d-flex align-items-center">
        <BiArrowBack size={18} />
        <div className="fw-bold mt-1 mx-2 cursor-pointer">
          <Link to="/">
            <h5>Go Back</h5>
          </Link>
        </div>
      </div>

      <Row>
        <Col md={8} lg={9}>
          <Card className="p-4 p-xl-5 my-3 my-xl-4">
            <div className="d-flex flex-row align-items-start justify-content-between mb-3">
              <div className="d-flex flex-column">
                <div className="d-flex flex-column">
                  <div className="mb-2">
                    <span className="fw-bold">Current&nbsp;Date:&nbsp;</span>
                    <span className="current-date">{formData.currentDate}</span>
                  </div>
                </div>
                <div className="d-flex flex-row align-items-center">
                  <span className="fw-bold d-block me-2">Due&nbsp;Date:</span>
                  <Form.Control
                    type="date"
                    value={formData.dateOfIssue}
                    name="dateOfIssue"
                    onChange={(e) => editField(e.target.name, e.target.value)}
                    style={{ maxWidth: "150px" }}
                    required
                  />
                </div>
              </div>
              <div className="d-flex flex-row align-items-center">
                <span className="fw-bold me-2">Invoice&nbsp;Number:&nbsp;</span>
                <Form.Control
                  type="number"
                  value={formData.invoiceNumber}
                  name="invoiceNumber"
                  onChange={(e) => editField(e.target.name, e.target.value)}
                  min="1"
                  style={{ maxWidth: "70px" }}
                  required
                />
              </div>
            </div>
            <hr className="my-4" />
            <Row className="mb-5">
              <Col>
                <Form.Label className="fw-bold">Bill to:</Form.Label>
                <Form.Control
                  placeholder="Who is this invoice to?"
                  rows={3}
                  value={formData.billTo}
                  type="text"
                  name="billTo"
                  className="my-2"
                  onChange={(e) => editField(e.target.name, e.target.value)}
                  autoComplete="name"
                  required
                />
                <Form.Control
                  placeholder="Email address"
                  value={formData.billToEmail}
                  type="email"
                  name="billToEmail"
                  className="my-2"
                  onChange={(e) => editField(e.target.name, e.target.value)}
                  autoComplete="email"
                  required
                />
                <Form.Control
                  placeholder="Billing address"
                  value={formData.billToAddress}
                  type="text"
                  name="billToAddress"
                  className="my-2"
                  autoComplete="address"
                  onChange={(e) => editField(e.target.name, e.target.value)}
                  required
                />
              </Col>
              <Col>
                <Form.Label className="fw-bold">Bill from:</Form.Label>
                <Form.Control
                  placeholder="Who is this invoice from?"
                  rows={3}
                  value={formData.billFrom}
                  type="text"
                  name="billFrom"
                  className="my-2"
                  onChange={(e) => editField(e.target.name, e.target.value)}
                  autoComplete="name"
                  required
                />
                <Form.Control
                  placeholder="Email address"
                  value={formData.billFromEmail}
                  type="email"
                  name="billFromEmail"
                  className="my-2"
                  onChange={(e) => editField(e.target.name, e.target.value)}
                  autoComplete="email"
                  required
                />
                <Form.Control
                  placeholder="Billing address"
                  value={formData.billFromAddress}
                  type="text"
                  name="billFromAddress"
                  className="my-2"
                  autoComplete="address"
                  onChange={(e) => editField(e.target.name, e.target.value)}
                  required
                />
              </Col>
            </Row>
            <ProductItem
                onItemizedItemEdit={onProductizedItemEdit}
                onProductAdd={handleAddProduct}
                onProductDel={handleDelProduct}
                addToItem={handleAddToItem}
                currency={formData.currency}
                products={products}
            />
            <InvoiceItem
              onItemizedItemEdit={onItemizedItemEdit}
              onRowAdd={handleAddEvent}
              onRowDel={handleRowDel}
              currency={formData.currency}
              items={formData.items}
            />
            <Row className="mt-4 justify-content-end">
              <Col lg={6}>
                <div className="d-flex flex-row align-items-start justify-content-between">
                  <span className="fw-bold">Subtotal:</span>
                  <span>
                    {formData.currency}
                    {formData.subTotal}
                  </span>
                </div>
                <div className="d-flex flex-row align-items-start justify-content-between mt-2">
                  <span className="fw-bold">Discount:</span>
                  <span>
                    <span className="small">
                      ({formData.discountRate || 0}%)
                    </span>
                    {formData.currency}
                    {formData.discountAmount || 0}
                  </span>
                </div>
                <div className="d-flex flex-row align-items-start justify-content-between mt-2">
                  <span className="fw-bold">Tax:</span>
                  <span>
                    <span className="small">({formData.taxRate || 0}%)</span>
                    {formData.currency}
                    {formData.taxAmount || 0}
                  </span>
                </div>
                <hr />
                <div
                  className="d-flex flex-row align-items-start justify-content-between"
                  style={{ fontSize: "1.125rem" }}
                >
                  <span className="fw-bold">Total:</span>
                  <span className="fw-bold">
                    {formData.currency}
                    {formData.total || 0}
                  </span>
                </div>
              </Col>
            </Row>
            <hr className="my-4" />
            <Form.Label className="fw-bold">Notes:</Form.Label>
            <Form.Control
              placeholder="Thanks for your business!"
              name="notes"
              value={formData.notes}
              onChange={(e) => editField(e.target.name, e.target.value)}
              as="textarea"
              className="my-2"
              rows={1}
            />
          </Card>
        </Col>
        <Col md={4} lg={3}>
          <div className="sticky-top pt-md-3 pt-xl-4">
            <Button
              variant="dark"
              onClick={handleAddInvoice}
              className="d-block w-100 mb-2"
            >
              {isEdit ? "Update Invoice" : "Add Invoice"}
            </Button>
            <Button variant="primary" type="submit" className="d-block w-100">
              Review Invoice
            </Button>
            <InvoiceModal
              showModal={isOpen}
              closeModal={closeModal}
              info={{
                isOpen,
                id: formData.id,
                currency: formData.currency,
                currentDate: formData.currentDate,
                invoiceNumber: formData.invoiceNumber,
                dateOfIssue: formData.dateOfIssue,
                billTo: formData.billTo,
                billToEmail: formData.billToEmail,
                billToAddress: formData.billToAddress,
                billFrom: formData.billFrom,
                billFromEmail: formData.billFromEmail,
                billFromAddress: formData.billFromAddress,
                notes: formData.notes,
                total: formData.total,
                subTotal: formData.subTotal,
                taxRate: formData.taxRate,
                taxAmount: formData.taxAmount,
                discountRate: formData.discountRate,
                discountAmount: formData.discountAmount,
              }}
              items={formData.items}
              currency={formData.currency}
              subTotal={formData.subTotal}
              taxAmount={formData.taxAmount}
              discountAmount={formData.discountAmount}
              total={formData.total}
            />
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Currency:</Form.Label>
              <Form.Select
                onChange={(event) =>
                  onCurrencyChange({ currency: event.target.value })
                }
                className="btn btn-light my-1"
                aria-label="Change Currency"
              >
                <option value="$">USD (United States Dollar)</option>
                <option value="£">GBP (British Pound Sterling)</option>
                <option value="¥">JPY (Japanese Yen)</option>
                <option value="$">CAD (Canadian Dollar)</option>
                <option value="$">AUD (Australian Dollar)</option>
                <option value="$">SGD (Singapore Dollar)</option>
                <option value="¥">CNY (Chinese Renminbi)</option>
                <option value="₿">BTC (Bitcoin)</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="my-3">
              <Form.Label className="fw-bold">Tax rate:</Form.Label>
              <InputGroup className="my-1 flex-nowrap">
                <Form.Control
                  name="taxRate"
                  type="number"
                  value={formData.taxRate}
                  onChange={(e) => editField(e.target.name, e.target.value)}
                  className="bg-white border"
                  placeholder="0.0"
                  min="0.00"
                  step="0.01"
                  max="100.00"
                />
                <InputGroup.Text className="bg-light fw-bold text-secondary small">
                  %
                </InputGroup.Text>
              </InputGroup>
            </Form.Group>
            <Form.Group className="my-3">
              <Form.Label className="fw-bold">Discount rate:</Form.Label>
              <InputGroup className="my-1 flex-nowrap">
                <Form.Control
                  name="discountRate"
                  type="number"
                  value={formData.discountRate}
                  onChange={(e) => editField(e.target.name, e.target.value)}
                  className="bg-white border"
                  placeholder="0.0"
                  min="0.00"
                  step="0.01"
                  max="100.00"
                />
                <InputGroup.Text className="bg-light fw-bold text-secondary small">
                  %
                </InputGroup.Text>
              </InputGroup>
            </Form.Group>

            <Form.Control
              placeholder="Enter Invoice ID"
              name="copyId"
              value={copyId}
              onChange={(e) => setCopyId(e.target.value)}
              type="text"
              className="my-2 bg-white border"
            />
            <Button
              variant="primary"
              onClick={handleCopyInvoice}
              className="d-block"
            >
              Copy Old Invoice
            </Button>
          </div>
        </Col>
      </Row>
    </Form>
  );
};

export default InvoiceForm;
