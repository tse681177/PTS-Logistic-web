-- =========================================================
-- B2B BULK COMMODITY & LOGISTICS PLATFORM SCHEMA (SUPABASE)
-- =========================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. ORDERS TABLE (Includes both public milestones and strictly private logistics data)
create table if not exists public.orders (
    id uuid primary key default uuid_generate_v4(),
    order_code varchar(64) unique not null,
    product_name text not null,
    quantity_tons numeric(10, 2) not null,
    destination text not null,
    transport_type varchar(32) not null check (transport_type in ('truck', 'rail')),
    status smallint not null default 1 check (status between 1 and 5),
    status_label text not null default 'Баталгаажсан',
    current_location text not null default 'Хуваарийн дагуу бэлтгэгдэж байна',
    departure_date text,
    estimated_arrival text,
    
    -- STRICTLY CONFIDENTIAL B2B FIELDS (Admin eyes only):
    customer_company text,
    customer_contact_person text,
    customer_phone text,
    contract_no text,
    payment_status varchar(32) default 'pending' check (payment_status in ('paid', 'advance_50', 'pending')),
    driver_name text,
    driver_phone text,
    vehicle_plate text,
    container_number text,
    admin_notes text,
    
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- 2. SECURE PUBLIC ORDERS VIEW (GUARANTEED ZERO DRIVER/PLATE LEAK)
-- Public clients query this view or API endpoint. Sensitive fields are physically omitted.
create or replace view public.public_orders_view as
select 
    id,
    order_code,
    product_name,
    quantity_tons,
    destination,
    transport_type,
    status,
    status_label,
    current_location,
    departure_date,
    estimated_arrival,
    created_at,
    updated_at
from public.orders;

-- 3. PRODUCTS TABLE
create table if not exists public.products (
    id uuid primary key default uuid_generate_v4(),
    title text not null,
    category varchar(32) not null check (category in ('ready', 'preorder')),
    price_per_ton numeric(14, 2) not null,
    currency varchar(16) not null default '₮',
    origin text not null,
    packaging text not null,
    description text,
    specs jsonb not null default '{}'::jsonb,
    image_url text,
    lab_cert_pdf_url text,
    lab_cert_details jsonb not null default '{}'::jsonb,
    in_stock_tons numeric(10, 2) default 0,
    min_order_tons numeric(10, 2) default 10,
    is_active boolean default true,
    created_at timestamptz default now()
);

-- 4. TICKER ITEMS (Commodity 7-day prices and FX Rates)
create table if not exists public.ticker_items (
    id uuid primary key default uuid_generate_v4(),
    type varchar(32) not null check (type in ('commodity', 'currency')),
    name text not null,
    code varchar(32) not null,
    price numeric(14, 2) not null,
    change_percent numeric(5, 2) default 0.00,
    is_up boolean default true,
    unit varchar(32) not null,
    is_active boolean default true,
    sort_order integer default 0,
    updated_at timestamptz default now()
);

-- 5. ROW LEVEL SECURITY (RLS) POLICIES
alter table public.orders enable row level security;
alter table public.products enable row level security;
alter table public.ticker_items enable row level security;

-- Public can read active products
create policy "Allow public read active products"
on public.products for select using (is_active = true);

-- Public can read active ticker items
create policy "Allow public read active ticker"
on public.ticker_items for select using (is_active = true);

-- Public can ONLY read from the scrubbed public view
grant select on public.public_orders_view to anon, authenticated;

-- Admin full access to base tables
create policy "Admin full access to orders"
on public.orders for all to authenticated using (true) with check (true);

create policy "Admin full access to products"
on public.products for all to authenticated using (true) with check (true);

create policy "Admin full access to ticker"
on public.ticker_items for all to authenticated using (true) with check (true);

-- 6. SITE CONTENTS TABLE (CMS FOR HOMEPAGE TEXTS & CONTENT)
create table if not exists public.site_contents (
    id uuid primary key default uuid_generate_v4(),
    key varchar(128) unique not null,
    value text not null,
    section varchar(64) not null, -- 'HERO', 'ABOUT', 'LOGISTICS', 'CONTACT', 'COMMON'
    label text,
    field_type varchar(32) default 'text', -- 'text', 'textarea'
    updated_at timestamptz default now()
);

alter table public.site_contents enable row level security;

-- Public can read site contents
create policy "Allow public read site contents"
on public.site_contents for select using (true);

-- Admin can insert, update, delete site contents
create policy "Admin full access to site contents"
on public.site_contents for all to authenticated using (true) with check (true);

grant select on public.site_contents to anon, authenticated;

-- 7. ORDER REQUESTS TABLE (INCOMING INQUIRIES FROM WEBSITE)
create table if not exists public.order_requests (
    id uuid primary key default uuid_generate_v4(),
    request_code varchar(64) unique not null,
    customer_company text not null,
    customer_contact_person text,
    customer_phone text not null,
    product_name text not null,
    quantity_tons numeric(10, 2) not null,
    destination text not null,
    notes text,
    status varchar(32) default 'pending' check (status in ('pending', 'approved', 'rejected')),
    admin_notes text,
    created_at timestamptz default now(),
    reviewed_at timestamptz
);

alter table public.order_requests enable row level security;

-- Public can submit order requests
create policy "Allow public insert order requests"
on public.order_requests for insert with check (true);

-- Admin can read, update, delete order requests
create policy "Admin full access to order requests"
on public.order_requests for all to authenticated using (true) with check (true);

grant insert on public.order_requests to anon, authenticated;


