"use client";

import { UIStatus } from "@/types/type";
import SprayControls from "./SprayControls";

type DashboardActionCenterProps = {
  machineLocation: string;
  status: UIStatus;
};

const getActionCenterPalette = (status: UIStatus) => {
  if (status === "disease") {
    return {
      sectionBg: "bg-[#e9edf6]",
      cardBg: "bg-[#f5f8ff]",
      borderColor: "border-[#4f98ff]",
      headerBg: "bg-[#0f244a]",
      headerTitle: "text-[#e4efff]",
      bodyText: "text-[#173768]",
      subText: "text-[#5c7398]",
      buttonBg: "#4f98ff",
      buttonText: "#f5f9ff",
      buttonHover: "#3f86e8",
    };
  }

  if (status === "pest") {
    return {
      sectionBg: "bg-[#f3ece3]",
      cardBg: "bg-[#fbf4ea]",
      borderColor: "border-[#f59e0b]",
      headerBg: "bg-[#2a1204]",
      headerTitle: "text-[#ffd9b0]",
      bodyText: "text-[#5b3111]",
      subText: "text-[#9a7656]",
      buttonBg: "#e19b42",
      buttonText: "#fff8ef",
      buttonHover: "#cc8a38",
    };
  }

  return {
    sectionBg: "bg-[#edf1e8]",
    cardBg: "bg-[#f7faf4]",
    borderColor: "border-[#2f7f3a]",
    headerBg: "bg-[#0f4a27]",
    headerTitle: "text-[#dbffe8]",
    bodyText: "text-[#1c4a2b]",
    subText: "text-[#4f7059]",
    buttonBg: "#2f7f3a",
    buttonText: "#f4fff7",
    buttonHover: "#3f9a4e",
  };
};

export const DashboardActionCenter = ({
  machineLocation,
  status,
}: DashboardActionCenterProps) => {
  const palette = getActionCenterPalette(status);

  return (
    <section className={`${palette.sectionBg} px-4 pb-4 pt-4 sm:px-6`}>
      <div
        className={`flex h-full min-h-72 flex-col overflow-hidden rounded-2xl border-2 ${palette.borderColor} ${palette.cardBg} shadow-[0_2px_8px_rgba(0,0,0,0.08)] sm:min-h-96`}
      >
        <div className={`${palette.headerBg} px-4 py-3 sm:px-5`}>
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className={`text-sm font-bold uppercase tracking-widest ${palette.headerTitle}`}>
                Action Center
              </h3>
              <p className="mt-1 text-xs text-white/70">
                Critical spraying controls.
              </p>
            </div>
            <span className="rounded-full border border-white/10 bg-white/10 px-2.5 py-1 text-[10px] font-semibold tracking-[0.08em] text-white/75">
              LIVE OPS
            </span>
          </div>
        </div>

        <div className="flex flex-1 flex-col justify-start gap-4 px-4 py-8 sm:px-5 sm:py-10">
          <SprayControls
            machineLocation={machineLocation}
            orientation="stacked"
            palette={{
              buttonBg: palette.buttonBg,
              buttonText: palette.buttonText,
              buttonHover: palette.buttonHover,
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default DashboardActionCenter;