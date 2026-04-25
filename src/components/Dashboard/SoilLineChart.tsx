"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Line,
  ReferenceDot,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { SoilLineChartProps, ChartColorScheme } from "@/types/type";

const HOUR_MS = 60 * 60 * 1000;

const formatTime = (value: string | number) => {
  const date = new Date(value);
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const tooltipLabel = (label: unknown) => formatTime(String(label ?? ""));

const tooltipValue = (value: unknown, name: unknown) => {
  const numericValue = typeof value === "number" ? value : Number(value ?? 0);
  const seriesName = String(name ?? "");
  if (seriesName === "Soil Moisture")
    return [`${numericValue.toFixed(1)} %`, seriesName] as [string, string];
  return [`${numericValue.toFixed(2)} pH`, seriesName] as [string, string];
};

const getChartColorScheme = (
  status: "healthy" | "disease" | "pest",
): ChartColorScheme => {
  const schemes: Record<string, ChartColorScheme> = {
    healthy: {
      line1: "#2f7f3a",
      line2: "#3f9a4e",
      area1: "#2f7f3a",
      area2: "#3f9a4e",
      axis1: "#2f7f3a",
      axis2: "#3f9a4e",
      grid: "#dbe2d3",
      tick: "#889481",
    },
    disease: {
      line1: "#4f98ff",
      line2: "#2f5fb5",
      area1: "#4f98ff",
      area2: "#2f5fb5",
      axis1: "#4f98ff",
      axis2: "#2f5fb5",
      grid: "#c7d3eb",
      tick: "#2d55d7",
    },
    pest: {
      line1: "#f59e0b",
      line2: "#ea580c",
      area1: "#f59e0b",
      area2: "#ea580c",
      axis1: "#f59e0b",
      axis2: "#ea580c",
      grid: "#fed7aa",
      tick: "#92400e",
    },
  };
  return schemes[status] || schemes.healthy;
};

const getSurfaceScheme = (status: "healthy" | "disease" | "pest") => {
  if (status === "disease") {
    return {
      sectionBg: "bg-[#e9edf6]",
      cardBg: "bg-[#f4f7fc]",
      border: "border-[#c4d3f0]",
      title: "text-[#0f244a]",
      live: "bg-[#d7e6ff] text-[#2456a8]",
      offline: "bg-[#f5dfdf] text-[#9b2f2f]",
    };
  }

  if (status === "pest") {
    return {
      sectionBg: "bg-[#f3ece3]",
      cardBg: "bg-[#faf5ef]",
      border: "border-[#e5cfb6]",
      title: "text-[#4a260b]",
      live: "bg-[#fde8cf] text-[#a75719]",
      offline: "bg-[#f5dfdf] text-[#9b2f2f]",
    };
  }

  return {
    sectionBg: "bg-[#edf1e8]",
    cardBg: "bg-[#f4f7ef]",
    border: "border-[#d5dccd]",
    title: "text-[#101b15]",
    live: "bg-[#d7f0dc] text-[#1c6d2f]",
    offline: "bg-[#f5dfdf] text-[#9b2f2f]",
  };
};

export const SoilLineChart = ({
  data,
  isConnected,
  status,
  dataSourceLabel,
}: SoilLineChartProps) => {
  // Color set is driven by live AI status (healthy/disease/pest).
  const colors = getChartColorScheme(status);
  const surface = getSurfaceScheme(status);

  // Build numeric timestamps for precise time-axis rendering.
  const chartData = data.map((point) => ({
    ...point,
    timeMs: new Date(point.time).getTime(),
  }));
  const alertPoints = chartData.filter((point) => point.alert);

  // Force X-axis to exactly last 24 hours ending at latest data point.
  const latestTimeMs =
    chartData.length > 0
      ? Math.max(...chartData.map((point) => point.timeMs))
      : Date.now();
  const axisStartMs = latestTimeMs - 24 * HOUR_MS;
  const axisTicks = Array.from(
    { length: 13 },
    (_, index) => axisStartMs + index * 2 * HOUR_MS,
  );

  return (
    <section className={`${surface.sectionBg} px-4 pb-4 pt-4 sm:px-6`}>
      <div
        className={`rounded-xl border ${surface.border} ${surface.cardBg} p-4 shadow-[0_2px_8px_rgba(0,0,0,0.06)]`}
      >
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3 pb-3">
          <h3 className={`text-sm font-bold ${surface.title}`}>
            Soil Moisture & pH — last 24 hrs
          </h3>

          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-bold tracking-[0.08em] ${
              isConnected ? surface.live : surface.offline
            }`}
          >
            {isConnected ? "LIVE" : "OFFLINE"}
          </span>

          <span className="rounded-full bg-[#e8ebf0] px-2 py-0.5 text-[10px] font-bold tracking-[0.08em] text-[#4a5568]">
            {dataSourceLabel}
          </span>
        </div>

        {/* {data.length === 0 ? (
          <div className="flex h-72.5 w-full items-center justify-center rounded-lg border border-dashed border-[#c7ced8] bg-white/60">
            <p className="text-sm font-medium text-[#5b6678]">
              Waiting for backend chart points (Socket.IO farmupdate)...
            </p>
          </div>
        ) : ( */}
        <div className="h-72.5 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 12, right: 20, left: 5, bottom: 8 }}
            >
              <CartesianGrid stroke={colors.grid} strokeDasharray="3 3" />
              <XAxis
                type="number"
                dataKey="timeMs"
                domain={[axisStartMs, latestTimeMs]}
                ticks={axisTicks}
                tickFormatter={formatTime}
                label={{
                  value: "Time (last 24h)",
                  position: "insideBottomRight",
                  offset: -5,
                }}
                tick={{ fill: colors.tick, fontSize: 10 }}
              />
              <YAxis
                yAxisId="left"
                domain={[0, 100]}
                tick={{ fill: colors.axis1, fontSize: 10 }}
                label={{ value: "%", angle: -90, position: "insideLeft" }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                domain={[0, 14]}
                tick={{ fill: colors.axis2, fontSize: 10 }}
                label={{ value: "pH", angle: 90, position: "insideRight" }}
              />
              <Tooltip
                labelFormatter={tooltipLabel}
                formatter={tooltipValue}
                contentStyle={{ borderRadius: 10, borderColor: "#d5dccd" }}
              />

              <Legend />

              <Area
                yAxisId="left"
                type="natural"
                dataKey="soil"
                name="Soil Moisture"
                fill={colors.area1}
                fillOpacity={0.06}
                stroke="none"
              />

              <Line
                yAxisId="left"
                type="natural"
                dataKey="soil"
                name="Soil Moisture"
                stroke={colors.line1}
                strokeWidth={2.4}
                dot={false}
                activeDot={{ r: 4 }}
              />

              <Area
                yAxisId="right"
                type="natural"
                dataKey="ph"
                name="pH"
                fill={colors.area2}
                fillOpacity={0.06}
                stroke="none"
              />

              <Line
                yAxisId="right"
                type="natural"
                dataKey="ph"
                name="pH"
                stroke={colors.line2}
                strokeWidth={2.4}
                dot={false}
                activeDot={{ r: 4 }}
              />

              {alertPoints.map((point, index) => (
                <ReferenceDot
                  key={`alert-dot-${index}`}
                  x={point.timeMs}
                  yAxisId="right"
                  y={point.ph}
                  r={4}
                  fill="#f97316"
                  stroke="#ffffff"
                  strokeWidth={1.5}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
};

export default SoilLineChart;
