# Demo

https://github.com/sunnyRishu/swipe/assets/155797653/fb1a8fa3-3445-4838-867c-c57de586317e

# Assumptions

## Products
1. Products Data Structure:
   - Products are similar to items in terms of data structure.
   - Below is the comparison between the item and product data

 structures:
        
        ```
        Item:

        {
            itemId: 0,
            itemName: "",
            itemDescription: "",
            itemPrice: "1.00",
            itemQuantity: 1,
        }
        ```
        ```
        Product

        {
            itemId: 0,
            itemName: "",
            itemDescription: "",
            itemPrice: "1.00",
            itemQuantity: 1,
            itemGroup: "Labor",
        }
        ```

2. Products Tab:
   - The Products tab is required only when creating or editing invoices.

3. Product Selection:
   - Products are predefined by the system or created by users.
   - Users can choose products from the available list, similar to item deletion.
   - Selected products are added to the items section for final invoicing.

## Grouping
1. Inventory and Grouping:
   - There is an assumption of pre-defined inventory by the Swipe system or an entity for grouping identification.

2. Groups:
   - Groups are defined as constants, allowing for dynamic adaptation to modifications.
   - Initial groups defined are: "Labor" and "Materials".

3. Product Association:
   - Each product in the Products tab needs to be associated with one of the predefined groups.
   - This association helps in separating items while adding products to the items section.

4. Miscellaneous Items:
   - Items may not belong to any group.
   - In such cases, the software handles them as miscellaneous or ungrouped items.
