"use client";
import BACKENDAPI from "@/API";
import type { ReactNode } from "react";
import { useState } from "react";

interface SprayPalette {
  buttonBg: string;
  buttonText: string;
  buttonHover: string;
}

interface SprayControlsProps {
  machineLocation: string;
  palette: SprayPalette;
  orientation?: "row" | "stacked";
}

const SprayPesticideIcon = ({ className = "h-6 w-6" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
    className={className}
  >
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

const SprayInsecticideIcon = ({ className = "h-6 w-6" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
    className={className}
  >
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

const ChevronRightIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <path
      d="M9 6l6 6-6 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Color definitions for different spraying states
const SPRAY_COLORS = {
  healthy: {
    bg: "#2f7f3a",
    text: "#ffffff",
    hover: "#3f9a4e",
  },
  pest: {
    bg: "#f59e0b",
    text: "#1f1f1f",
    hover: "#ea580c",
  },
  disease: {
    bg: "#4f98ff",
    text: "#ffffff",
    hover: "#2f5fb5",
  },
};

export const SprayControls = ({
  machineLocation,
  palette,
  orientation = "row",
}: SprayControlsProps) => {
  const [sprayingPesticide, setSprayingPesticide] = useState(false);
  const [sprayingInsecticide, setSprayingInsecticide] = useState(false);

  //if the farmer clicck spray pesticide, if the action is true spray and if the action is false stop the spraying
  const handleSprayPesticide = async () => {
    const nextSprayingPesticide = !sprayingPesticide;
    setSprayingPesticide(nextSprayingPesticide);
    try {
      console.log("Spraying pesticide on:", machineLocation);
      await BACKENDAPI.post("/spraying/action", { 
        machine_location: machineLocation,
        status:"pest",
        action: nextSprayingPesticide
       });
    } catch (error) {
      console.error("Failed to spray pesticide:", error);
      setSprayingPesticide(sprayingPesticide);
    } 
  };

  
  const handleSprayInsecticide = async () => {
    const nextSprayingInsecticide = !sprayingInsecticide;
    setSprayingInsecticide(nextSprayingInsecticide);
    try {
      // Send spray insecticide command to backend
      console.log("Spraying insecticide on:", machineLocation);
       await BACKENDAPI.post("/spraying/action", {
         machine_location: machineLocation,
         status:"disease",
         action: nextSprayingInsecticide
        });
    } catch (error) {
      console.error("Failed to spray insecticide:", error);
      setSprayingInsecticide(sprayingInsecticide);
    } 
  };

  // Get colors based on spraying state
  const pesticideColors = sprayingPesticide ? SPRAY_COLORS.pest : SPRAY_COLORS.healthy;
  const insecticideColors = sprayingInsecticide ? SPRAY_COLORS.disease : SPRAY_COLORS.healthy;

  const buttonBaseClass =
    orientation === "stacked"
      ? "flex min-h-24 w-full items-center justify-between gap-4 rounded-[18px] px-4 py-4 text-left font-bold tracking-[0.06em] shadow-[0_8px_18px_rgba(0,0,0,0.08)] transition-transform transition-shadow duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(0,0,0,0.1)] disabled:cursor-not-allowed disabled:opacity-70"
      : "flex-1 rounded-xl px-3 py-1.5 text-[12px] font-bold tracking-[0.08em] transition-colors disabled:cursor-not-allowed disabled:opacity-70";

  const renderButtonContent = (
    title: string,
    subtitle: string,
    textColor: string,
    icon: ReactNode,
  ) => (
    <div className="flex min-w-0 items-center gap-3">
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/45"
        style={{ color: textColor }}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <span className="block truncate text-sm leading-tight">{title}</span>
        <span className="mt-0.5 block text-[10px] font-medium normal-case tracking-normal opacity-80">
          {subtitle}
        </span>
      </div>
    </div>
  );

  const pesticideCard = sprayingPesticide
    ? { bg: "#dff2e1", fg: "#1f6a32", hover: "#d4ecd6", icon: "#1f6a32", border: "rgba(47,127,58,0.18)" }
    : { bg: "#fff1dc", fg: "#a15c00", hover: "#ffe7c5", icon: "#a15c00", border: "rgba(245,158,11,0.16)" };

  const insecticideCard = sprayingInsecticide
    ? { bg: "#dff2e1", fg: "#1f6a32", hover: "#d4ecd6", icon: "#1f6a32", border: "rgba(47,127,58,0.18)" }
    : { bg: "#e7f1ff", fg: "#245ea8", hover: "#dbeaff", icon: "#245ea8", border: "rgba(79,152,255,0.16)" };

  if (orientation === "stacked") {
    return (
      <div className="grid gap-3">
        <button
          type="button"
          onClick={handleSprayPesticide}
          className={buttonBaseClass}
          style={{
            backgroundColor: pesticideCard.bg,
            color: pesticideCard.fg,
            border: `1px solid ${pesticideCard.border}`,
          }}
          onMouseEnter={(event) => {
            event.currentTarget.style.backgroundColor = pesticideCard.hover;
          }}
          onMouseLeave={(event) => {
            event.currentTarget.style.backgroundColor = pesticideCard.bg;
          }}
        >
          {renderButtonContent(
            sprayingPesticide ? "Spraying...." : "Spray Pesticide",
            sprayingPesticide ? "Action in progress" : "Remote spraying control",
            pesticideCard.icon,
            <SprayPesticideIcon className="h-5 w-5" />,
          )}
          <span style={{ color: pesticideCard.fg }}>
            <ChevronRightIcon className="h-6 w-6" />
          </span>
        </button>

        <button
          type="button"
          onClick={handleSprayInsecticide}
          className={buttonBaseClass}
          style={{
            backgroundColor: insecticideCard.bg,
            color: insecticideCard.fg,
            border: `1px solid ${insecticideCard.border}`,
          }}
          onMouseEnter={(event) => {
            event.currentTarget.style.backgroundColor = insecticideCard.hover;
          }}
          onMouseLeave={(event) => {
            event.currentTarget.style.backgroundColor = insecticideCard.bg;
          }}
        >
          {renderButtonContent(
            sprayingInsecticide ? "Spraying...." : "Spray Insecticide",
            sprayingInsecticide ? "Action in progress" : "Remote spraying control",
            insecticideCard.icon,
            <SprayInsecticideIcon className="h-5 w-5" />,
          )}
          <span style={{ color: insecticideCard.fg }}>
            <ChevronRightIcon className="h-6 w-6" />
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={handleSprayPesticide}
        // disabled={sprayingPesticide}
        className="flex-1 rounded-xl px-3 py-1.5 text-[12px] font-bold tracking-[0.08em] transition-colors disabled:cursor-not-allowed disabled:opacity-70"
        style={{
          backgroundColor: pesticideColors.bg,
          color: pesticideColors.text,
        }}
        onMouseEnter={(event) => {
          event.currentTarget.style.backgroundColor = pesticideColors.hover;
        }}
        onMouseLeave={(event) => {
          event.currentTarget.style.backgroundColor = pesticideColors.bg;
        }}
      >
        {sprayingPesticide ? "STOP SPRAYING..." : "SPRAY PESTICIDE"}
      </button>

      <button
        type="button"
        onClick={handleSprayInsecticide}
        // disabled={sprayingInsecticide}
        className="flex-1 rounded-xl px-3 py-1.5 text-[12px] font-bold tracking-[0.08em] transition-colors disabled:cursor-not-allowed disabled:opacity-70"
        style={{
          backgroundColor: insecticideColors.bg,
          color: insecticideColors.text,
        }}
        onMouseEnter={(event) => {
          event.currentTarget.style.backgroundColor = insecticideColors.hover;
        }}
        onMouseLeave={(event) => {
          event.currentTarget.style.backgroundColor = insecticideColors.bg;
        }}
      >
        {sprayingInsecticide ? "STOP SPRAYING..." : "SPRAY INSECTICIDE"}
      </button>
    </div>
  );
};

export default SprayControls;
