"use client";

import { useEffect, useMemo, useState } from "react";
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
      <div
        className="rounded-xl border border-white/20 bg-slate-950/80 p-3.5 shadow-xl backdrop-blur-md transition-all duration-300 min-w-37.5"
        style={{ boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)" }}
      >
        <p className="mb-2 border-b border-white/10 pb-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-white/40">
          {formatTime(label)}
        </p>

        <div className="space-y-1.5">
          {cleanPayload.map((entry: any, index: number) => (
            <div
              key={`tooltip-item-${index}`}
              className="flex items-center justify-between gap-4 text-xs font-semibold"
            >
              <span className="text-white/60 font-medium">{entry.name}:</span>
              <span
                style={{ color: entry.color }}
                className="font-mono font-bold text-sm"
              >
                {entry.value?.toFixed(1)}
                <span className="text-[10px] ml-0.5 opacity-80">
                  {entry.name === "Temperature" ? "°C" : "%"}
                </span>
              </span>
            </div>
          ))}
        </div>
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
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const chartData = useMemo(() => {
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
    <section
      className={`${surface.sectionBg} px-4 pb-5 pt-4 sm:px-6 transition-all duration-700 ease-in-out`}
    >
      <div
        className={`rounded-2xl border ${surface.border} ${surface.cardBg} p-5 md:p-6 shadow-[0_12px_30px_-5px_rgba(0,0,0,0.05),inset_0_1px_1px_rgba(255,255,255,0.6)] transition-all duration-700 relative overflow-hidden`}
      >
        {/* Top Header Deck Line */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-black/3">
          <h3
            className={`text-sm md:text-base font-black tracking-tight antialiased ${surface.title}`}
          >
            Environment Telemetry{" "}
            <span className="font-medium opacity-50 text-xs sm:text-sm block sm:inline sm:ml-1">
              (Temperature, Humidity, Soil)
            </span>
          </h3>

          <div className="flex items-center gap-2">
            <span
              className={`rounded-lg px-2.5 py-1 text-[10px] font-black tracking-[0.12em] border border-black/2 shadow-sm flex items-center gap-1.5 ${
                isConnected ? surface.live : surface.offline
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${isConnected ? "bg-current animate-pulse" : "bg-current"}`}
              />
              {isConnected ? "LIVE" : "OFFLINE"}
            </span>

            <span className="rounded-lg bg-white/60 border border-black/4 px-2.5 py-1 text-[10px] font-bold font-mono tracking-wider text-[#4a5568] shadow-sm">
              {dataSourceLabel}
            </span>
          </div>
        </div>

        {/* Responsive Visualization Matrix Core */}
        <div className="h-64 w-full sm:h-96 relative">
          {isLoading && data.length === 0 ? (
            <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-black/10 bg-white/40 px-4 text-center backdrop-blur-sm animate-fade-in">
              <div className="flex flex-col items-center">
                <div className="w-6 h-6 border-2 border-slate-400 border-t-transparent rounded-full animate-spin mb-3" />
                <p className="text-xs font-bold text-slate-700 tracking-wide uppercase font-mono">
                  Loading telemetry matrix...
                </p>
                <p className="mt-1 text-xs text-slate-400 max-w-xs leading-relaxed">
                  Fetching historical data streams before real-time syncing
                  starts.
                </p>
              </div>
            </div>
          ) : !isMounted ? (
            <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-black/10 bg-white/40 px-4 text-center backdrop-blur-sm">
              <div className="flex flex-col items-center">
                <div className="w-5 h-5 border-2 border-slate-300 border-t-transparent rounded-full animate-spin mb-3" />
                <p className="text-xs font-bold text-slate-600 tracking-wide uppercase font-mono">
                  Preparing layout...
                </p>
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 12, right: 8, left: -24, bottom: 4 }}
              >
                <defs>
                  <linearGradient id="tempFill" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={colors.area1}
                      stopOpacity={0.24}
                    />
                    <stop
                      offset="95%"
                      stopColor={colors.area1}
                      stopOpacity={0.01}
                    />
                  </linearGradient>
                  <linearGradient id="humFill" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={colors.area2}
                      stopOpacity={0.24}
                    />
                    <stop
                      offset="95%"
                      stopColor={colors.area2}
                      stopOpacity={0.01}
                    />
                  </linearGradient>
                  <linearGradient id="soilFill" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={colors.area3}
                      stopOpacity={0.24}
                    />
                    <stop
                      offset="95%"
                      stopColor={colors.area3}
                      stopOpacity={0.01}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  stroke={colors.grid}
                  strokeDasharray="4 4"
                  opacity={0.6}
                />

                <XAxis
                  type="number"
                  dataKey="timeMs"
                  domain={["dataMin", "dataMax"]}
                  tickFormatter={formatTime}
                  minTickGap={40}
                  tick={{
                    fill: colors.tick,
                    fontSize: 10,
                    fontFamily: "monospace",
                    fontWeight: "700",
                  }}
                  tickLine={false}
                  axisLine={{ stroke: colors.grid, strokeWidth: 1.5 }}
                  dy={8}
                />

                <YAxis
                  domain={["auto", "auto"]}
                  tick={{
                    fill: colors.axis1,
                    fontSize: 11,
                    fontFamily: "monospace",
                    fontWeight: "800",
                  }}
                  tickLine={true}
                  tickSize={5}
                  stroke={colors.axis1}
                  axisLine={{ stroke: colors.axis1, strokeWidth: 2 }}
                  dx={-6}
                />

                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{
                    stroke: colors.grid,
                    strokeWidth: 1.5,
                    strokeDasharray: "3 3",
                  }}
                />

                <Legend
                  verticalAlign="top"
                  height={36}
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{
                    fontSize: "11px",
                    fontFamily: "monospace",
                    fontWeight: "700",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    paddingBottom: "12px",
                  }}
                />

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
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 5, strokeWidth: 1.5, stroke: "#ffffff" }}
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
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 5, strokeWidth: 1.5, stroke: "#ffffff" }}
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
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 5, strokeWidth: 1.5, stroke: "#ffffff" }}
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
