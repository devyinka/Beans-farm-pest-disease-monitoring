"use client";

import type { farmStatusBox, UIStatus } from "@/types/type";
import Image from "next/image";

const getFarmStatusPalette = (status: UIStatus) => {
  if (status === "disease") {
    return {
      outerBg: "bg-[#e9edf6]",
      cardBg: "bg-[linear-gradient(135deg,rgba(5,20,48,0.96)_0%,rgba(8,34,74,0.94)_55%,rgba(10,47,99,0.98)_100%)]",
      borderColor: "border-[#4f98ff]",
      text: "text-white",
      subtitle: "text-[#d7e6ff]",
      status: "#6ea8ff",
      accent: "#4f98ff",
      panelBg: "bg-white/6",
      panelBorder: "border-white/10",
      panelText: "text-white/90",
    };
  }

  if (status === "pest") {
    return {
      outerBg: "bg-[#f3ece3]",
      cardBg: "bg-[linear-gradient(135deg,rgba(58,20,10,0.97)_0%,rgba(86,38,13,0.95)_52%,rgba(118,55,17,0.98)_100%)]",
      borderColor: "border-[#f59e0b]",
      text: "text-white",
      subtitle: "text-[#ffe1bf]",
      status: "#ffc36b",
      accent: "#f59e0b",
      panelBg: "bg-white/6",
      panelBorder: "border-white/10",
      panelText: "text-white/90",
    };
  }

  return {
    outerBg: "bg-[#edf1e8]",
    cardBg: "bg-[linear-gradient(135deg,rgba(8,32,18,0.96)_0%,rgba(15,64,30,0.92)_48%,rgba(9,43,19,0.98)_100%)]",
    borderColor: "border-[#2f7f3a]",
    text: "text-white",
    subtitle: "text-white/72",
    status: "#7DED9B",
    accent: "#2f7f3a",
    panelBg: "bg-white/5",
    panelBorder: "border-white/10",
    panelText: "text-white/90",
  };
};

export const FarmstatusBox = ({
  status,
  imageurl,
  AIconfidence,
  statusLabel,
  Title,
  subtitle,
  backgroundClass,
  statusColor,
  titleColor,
  subtitleColor,
  confidenceLabel,
  confidenceColor,
  predictionLabel,
  machineLocation,
  lastReading,
  nextReading,
}: farmStatusBox) => {
  const palette = getFarmStatusPalette(status);

  return (
    <div className={`${palette.outerBg} px-4 py-4 sm:px-6`}>
      <div className={`overflow-hidden rounded-[28px] border ${palette.borderColor} ${palette.cardBg} shadow-[0_24px_50px_rgba(7,26,14,0.28)]`}>
        <div className="grid gap-6 px-5 py-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(260px,0.85fr)_minmax(190px,0.55fr)] lg:items-center lg:px-6 lg:py-6">
          <div className="flex w-full items-start gap-4 sm:gap-5">
            <Image
              src={imageurl}
              alt={statusLabel}
              width={60}
              height={60}
              className={`h-14 w-14 shrink-0 rounded-2xl ${palette.panelBg} p-2 shadow-[0_8px_20px_rgba(0,0,0,0.16)] sm:h-16 sm:w-16`}
            />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h5
                  className="text-[10px] font-bold uppercase tracking-[0.15em] sm:text-[11px]"
                  style={{ color: palette.status }}
                >
                  {statusLabel}
                </h5>
                {machineLocation ? (
                  <span className={`rounded-full ${palette.panelBorder} ${palette.panelBg} px-2.5 py-1 text-[10px] font-semibold tracking-[0.08em] ${palette.panelText}`}>
                    {machineLocation}
                  </span>
                ) : null}
              </div>
              <h2 className={`mt-2 max-w-3xl text-2xl font-bold leading-tight ${palette.text} sm:text-3xl`}>
                {Title}
              </h2>
              <p className={`mt-2 max-w-2xl text-sm leading-relaxed ${palette.subtitle} sm:text-base`}>
                {subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center lg:justify-start">
            <div className={`w-full max-w-[320px] rounded-3xl ${palette.panelBorder} ${palette.panelBg} px-4 py-4 ${palette.panelText} shadow-[0_10px_22px_rgba(0,0,0,0.12)]`}>
              <div className="flex items-center justify-between gap-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/65">
                <span>Last reading</span>
                <span>Next reading</span>
              </div>
              <div className="mt-2 flex items-end justify-between gap-4">
                <div>
                  <div className="text-sm font-medium text-white/60">mins ago</div>
                  <div className="text-2xl font-bold leading-none text-white sm:text-3xl">
                    {typeof lastReading === "number" ? lastReading : "--"}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-white/60">in mins</div>
                  <div className="text-2xl font-bold leading-none text-white sm:text-3xl">
                    {typeof nextReading === "number" ? nextReading : "--"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-start lg:justify-end">
            <div className={`rounded-3xl ${palette.panelBorder} ${palette.panelBg} px-4 py-4 text-right ${palette.panelText} shadow-[0_10px_22px_rgba(0,0,0,0.12)]`}>
              <h5 className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/45">
                ML Confidence
              </h5>
              <div className="mt-2 flex items-end justify-end gap-2">
                <span
                  className="text-4xl font-bold leading-none sm:text-5xl"
                  style={{ color: confidenceColor }}
                >
                  {AIconfidence}%
                </span>
              </div>
              <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/55">
                {confidenceLabel || predictionLabel}
              </p>
            </div>
          </div>
        </div>
      </div>
      </div>
  );
};

export default FarmstatusBox;
