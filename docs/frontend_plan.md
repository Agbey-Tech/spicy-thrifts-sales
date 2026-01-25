Good — this is exactly the **right abstraction layer** to do now.
If you mess this up, the AI will hallucinate UI logic, mix roles, or bypass APIs.
If you do this **properly**, the AI can generate a clean, usable frontend later with minimal correction.

Below is a **SOLID FRONTEND UI / UX MASTER PLAN + AI GUIDANCE PROMPT** for **Spicy Thrifts POS**, strictly aligned with your backend contract and `lib/api` client interactors.

This is **not code**.
This is **UI law**.

---

# 🎨 SPICY THRIFTS POS — FRONTEND UI MASTER PLAN

**(Admin + Sales, Next.js App Router, PWA-ready)**

---

## 0️⃣ GLOBAL FRONTEND RULES (NON-NEGOTIABLE)

These rules apply to **every page** and **every component**.

### Architecture Rules

- Frontend uses **Next.js App Router**
- NO direct fetch calls in components
- ALL API calls go through `lib/api/*`
- NO mock data
- Auth state comes from `/api/auth/me`

### State Rules

- User profile (id, role, name) is fetched once on app load
- Role is cached in a global store (context or zustand)
- UI rendering is role-driven, NOT route-driven

### Error Handling

- All API errors are surfaced via:
  - Toasts for actions
  - Inline messages for forms

- Never silently fail

---

## 1️⃣ APP ENTRY & AUTH FLOW

### 🔹 `/login`

**Purpose**

- User authentication (Supabase Auth)

**Behavior**

- Email + password login
- On success:
  - Fetch `/api/auth/me`
  - Cache user profile
  - Redirect based on role:
    - ADMIN → `/admin`
    - SALES → `/sales`

🚫 No role switching on frontend
🚫 No UI without auth

---

## 2️⃣ ADMIN APPLICATION (`/admin/*`)

### 2.1 Admin Layout

**Global Layout**

- Left sidebar
- Top bar with:
  - User name
  - Role badge
  - Logout

**Sidebar Navigation**

- Dashboard
- Categories
- Products
- Variants
- Orders
- Reports

---

### 2.2 Admin Dashboard (`/admin`)

**Purpose**

- Business overview

**Must Show**

- Total products
- Total variants
- Today’s sales
- Low-stock count

**Behavior**

- Read-only metrics
- No CRUD here

---

### 2.3 Categories Page (`/admin/categories`)

**Purpose**

- Manage reference categories

**UI Requirements**

- Table: name, code
- Create category modal
- Edit category inline or modal

**Actions**

- Create
- Update

🚫 No delete if products exist (backend enforces)

---

### 2.4 Products Page (`/admin/products`)

**Purpose**

- Manage product designs

**UI Structure**

- Product list (card or table)
- Columns:
  - Name
  - Category
  - Active status
  - Variant count

**Actions**

- Create product
- Edit product
- Soft delete product

**Create / Edit Product Form**

- Name
- Category
- Description
- Images (upload or URL)
- Is Unique (boolean)

🚫 No stock input
🚫 No price per variant here

---

### 2.5 Product Detail Page (`/admin/products/:id`)

**Purpose**

- View product + manage variants

**Sections**

1. Product metadata (read/edit)
2. Variant list (table)

**Variant Table Columns**

- SKU
- Size
- Color
- Price
- Stock
- Active

**Actions**

- Create variant
- Edit variant
- Deactivate variant

---

### 2.6 Variants Page (`/admin/variants`)

**Purpose**

- Inventory-wide management

**UI**

- Filterable table:
  - SKU
  - Product
  - Category
  - Stock
  - Price

**Actions**

- Edit variant
- Deactivate variant

---

### 2.7 Orders Page (`/admin/orders`)

**Purpose**

- View all invoices

**UI**

- Orders table:
  - Invoice number
  - Date
  - Total
  - Payment method
  - Sales person

**Actions**

- View order
- Print invoice

🚫 No editing orders

---

### 2.8 Reports Page (`/admin/reports`)

**Purpose**

- Business insights

**Reports**

- Sales summary (date range)
- Low stock list

**UI**

- Date picker
- Tables / charts (optional)

---

## 3️⃣ SALES APPLICATION (`/sales/*`)

### 3.1 Sales Layout

**Layout**

- Minimal UI
- Optimized for mobile & tablet
- Big buttons, large fonts

**Navigation**

- POS
- Orders
- Logout

---

### 3.2 POS Screen (`/sales`)

**Purpose**

- Sell products & generate invoices

**UI Sections**

1. Product search
2. Cart
3. Checkout panel

---

#### Product Search Panel

- Search by:
  - SKU
  - Name

- Filter by category

Displays:

- Variant cards:
  - Name
  - Size / Color
  - Price
  - Available stock

---

#### Cart Panel

- List of selected variants
- Quantity selector
- Auto subtotal per line
- Remove item

🚫 Quantity > stock blocked in UI

---

#### Checkout Panel

**Inputs**

- Order type: In-store / Phone
- Payment method
- Customer name (optional)
- Customer phone (optional)
- Delivery address (if phone order)

**Actions**

- Submit order
- Print invoice

🚨 On submit:

- Call `/api/orders`
- Backend recalculates totals (frontend never trusts itself)

---

### 3.3 Sales Orders Page (`/sales/orders`)

**Purpose**

- View own orders

**UI**

- Table:
  - Invoice
  - Date
  - Total

**Actions**

- View invoice
- Reprint invoice

---

## 4️⃣ INVOICE VIEW (`/orders/:id`)

**Shared Page**

- Used by ADMIN & SALES

**Must Show**

- Store name
- Invoice number
- Date
- Items:
  - Name
  - Qty
  - Unit price
  - Line total

- Grand total
- Payment method

**Actions**

- Print
- Download PDF (optional)

---

## 5️⃣ UI BEHAVIOR RULES (IMPORTANT)

### Stock Handling

- UI shows live stock from variants
- Stock deducted only after successful order API response

### Permissions

- UI hides forbidden actions
- Backend still enforces roles

### Performance

- Variants list cached for POS
- Re-fetch on order completion

---

## 6️⃣ COMPONENT ORGANIZATION (GUIDELINE)

```txt
components/
  layout/
  tables/
  forms/
  modals/
  pos/
  invoices/

app/
  admin/
  sales/
  login/
```

---

## 7️⃣ AI FRONTEND GENERATION PROMPT (USE THIS)

You can literally paste this into your AI 👇

---

### 🧠 SYSTEM PROMPT — FRONTEND GENERATION

> You are building the frontend for **Spicy Thrifts POS**.
>
> You MUST:
>
> - Use Next.js App Router
> - Call APIs ONLY via `lib/api` client functions
> - Respect role-based UI behavior
> - Follow the provided backend endpoint contract exactly
>
> DO NOT:
>
> - Use mock data
> - Call Supabase directly
> - Bypass services
>
> Build:
>
> - Admin UI with product, variant, category, order management
> - Sales POS UI optimized for mobile
>
> The UI must:
>
> - Prevent invalid actions before submission
> - Show meaningful loading & error states
> - Match business workflows described in the documentation
>
> Any UI logic that violates backend constraints is incorrect.

---

## 🧠 FINAL WORD

This plan:

- Prevents AI hallucination
- Keeps roles clean
- Keeps POS fast
- Keeps admin powerful but safe

If you want next, I can:

- Turn this into **wireframe-level page specs**
- Or generate **one page at a time prompts** (POS first is usually best)
- Or review AI-generated UI against this plan and tear it apart 😈

Your move, Zigla City 🚀
