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

const ItemRow = (props) => {
  const onDelEvent = () => {
    props.onDelEvent(props?.item?.itemId);
  };

  const addToItem = () => {
    props.addToItem(props?.item)
  }

  //console.log(props?.item?.itemId, "props item id")
  return (
    <tr>
      <td style={{ width: "100%" }}>
        <EditableField
          onItemizedItemEdit={(evt) =>
            props.onItemizedItemEdit(evt, props?.item?.itemId)
          }
          cellData={{
            type: "text",
            name: "itemName",
            placeholder: "Item name",
            value: props?.item?.itemName,
            id: props?.item?.itemId,
          }}
        />
        <EditableField
          onItemizedItemEdit={(evt) =>
            props.onItemizedItemEdit(evt, props?.item?.itemId)
          }
          cellData={{
            type: "text",
            name: "itemDescription",
            placeholder: "Item description",
            value: props?.item?.itemDescription,
            id: props?.item?.itemId,
          }}
        />
        <Form.Group className="">
            <Form.Label className="fw-bold">Choose Group: </Form.Label>
            <Form.Select
              name="itemGroup"
              onChange={(evt) =>
                props.onItemizedItemEdit(evt, props?.item?.itemId)
              }
              value={props?.item?.itemGroup}
              className="btn btn-light my-1 py-1"
              aria-label="Change Group"
            >
              {
                groups.map((group, index) => {
                  return <option key={index} value={group}>{group}</option>
                })
              }
            </Form.Select>
          </Form.Group>
      </td>
      <td style={{ minWidth: "70px" }}>
        <EditableField
          onItemizedItemEdit={(evt) =>
            props.onItemizedItemEdit(evt, props?.item?.itemId)
          }
          cellData={{
            type: "number",
            name: "itemQuantity",
            min: 1,
            step: "1",
            value: props?.item?.itemQuantity,
            id: props?.item?.itemId,
          }}
        />
      </td>
      <td style={{ minWidth: "130px" }}>
        <EditableField
          onItemizedItemEdit={(evt) =>
            props.onItemizedItemEdit(evt, props?.item?.itemId)
          }
          cellData={{
            leading: props.currency,
            type: "number",
            name: "itemPrice",
            min: 1,
            step: "0.01",
            presicion: 2,
            textAlign: "text-end",
            value: props?.item?.itemPrice,
            id: props?.item?.itemId,
          }}
        />
      </td>
      <td className="text-center" style={{ minWidth: "50px" }}>
        <BiTrash
          onClick={onDelEvent}
          style={{ height: "33px", width: "33px", padding: "7.5px" }}
          className="text-white mt-1 btn btn-danger"
        />
        {
        !props.isLastProd && (
          <td className="text-center" style={{ minWidth: "50px" }}>
            <MdAddToQueue
              onClick={addToItem}
              style={{ height: "33px", width: "33px", padding: "7.5px" }}
              className="mt-1 btn btn-success"
            />
          </td>
        )
      }
      </td>
    </tr>
  );
};

export default ProductItem;