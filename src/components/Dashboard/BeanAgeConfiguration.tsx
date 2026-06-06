"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BeanAgeConfigurationProps,
  BeanAgePayload,
  UIStatus,
} from "@/types/type";

const MAX_BEAN_AGE_DAYS = 120;
const AGE_PRESETS = [
  { label: "Custom Date", daysOffset: -1 },
  { label: "Nursery Stage", daysOffset: 7 },
  { label: "Vegetative Stage", daysOffset: 28 },
  { label: "Flowering Stage", daysOffset: 55 },
  { label: "Pod Fill Stage", daysOffset: 90 },
];

const getMinAllowedDate = (): string => {
  const date = new Date();
  date.setDate(date.getDate() - MAX_BEAN_AGE_DAYS);
  return date.toISOString().split("T")[0];
};

const calculateDaysSincePlanting = (plantingDate: string): number => {
  const planting = new Date(plantingDate);
  const today = new Date();
  const diffDays = Math.ceil(
    (today.getTime() - planting.getTime()) / (1000 * 60 * 60 * 24),
  );
  return Math.max(0, diffDays);
};

const calculatePlantingDate = (daysAgo: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split("T")[0];
};

const getStageMeta = (beanAge: number) => {
  if (beanAge <= 14) return { label: "Seedling", progress: 12 };
  if (beanAge <= 40) return { label: "Vegetative", progress: 36 };
  if (beanAge <= 75) return { label: "Flowering", progress: 66 };
  return { label: "Pod Fill", progress: 90 };
};

const getBeanAgePalette = (status: UIStatus) => {
  const palettes: Record<UIStatus, any> = {
    healthy: {
      borderColor: "border-[#2f7f3a]",
      headerTitle: "text-[#0f4a27]",
      accent: "#2f7f3a",
      bodyTitle: "text-[#1c4a2b]",
      bodyText: "text-[#4f7059]",
      buttonBg: "#2f7f3a",
      buttonText: "#f4fff7",
      track: "#d3dfcc",
      divider: "border-black/5",
      inputBorder: "border-[#d4dfcd]",
    },
    disease: {
      borderColor: "border-[#4f98ff]",
      headerTitle: "text-[#0f244a]",
      accent: "#4f98ff",
      bodyTitle: "text-[#173768]",
      bodyText: "text-[#5c7398]",
      buttonBg: "#4f98ff",
      buttonText: "#f5f9ff",
      track: "#d4dff1",
      divider: "border-black/5",
      inputBorder: "border-[#ccd8ef]",
    },
    pest: {
      borderColor: "border-[#f59e0b]",
      headerTitle: "text-[#2a1204]",
      accent: "#f59e0b",
      bodyTitle: "text-[#5b3111]",
      bodyText: "text-[#9a7656]",
      buttonBg: "#e19b42",
      buttonText: "#fff8ef",
      track: "#eadcc8",
      divider: "border-black/5",
      inputBorder: "border-[#ead8bf]",
    },
  };
  return palettes[status];
};

