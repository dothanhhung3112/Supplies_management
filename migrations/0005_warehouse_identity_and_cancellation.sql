alter table warehouse_receipts
  add column if not exists warehouse_id text references warehouse_warehouses(id);

update warehouse_receipts as r
set warehouse_id = w.id
from warehouse_warehouses as w
where w.name = r.warehouse
  and r.warehouse_id is null;

alter table warehouse_receipts
  alter column warehouse_id set not null;

create index if not exists warehouse_receipts_warehouse_idx
  on warehouse_receipts(warehouse_id);

alter table warehouse_movements
  alter column warehouse_id set not null;

alter table warehouse_receipts
  drop column if exists warehouse;

alter table warehouse_receipts
  drop constraint if exists warehouse_receipts_status_check;

alter table warehouse_receipts
  add constraint warehouse_receipts_status_check
  check (status in ('draft', 'posted', 'cancelled'));

create index if not exists warehouse_movements_receipt_idx
  on warehouse_movements(receipt_id);
