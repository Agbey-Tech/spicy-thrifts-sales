-- =========================
-- ENUMS
-- =========================
create type user_role as enum ('ADMIN', 'SALES');
create type order_type as enum ('IN_STORE', 'PHONE_ORDER');
create type payment_method as enum ('CASH', 'MOMO', 'TRANSFER');
create type delivery_status as enum ('PENDING', 'DISPATCHED', 'DELIVERED');

-- =========================
-- PROFILES
-- =========================
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role user_role not null default 'SALES',
  created_at timestamptz default now()
);

-- =========================
-- CATEGORIES
-- =========================
create table categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  code text not null unique,
  created_at timestamptz default now()
);

-- =========================
-- PRODUCTS (DESIGN LEVEL)
-- =========================
create table products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references categories(id),
  name text not null,
  description text,
  base_price numeric(10,2),
  is_unique boolean default false,
  images text[],
  created_at timestamptz default now()
);

-- =========================
-- PRODUCT VARIANTS (SELLABLE)
-- =========================
create table product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade,
  sku text not null unique,
  size text,
  primary_color text,
  price numeric(10,2) not null,
  stock_quantity integer not null default 0,
  attributes jsonb,
  created_at timestamptz default now()
);

-- =========================
-- ORDERS
-- =========================
create table orders (
  id uuid primary key default gen_random_uuid(),
  invoice_number text not null unique,
  sales_person_id uuid references profiles(id),
  order_type order_type not null,
  payment_method payment_method not null,
  total_amount numeric(10,2) not null,
  delivery_status delivery_status,
  customer_name text,
  customer_phone text,
  delivery_address text,
  created_at timestamptz default now()
);

-- =========================
-- ORDER ITEMS
-- =========================
create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  product_variant_id uuid references product_variants(id),
  quantity integer not null,
  unit_price numeric(10,2) not null,
  subtotal numeric(10,2) not null
);

-- =========================
-- PAYMENTS
-- =========================
create table payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  method payment_method not null,
  amount numeric(10,2) not null,
  created_at timestamptz default now()
);

-- =========================
-- INDEXES
-- =========================
create index idx_variants_sku on product_variants(sku);
create index idx_products_category on products(category_id);
create index idx_orders_created on orders(created_at);
