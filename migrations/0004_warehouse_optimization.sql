create extension if not exists unaccent;

alter table warehouse_movements
  add column if not exists warehouse_id text references warehouse_warehouses(id);

update warehouse_movements as m
set warehouse_id = w.id
from warehouse_receipts as r
join warehouse_warehouses as w on w.name = r.warehouse
where m.receipt_id = r.id
  and m.warehouse_id is null;

create index if not exists warehouse_movements_created_at_idx
  on warehouse_movements(created_at desc);

create index if not exists warehouse_movements_warehouse_idx
  on warehouse_movements(warehouse_id);

create or replace view warehouse_stock as
select
  material_id,
  warehouse_id,
  sum(quantity) as qty
from warehouse_movements
group by material_id, warehouse_id;
