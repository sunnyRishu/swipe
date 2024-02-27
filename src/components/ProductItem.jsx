import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import { BiTrash } from "react-icons/bi";
import { MdAddToQueue } from "react-icons/md";
import EditableField from "./EditableField";
import Form from "react-bootstrap/Form";
import groups from "../utils/constant";

const ProductItem = (props) => {
  const { onItemizedItemEdit, currency, onProductDel, products, onProductAdd, addToItem } = props;

  const itemTable = products.map((product, index) => (
    <ItemRow
      key={product?.itemId}
      item={product}
      onDelEvent={onProductDel}
      onItemizedItemEdit={onItemizedItemEdit}
      currency={currency}
      addToItem={addToItem}
      isLastProd={index === products.length - 1}
    />
  ));

  return (
    <div className="pb-5">
      <Table>
        <thead>
          <tr>
            <th>Products</th>
            <th>QTY</th>
            <th>PRICE/RATE</th>
            <th className="text-center">ACTION</th>
          </tr>
        </thead>
        <tbody>{itemTable}</tbody>
      </Table>
      <Button className="fw-bold" onClick={onProductAdd}>
        Add Product
      </Button>
    </div>
  );
};

const ItemRow = ({ item, onDelEvent, addToItem, isLastProd, onItemizedItemEdit, currency }) => {
  const handleDelete = () => {
    onDelEvent(item?.itemId);
  };

  const handleAddToItem = () => {
    addToItem(item)
  }

  const handleEdit = (evt) => {
    onItemizedItemEdit(evt, item?.itemId)
  }

  return (
    <tr>
      <td style={{ width: "100%" }}>
        <EditableField
          onItemizedItemEdit={handleEdit}
          cellData={{
            type: "text",
            name: "itemName",
            placeholder: "Item name",
            value: item?.itemName,
            id: item?.itemId,
          }}
        />
        <EditableField
          onItemizedItemEdit={handleEdit}
          cellData={{
            type: "text",
            name: "itemDescription",
            placeholder: "Item description",
            value: item?.itemDescription,
            id: item?.itemId,
          }}
        />
        <Form.Group className="">
          <Form.Label className="fw-bold">Choose Group: </Form.Label>
          <Form.Select
            name="itemGroup"
            onChange={handleEdit}
            value={item?.itemGroup}
            className="btn btn-light my-1 py-1"
            aria-label="Change Group"
          >
            {groups.map((group, index) => {
              return (
                <option key={index} value={group}>
                  {group}
                </option>
              );
            })}
          </Form.Select>
        </Form.Group>
      </td>
      <td style={{ minWidth: "70px" }}>
        <EditableField
          onItemizedItemEdit={handleEdit}
          cellData={{
            type: "number",
            name: "itemQuantity",
            min: 1,
            step: "1",
            value: item?.itemQuantity,
            id: item?.itemId,
          }}
        />
      </td>
      <td style={{ minWidth: "130px" }}>
        <EditableField
          onItemizedItemEdit={handleEdit}
          cellData={{
            leading: currency,
            type: "number",
            name: "itemPrice",
            min: 1,
            step: "0.01",
            presicion: 2,
            textAlign: "text-end",
            value: item?.itemPrice,
            id: item?.itemId,
          }}
        />
      </td>
      <td className="text-center" style={{ minWidth: "50px" }}>
        <BiTrash
          onClick={handleDelete}
          style={{ height: "33px", width: "33px", padding: "7.5px" }}
          className="text-white mt-1 btn btn-danger"
        />
        {!isLastProd && (
          <td className="text-center" style={{ minWidth: "50px" }}>
            <MdAddToQueue
              onClick={handleAddToItem}
              style={{ height: "33px", width: "33px", padding: "7.5px" }}
              className="mt-1 btn btn-success"
            />
          </td>
        )}
      </td>
    </tr>
  );
};

export default ProductItem;