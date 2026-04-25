"use client";

import { useMemo, useState } from "react";
import {
  BeanAgeConfigurationProps,
  BeanAgePayload,
  UIStatus,
} from "@/types/type";

const MIN_BEAN_AGE_DAYS = 1;
const MAX_BEAN_AGE_DAYS = 120;
const AGE_PRESETS = [
  { label: "Nursery", day: 7 },
  { label: "Vegetative", day: 28 },
  { label: "Flowering", day: 55 },
  { label: "Pod Fill", day: 90 },
];

const clampBeanAge = (value: number) =>
  Math.min(MAX_BEAN_AGE_DAYS, Math.max(MIN_BEAN_AGE_DAYS, value));

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
  defaultBeanAge = 1,
  onSave,
}: BeanAgeConfigurationProps) => {
  const palette = getBeanAgePalette(status);

  const [beanAge, setBeanAge] = useState<number>(
    clampBeanAge(Math.round(defaultBeanAge)),
  );
  const [isSaving, setIsSaving] = useState(false);

  const stageMeta = useMemo(() => getStageMeta(beanAge), [beanAge]);
  const ageProgressPercent = Math.round((beanAge / MAX_BEAN_AGE_DAYS) * 100);
  const milestones = [1, 14, 40, 75, 120];

  const handleSave = async () => {
    const payload: BeanAgePayload = {
      beanAge,
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

  return (
    <section
      className={`${palette.outerBg} h-full w-full px-4 pb-4 pt-4 xl:max-w-105 xl:justify-self-center`}
    >
      <div
        className={`relative flex h-full min-h-72 flex-col overflow-hidden rounded-2xl border-2 ${palette.borderColor} ${palette.cardBg} shadow-[0_8px_24px_rgba(0,0,0,0.10)]`}
      >
        <div
          className="pointer-events-none absolute -right-12 -top-10 h-32 w-32 rounded-full blur-2xl"
          style={{ backgroundColor: palette.softAccent, opacity: 0.18 }}
        />
        <div
          className="pointer-events-none absolute -left-10 bottom-0 h-24 w-24 rounded-full blur-2xl"
          style={{ backgroundColor: palette.chipBg, opacity: 0.14 }}
        />

        <header className={`${palette.headerBg} px-4 py-4 sm:px-5`}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className={`text-lg font-bold ${palette.headerTitle}`}>
                Beans Age Profile
              </h2>
              <p className="mt-1 text-[11px] text-[rgba(255,255,255,0.72)]">
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

        <div className="px-4 pt-3 sm:px-5">
          <p
            className={`text-[10px] font-semibold tracking-[0.06em] ${palette.bodyText}`}
          >
            STAGE PRESETS
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {AGE_PRESETS.map((preset) => {
              const selected = beanAge === preset.day;
              return (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => setBeanAge(preset.day)}
                  className="rounded-full px-3 py-1 text-[11px] font-semibold transition-all"
                  style={{
                    backgroundColor: selected ? palette.chipBg : "transparent",
                    color: selected ? palette.chipText : undefined,
                    border: `1px solid ${selected ? palette.chipBg : palette.track}`,
                  }}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-5 p-4 sm:p-5">
          <div
            className="grid grid-cols-[auto_1fr] items-center gap-4 rounded-xl border p-3"
            style={{ borderColor: palette.track }}
          >
            <div
              className="grid h-20 w-20 place-items-center rounded-full"
              style={{
                background: `conic-gradient(${palette.softAccent} ${ageProgressPercent}%, ${palette.track} ${ageProgressPercent}% 100%)`,
              }}
            >
              <div
                className="grid h-14 w-14 place-items-center rounded-full bg-white/80 text-xs font-bold"
                style={{ color: palette.accent }}
              >
                {ageProgressPercent}%
              </div>
            </div>
            <div>
              <p
                className={`text-xs font-semibold tracking-[0.06em] ${palette.bodyTitle}`}
              >
                CURRENT PLANT AGE
              </p>
              <h3
                className={`mt-1 text-3xl font-extrabold ${palette.bodyTitle}`}
              >
                Day {beanAge}
              </h3>
              <p className={`mt-1 text-xs ${palette.bodyText}`}>
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
            className="flex items-center gap-2 rounded-xl border p-2"
            style={{ borderColor: palette.track }}
          >
            <button
              type="button"
              onClick={() => setBeanAge((prev) => clampBeanAge(prev - 1))}
              className="rounded-md border px-3 py-1.5 text-sm font-bold"
              style={{ borderColor: palette.accent, color: palette.accent }}
              aria-label="Decrease bean age"
            >
              −
            </button>

            <input
              type="range"
              min={MIN_BEAN_AGE_DAYS}
              max={MAX_BEAN_AGE_DAYS}
              step={1}
              value={beanAge}
              onChange={(event) =>
                setBeanAge(clampBeanAge(Number(event.target.value)))
              }
              className="h-2 w-full cursor-pointer rounded-lg"
              style={{
                accentColor: palette.accent,
                backgroundColor: palette.track,
              }}
            />

            <button
              type="button"
              onClick={() => setBeanAge((prev) => clampBeanAge(prev + 1))}
              className="rounded-md border px-3 py-1.5 text-sm font-bold"
              style={{ borderColor: palette.accent, color: palette.accent }}
              aria-label="Increase bean age"
            >
              +
            </button>
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="mt-auto w-full rounded-xl px-4 py-3 text-sm font-bold tracking-[0.08em] transition-colors disabled:cursor-not-allowed disabled:opacity-70"
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

          <div
            className="rounded-xl border p-3"
            style={{ borderColor: palette.track }}
          >
            <p
              className={`text-[11px] font-semibold tracking-[0.06em] ${palette.bodyTitle}`}
            >
              STAGE INTELLIGENCE
            </p>
            <p className={`mt-1 text-xs leading-relaxed ${palette.bodyText}`}>
              This profile calibrates our AI threat detection per growth stage,
              keeping pest and disease alerts aligned with actual crop maturity.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BeanAgeConfiguration;
