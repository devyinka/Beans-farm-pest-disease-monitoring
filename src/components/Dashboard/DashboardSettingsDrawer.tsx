"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BeanAgePayload,
  ESP32ANDAIconfiguration,
  RemoteConfig,
  UIStatus,
} from "@/types/type";
import { RemoteConfiguration } from "./RemoteConfiguration";
import { BeanAgeConfiguration } from "./BeanAgeConfiguration";

type DashboardSettingsDrawerProps = {
  open: boolean;
  onClose: () => void;
  status: UIStatus;
  machineLocation: string;
  remoteConfig: RemoteConfig;
  onRemoteSettingsSave: (
    payload: ESP32ANDAIconfiguration,
  ) => Promise<void> | void;
  onBeanAgeSave: (payload: BeanAgePayload) => Promise<void> | void;
};

export const DashboardSettingsDrawer = ({
  open,
  onClose,
  status,
  machineLocation,
  remoteConfig,
  onRemoteSettingsSave,
  onBeanAgeSave,
}: DashboardSettingsDrawerProps) => {
  // Track which accordion panel is open. Default to the first one.
  const [activeAccordion, setActiveAccordion] = useState<
    "remote" | "beanAge" | null
  >("remote");

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Frosted Glass Backdrop */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            type="button"
            aria-label="Close settings drawer"
            className="absolute inset-0 w-full h-full cursor-default bg-slate-950/40 backdrop-blur-sm border-none outline-none"
            onClick={onClose}
          />

          {/* Sliding Drawer Panel - Glassmorphic Base */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative flex h-full w-full max-w-[460px] flex-col border-l border-white/40 bg-white/60 backdrop-blur-2xl shadow-[-10px_0_30px_rgba(0,0,0,0.1)] z-10"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-white/20 bg-white/40 px-5 py-5">
              <div>
                <h2 className="text-xl font-black tracking-tight text-[#10311c]">
                  System Configuration
                </h2>
                <p className="mt-0.5 text-xs font-semibold tracking-wide text-[#5d6e5f] uppercase">
                  Farm & Crop Parameters
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full bg-black/5 px-4 py-2 text-xs font-bold text-[#33543d] transition-colors hover:bg-black/10"
              >
                CLOSE
              </button>
            </div>

            {/* Accordion List Body */}
            <div className="flex-1 overflow-y-auto w-full px-2 py-2">
              <div className="flex flex-col gap-1">
                <RemoteConfiguration
                  status={status}
                  defaultConfidence={remoteConfig.aiConfidence}
                  defaultIntervalMinutes={remoteConfig.sensorPollingRateMinutes}
                  machineLocation={machineLocation}
                  onSave={onRemoteSettingsSave}
                  isExpanded={activeAccordion === "remote"}
                  onToggle={() =>
                    setActiveAccordion((prev) =>
                      prev === "remote" ? null : "remote",
                    )
                  }
                />

                <BeanAgeConfiguration
                  status={status}
                  defaultBeanAge={remoteConfig.BeanAge}
                  onSave={onBeanAgeSave}
                  machineLocation={machineLocation}
                  isExpanded={activeAccordion === "beanAge"}
                  onToggle={() =>
                    setActiveAccordion((prev) =>
                      prev === "beanAge" ? null : "beanAge",
                    )
                  }
                />
              </div>

              <div className="p-4 mt-4"></div>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
};

export default DashboardSettingsDrawer;
