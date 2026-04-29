"use client";

import { useMemo, useState } from "react";
import {
  BeanAgeConfigurationProps,
  BeanAgePayload,
  UIStatus,
} from "@/types/type";

const MAX_BEAN_AGE_DAYS = 120;
const AGE_PRESETS = [
  { label: "Nursery", daysOffset: 7 },
  { label: "Vegetative", daysOffset: 28 },
  { label: "Flowering", daysOffset: 55 },
  { label: "Pod Fill", daysOffset: 90 },
];

const AGE_PRESET_COLORS: Record<
  (typeof AGE_PRESETS)[number]["label"],
  {
    bg: string;
    text: string;
    border: string;
    activeBg: string;
    activeText: string;
    activeBorder: string;
  }
> = {
  Nursery: {
    bg: "#e8f7ec",
    text: "#1f6a32",
    border: "#9ed5ac",
    activeBg: "#2f7f3a",
    activeText: "#f4fff7",
    activeBorder: "#2f7f3a",
  },
  Vegetative: {
    bg: "#e7f1ff",
    text: "#245ea8",
    border: "#9dc0ef",
    activeBg: "#4f98ff",
    activeText: "#f5f9ff",
    activeBorder: "#4f98ff",
  },
  Flowering: {
    bg: "#fff0dc",
    text: "#a15c00",
    border: "#f0c27e",
    activeBg: "#f59e0b",
    activeText: "#fff8ef",
    activeBorder: "#f59e0b",
  },
  "Pod Fill": {
    bg: "#f2e8dd",
    text: "#7a4315",
    border: "#d7b08e",
    activeBg: "#e19b42",
    activeText: "#fff8ef",
    activeBorder: "#e19b42",
  },
};

// Calculate minimum allowed date (120 days ago)
const getMinAllowedDate = (): string => {
  const date = new Date();
  date.setDate(date.getDate() - MAX_BEAN_AGE_DAYS);
  return date.toISOString().split("T")[0];
};

const calculateDaysSincePlanting = (plantingDate: string): number => {
  const planting = new Date(plantingDate);
  const today = new Date();
  const diffTime = today.getTime() - planting.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
};

// Calculate planting date from days offset
const calculatePlantingDate = (daysAgo: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split("T")[0];
};

const getStageMeta = (beanAge: number) => {
  if (beanAge <= 14) {
    return {
      label: "Seedling",
      tip: "Focus on early leaf health and moisture stability.",
      progress: 12,
    };
  }
  if (beanAge <= 40) {
    return {
      label: "Vegetative",
      tip: "Rapid canopy growth — monitor nutrient balance closely.",
      progress: 36,
    };
  }
  if (beanAge <= 75) {
    return {
      label: "Flowering",
      tip: "Critical stage for stress alerts and preventive actions.",
      progress: 66,
    };
  }
  return {
    label: "Pod Development",
    tip: "Pod-fill window — tighten disease and pest thresholds.",
    progress: 90,
  };
};

const getBeanAgePalette = (status: UIStatus) => {
  const palettes: Record<
    UIStatus,
    {
      outerBg: string;
      cardBg: string;
      borderColor: string;
      headerBg: string;
      headerTitle: string;
      accent: string;
      softAccent: string;
      bodyTitle: string;
      bodyText: string;
      chipBg: string;
      chipText: string;
      buttonBg: string;
      buttonText: string;
      buttonHover: string;
      track: string;
    }
  > = {
    healthy: {
      outerBg: "bg-[#edf1e8]",
      cardBg: "bg-[#f7faf4]",
      borderColor: "border-[#2f7f3a]",
      headerBg: "bg-[#0f4a27]",
      headerTitle: "text-[#dbffe8]",
      accent: "#2f7f3a",
      softAccent: "#7DED9B",
      bodyTitle: "text-[#1c4a2b]",
      bodyText: "text-[#4f7059]",
      chipBg: "#2d5f35",
      chipText: "#a6f6bb",
      buttonBg: "#67b978",
      buttonText: "#f4fff7",
      buttonHover: "#579f66",
      track: "#d3dfcc",
    },
    disease: {
      outerBg: "bg-[#e9edf6]",
      cardBg: "bg-[#f5f8ff]",
      borderColor: "border-[#4f98ff]",
      headerBg: "bg-[#0f244a]",
      headerTitle: "text-[#e4efff]",
      accent: "#4f98ff",
      softAccent: "#9ec3ff",
      bodyTitle: "text-[#173768]",
      bodyText: "text-[#5c7398]",
      chipBg: "#2d4a8a",
      chipText: "#cbe0ff",
      buttonBg: "#4f98ff",
      buttonText: "#f5f9ff",
      buttonHover: "#3f86e8",
      track: "#d4dff1",
    },
    pest: {
      outerBg: "bg-[#f3ece3]",
      cardBg: "bg-[#fbf4ea]",
      borderColor: "border-[#f59e0b]",
      headerBg: "bg-[#2a1204]",
      headerTitle: "text-[#ffd9b0]",
      accent: "#f59e0b",
      softAccent: "#ffc36b",
      bodyTitle: "text-[#5b3111]",
      bodyText: "text-[#9a7656]",
      chipBg: "#5a3818",
      chipText: "#ffd7a6",
      buttonBg: "#e19b42",
      buttonText: "#fff8ef",
      buttonHover: "#cc8a38",
      track: "#eadcc8",
    },
  };

  return palettes[status];
};

