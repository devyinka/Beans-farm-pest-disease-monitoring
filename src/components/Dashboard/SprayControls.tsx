"use client";
import BACKENDAPI from "@/API";
import { useState } from "react";

interface SprayPalette {
  buttonBg: string;
  buttonText: string;
  buttonHover: string;
}

interface SprayControlsProps {
  machineLocation: string;
  palette: SprayPalette;
}

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
