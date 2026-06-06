"use client";

import { motion } from "framer-motion";
import { UIStatus } from "@/types/type";
import SprayControls from "./SprayControls";

type DashboardActionCenterProps = {
  machineLocation: string;
  status: UIStatus;
};

const getActionCenterPalette = (status: UIStatus) => {
  const palettes = {
    healthy: {
      wrapper: "bg-transparent",
      card: "bg-white/70 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.04)] border border-white/40 border-l-4 border-l-[#2f7f3a]",
      headerTitle: "text-[#1c4a2b]",
      badgeBg: "bg-[#2f7f3a]/15",
      badgeText: "text-[#0f4a27]",
      badgePulse: "bg-[#2f7f3a]",
    },
    disease: {
      wrapper: "bg-transparent",
      card: "bg-white/70 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.04)] border border-white/40 border-l-4 border-l-[#4f98ff]",
      headerTitle: "text-[#173768]",
      badgeBg: "bg-[#4f98ff]/15",
      badgeText: "text-[#0f244a]",
      badgePulse: "bg-[#4f98ff]",
    },
    pest: {
      wrapper: "bg-transparent",
      card: "bg-white/70 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.04)] border border-white/40 border-l-4 border-l-[#f59e0b]",
      headerTitle: "text-[#5b3111]",
      badgeBg: "bg-[#f59e0b]/15",
      badgeText: "text-[#2a1204]",
      badgePulse: "bg-[#f59e0b]",
    },
  };

  return palettes[status] ?? palettes.healthy;
};

export const DashboardActionCenter = ({
  machineLocation,
  status,
}: DashboardActionCenterProps) => {
  const palette = getActionCenterPalette(status);

  return (
    <section className={`${palette.wrapper} px-4 pb-4 pt-4 sm:px-6`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`flex h-full min-h-[18rem] flex-col overflow-hidden rounded-2xl ${palette.card} sm:min-h-[24rem]`}
      >
        <div className="border-b border-black/5 px-5 py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-black/5 bg-white shadow-sm">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={palette.headerTitle}
                >
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                </svg>
              </div>
              <h3 className={`text-[15px] font-bold ${palette.headerTitle}`}>
                Action Center
              </h3>
            </div>

            <div
              className={`flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-bold tracking-[0.08em] ${palette.badgeBg} ${palette.badgeText}`}
            >
              <span className="relative flex h-2 w-2">
                <span
                  className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${palette.badgePulse}`}
                ></span>
                <span
                  className={`relative inline-flex h-2 w-2 rounded-full ${palette.badgePulse}`}
                ></span>
              </span>
              LIVE OPS
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col justify-start gap-4 p-5 sm:p-6">
          <SprayControls
            machineLocation={machineLocation}
            orientation="stacked"
          />
        </div>
      </motion.div>
    </section>
  );
};

export default DashboardActionCenter;
