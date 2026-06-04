"use client";

import { useEffect } from "react";
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
  onRemoteSettingsSave: (payload: ESP32ANDAIconfiguration) => Promise<void> | void;
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
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Close settings drawer"
        className="absolute inset-0 cursor-default bg-black/45 backdrop-blur-[2px]"
        onClick={onClose}
      />

      <aside className="absolute right-0 top-0 flex h-full w-full max-w-[460px] flex-col border-l border-white/10 bg-[linear-gradient(180deg,#f6f8f4_0%,#eef3ea_100%)] shadow-[0_30px_80px_rgba(0,0,0,0.35)] transition-transform duration-300 ease-out">
        <div className="flex items-center justify-between border-b border-[#d8e1d5] px-5 py-4">
          <div>
            <h2 className="text-xl font-bold text-[#10311c]">Settings</h2>
            <p className="mt-1 text-xs font-medium text-[#5d6e5f]">
              Farm and crop configuration stay here.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-[#d4ded0] bg-white px-3 py-2 text-sm font-semibold text-[#33543d] transition hover:bg-[#f3f7ef]"
          >
            Close
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
          <section className="rounded-[24px] border border-[#d7e2d3] bg-white/80 shadow-[0_12px_32px_rgba(15,59,32,0.08)]">
            <div className="border-b border-[#e4ece0] px-4 py-3">
              <h3 className="text-sm font-bold uppercase tracking-[0.1em] text-[#35503b]">
                Farm Configuration
              </h3>
            </div>
            <RemoteConfiguration
              status={status}
              defaultConfidence={remoteConfig.aiConfidence}
              defaultIntervalMinutes={remoteConfig.sensorPollingRateMinutes}
              machineLocation={machineLocation}
              onSave={onRemoteSettingsSave}
            />
          </section>

          <section className="rounded-[24px] border border-[#d7e2d3] bg-white/80 shadow-[0_12px_32px_rgba(15,59,32,0.08)]">
            <div className="border-b border-[#e4ece0] px-4 py-3">
              <h3 className="text-sm font-bold uppercase tracking-[0.1em] text-[#35503b]">
                Crop Configuration
              </h3>
            </div>
            <BeanAgeConfiguration
              status={status}
              defaultBeanAge={remoteConfig.BeanAge}
              onSave={onBeanAgeSave}
              machineLocation={machineLocation}
            />
          </section>

          <p className="px-2 pb-2 text-xs leading-relaxed text-[#607066]">
            Operational spray actions remain on the main dashboard so they stay
            immediately available during monitoring.
          </p>
        </div>
      </aside>
    </div>
  );
};

export default DashboardSettingsDrawer;