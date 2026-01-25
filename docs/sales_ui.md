Here’s a high-level plan for implementing the /sales/\* application, strictly following your requirements and backend API contracts:

1. Sales Layout (/sales)
   Minimal, mobile-first layout.
   Navigation: POS, Orders, Logout.
   Use big buttons, large fonts.
   Role-based access: Only SALES (and ADMIN if allowed) can access.
2. POS Screen (/sales)
   Product Search Panel
   Fetch variants via lib/api/variants (with search/filter by SKU, name, category).
   Display as cards: Name, Size/Color, Price, Stock.
   Variants list is cached for fast access; re-fetch after order completion.
   Cart Panel
   Add variants to cart.
   Quantity selector (max = available stock).
   Show subtotal per line.
   Remove item from cart.
   Prevent quantity > stock in UI.
   Checkout Panel
   Inputs: Order type, payment method, customer name/phone, delivery address (if phone order).
   On submit: Call lib/api/orders (POST), passing items, order type, payment, and customer info.
   Backend recalculates totals; frontend never trusts itself.
   On success: Show invoice, print option, clear cart, re-fetch variants.
3. Sales Orders Page (/sales/orders)
   Fetch orders for current user via lib/api/orders (filtered by user if needed).
   Table: Invoice, Date, Total.
   Actions: View invoice, reprint invoice.
4. Invoice View (/orders/:id)
   Shared for ADMIN & SALES.
   Fetch order details via lib/api/orders/:id.
   Show: Store name, invoice number, date, items (name, qty, unit price, line total), grand total, payment method.
   Actions: Print, download PDF (optional).
5. UI Behavior & Performance
   Show live stock from variants.
   Deduct stock only after successful order.
   Hide forbidden actions based on role.
   Use SWR or similar for caching and revalidation.
   All API calls via lib/api/\*, never direct fetch.
6. Component Organization
   layout: Sales layout, navigation.
   components/pos/: Product search, cart, checkout.
   components/tables/: Orders table.
   components/invoices/: Invoice view/print.
   app/sales/: POS and orders pages.
   Next Steps:

Scaffold the /sales layout and navigation.
Implement the POS screen with product search, cart, and checkout.
Build the sales orders page.
Implement the shared invoice view.
Let me know if you want to start with the POS screen or another section!
