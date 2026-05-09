"use client";
import React, { useState } from "react";
import axios from "axios";
import {
  UIStatus,
  ThresholdConfigurationProps,
  ThresholdPayload,
} from "../../types/type";

type Palette = {
  outerBg: string;
  cardBg: string;
  borderColor: string;
  headerBg: string;
  headerTitle: string;
  buttonBg: string;
  buttonText: string;
  badgeBg: string;
  badgeText: string;
  sliderAccent: string;
  inputTrack: string;
  labelText: string;
  subText: string;
  selectBorder: string;
  selectText: string;
};

const getThresholdConfigPalette = (status: UIStatus): Palette => {
  switch (status) {
    case "healthy":
      return {
        outerBg: "bg-[#edf1e8]",
        cardBg: "bg-[#f7faf4]",
        borderColor: "border-[#2f7f3a]",
        headerBg: "bg-[#0f4a27]",
        headerTitle: "text-[#dbffe8]",
        buttonBg: "#67b978",
        buttonText: "#f4fff7",
        badgeBg: "#2d5f35",
        badgeText: "#a6f6bb",
        sliderAccent: "#2f7f3a",
        inputTrack: "#d3dfcc",
        labelText: "text-[#1c4a2b]",
        subText: "text-[#4f7059]",
        selectBorder: "border-[#d4dfcd]",
        selectText: "text-[#234930]",
      };
    case "disease":
      return {
        outerBg: "bg-[#e9edf6]",
        cardBg: "bg-[#f5f8ff]",
        borderColor: "border-[#4f98ff]",
        headerBg: "bg-[#0f244a]",
        headerTitle: "text-[#e4efff]",
        buttonBg: "#4f98ff",
        buttonText: "#f5f9ff",
        badgeBg: "#2d4a8a",
        badgeText: "#cbe0ff",
        sliderAccent: "#4f98ff",
        inputTrack: "#d4dff1",
        labelText: "text-[#173768]",
        subText: "text-[#5c7398]",
        selectBorder: "border-[#ccd8ef]",
        selectText: "text-[#173768]",
      };
    case "pest":
      return {
        outerBg: "bg-[#f3ece3]",
        cardBg: "bg-[#fbf4ea]",
        borderColor: "border-[#f59e0b]",
        headerBg: "bg-[#2a1204]",
        headerTitle: "text-[#ffd9b0]",
        buttonBg: "#e19b42",
        buttonText: "#fff8ef",
        badgeBg: "#5a3818",
        badgeText: "#ffd7a6",
        sliderAccent: "#f59e0b",
        inputTrack: "#eadcc8",
        labelText: "text-[#5b3111]",
        subText: "text-[#9a7656]",
        selectBorder: "border-[#ead8bf]",
        selectText: "text-[#5b3111]",
      };
  }
};

const DEFAULT_THRESHOLDS: ThresholdPayload = {
  luxThreshold: 5000,
  hotDayTempThreshold: 35,
  wetNightHumThreshold: 85,
  drySoilThreshold: 20,
  floodedSoilThreshold: 80,
};

