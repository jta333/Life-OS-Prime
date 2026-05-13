"use client";

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface Point {
  date: string;
  energy: number;
  productivity: number;
}

export function EnergyCurve({ data }: { data: Point[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 10, right: 8, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="energyG" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--cyan)" stopOpacity={0.5} />
            <stop offset="100%" stopColor="var(--cyan)" stopOpacity={0.02} />
          </linearGradient>
          <linearGradient id="prodG" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--gold)" stopOpacity={0.45} />
            <stop offset="100%" stopColor="var(--gold)" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="date"
          stroke="var(--muted-foreground)"
          fontSize={10}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          domain={[0, 100]}
          stroke="var(--muted-foreground)"
          fontSize={10}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          contentStyle={{
            background: "var(--popover)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            fontSize: 12,
          }}
          labelStyle={{ color: "var(--muted-foreground)" }}
        />
        <Area
          type="monotone"
          dataKey="productivity"
          stroke="var(--gold)"
          strokeWidth={2}
          fill="url(#prodG)"
        />
        <Area
          type="monotone"
          dataKey="energy"
          stroke="var(--cyan)"
          strokeWidth={2}
          fill="url(#energyG)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
