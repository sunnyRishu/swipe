import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import { BiTrash } from "react-icons/bi";
import EditableField from "./EditableField";

const InvoiceItem = ({ onItemizedItemEdit, currency, onRowDel, items, onRowAdd }) => {
  const [groupedItems, setGroupedItems] = useState({});

  useEffect(() => {
    const grouped = {};
    items.forEach((item) => {
      const group = item.itemGroup || "Miscellaneous";
      if (!grouped[group]) {
        grouped[group] = [];
      }
      grouped[group].push(item);
    });
    setGroupedItems(grouped);
  }, [items]);

  const handleDelete = (item) => {
    onRowDel(item);
  };

  return (
    <div>
      {Object.entries(groupedItems).map(([group, groupItems]) => (
        <div key={group}>
          <h6>{group}</h6>
          <Table>
            <thead>
              <tr>
                <th>ITEM</th>
                <th>QTY</th>
                <th>PRICE/RATE</th>
                <th className="text-center">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {groupItems.map((item) => (
                <ItemRow
                  key={item.itemId}
                  item={item}
                  onItemizedItemEdit={onItemizedItemEdit}
                  currency={currency}
                  onDelete={handleDelete}
                />
              ))}
            </tbody>
          </Table>
        </div>
      ))}
      <Button className="fw-bold" onClick={onRowAdd}>
        Add Item
      </Button>
    </div>
  );
};

const ItemRow = ({ item, onItemizedItemEdit, currency, onDelete }) => {
  const handleEdit = (evt) => {
    onItemizedItemEdit(evt, item.itemId);
  };

  const handleDelete = () => {
    onDelete(item);
  };

  return (
    <tr>
      <td style={{ width: "100%" }}>
        <EditableField
          onItemizedItemEdit={handleEdit}
          cellData={{
            type: "text",
            name: "itemName",
            placeholder: "Item name",
            value: item.itemName,
            id: item.itemId,
          }}
        />
        <EditableField
          onItemizedItemEdit={handleEdit}
          cellData={{
            type: "text",
            name: "itemDescription",
            placeholder: "Item description",
            value: item.itemDescription,
            id: item.itemId,
          }}
        />
      </td>
      <td style={{ minWidth: "70px" }}>
        <EditableField
          onItemizedItemEdit={handleEdit}
          cellData={{
            type: "number",
            name: "itemQuantity",
            min: 1,
            step: "1",
            value: item.itemQuantity,
            id: item.itemId,
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
            precision: 2,
            textAlign: "text-end",
            value: item.itemPrice,
            id: item.itemId,
          }}
        />
      </td>
      <td className="text-center" style={{ minWidth: "50px" }}>
        <BiTrash
          onClick={handleDelete}
          style={{ height: "33px", width: "33px", padding: "7.5px" }}
          className="text-white mt-1 btn btn-danger"
        />
      </td>
    </tr>
  );
};

export default InvoiceItem;
  