export const ThresholdConfiguration = ({
  status,
  defaultThresholds = DEFAULT_THRESHOLDS,
  onSave,
}: ThresholdConfigurationProps) => {
  const palette = getThresholdConfigPalette(status);

  const [thresholds, setThresholds] =
    useState<ThresholdPayload>(defaultThresholds);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const BACKENDURL =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5001";

  const handleSliderChange = (key: keyof ThresholdPayload, value: number) => {
    setThresholds((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage(null);
    try {
      if (onSave) {
        await onSave(thresholds);
      } else {
        // Fallback: send directly to backend if parent didn't provide onSave
        await axios.post(
          `${BACKENDURL}/api/device-config/thresholds`,
          thresholds,
        );
      }
      setSaveMessage("Saved");
    } catch (err) {
      console.error("Failed to save thresholds:", err);
      setSaveMessage("Save failed");
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveMessage(null), 3000);
    }
  };

  return (
    <section
      className={`${palette.outerBg} h-full w-full px-4 pb-0.5 pt-0.5 xl:max-w-105 xl:justify-self-center`}
    >
      <div
        className={`relative flex h-full min-h-28 max-h-105 flex-col overflow-hidden rounded-2xl border-2 ${palette.borderColor} ${palette.cardBg} shadow-[0_8px_24px_rgba(0,0,0,0.10)]`}
      >
        <div
          className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full blur-2xl"
          style={{ backgroundColor: palette.sliderAccent, opacity: 0.18 }}
        />
        <div
          className="pointer-events-none absolute -left-10 bottom-0 h-24 w-24 rounded-full blur-2xl"
          style={{ backgroundColor: palette.badgeBg, opacity: 0.14 }}
        />

        <header className={`${palette.headerBg} px-4 py-2 sm:px-5`}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className={`text-base font-bold ${palette.headerTitle}`}>
                Environmental Thresholds
              </h2>
              <p
                className={`mt-0.5 text-[10px] ${status === "pest" ? "text-gray-800" : "text-[rgba(255,255,255,0.72)]"}`}
              >
                Configure bounds for automated alerts.
              </p>
            </div>
            <span
              className="rounded-full px-3 py-1 text-[10px] font-semibold tracking-[0.08em]"
              style={{
                backgroundColor: palette.badgeBg,
                color: palette.badgeText,
              }}
            >
              BOUNDS
            </span>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-1.5 overflow-y-auto px-2 pb-2 pt-2 sm:px-2.5 sm:pt-2.5">
          {[
            {
              key: "hotDayTempThreshold",
              label: "HOT DAY TEMP THRESHOLD",
              min: 20,
              max: 50,
              step: 1,
              unit: "°C",
              desc: "Trigger an alert when daytime temperature rises above this value.",
            },
            {
              key: "wetNightHumThreshold",
              label: "WET NIGHT HUMIDITY",
              min: 50,
              max: 100,
              step: 1,
              unit: "%",
              desc: "Trigger an alert when nighttime humidity stays above this threshold.",
            },
            {
              key: "drySoilThreshold",
              label: "DRY SOIL THRESHOLD",
              min: 0,
              max: 50,
              step: 1,
              unit: "%",
              desc: "Trigger an alert when soil moisture falls below this percentage.",
            },
            {
              key: "floodedSoilThreshold",
              label: "FLOODED SOIL THRESHOLD",
              min: 50,
              max: 100,
              step: 1,
              unit: "%",
              desc: "Trigger an alert when soil moisture rises above this percentage (possible waterlogging).",
            },
            {
              key: "luxThreshold",
              label: "LUX THRESHOLD",
              min: 0,
              max: 20000,
              step: 500,
              unit: "Lx",
              desc: "Minimum daily light (lux); alert when measured light falls below this.",
            },
          ].map((item) => (
            <div
              key={item.key}
              className="rounded-xl border p-1.5"
              style={{ borderColor: palette.selectBorder }}
            >
              <label
                className={`text-[10px] font-semibold tracking-[0.06em] ${palette.labelText}`}
              >
                {item.label}
              </label>
              <div className="mt-2 flex items-center gap-2.5">
                <input
                  type="range"
                  min={item.min}
                  max={item.max}
                  step={item.step}
                  value={thresholds[item.key as keyof ThresholdPayload]}
                  onChange={(event) =>
                    handleSliderChange(
                      item.key as keyof ThresholdPayload,
                      Number(event.target.value),
                    )
                  }
                  className="h-2 w-full cursor-pointer rounded-lg"
                  style={{
                    accentColor: palette.sliderAccent,
                    backgroundColor: palette.inputTrack,
                  }}
                />
                <span
                  className={`w-14 text-right text-[13px] font-bold ${palette.labelText}`}
                >
                  {thresholds[item.key as keyof ThresholdPayload]}
                  {item.unit}
                </span>
              </div>
              <p className={`mt-1.5 text-[10px] ${palette.subText}`}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        <footer
          className={`shrink-0 border-t px-2 py-2 sm:px-2.5 ${palette.cardBg}`}
          style={{ borderColor: palette.selectBorder }}
        >
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex w-full items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-[13px] font-bold text-white shadow-[0_6px_16px_rgba(0,0,0,0.12)] transition-all active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            style={{
              backgroundColor: palette.buttonBg,
              color: palette.buttonText,
              borderColor: palette.buttonBg,
            }}
          >
            <span className="text-base leading-none">↗</span>
            {isSaving ? "SAVING..." : "SAVE THRESHOLDS"}
          </button>
          {saveMessage && (
            <p
              className={`mt-1.5 text-center text-xs font-medium ${palette.labelText}`}
            >
              {saveMessage}
            </p>
          )}
        </footer>
      </div>
    </section>
  );
};
