create table if not exists warehouse_categories (
  id text primary key,
  name text not null,
  description text not null default ''
);

create table if not exists warehouse_materials (
  id text primary key,
  sku text not null,
  name text not null,
  category_id text not null references warehouse_categories(id),
  unit text not null,
  min_stock numeric not null default 0,
  location text not null default '',
  note text not null default '',
  last_unit_price numeric not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists warehouse_receipts (
  id text primary key,
  code text not null,
  date date not null,
  supplier text not null default '',
  warehouse text not null default '',
  note text not null default '',
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  posted_at timestamptz
);

create table if not exists warehouse_receipt_lines (
  id text primary key,
  receipt_id text not null references warehouse_receipts(id) on delete cascade,
  material_id text not null references warehouse_materials(id),
  quantity numeric not null,
  unit_price numeric not null
);

create table if not exists warehouse_movements (
  id text primary key,
  material_id text not null references warehouse_materials(id),
  type text not null,
  quantity numeric not null,
  unit_price numeric not null,
  receipt_id text references warehouse_receipts(id),
  note text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists warehouse_materials_category_idx on warehouse_materials(category_id);
create index if not exists warehouse_movements_material_idx on warehouse_movements(material_id);
create index if not exists warehouse_receipt_lines_receipt_idx on warehouse_receipt_lines(receipt_id);