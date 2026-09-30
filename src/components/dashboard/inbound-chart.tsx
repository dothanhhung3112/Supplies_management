import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatNumber, formatVnd } from "@/lib/warehouse/format";
import type { MonthlyInbound } from "@/lib/warehouse/types";

function monthLabel(key: string) {
  const [y, m] = key.split("-");
  const names = ["Th1", "Th2", "Th3", "Th4", "Th5", "Th6", "Th7", "Th8", "Th9", "Th10", "Th11", "Th12"];
  return `${names[Number(m) - 1] ?? m} ${y?.slice(2) ?? ""}`;
}

export function InboundChart({ data }: { data: MonthlyInbound[] }) {
  const chart = data.map((row) => ({ ...row, label: monthLabel(row.month) }));
  const max = Math.max(...chart.map((row) => row.value), 0);
  const unit = max >= 1_000_000 ? 1_000_000 : max >= 1_000 ? 1_000 : 1;
  const suffix = unit === 1_000_000 ? "tr" : unit === 1_000 ? "k" : "";

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chart} barCategoryGap="28%">
        <CartesianGrid stroke="var(--color-border)" vertical={false} />
        <XAxis dataKey="label" tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis
          tickFormatter={(v) => `${Math.round(Number(v) / unit)}${suffix}`}
          tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          width={44}
        />
        <Tooltip
          cursor={{ fill: "var(--color-secondary)" }}
          content={({ active, payload }) => {
            if (!active || !payload?.[0]) return null;
            const row = payload[0].payload as MonthlyInbound & { label: string };
            return (
              <div className="rounded-md border border-border bg-card px-3 py-2 text-sm shadow-card">
                <p className="font-medium">{row.label}</p>
                <p className="tabular-nums">{formatVnd(row.value)}</p>
                <p className="text-muted-foreground">{formatNumber(row.qty)} đơn vị nhập</p>
              </div>
            );
          }}
        />
        <Bar dataKey="value" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