export const BeanAgeConfiguration = ({
  status,
  defaultBeanAge = new Date().toISOString().split("T")[0],
  onSave,
}: BeanAgeConfigurationProps) => {
  const palette = getBeanAgePalette(status);

  const [plantingDate, setPlantingDate] = useState<string>(defaultBeanAge);
  const [isSaving, setIsSaving] = useState(false);

  const beanAge = useMemo(
    () => calculateDaysSincePlanting(plantingDate),
    [plantingDate],
  );
  const stageMeta = useMemo(() => getStageMeta(beanAge), [beanAge]);
  const ageProgressPercent = Math.round((beanAge / MAX_BEAN_AGE_DAYS) * 100);
  const milestones = [1, 14, 40, 75, 120];

  const handleSave = async () => {
    const payload: BeanAgePayload = {
      plantingDate,
      updatedAt: new Date().toISOString(),
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

  // Handle date input change with validation
  const handleDateChange = (newDate: string) => {
    const daysAge = calculateDaysSincePlanting(newDate);
    if (daysAge <= MAX_BEAN_AGE_DAYS) {
      setPlantingDate(newDate);
    }
  };

  return (
    <section
      className={`${palette.outerBg} h-full w-full px-4 pb-0.5 pt-0.5 xl:max-w-60 xl:justify-self-center`}
    >
      <div
        className={`relative flex h-full min-h-36 flex-col overflow-hidden rounded-2xl border-2 ${palette.borderColor} ${palette.cardBg} shadow-[0_8px_24px_rgba(0,0,0,0.10)]`}
      >
        <div
          className="pointer-events-none absolute -right-12 -top-10 h-32 w-32 rounded-full blur-2xl"
          style={{ backgroundColor: palette.softAccent, opacity: 0.18 }}
        />
        <div
          className="pointer-events-none absolute -left-10 bottom-0 h-24 w-24 rounded-full blur-2xl"
          style={{ backgroundColor: palette.chipBg, opacity: 0.14 }}
        />

        <header className={`${palette.headerBg} px-4 py-2 sm:px-5`}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className={`text-base font-bold ${palette.headerTitle}`}>
                Beans Age Profile
              </h2>
              <p className="mt-0.5 text-[10px] text-[rgba(255,255,255,0.72)]">
                Growth-stage setup for calibration and farm recommendations.
              </p>
            </div>
            <span
              className="rounded-full px-3 py-1 text-[10px] font-semibold tracking-[0.08em]"
              style={{
                backgroundColor: palette.chipBg,
                color: palette.chipText,
              }}
            >
              {stageMeta.label}
            </span>
          </div>
        </header>

        <div className="px-4 pt-1.5 sm:px-5">
          <p
            className={`text-[9px] font-semibold tracking-[0.06em] ${palette.bodyText}`}
          >
            STAGE PRESETS
          </p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {AGE_PRESETS.map((preset) => {
              const selected = beanAge === preset.daysOffset;
              const presetDate = calculatePlantingDate(preset.daysOffset);
              const colors = AGE_PRESET_COLORS[preset.label];
              return (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => setPlantingDate(presetDate)}
                  className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold transition-all"
                  style={{
                    backgroundColor: selected ? colors.activeBg : colors.bg,
                    color: selected ? colors.activeText : colors.text,
                    border: `1px solid ${selected ? colors.activeBorder : colors.border}`,
                    boxShadow: selected
                      ? "0 0 0 2px rgba(255,255,255,0.55), 0 4px 10px rgba(0,0,0,0.10)"
                      : "none",
                    transform: selected ? "translateY(-1px)" : "none",
                  }}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-1.5 p-2 sm:p-2.5">
          <div
            className="grid grid-cols-[auto_1fr] items-center gap-2.5 rounded-xl border p-2"
            style={{ borderColor: palette.track }}
          >
            <div
              className="grid h-14 w-14 place-items-center rounded-full"
              style={{
                background: `conic-gradient(${palette.softAccent} ${ageProgressPercent}%, ${palette.track} ${ageProgressPercent}% 100%)`,
              }}
            >
              <div
                className="grid h-9 w-9 place-items-center rounded-full bg-white/80 text-[9px] font-bold"
                style={{ color: palette.accent }}
              >
                {ageProgressPercent}%
              </div>
            </div>
            <div>
              <p
                className={`text-[10px] font-semibold tracking-[0.06em] ${palette.bodyTitle}`}
              >
                CURRENT PLANT AGE
              </p>
              <h3
                className={`mt-0.5 text-xl font-extrabold ${palette.bodyTitle}`}
              >
                Day {beanAge}
              </h3>
              <p className={`mt-0.5 text-[10px] ${palette.bodyText}`}>
                {stageMeta.tip}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div
              className="h-2 w-full overflow-hidden rounded-full"
              style={{ backgroundColor: palette.track }}
            >
              <div
                className="h-full rounded-full"
                style={{
                  width: `${stageMeta.progress}%`,
                  backgroundColor: palette.softAccent,
                }}
              />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {milestones.map((mark) => {
                const done = beanAge >= mark;
                return (
                  <span
                    key={mark}
                    className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                    style={{
                      backgroundColor: done ? palette.chipBg : "transparent",
                      color: done ? palette.chipText : palette.bodyText,
                      border: `1px solid ${done ? palette.chipBg : palette.track}`,
                    }}
                  >
                    D{mark}
                  </span>
                );
              })}
            </div>
          </div>

          <div
            className="rounded-xl border p-1.5"
            style={{ borderColor: palette.track }}
          >
            <label
              className={`block text-[10px] font-semibold tracking-[0.06em] ${palette.bodyTitle}`}
              htmlFor="planting-date-input"
            >
              SELECT PLANTING DATE
            </label>
            <input
              id="planting-date-input"
              type="date"
              value={plantingDate}
              onChange={(event) => handleDateChange(event.target.value)}
              min={getMinAllowedDate()}
              max={new Date().toISOString().split("T")[0]}
              className="mt-1.5 w-full rounded-md border px-2.5 py-1.5 text-[13px]"
              style={{
                borderColor: palette.accent,
                color: palette.bodyTitle,
              }}
            />
          </div>

          <div
            className="flex items-center gap-2 rounded-xl border p-1.5"
            style={{ borderColor: palette.track }}
          >
            <button
              type="button"
              onClick={() =>
                setPlantingDate(calculatePlantingDate(beanAge + 1))
              }
              className="rounded-md border px-2.5 py-1 text-[13px] font-bold"
              style={{ borderColor: palette.accent, color: palette.accent }}
              aria-label="Decrease bean age"
            >
              −
            </button>

            <input
              type="range"
              className="h-2 w-full cursor-pointer rounded-lg"
              max={MAX_BEAN_AGE_DAYS}
              min={0}
              step={1}
              value={beanAge}
              onChange={(event) =>
                setPlantingDate(
                  calculatePlantingDate(Number(event.target.value)),
                )
              }
              style={{
                accentColor: palette.accent,
                backgroundColor: palette.track,
              }}
            />

            <button
              type="button"
              onClick={() =>
                setPlantingDate(calculatePlantingDate(Math.max(0, beanAge - 1)))
              }
              className="rounded-md border px-2.5 py-1 text-[13px] font-bold"
              style={{ borderColor: palette.accent, color: palette.accent }}
              aria-label="Increase bean age"
            >
              +
            </button>
          </div>

          <div
            className="rounded-xl border p-2.5"
            style={{ borderColor: palette.track }}
          >
            <p
              className={`text-[10px] font-semibold tracking-[0.06em] ${palette.bodyTitle}`}
            >
              STAGE INTELLIGENCE
            </p>
            <p
              className={`mt-1 text-[11px] leading-relaxed ${palette.bodyText}`}
            >
              This profile updates your pest and disease warnings based on the
              growth stage, keeping your crop protected as it matures.
            </p>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="mt-auto w-full rounded-xl px-4 py-2.5 text-sm font-bold tracking-[0.08em] transition-colors disabled:cursor-not-allowed disabled:opacity-70"
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
              {isSaving ? "SAVING AGE..." : "APPLY BEANS AGE PROFILE"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BeanAgeConfiguration;
