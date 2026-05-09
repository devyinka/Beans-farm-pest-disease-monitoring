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
  isLoading = false,
}: SoilLineChartProps) => {
  // Color set is driven by live AI status (healthy/disease/pest).
  const colors = getChartColorScheme(status);
  const surface = getSurfaceScheme(status);

  // Build numeric timestamps for precise time-axis rendering.
  const chartData = data.map((point) => ({
    ...point,
    timeMs: new Date(point.timeStamp).getTime(),
  }));
  // Alert markers help show when the backend flagged this reading.
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
        className={`rounded-2xl border ${surface.border} ${surface.cardBg} p-4 shadow-[0_10px_28px_rgba(0,0,0,0.08)]`}
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

        <div className="h-72 w-full">
          {isLoading && data.length === 0 ? (
            <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-[#c7ced8] bg-white/60 px-4 text-center">
              <div>
                <p className="text-sm font-semibold text-[#465163]">
                  Loading 24-hour history...
                </p>
                <p className="mt-1 text-xs text-[#6a7586]">
                  Fetching MongoDB readings before live updates continue.
                </p>
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 24, right: 8, left: 0, bottom: 4 }}
              >
                <defs>
                  <linearGradient id="soilFill" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={colors.area1}
                      stopOpacity={0.28}
                    />
                    <stop
                      offset="95%"
                      stopColor={colors.area1}
                      stopOpacity={0.03}
                    />
                  </linearGradient>
                </defs>
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
                  domain={["auto", "auto"]}
                  tick={{ fill: colors.axis1, fontSize: 10 }}
                  label={{ value: "%", angle: -90, position: "insideLeft" }}
                />
                <Tooltip
                  labelFormatter={tooltipLabel}
                  formatter={tooltipValue}
                  contentStyle={{ borderRadius: 16, borderColor: "#d5dccd" }}
                />

                <Legend verticalAlign="top" height={24} />

                {/* Soil moisture and pH are drawn on separate axes so the scales do not fight each other. */}
                <Area
                  yAxisId="left"
                  type="natural"
                  dataKey="soil"
                  name="Soil Moisture"
                  fill="url(#soilFill)"
                  stroke="none"
                />

                <Line
                  yAxisId="left"
                  type="natural"
                  dataKey="soil"
                  name="Soil Moisture"
                  stroke={colors.line1}
                  strokeWidth={3}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  dot={false}
                  activeDot={{ r: 4 }}
                />

                {alertPoints.map((point, index) => (
                  <ReferenceDot
                    key={`alert-dot-${index}`}
                    x={point.timeMs}
                    yAxisId="left"
                    y={point.soil}
                    r={4}
                    fill="#f97316"
                    stroke="#ffffff"
                    strokeWidth={1.5}
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </section>
  );
};

export default SoilLineChart;
