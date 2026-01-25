Good — this is the **right moment** to do this carefully.
Below is a **complete, deliberate endpoint map** for the Spicy Thrifts POS backend, written to **fit exactly** with the system prompt you just locked in.

This is not rushed. This is **exhaustive but controlled** (MVP-safe, no fantasy endpoints).

---

# 📡 SPICY THRIFTS POS — COMPLETE API ENDPOINT MAP

**(Backend-first, App Router, Service-driven)**

> All endpoints follow:
>
> - `Next.js App Router`
> - `withErrorHandling`
> - `requireAuth`
> - `requireRole`
> - `validate(ZodSchema)`
> - Class-based services
> - NO Supabase logic in routes

---

## 0️⃣ AUTH / SESSION (FOUNDATION)

> Auth uses Supabase Auth.
> These endpoints exist mainly to **hydrate role + profile**, not replace Supabase.

### 🔹 `GET /api/auth/me`

**Purpose**

- Get authenticated user + cached profile
- Used by frontend bootstrapping

**Access**

- Any authenticated user

**Response**

```ts
{
  id: string;
  email: string;
  role: "ADMIN" | "SALES";
  full_name: string;
}
```

**Schema**
❌ No input schema (no body)

---

### 🔹 `POST /api/auth/logout`

**Purpose**

- Logout user

❌ No schema

---

## 1️⃣ CATEGORIES (REFERENCE DATA)

### 🔹 `GET /api/categories`

**Purpose**

- List all product categories
- Used everywhere (admin, POS filters)

**Access**

- ADMIN, SALES

❌ No input schema

---

### 🔹 `POST /api/categories`

**Purpose**

- Create category

**Access**

- ADMIN only

#### Schema: `categories.schema.ts`

```ts
export const createCategorySchema = z.object({
  name: z.string().min(2),
  code: z.string().min(2).max(5),
});
```

---

### 🔹 `PATCH /api/categories/:id`

**Purpose**

- Update category name/code

**Schema**

```ts
export const updateCategorySchema = z.object({
  name: z.string().min(2).optional(),
  code: z.string().min(2).max(5).optional(),
});
```

---

## 2️⃣ PRODUCTS (DESIGN LEVEL)

> Products represent **designs**, not sellable stock.

### 🔹 `GET /api/products`

**Purpose**

- List products with category & images

**Access**

- ADMIN, SALES

❌ No input schema

---

### 🔹 `POST /api/products`

**Purpose**

- Create new product design

**Access**

- ADMIN

#### Schema: `products.schema.ts`

```ts
export const createProductSchema = z.object({
  name: z.string().min(2),
  category_id: z.string().uuid(),
  description: z.string().optional(),
  base_price: z.number().positive().optional(),
  is_unique: z.boolean(),
  images: z.array(z.string().url()).optional(),
});
```

---

### 🔹 `PATCH /api/products/:id`

**Purpose**

- Update product metadata (NOT stock)

```ts
export const updateProductSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().optional(),
  base_price: z.number().positive().optional(),
  images: z.array(z.string().url()).optional(),
});
```

---

### 🔹 `DELETE /api/products/:id`

**Purpose**

- Soft delete or restrict deletion if variants exist

❌ No body schema

---

## 3️⃣ PRODUCT VARIANTS (SELLABLE ITEMS)

> **This is the POS backbone.**

### 🔹 `GET /api/variants`

**Purpose**

- List variants (search, filter by SKU, category, size, color)

**Query params (optional)**

- `sku`
- `category_id`
- `size`
- `color`

❌ No body schema

---

### 🔹 `POST /api/variants`

**Purpose**

- Create a sellable variant

**Access**

- ADMIN

#### Schema: `variants.schema.ts`

```ts
export const createVariantSchema = z.object({
  product_id: z.string().uuid(),
  sku: z.string().min(3),
  size: z.string().optional(),
  primary_color: z.string().optional(),
  price: z.number().positive(),
  stock_quantity: z.number().int().min(0),
  attributes: z.record(z.any()).optional(),
});
```

> ⚠ Service MUST enforce:
>
> - SKU uniqueness
> - `is_unique → stock_quantity <= 1`

---

### 🔹 `PATCH /api/variants/:id`

**Purpose**

- Update price or stock

```ts
export const updateVariantSchema = z.object({
  price: z.number().positive().optional(),
  stock_quantity: z.number().int().min(0).optional(),
  attributes: z.record(z.any()).optional(),
});
```

---

## 4️⃣ ORDERS (INVOICES)

> **Most sensitive domain**
> Stock + money + receipts

### 🔹 `GET /api/orders`

**Purpose**

- List orders (admin view, reporting)

**Access**

- ADMIN

❌ No schema

---

### 🔹 `GET /api/orders/:id`

**Purpose**

- View single order (invoice page)

**Access**

- ADMIN, SALES

❌ No schema

---

### 🔹 `POST /api/orders`

**Purpose**

- Create order (POS checkout)

**Access**

- SALES, ADMIN

#### Schema: `orders.schema.ts`

```ts
export const createOrderSchema = z.object({
  order_type: z.enum(["IN_STORE", "PHONE_ORDER"]),
  payment_method: z.enum(["CASH", "MOMO", "TRANSFER"]),
  customer_name: z.string().optional(),
  customer_phone: z.string().optional(),
  delivery_address: z.string().optional(),
  items: z
    .array(
      z.object({
        product_variant_id: z.string().uuid(),
        quantity: z.number().int().min(1),
      }),
    )
    .min(1),
});
```

> 🚨 Service MUST:
>
> - Re-fetch variants
> - Validate stock
> - Calculate totals
> - Generate invoice number
> - Reduce stock atomically

---

## 5️⃣ PAYMENTS (OPTIONAL BUT CLEAN)

### 🔹 `POST /api/payments`

**Purpose**

- Record payment (if split or future support)

```ts
export const createPaymentSchema = z.object({
  order_id: z.string().uuid(),
  method: z.enum(["CASH", "MOMO", "TRANSFER"]),
  amount: z.number().positive(),
});
```

---

## 6️⃣ REPORTS (ADMIN)

### 🔹 `GET /api/reports/sales-summary`

**Purpose**

- Daily / weekly sales totals

**Query**

- `from`
- `to`

```ts
export const salesReportQuerySchema = z.object({
  from: z.string(),
  to: z.string(),
});
```

---

### 🔹 `GET /api/reports/low-stock`

**Purpose**

- Inventory alerting

❌ No schema

---

## 7️⃣ VALIDATION FILE INDEX (FOR AI)

```txt
core/validation/
  auth.schema.ts        (minimal, if needed)
  categories.schema.ts
  products.schema.ts
  variants.schema.ts
  orders.schema.ts
  payments.schema.ts
  reports.schema.ts
```

---

## 🧠 FINAL NOTES (VERY IMPORTANT)

- **Every endpoint listed here maps 1-to-1 to a service method**
- No endpoint should exist without a schema (except GETs)
- No service should exist without an endpoint (MVP scope)
- This list is **the contract**

If an AI:

- Adds extra endpoints → ❌
- Skips validation → ❌
- Touches Supabase in a route → ❌

---

### 🔜 Next best steps

1. Lock this as `ENDPOINTS.md`
2. Generate **service method signatures only** (no implementation yet)
3. Then implement **Auth → Categories → Products** in order

If you want, next I can:

- Generate **empty service classes with method stubs**
- Or generate **one full vertical slice (Categories) end-to-end** following the rules

Your call.
