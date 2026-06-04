"use client";

import { useEffect, useMemo, useState } from "react";
import {
  RemoteConfigurationProps,
  UIStatus,
  RemoteConfigPayload,
  ESP32ANDAIconfiguration,
} from "@/types/type";
import { useUserLoginContext } from "@/context/userLogincontex";
import { SprayControls } from "./SprayControls";

const getRemoteConfigPalette = (status: UIStatus) => {
  const palettes: Record<
    UIStatus,
    {
      outerBg: string;
      cardBg: string;
      borderColor: string;
      headerBg: string;
      headerTitle: string;
      labelText: string;
      subText: string;
      sliderAccent: string;
      buttonBg: string;
      buttonText: string;
      buttonHover: string;
      selectBorder: string;
      selectText: string;
      inputTrack: string;
      badgeBg: string;
      badgeText: string;
    }
  > = {
    healthy: {
      outerBg: "bg-[#edf1e8]",
      cardBg: "bg-[#f7faf4]",
      borderColor: "border-[#2f7f3a]",
      headerBg: "bg-[#0f4a27]",
      headerTitle: "text-[#dbffe8]",
      labelText: "text-[#1c4a2b]",
      subText: "text-[#4f7059]",
      sliderAccent: "#2f7f3a",
      buttonBg: "#2f7f3a",
      buttonText: "#f4fff7",
      buttonHover: "#3f9a4e",
      selectBorder: "border-[#d4dfcd]",
      selectText: "text-[#234930]",
      inputTrack: "#d3dfcc",
      badgeBg: "#2d5f35",
      badgeText: "#a6f6bb",
    },
    disease: {
      outerBg: "bg-[#e9edf6]",
      cardBg: "bg-[#f5f8ff]",
      borderColor: "border-[#4f98ff]",
      headerBg: "bg-[#0f244a]",
      headerTitle: "text-[#e4efff]",
      labelText: "text-[#173768]",
      subText: "text-[#5c7398]",
      sliderAccent: "#4f98ff",
      buttonBg: "#4f98ff",
      buttonText: "#f5f9ff",
      buttonHover: "#3f86e8",
      selectBorder: "border-[#ccd8ef]",
      selectText: "text-[#173768]",
      inputTrack: "#d4dff1",
      badgeBg: "#2d4a8a",
      badgeText: "#cbe0ff",
    },
    pest: {
      outerBg: "bg-[#f3ece3]",
      cardBg: "bg-[#fbf4ea]",
      borderColor: "border-[#f59e0b]",
      headerBg: "bg-[#2a1204]",
      headerTitle: "text-[#ffd9b0]",
      labelText: "text-[#5b3111]",
      subText: "text-[#9a7656]",
      sliderAccent: "#f59e0b",
      buttonBg: "#e19b42",
      buttonText: "#fff8ef",
      buttonHover: "#cc8a38",
      selectBorder: "border-[#ead8bf]",
      selectText: "text-[#5b3111]",
      inputTrack: "#eadcc8",
      badgeBg: "#5a3818",
      badgeText: "#ffd7a6",
    },
  };

  return palettes[status];
};

const clampConfidence = (value: number) => Math.min(100, Math.max(50, value));
const POLLING_INTERVAL_OPTIONS = [1, 10, 15, 30, 45, 60, 120];
const QUICK_REMOTE_PROFILES = [
  { label: "Conservative", confidence: 90, interval: 45 },
  { label: "Balanced", confidence: 80, interval: 30 },
  { label: "Rapid Detect", confidence: 70, interval: 10 },
];

