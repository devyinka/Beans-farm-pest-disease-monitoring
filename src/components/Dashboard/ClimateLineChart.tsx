"use client";

import { useMemo } from "react";
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
import type { ClimateLineChartProps, ChartColorScheme } from "@/types/type";

// const HOUR_MS = 60 * 60 * 1000;

const formatTime = (value: string | number) => {
  const date = new Date(Number(value));
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const cleanPayload = payload.filter((entry: any) =>
      ["Temperature", "Humidity", "Soil Moisture"].includes(entry.name),
    );

    return (
      <div className="rounded-xl border border-[#d5dccd] bg-white/95 p-3 shadow-[0_4px_12px_rgba(0,0,0,0.1)] backdrop-blur-sm">
        <p className="mb-2 border-b border-gray-100 pb-1 text-xs font-semibold text-gray-500">
          {formatTime(label)}
        </p>

        {/* We map over 'cleanPayload' instead of the raw 'payload' */}
        {cleanPayload.map((entry: any, index: number) => (
          <div
            key={`tooltip-item-${index}`}
            className="flex items-center justify-between gap-4 py-0.5 text-sm font-bold"
            style={{ color: entry.color }}
          >
            <span>{entry.name}:</span>
            <span>
              {entry.value?.toFixed(0)}{" "}
              {entry.name === "Temperature" ? "°C" : "%"}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const getChartColorScheme = (
  status: "healthy" | "disease" | "pest",
): ChartColorScheme => {
  const schemes: Record<string, ChartColorScheme> = {
    healthy: {
      line1: "#2f7f3a",
      line2: "#3f9a4e",
      line3: "#66a064",
      area1: "#2f7f3a",
      area2: "#3f9a4e",
      area3: "#66a064",
      axis1: "#2f7f3a",
      axis2: "#3f9a4e",
      grid: "#dbe2d3",
      tick: "#889481",
    },
    disease: {
      line1: "#4f98ff",
      line2: "#2f5fb5",
      line3: "#73a5ff",
      area1: "#4f98ff",
      area2: "#2f5fb5",
      area3: "#73a5ff",
      axis1: "#4f98ff",
      axis2: "#2f5fb5",
      grid: "#c7d3eb",
      tick: "#2d55d7",
    },
    pest: {
      line1: "#f59e0b",
      line2: "#ea580c",
      line3: "#f5b74b",
      area1: "#f59e0b",
      area2: "#ea580c",
      area3: "#f5b74b",
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

export const ClimateLineChart = ({
  data,
  isConnected,
  status,
  dataSourceLabel,
  isLoading = false,
}: ClimateLineChartProps) => {
  const colors = getChartColorScheme(status);
  const surface = getSurfaceScheme(status);

  const chartData = useMemo(() => {
    // Use a fixed fallback timestamp instead of Date.now() to ensure consistency
    // This prevents hydration mismatches between server and client renders
    const fallbackTime = 0;
    
    return data
      .map((point) => {
        const rawDate = point.timeStamp;
        return {
          ...point,
          timeMs: rawDate ? new Date(rawDate).getTime() : fallbackTime,
        };
      })
      .sort((a, b) => a.timeMs - b.timeMs)
      .filter((point) => !isNaN(point.timeMs));
  }, [data]);

  const alertPoints = chartData.filter((point) => point.alert);

  return (
    <section className={`${surface.sectionBg} px-4 pb-4 pt-4 sm:px-6`}>
      <div
        className={`rounded-2xl border ${surface.border} ${surface.cardBg} p-4 shadow-[0_10px_28px_rgba(0,0,0,0.08)]`}
      >
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h3 className={`text-sm font-bold ${surface.title}`}>
            Environment (Temperature, Humidity, Soil)
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

        <div className="h-96 w-full sm:h-105">
          {isLoading && data.length === 0 ? (
            <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-[#c7ced8] bg-white/60 px-4 text-center">
              <div>
                <p className="text-sm font-semibold text-[#465163]">
                  Loading history...
                </p>
                <p className="mt-1 text-xs text-[#6a7586]">
                  Fetching database readings before live updates continue.
                </p>
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 24, right: 8, left: -16, bottom: 4 }}
              >
                <defs>
                  <linearGradient id="tempFill" x1="0" y1="0" x2="0" y2="1">
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
                  <linearGradient id="humFill" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={colors.area2}
                      stopOpacity={0.28}
                    />
                    <stop
                      offset="95%"
                      stopColor={colors.area2}
                      stopOpacity={0.03}
                    />
                  </linearGradient>
                  <linearGradient id="soilFill" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={colors.area3}
                      stopOpacity={0.28}
                    />
                    <stop
                      offset="95%"
                      stopColor={colors.area3}
                      stopOpacity={0.03}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={colors.grid} strokeDasharray="3 3" />

                <XAxis
                  type="number"
                  dataKey="timeMs"
                  domain={["dataMin", "dataMax"]}
                  tickFormatter={formatTime}
                  minTickGap={30}
                  tick={{ fill: colors.tick, fontSize: 10 }}
                />

                {/* Single, clean Y-Axis for everything */}
                <YAxis
                  domain={["auto", "auto"]}
                  tick={{ fill: colors.axis1, fontSize: 10 }}
                />

                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ stroke: colors.grid, strokeWidth: 2 }}
                />

                <Legend verticalAlign="top" height={24} iconType="circle" />

                <Area
                  type="monotone"
                  dataKey="temp"
                  fill="url(#tempFill)"
                  stroke="none"
                  legendType="none"
                  tooltipType="none"
                />
                <Line
                  type="monotone"
                  dataKey="temp"
                  name="Temperature"
                  stroke={colors.line1}
                  strokeWidth={1.5}
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 0 }}
                />

                <Area
                  type="monotone"
                  dataKey="hum"
                  fill="url(#humFill)"
                  stroke="none"
                  legendType="none"
                  tooltipType="none"
                />
                <Line
                  type="monotone"
                  dataKey="hum"
                  name="Humidity"
                  stroke={colors.line2}
                  strokeWidth={1.5}
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 0 }}
                />

                <Area
                  type="monotone"
                  dataKey="soil"
                  fill="url(#soilFill)"
                  stroke="none"
                  legendType="none"
                  tooltipType="none"
                />
                <Line
                  type="monotone"
                  dataKey="soil"
                  name="Soil Moisture"
                  stroke={colors.line3}
                  strokeWidth={1.5}
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 0 }}
                />

                {alertPoints.map((point, index) => (
                  <ReferenceDot
                    key={`alert-dot-${index}`}
                    x={point.timeMs}
                    y={point.hum}
                    r={5}
                    fill="#ef4444"
                    stroke="#ffffff"
                    strokeWidth={2}
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

export default ClimateLineChart;
