create table if not exists warehouse_warehouses (
  id text primary key,
  name text not null unique,
  address text not null default '',
  created_at timestamptz not null default now()
);

insert into warehouse_warehouses (id, name)
values
  ('wh_chinh', 'Kho chính — Nhà xưởng A'),
  ('wh_phu', 'Kho phụ — Bãi A'),
  ('wh_congtrinh', 'Kho công trình — Block B')
on conflict (name) do nothing;