export const RemoteConfiguration = ({
  machineLocation,
  status,
  defaultConfidence = 75,
  defaultIntervalMinutes = 30,
  onSave,
}: RemoteConfigurationProps) => {
  const palette = getRemoteConfigPalette(status);

  const [aiConfidence, setAiConfidence] = useState<number>(
    clampConfidence(Math.round(defaultConfidence)),
  );
  const [intervalMinutes, setIntervalMinutes] = useState<number>(
    defaultIntervalMinutes,
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  // Whenever the backend updates the default values (e.g. from a database or after applying settings), this effect ensures the sliders reflect those changes immediately.
  useEffect(() => {
    setIntervalMinutes(defaultIntervalMinutes);
  }, [defaultIntervalMinutes]);

  const pollLabel = useMemo(() => {
    if (intervalMinutes >= 60) {
      const hours = intervalMinutes / 60;
      return `${hours} ${hours > 1 ? "Hours" : "Hour"}`;
    }
    return `${intervalMinutes} Minutes`;
  }, [intervalMinutes]);

  const confidenceProfile = useMemo(() => {
    if (aiConfidence >= 90) return "Very Strict";
    if (aiConfidence >= 80) return "Balanced";
    return "Permissive";
  }, [aiConfidence]);

  const wakeProfile = useMemo(() => {
    if (intervalMinutes === 1) return "Demo";
    if (intervalMinutes <= 10) return "High Frequency";
    if (intervalMinutes <= 30) return "Recommended";
    return "Power Saver";
  }, [intervalMinutes]);

  const handleSave = async () => {
    const payload: ESP32ANDAIconfiguration = {
      machine_location: machineLocation,
      aiConfidence,
      sensorPollingRateMinutes: intervalMinutes,
      // updatedAt: new Date().toISOString(),
    };

    setIsSaving(true);
    try {
      if (onSave) {
        await onSave(payload);
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section
      className={`${palette.outerBg} h-full w-full px-4 pb-0.5 pt-0.5`}
    >
      <div
        className={`relative flex h-full min-h-36 flex-col overflow-hidden rounded-2xl border-2 ${palette.borderColor} ${palette.cardBg}`}
      >
        <div
          className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full blur-2xl"
          style={{ backgroundColor: palette.sliderAccent, opacity: 0.18 }}
        />
        <div
          className="pointer-events-none absolute -left-10 bottom-0 h-24 w-24 rounded-full blur-2xl"
          style={{ backgroundColor: palette.badgeBg, opacity: 0.14 }}
        />

        <button
          type="button"
          onClick={() => setIsExpanded((previous) => !previous)}
          className={`${palette.headerBg} flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-opacity hover:opacity-95 sm:px-5`}
          aria-expanded={isExpanded}
          aria-controls="remote-configuration-panel"
        >
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-10 w-10 flex-col items-center justify-center gap-1 rounded-full border border-white/20 bg-white/10">
              <span className="h-0.5 w-4 rounded-full bg-white/85" />
              <span className="h-0.5 w-4 rounded-full bg-white/85" />
              <span className="h-0.5 w-4 rounded-full bg-white/85" />
            </span>
            <div className="min-w-0">
              <h2 className={`text-base font-bold ${palette.headerTitle}`}>
                Farm Control
              </h2>
              <p className="mt-0.5 truncate text-[10px] text-[rgba(255,255,255,0.72)]">
                polling, AI-prediction and spraying control control
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="rounded-full px-3 py-1 text-[10px] font-semibold tracking-[0.08em]"
              style={{
                backgroundColor: palette.badgeBg,
                color: palette.badgeText,
              }}
            >
              SETUP MODE
            </span>
            <span
              className="text-lg font-bold text-white transition-transform duration-200"
              style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)" }}
            >
              ▾
            </span>
          </div>
        </button>

        {isExpanded && (
          <div id="remote-configuration-panel">
            <div className="grid grid-cols-2 gap-2 px-4 pt-1.5 sm:px-5">
              <div
                className="rounded-xl border px-2.5 py-1.5"
                style={{ borderColor: palette.selectBorder }}
              >
                <p
                  className={`text-[9px] font-semibold tracking-[0.06em] ${palette.subText}`}
                >
                  ALERT PROFILE
                </p>
                <p className={`mt-0.5 text-[13px] font-bold ${palette.labelText}`}>
                  {confidenceProfile}
                </p>
              </div>
              <div
                className="rounded-xl border px-2.5 py-1.5"
                style={{ borderColor: palette.selectBorder }}
              >
                <p
                  className={`text-[9px] font-semibold tracking-[0.06em] ${palette.subText}`}
                >
                  WAKE MODE
                </p>
                <p className={`mt-0.5 text-[13px] font-bold ${palette.labelText}`}>
                  {wakeProfile}
                </p>
              </div>
            </div>

            <div className="px-4 pt-1 sm:px-5">
              <p
                className={`text-[9px] font-semibold tracking-[0.06em] ${palette.subText}`}
              >
                QUICK PROFILES
              </p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {QUICK_REMOTE_PROFILES.map((profile) => {
                  const isActive =
                    aiConfidence === profile.confidence &&
                    intervalMinutes === profile.interval;

                  return (
                    <button
                      key={profile.label}
                      type="button"
                      onClick={() => {
                        setAiConfidence(profile.confidence);
                        setIntervalMinutes(profile.interval);
                      }}
                      className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold transition-all"
                      style={{
                        backgroundColor: isActive ? palette.badgeBg : "transparent",
                        color: isActive ? palette.badgeText : undefined,
                        border: `1px solid ${isActive ? palette.badgeBg : palette.selectBorder}`,
                      }}
                    >
                      {profile.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-1 flex-col gap-1.5 p-2 sm:p-2.5">
              <div
                className="rounded-xl border p-1.5"
                style={{ borderColor: palette.selectBorder }}
              >
                <label
                  className={`text-[10px] font-semibold tracking-[0.06em] ${palette.labelText}`}
                >
                  AI WARNING SENSITIVITY
                </label>
                <div className="mt-2 flex items-center gap-2.5">
                  <input
                    type="range"
                    min={50}
                    max={100}
                    step={1}
                    value={aiConfidence}
                    onChange={(event) =>
                      setAiConfidence(Number(event.target.value))
                    }
                    className="h-2 w-full cursor-pointer rounded-lg"
                    style={{
                      accentColor: palette.sliderAccent,
                      backgroundColor: palette.inputTrack,
                    }}
                  />
                  <span
                    className={`w-12 text-right text-[13px] font-bold ${palette.labelText}`}
                  >
                    {aiConfidence}%
                  </span>
                </div>
                <p className={`mt-1.5 text-[10px] ${palette.subText}`}>
                  Controls how strict AI must be before triggering warning
                  workflows.
                </p>
              </div>

              <div
                className="rounded-xl border p-1.5"
                style={{ borderColor: palette.selectBorder }}
              >
                <label
                  className={`text-[10px] font-semibold tracking-[0.06em] ${palette.labelText}`}
                >
                  SENSOR POLLING RATE
                </label>
                <select
                  value={intervalMinutes}
                  onChange={(event) =>
                    setIntervalMinutes(Number(event.target.value))
                  }
                  className={`mt-1.5 w-full rounded-md border px-2.5 py-1.5 text-[13px] font-medium outline-none ${palette.selectBorder} ${palette.selectText}`}
                >
                  {POLLING_INTERVAL_OPTIONS.map((minutes) => (
                    <option key={minutes} value={minutes}>
                      Every{" "}
                      {minutes < 60
                        ? `${minutes} Minutes`
                        : `${minutes / 60} Hour${minutes > 60 ? "s" : ""}`}
                      {minutes === 30 ? " (Recommended)" : ""}
                    </option>
                  ))}
                </select>
                <div className="mt-1.5 flex items-center justify-between">
                  <p className={`text-[10px] ${palette.subText}`}>
                    ESP32 wakes every {pollLabel}.
                  </p>
                  <span
                    className="rounded-full px-2 py-0.5 text-[9px] font-semibold"
                    style={{
                      backgroundColor: palette.badgeBg,
                      color: palette.badgeText,
                    }}
                  >
                    {wakeProfile}
                  </span>
                </div>
              </div>
              <div className="mt-3">
                <SprayControls
                  machineLocation={machineLocation}
                  palette={{
                    buttonBg: palette.buttonBg,
                    buttonText: palette.buttonText,
                    buttonHover: palette.buttonHover,
                  }}
                />
              </div>

              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="mt-auto w-full rounded-xl px-4 py-1.5 text-[13px] font-bold tracking-[0.08em] transition-colors disabled:cursor-not-allowed disabled:opacity-70"
                style={{
                  backgroundColor: palette.buttonBg,
                  color: palette.buttonText,
                }}
                onMouseEnter={(event) => {
                  event.currentTarget.style.backgroundColor = palette.buttonHover;
                }}
                onMouseLeave={(event) => {
                  event.currentTarget.style.backgroundColor = palette.buttonBg;
                }}
              >
                {isSaving ? "SAVING..." : "APPLY ESP32 SETTINGS"}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default RemoteConfiguration;
