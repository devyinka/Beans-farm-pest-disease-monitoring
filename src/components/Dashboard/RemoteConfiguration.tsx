"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RemoteConfigurationProps,
  UIStatus,
  ESP32ANDAIconfiguration,
} from "@/types/type";

const getRemoteConfigPalette = (status: UIStatus) => {
  const palettes: Record<UIStatus, any> = {
    healthy: {
      borderColor: "border-[#2f7f3a]",
      headerTitle: "text-[#0f4a27]",
      labelText: "text-[#1c4a2b]",
      subText: "text-[#4f7059]",
      sliderAccent: "#2f7f3a",
      buttonBg: "#2f7f3a",
      buttonText: "#f4fff7",
      selectBorder: "border-[#d4dfcd]",
      inputTrack: "#d3dfcc",
      divider: "border-black/5",
    },
    disease: {
      borderColor: "border-[#4f98ff]",
      headerTitle: "text-[#0f244a]",
      labelText: "text-[#173768]",
      subText: "text-[#5c7398]",
      sliderAccent: "#4f98ff",
      buttonBg: "#4f98ff",
      buttonText: "#f5f9ff",
      selectBorder: "border-[#ccd8ef]",
      inputTrack: "#d4dff1",
      divider: "border-black/5",
    },
    pest: {
      borderColor: "border-[#f59e0b]",
      headerTitle: "text-[#2a1204]",
      labelText: "text-[#5b3111]",
      subText: "text-[#9a7656]",
      sliderAccent: "#f59e0b",
      buttonBg: "#e19b42",
      buttonText: "#fff8ef",
      selectBorder: "border-[#ead8bf]",
      inputTrack: "#eadcc8",
      divider: "border-black/5",
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
  { label: "Custom", confidence: 0, interval: 0 },
];

export const RemoteConfiguration = ({
  machineLocation,
  status,
  defaultConfidence = 75,
  defaultIntervalMinutes = 30,
  onSave,
  isExpanded,
  onToggle,
}: RemoteConfigurationProps & {
  isExpanded?: boolean;
  onToggle?: () => void;
}) => {
  const palette = getRemoteConfigPalette(status);

  const [aiConfidence, setAiConfidence] = useState<number>(
    clampConfidence(Math.round(defaultConfidence)),
  );
  const [intervalMinutes, setIntervalMinutes] = useState<number>(
    defaultIntervalMinutes,
  );
  const [activeProfile, setActiveProfile] = useState<string>("Custom");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setIntervalMinutes(defaultIntervalMinutes);
  }, [defaultIntervalMinutes]);

  const handleProfileSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const profileLabel = e.target.value;
    setActiveProfile(profileLabel);

    if (profileLabel !== "Custom") {
      const profile = QUICK_REMOTE_PROFILES.find(
        (p) => p.label === profileLabel,
      );
      if (profile) {
        setAiConfidence(profile.confidence);
        setIntervalMinutes(profile.interval);
      }
    }
  };

  const handleSave = async () => {
    const payload: ESP32ANDAIconfiguration = {
      machine_location: machineLocation,
      aiConfidence,
      sensorPollingRateMinutes: intervalMinutes,
    };
    setIsSaving(true);
    try {
      if (onSave) await onSave(payload);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className={`w-full transition-all duration-500 ease-out ${
        isExpanded
          ? `bg-white/70 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.04)] border-l-4 ${palette.borderColor} my-2 rounded-xl`
          : "bg-transparent border-l-4 border-transparent hover:bg-white/30 rounded-xl"
      }`}
    >
      {/* Accordion Toggle Header */}
      <button
        type="button"
        onClick={onToggle}
        className={`flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors ${
          isExpanded ? "bg-transparent" : "bg-transparent rounded-xl"
        }`}
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-3">
          <div
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${palette.selectBorder} bg-white shadow-sm`}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke={palette.sliderAccent}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
          </div>
          <div>
            <h2 className={`text-[15px] font-bold ${palette.headerTitle}`}>
              Farm Control
            </h2>
            <p className={`text-[11px] font-medium ${palette.subText}`}>
              Polling & AI-prediction settings
            </p>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-black/40"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </motion.div>
      </button>

      {/* Accordion Body */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 flex flex-col">
              {/* Row 1: Quick Preset Dropdown */}
              <div
                className={`flex flex-wrap items-center justify-between gap-3 py-3 border-b ${palette.divider}`}
              >
                <label
                  className={`shrink-0 text-xs font-bold tracking-wider ${palette.labelText}`}
                >
                  PRESET MODE
                </label>
                <select
                  value={activeProfile}
                  onChange={handleProfileSelect}
                  className={`w-[140px] sm:w-[180px] cursor-pointer rounded-lg border bg-white/60 px-3 py-2 text-sm font-black shadow-sm outline-none backdrop-blur-sm transition-all hover:bg-white/80 focus:ring-2 focus:ring-offset-1 ${palette.selectBorder} ${palette.labelText}`}
                  style={
                    {
                      "--tw-ring-color": palette.sliderAccent,
                    } as React.CSSProperties
                  }
                >
                  {QUICK_REMOTE_PROFILES.map((p) => (
                    <option key={p.label} value={p.label}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Row 2: Polling Rate Dropdown */}
              <div
                className={`flex flex-wrap items-center justify-between gap-3 py-3 border-b ${palette.divider}`}
              >
                <label
                  className={`shrink-0 text-xs font-bold tracking-wider ${palette.labelText}`}
                >
                  POLLING RATE
                </label>
                <select
                  value={intervalMinutes}
                  onChange={(e) => {
                    setIntervalMinutes(Number(e.target.value));
                    setActiveProfile("Custom");
                  }}
                  className={`w-[140px] sm:w-[180px] cursor-pointer rounded-lg border bg-white/60 px-3 py-2 text-sm font-black shadow-sm outline-none backdrop-blur-sm transition-all hover:bg-white/80 focus:ring-2 focus:ring-offset-1 ${palette.selectBorder} ${palette.labelText}`}
                  style={
                    {
                      "--tw-ring-color": palette.sliderAccent,
                    } as React.CSSProperties
                  }
                >
                  {POLLING_INTERVAL_OPTIONS.map((minutes) => (
                    <option key={minutes} value={minutes}>
                      Every{" "}
                      {minutes < 60
                        ? `${minutes} Mins`
                        : `${minutes / 60} Hr${minutes > 60 ? "s" : ""}`}
                    </option>
                  ))}
                </select>
              </div>

              {/* Row 3: AI Sensitivity Slider */}
              <div
                className={`flex flex-col justify-center py-4 border-b ${palette.divider}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <label
                    className={`shrink-0 text-xs font-bold tracking-wider ${palette.labelText}`}
                  >
                    AI SENSITIVITY
                  </label>
                  <span
                    className={`w-[140px] sm:w-[180px] text-right text-sm font-black pr-1 ${palette.labelText}`}
                  >
                    {aiConfidence}%
                  </span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={100}
                  step={1}
                  value={aiConfidence}
                  onChange={(e) => {
                    setAiConfidence(Number(e.target.value));
                    setActiveProfile("Custom");
                  }}
                  className="h-2 w-full cursor-pointer rounded-lg appearance-none shadow-inner"
                  style={{
                    accentColor: palette.sliderAccent,
                    backgroundColor: palette.inputTrack,
                  }}
                />
              </div>

              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="mt-5 w-full rounded-lg px-4 py-3 text-xs font-black tracking-widest transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70 shadow-sm"
                style={{
                  backgroundColor: palette.buttonBg,
                  color: palette.buttonText,
                }}
              >
                {isSaving ? "SAVING..." : "APPLY ESP32 SETTINGS"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RemoteConfiguration;
