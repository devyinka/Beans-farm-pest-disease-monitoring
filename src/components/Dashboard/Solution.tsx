"use client";

import { motion } from "framer-motion";
import { UIStatus, solutionProps } from "@/types/type";

const getActionLabel = (status: UIStatus): string => {
  const labels: Record<UIStatus, string> = {
    healthy: "RECOMMENDED ACTION",
    disease: "DISEASE INTERVENTION REQUIRED",
    pest: "PEST INTERVENTION REQUIRED",
  };
  return labels[status];
};

const getSolutionPalette = (status: UIStatus) => {
  const palettes: Record<
    UIStatus,
    {
      wrapper: string;
      card: string;
      labelBg: string;
      labelText: string;
      titleColor: string;
      descriptionColor: string;
      metaColor: string;
      progressTrack: string;
      progressFill: string;
      glow: string;
    }
  > = {
    healthy: {
      wrapper: "bg-transparent",
      card: "bg-white/70 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.04)] border border-white/40 border-l-4 border-l-[#2f7f3a]",
      labelBg: "bg-[#2f7f3a]/15",
      labelText: "text-[#0f4a27]",
      titleColor: "text-[#1c4a2b]",
      descriptionColor: "text-[#4f7059]",
      metaColor: "text-[#4f7059]",
      progressTrack: "bg-[#2f7f3a]/15",
      progressFill: "bg-[#2f7f3a]",
      glow: "shadow-[0_0_12px_rgba(47,127,58,0.4)]",
    },
    disease: {
      wrapper: "bg-transparent",
      card: "bg-white/70 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.04)] border border-white/40 border-l-4 border-l-[#4f98ff]",
      labelBg: "bg-[#4f98ff]/15",
      labelText: "text-[#0f244a]",
      titleColor: "text-[#173768]",
      descriptionColor: "text-[#5c7398]",
      metaColor: "text-[#5c7398]",
      progressTrack: "bg-[#4f98ff]/15",
      progressFill: "bg-[#4f98ff]",
      glow: "shadow-[0_0_12px_rgba(79,152,255,0.4)]",
    },
    pest: {
      wrapper: "bg-transparent",
      card: "bg-white/70 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.04)] border border-white/40 border-l-4 border-l-[#f59e0b]",
      labelBg: "bg-[#f59e0b]/15",
      labelText: "text-[#2a1204]",
      titleColor: "text-[#5b3111]",
      descriptionColor: "text-[#9a7656]",
      metaColor: "text-[#9a7656]",
      progressTrack: "bg-[#f59e0b]/15",
      progressFill: "bg-[#f59e0b]",
      glow: "shadow-[0_0_12px_rgba(245,158,11,0.4)]",
    },
  };

  return palettes[status];
};

export const Solution = ({ farmData, status }: solutionProps) => {
  const actionLabel = getActionLabel(status);
  const palette = getSolutionPalette(status);

  const safeAIData = {
    spray_action: farmData?.AIData?.spray_action ?? "Awaiting Action...",
    description:
      farmData?.AIData?.description ??
      "Fetching latest environmental analysis...",
    confidence: farmData?.AIData?.confidence ?? 0,
  };

  return (
    <section className={`h-full w-full px-4 pb-4 pt-4 ${palette.wrapper}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`flex h-full min-h-[18rem] flex-col rounded-2xl ${palette.card} p-5 sm:min-h-[24rem]`}
      >
        {/* Header Label with AI Sparkle Icon */}
        <div className="mb-5 flex items-start">
          <div
            className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-bold tracking-[0.08em] ${palette.labelBg} ${palette.labelText}`}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path>
            </svg>
            <span>{actionLabel}</span>
          </div>
        </div>

        {/* Title from AI */}
        <h2
          className={`mb-3 text-2xl font-bold tracking-tight ${palette.titleColor}`}
        >
          {safeAIData.spray_action}
        </h2>

        {/* Description from AI */}
        <p
          className={`mb-6 text-sm leading-relaxed ${palette.descriptionColor}`}
        >
          {safeAIData.description}
        </p>

        {/* Confidence Footer */}
        <div className="mt-auto flex flex-col justify-end space-y-3 pt-4">
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest">
            <span className={palette.metaColor}>AI Confidence</span>
            <span className={palette.labelText}>
              {Math.round(safeAIData.confidence)}%
            </span>
          </div>

          <div
            className={`h-2 w-full overflow-hidden rounded-full ${palette.progressTrack}`}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.round(safeAIData.confidence)}%` }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
              className={`h-full rounded-full ${palette.progressFill} ${palette.glow}`}
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
};
