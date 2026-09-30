-- Allow deleting an empty warehouse without destroying historical records.
-- Historical receipts/movements keep their rows and simply lose the warehouse link.
alter table warehouse_receipts
  alter column warehouse_id drop not null;

alter table warehouse_movements
  alter column warehouse_id drop not null;

alter table warehouse_receipts
  drop constraint if exists warehouse_receipts_warehouse_id_fkey;

alter table warehouse_movements
  drop constraint if exists warehouse_movements_warehouse_id_fkey;

alter table warehouse_receipts
  add constraint warehouse_receipts_warehouse_id_fkey
  foreign key (warehouse_id) references warehouse_warehouses(id)
  on delete set null;

alter table warehouse_movements
  add constraint warehouse_movements_warehouse_id_fkey
  foreign key (warehouse_id) references warehouse_warehouses(id)
  on delete set null;
