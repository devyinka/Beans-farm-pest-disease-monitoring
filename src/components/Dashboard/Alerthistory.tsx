"use client";

import { motion, Variants } from "framer-motion";
import { STATUS_STYLES } from "@/types/UIStstus";
import { alertHistoryprops, AlertHistoryItem, UIStatus } from "@/types/type";

const getAlertPalette = (status: UIStatus) => {
  const palettes: Record<
    UIStatus,
    {
      wrapper: string;
      card: string;
      headerTitle: string;
      badgeBg: string;
      badgeText: string;
      rowTitle: string;
      rowMeta: string;
      divider: string;
      hoverBg: string;
    }
  > = {
    healthy: {
      wrapper: "bg-transparent",
      card: "bg-white/70 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.04)] border border-white/40 border-l-4 border-l-[#2f7f3a]",
      headerTitle: "text-[#0f4a27]",
      badgeBg: "bg-[#2f7f3a]/15",
      badgeText: "text-[#0f4a27]",
      rowTitle: "text-[#1c4a2b]",
      rowMeta: "text-[#4f7059]",
      divider: "divide-black/5",
      hoverBg: "hover:bg-white/50",
    },
    disease: {
      wrapper: "bg-transparent",
      card: "bg-white/70 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.04)] border border-white/40 border-l-4 border-l-[#4f98ff]",
      headerTitle: "text-[#0f244a]",
      badgeBg: "bg-[#4f98ff]/15",
      badgeText: "text-[#0f244a]",
      rowTitle: "text-[#173768]",
      rowMeta: "text-[#5c7398]",
      divider: "divide-black/5",
      hoverBg: "hover:bg-white/50",
    },
    pest: {
      wrapper: "bg-transparent",
      card: "bg-white/70 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.04)] border border-white/40 border-l-4 border-l-[#f59e0b]",
      headerTitle: "text-[#2a1204]",
      badgeBg: "bg-[#f59e0b]/15",
      badgeText: "text-[#2a1204]",
      rowTitle: "text-[#5b3111]",
      rowMeta: "text-[#9a7656]",
      divider: "divide-black/5",
      hoverBg: "hover:bg-white/50",
    },
  };

  return palettes[status];
};

// Extracted the dot coloring to act like a glowing LED indicator
const getItemDotStyles = (itemStatus: UIStatus) => {
  const dots: Record<UIStatus, string> = {
    healthy: "bg-[#2f7f3a] shadow-[0_0_8px_rgba(47,127,58,0.5)]",
    disease: "bg-[#4f98ff] shadow-[0_0_8px_rgba(79,152,255,0.5)]",
    pest: "bg-[#f59e0b] shadow-[0_0_8px_rgba(245,158,11,0.5)]",
  };
  return dots[itemStatus] ?? dots.healthy;
};

// Framer Motion variants for cascading list items
const listVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      duration: 0.3,
      bounce: 0.4,
    },
  },
};

export const Alerthistory = ({
  AlertHistory,
  status,
  isLoading,
}: alertHistoryprops) => {
  const ui = STATUS_STYLES[status] ?? STATUS_STYLES.healthy;
  const palette = getAlertPalette(status);

  // Format timestamps into a compact dashboard-friendly label.
  const formatTime = (timestamp: string) =>
    new Intl.DateTimeFormat("en-US", {
      timeZone: "UTC",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(timestamp));

  return (
    <section className={`h-full w-full px-4 pb-4 pt-4 ${palette.wrapper}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`flex h-full min-h-[18rem] max-h-[22rem] flex-col overflow-hidden rounded-2xl ${palette.card} sm:min-h-[24rem] sm:max-h-[24rem]`}
      >
        {/* Header section with badge */}
        <div className="flex items-center justify-between gap-3 border-b border-black/5 px-5 py-4">
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
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
            </div>
            <h2 className={`text-[15px] font-bold ${palette.headerTitle}`}>
              Alert History
            </h2>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${palette.badgeBg} ${palette.badgeText}`}
          >
            {AlertHistory.length} Logged
          </span>
        </div>

        {/* Scrollable List Body */}
        {/* Note: Added scrollbar utility classes for a clean look */}
        <div
          className={`flex min-h-0 flex-1 flex-col overflow-y-auto divide-y ${palette.divider} scrollbar-thin scrollbar-track-transparent scrollbar-thumb-black/10`}
        >
          {isLoading ? (
            <div
              className={`flex flex-1 items-center justify-center px-4 py-6 text-center text-sm font-medium ${palette.rowMeta}`}
            >
              <motion.span
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                Syncing logs...
              </motion.span>
            </div>
          ) : AlertHistory.length === 0 ? (
            <div
              className={`flex flex-1 items-center justify-center px-4 py-6 text-center text-sm font-medium ${palette.rowMeta}`}
            >
              System stable. No recent alerts.
            </div>
          ) : (
            <motion.div
              variants={listVariants}
              initial="hidden"
              animate="show"
              className="flex flex-col"
            >
              {AlertHistory.map((alert: AlertHistoryItem, index) => {
                const dotStyle = getItemDotStyles(alert.status);
                return (
                  <motion.div
                    variants={itemVariants}
                    key={`${alert.timeStamp}-${index}`}
                    className={`flex items-start gap-4 px-5 py-4 transition-colors ${palette.hoverBg}`}
                  >
                    <span
                      className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${dotStyle}`}
                    />
                    <div className="min-w-0 flex-1">
                      <div className={`text-sm font-bold ${palette.rowTitle}`}>
                        {alert.farmstatus}
                      </div>
                      <div
                        className={`mt-0.5 text-[11px] font-medium tracking-wide ${palette.rowMeta}`}
                      >
                        {formatTime(alert.timeStamp)}
                        <span className="mx-2 opacity-50">•</span>
                        <span
                          className={
                            alert.smsAlertSent
                              ? "text-green-600/80"
                              : "opacity-70"
                          }
                        >
                          {alert.smsAlertSent
                            ? "SMS Delivered"
                            : "No SMS Triggered"}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </motion.div>
    </section>
  );
};
