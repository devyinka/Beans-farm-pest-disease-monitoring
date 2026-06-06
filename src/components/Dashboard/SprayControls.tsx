"use client";
import BACKENDAPI from "@/API";
import type { ReactNode } from "react";
import { useState } from "react";
import { motion } from "framer-motion";

interface SprayControlsProps {
  machineLocation: string;
  orientation?: "row" | "stacked";
}

const SprayPesticideIcon = ({
  className = "h-6 w-6",
}: {
  className?: string;
}) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
    <path
      d="M10 4h4m-2 0v3m0 0-2.5 2.5M12 7h5l2 2-3 3v5a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3v-5l3-3"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M15 13h.01M17.5 12.5h.01M14 16h.01"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
    />
  </svg>
);

const SprayInsecticideIcon = ({
  className = "h-6 w-6",
}: {
  className?: string;
}) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
    <path
      d="M9 4h6m-3 0v3m0 0-2.5 2.5M12 7h4.5l1.5 1.5-2.8 2.8V16a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3v-4.7L9.8 8.2"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8 13.5c.8-1.1 1.8-1.7 3-1.7s2.2.6 3 1.7M8.5 16c.6-.7 1.6-1.1 2.8-1.1s2.2.4 2.8 1.1"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);

const ChevronRightIcon = ({
  className = "h-5 w-5",
}: {
  className?: string;
}) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
    <path
      d="M9 6l6 6-6 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const SprayControls = ({
  machineLocation,
  orientation = "row",
}: SprayControlsProps) => {
  const [sprayingPesticide, setSprayingPesticide] = useState(false);
  const [sprayingInsecticide, setSprayingInsecticide] = useState(false);

  const handleSprayPesticide = async () => {
    const nextState = !sprayingPesticide;
    setSprayingPesticide(nextState);
    try {
      await BACKENDAPI.post("/spraying/action", {
        machine_location: machineLocation,
        status: "pest",
        action: nextState,
      });
    } catch (error) {
      setSprayingPesticide(!nextState); // Revert on failure
    }
  };

  const handleSprayInsecticide = async () => {
    const nextState = !sprayingInsecticide;
    setSprayingInsecticide(nextState);
    try {
      await BACKENDAPI.post("/spraying/action", {
        machine_location: machineLocation,
        status: "disease",
        action: nextState,
      });
    } catch (error) {
      setSprayingInsecticide(!nextState); // Revert on failure
    }
  };

  // GLASSMORPHIC STYLING LOGIC
  // When active (spraying) = Green theme. When inactive = amber/blue theme.
  const pesticideCard = sprayingPesticide
    ? "bg-[#2f7f3a]/15 border-[#2f7f3a]/40 shadow-[0_0_15px_rgba(47,127,58,0.2)] text-[#0f4a27]"
    : "bg-[#f59e0b]/10 border-[#f59e0b]/30 hover:bg-[#f59e0b]/20 text-[#5b3111] shadow-sm";

  const pesticideIcon = sprayingPesticide
    ? "bg-[#2f7f3a]/20 text-[#1f6a32]"
    : "bg-[#f59e0b]/20 text-[#a15c00]";

  const insecticideCard = sprayingInsecticide
    ? "bg-[#2f7f3a]/15 border-[#2f7f3a]/40 shadow-[0_0_15px_rgba(47,127,58,0.2)] text-[#0f4a27]"
    : "bg-[#4f98ff]/10 border-[#4f98ff]/30 hover:bg-[#4f98ff]/20 text-[#173768] shadow-sm";

  const insecticideIcon = sprayingInsecticide
    ? "bg-[#2f7f3a]/20 text-[#1f6a32]"
    : "bg-[#4f98ff]/20 text-[#245ea8]";

  const buttonBaseClass =
    orientation === "stacked"
      ? "flex w-full items-center justify-between gap-4 rounded-2xl border px-5 py-4 text-left transition-all duration-300 disabled:opacity-50"
      : "flex-1 rounded-xl px-3 py-1.5 text-[12px] font-bold tracking-[0.08em] transition-all disabled:opacity-50 border";

  const renderContent = (
    title: string,
    subtitle: string,
    iconBgClass: string,
    icon: ReactNode,
    isActive: boolean,
  ) => (
    <div className="flex min-w-0 items-center gap-4">
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${iconBgClass}`}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <span className="block truncate text-[15px] font-bold leading-tight">
          {title}
        </span>
        <motion.span
          animate={isActive ? { opacity: [1, 0.5, 1] } : {}}
          transition={isActive ? { duration: 1.5, repeat: Infinity } : {}}
          className={`mt-0.5 block text-[11px] font-medium tracking-wide ${isActive ? "text-[#1f6a32]" : "opacity-60"}`}
        >
          {subtitle}
        </motion.span>
      </div>
    </div>
  );

  if (orientation === "stacked") {
    return (
      <div className="grid gap-4">
        {/* PESTICIDE BUTTON */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={handleSprayPesticide}
          className={`${buttonBaseClass} ${pesticideCard}`}
        >
          {renderContent(
            sprayingPesticide ? "Spraying Pesticide..." : "Spray Pesticide",
            sprayingPesticide
              ? "System active • Outputting"
              : "Target: Pests & Insects",
            pesticideIcon,
            <SprayPesticideIcon className="h-6 w-6" />,
            sprayingPesticide,
          )}
          <span className="opacity-60">
            {sprayingPesticide ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#1f6a32] border-t-transparent" />
            ) : (
              <ChevronRightIcon className="h-6 w-6" />
            )}
          </span>
        </motion.button>

        {/* INSECTICIDE BUTTON */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={handleSprayInsecticide}
          className={`${buttonBaseClass} ${insecticideCard}`}
        >
          {renderContent(
            sprayingInsecticide
              ? "Spraying Insecticide..."
              : "Spray Insecticide",
            sprayingInsecticide
              ? "System active • Outputting"
              : "Target: Fungal & Disease",
            insecticideIcon,
            <SprayInsecticideIcon className="h-6 w-6" />,
            sprayingInsecticide,
          )}
          <span className="opacity-60">
            {sprayingInsecticide ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#1f6a32] border-t-transparent" />
            ) : (
              <ChevronRightIcon className="h-6 w-6" />
            )}
          </span>
        </motion.button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <motion.button
        whileTap={{ scale: 0.95 }}
        type="button"
        onClick={handleSprayPesticide}
        className={`${buttonBaseClass} ${pesticideCard}`}
      >
        {sprayingPesticide ? "STOPPING..." : "SPRAY PESTICIDE"}
      </motion.button>

      <motion.button
        whileTap={{ scale: 0.95 }}
        type="button"
        onClick={handleSprayInsecticide}
        className={`${buttonBaseClass} ${insecticideCard}`}
      >
        {sprayingInsecticide ? "STOPPING..." : "SPRAY INSECTICIDE"}
      </motion.button>
    </div>
  );
};

export default SprayControls;