export const BeanAgeConfiguration = ({
  status,
  machineLocation,
  defaultBeanAge = new Date().toISOString().split("T")[0],
  onSave,
  isExpanded,
  onToggle,
}: BeanAgeConfigurationProps & {
  isExpanded?: boolean;
  onToggle?: () => void;
}) => {
  const palette = getBeanAgePalette(status);

  const [plantingDate, setPlantingDate] = useState<string>(defaultBeanAge);
  const [activePreset, setActivePreset] = useState<string>("Custom Date");
  const [isSaving, setIsSaving] = useState(false);

  const beanAge = useMemo(
    () => calculateDaysSincePlanting(plantingDate),
    [plantingDate],
  );
  const stageMeta = useMemo(() => getStageMeta(beanAge), [beanAge]);

  const handleSave = async () => {
    const payload: BeanAgePayload = {
      machine_location: machineLocation,
      plantingDate,
    };
    setIsSaving(true);
    try {
      if (onSave) await onSave(payload);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePresetSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const label = e.target.value;
    setActivePreset(label);
    const preset = AGE_PRESETS.find((p) => p.label === label);
    if (preset && preset.daysOffset !== -1) {
      setPlantingDate(calculatePlantingDate(preset.daysOffset));
    }
  };

  const handleDateChange = (newDate: string) => {
    if (calculateDaysSincePlanting(newDate) <= MAX_BEAN_AGE_DAYS) {
      setPlantingDate(newDate);
      setActivePreset("Custom Date");
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
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border bg-white shadow-sm`}
            style={{ borderColor: palette.track }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke={palette.accent}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22c4-4 4-10 4-14a4 4 0 0 0-8 0c0 4 0 10 4 14z"></path>
              <path d="M12 22V13"></path>
              <path d="M12 16a3 3 0 0 0-3-3"></path>
              <path d="M12 18a3 3 0 0 1 3-3"></path>
            </svg>
          </div>
          <div>
            <h2 className={`text-[15px] font-bold ${palette.headerTitle}`}>
              Beans Age Profile
            </h2>
            <p className={`text-[11px] font-medium ${palette.bodyText}`}>
              Growth-stage setup & calibration
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
              {/* Row 1: Current Info (Read Only) */}
              <div
                className={`flex flex-wrap items-center justify-between gap-3 py-3 border-b ${palette.divider}`}
              >
                <label
                  className={`shrink-0 text-xs font-bold tracking-wider ${palette.bodyTitle}`}
                >
                  CURRENT STAGE
                </label>
                <div className="w-[140px] sm:w-[180px] text-right pr-2">
                  <span
                    className={`block text-sm font-black ${palette.bodyTitle}`}
                  >
                    Day {beanAge}
                  </span>
                  <span
                    className={`block text-[10px] uppercase tracking-wider ${palette.bodyText}`}
                  >
                    {stageMeta.label}
                  </span>
                </div>
              </div>

              {/* Row 2: Stage Preset Dropdown */}
              <div
                className={`flex flex-wrap items-center justify-between gap-3 py-3 border-b ${palette.divider}`}
              >
                <label
                  className={`shrink-0 text-xs font-bold tracking-wider ${palette.bodyTitle}`}
                >
                  QUICK JUMP
                </label>
                <select
                  value={activePreset}
                  onChange={handlePresetSelect}
                  className={`w-[140px] sm:w-[180px] cursor-pointer rounded-lg border bg-white/60 px-3 py-2 text-sm font-black shadow-sm outline-none backdrop-blur-sm transition-all hover:bg-white/80 focus:ring-2 focus:ring-offset-1 ${palette.inputBorder} ${palette.bodyTitle}`}
                  style={
                    { "--tw-ring-color": palette.accent } as React.CSSProperties
                  }
                >
                  {AGE_PRESETS.map((p) => (
                    <option key={p.label} value={p.label}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Row 3: Native Date Input */}
              <div
                className={`flex flex-wrap items-center justify-between gap-3 py-3 border-b ${palette.divider}`}
              >
                <label
                  className={`shrink-0 text-xs font-bold tracking-wider ${palette.bodyTitle}`}
                >
                  PLANTING DATE
                </label>
                <input
                  type="date"
                  value={plantingDate}
                  onChange={(e) => handleDateChange(e.target.value)}
                  min={getMinAllowedDate()}
                  max={new Date().toISOString().split("T")[0]}
                  className={`w-[140px] sm:w-[180px] cursor-pointer rounded-lg border bg-white/60 px-3 py-2 text-sm font-black shadow-sm outline-none backdrop-blur-sm transition-all hover:bg-white/80 focus:ring-2 focus:ring-offset-1 ${palette.inputBorder} ${palette.bodyTitle}`}
                  style={
                    {
                      color: palette.bodyTitle,
                      "--tw-ring-color": palette.accent,
                    } as React.CSSProperties
                  }
                />
              </div>

              {/* Row 4: Fine-tune Slider */}
              <div
                className={`flex flex-col justify-center py-4 border-b ${palette.divider}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <label
                    className={`shrink-0 text-xs font-bold tracking-wider ${palette.bodyTitle}`}
                  >
                    ADJUST AGE (DAYS)
                  </label>
                </div>
                <input
                  type="range"
                  max={MAX_BEAN_AGE_DAYS}
                  min={0}
                  step={1}
                  value={beanAge}
                  onChange={(e) => {
                    setPlantingDate(
                      calculatePlantingDate(Number(e.target.value)),
                    );
                    setActivePreset("Custom Date");
                  }}
                  className="h-2 w-full cursor-pointer rounded-lg appearance-none shadow-inner"
                  style={{
                    accentColor: palette.accent,
                    backgroundColor: palette.track,
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
                {isSaving ? "SAVING AGE..." : "APPLY BEANS AGE PROFILE"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BeanAgeConfiguration;
