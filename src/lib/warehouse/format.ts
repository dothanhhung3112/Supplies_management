import { format, parseISO } from "date-fns";
import { vi } from "date-fns/locale";

export function formatVnd(value: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 2 }).format(value);
}

export function formatQty(value: number, unit?: string) {
  const n = formatNumber(value);
  return unit ? `${n} ${unit}` : n;
}

function toDate(iso: string) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(iso)) return parseISO(`${iso}T12:00:00`);
  return parseISO(iso);
}

export function formatDate(iso: string) {
  try {
    return format(toDate(iso), "dd/MM/yyyy", { locale: vi });
  } catch {
    return iso;
  }
}

export function formatDateTime(iso: string) {
  try {
    return format(toDate(iso), "dd/MM/yyyy HH:mm", { locale: vi });
  } catch {
    return iso;
  }
}

export function formatMonth(iso: string) {
  try {
    return format(toDate(iso), "MMM yyyy", { locale: vi });
  } catch {
    return iso;
  }
}

export function todayIsoDate() {
  return format(new Date(), "yyyy-MM-dd");
}
