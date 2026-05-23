"use client";

import { useEffect, useState } from "react";
import TopNav from "@/components/Topnav";
import { useSocketStatus } from "@/context/socketContext";
import { useFarmData } from "@/hook/useFarmData";
import { useAlertHistory } from "@/hook/useAlertHistory";
import Link from "next/link";

import { mockDisease, mockHealthy, mockPest } from "@/Mock/Mockdata";
import { remoteConfigDefault } from "@/Mock/RemoteConfig";

import {
  ChartDataSourceLabel,
  FarmUpdatePayload,
  BeanAgePayload,
  RemoteConfig,
  UIStatus,
  ThresholdPayload,
  RemoteConfigPayload,
  ESP32ANDAIconfiguration,
} from "@/types/type";
import ClimateLineChart from "@/components/Dashboard/ClimateLineChart";
import {
  AlertStrip,
  Header,
  SensorGrid,
} from "@/components/Dashboard/topHeader";
import { FarmstatusBox } from "@/components/Dashboard/Farmstatusbox";
import { STATUS_STYLES } from "@/types/UIStstus";
import { Solution } from "@/components/Dashboard/Solution";
import { Alerthistory } from "@/components/Dashboard/Alerthistory";
import { RemoteConfiguration } from "@/components/Dashboard/RemoteConfiguration";
import { BeanAgeConfiguration } from "@/components/Dashboard/BeanAgeConfiguration";
import { ThresholdConfiguration } from "@/components/Dashboard/ThresholdConfiguration";
import { useUserLoginContext } from "@/context/userLogincontex";

import BACKENDAPI from "@/API";

const getStoredMachineLocation = (): string => {
  if (typeof window === "undefined") return "";

  return localStorage.getItem("beanfarm_machine_location")?.trim() ?? "";
};

// Main dashboard page component
const DashboardPage = () => {
  // const BACKENDURL =process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5001";
  const { isConnected } = useSocketStatus();
  // const { userProfile } = useUserLoginContext();

  const [remoteConfig, setRemoteConfig] =
    useState<RemoteConfig>(remoteConfigDefault);

  const [thresholdConfig, setThresholdConfig] = useState<ThresholdPayload>({
    luxThreshold: 5000,
    hotDayTempThreshold: 35,
    wetNightHumThreshold: 85,
    drySoilThreshold: 20,
    floodedSoilThreshold: 80,
  });

  const [configIntervalMinutes, setConfigIntervalMinutes] = useState<
    number | null
  >(null);

  // Live values supplied by the socket hook (no mock fallback).
  const { farmData, chartdata, minutesago, minituesnext, isHistoryLoading } =
    useFarmData();

  const {
    alertHistory,
    fetchAlertHistory,
    isLoading: isAlertHistoryLoading,
  } = useAlertHistory();

  const [seedLocation] = useState<string>(getStoredMachineLocation);

  const machineLocation = farmData?.farmInfo?.name?.trim() || seedLocation;
  // const machineLocation = userProfile?.machineLocation?.trim();
  useEffect(() => {
    if (!machineLocation) return;

    void fetchAlertHistory(machineLocation);
  }, [fetchAlertHistory, machineLocation]);

  // ... existing code ...
  useEffect(() => {
    if (!machineLocation) return;
    void fetchAlertHistory(machineLocation);
  }, [fetchAlertHistory, machineLocation]);

  useEffect(() => {
    if (!machineLocation) return;

    const fetchConfiguration = async () => {
      try {
        const response = await BACKENDAPI.get("/get/SensorPollingRate", {
          params: { machine_location: machineLocation },
        });
        console.log("2. Raw Backend Response:", response.data);

        const config =
          response.data?.config || response.data?.data || response.data;

        if (config && typeof config === "object") {
          const actualRate = config.sensorPollingRate;

          if (actualRate !== undefined) {
            setRemoteConfig((prev) => ({
              ...prev,
              aiConfidence: config.aiConfidence,
              sensorPollingRateMinutes: actualRate,
              BeanAge: config.beansPlantingDate,
            }));
            setConfigIntervalMinutes(actualRate);
          } else {
            console.warn(
              "FAILED: Neither polling rate variable was found in the object!",
            );
          }
        }
      } catch (error) {
        console.error("Fetch completely failed:", error);
      }
    };

    void fetchConfiguration();
  }, [machineLocation]);

  if (!farmData) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <p className="text-gray-500 font-semibold">Loading farm data...</p>
      </div>
    );
  }

  // Determine if we have live data or should fall back to mock for initial display.
  const hasLiveData = farmData !== null;
  const dashboardData = farmData as FarmUpdatePayload;

  //  Create "safe" versions of the data that provide defaults if any fields are missing. This ensures the UI can render without errors even if some data is not yet available from the backend.
  const safeAIData = {
    ui_status: dashboardData?.AIData?.ui_status ?? "healthy",// i will update this to demostrate the different states, but for now default to healthy to show the full UI.
    ui_title: dashboardData?.AIData?.ui_title ?? "Monitoring...",
    confidence: dashboardData?.AIData?.confidence ?? 0,
    description: dashboardData?.AIData?.description ?? "Fetching analysis...",
    spray_action: dashboardData?.AIData?.spray_action ?? "N/A",
    sms_alert_sent: dashboardData?.AIData?.sms_alert_sent ?? false,
  };

  const safeLocationName =
    dashboardData?.farmInfo?.name ?? seedLocation ?? "Unknown Farm";

  const status = (safeAIData.ui_status as UIStatus) ?? "healthy";
  const ui = STATUS_STYLES[status] ?? STATUS_STYLES.healthy;

  // Chart series now come from backend raw history first, then grow with live socket updates.
  const climateChartData = chartdata;

  // Data source badge for chart headers.
  const dataSourceLabel: ChartDataSourceLabel = hasLiveData
    ? "LIVE STREAM"
    : "SENSOR HISTORY";

  // Calculate time until next reading based on backend config, falling back to socket timing if config is not yet loaded. This allows the "Next Reading In" timer in the header to reflect the actual configured polling rate as soon as it's available, while still showing a countdown based on live socket data in the meantime.
  const displayLastReading = minutesago;

  const displayNextReading =
    configIntervalMinutes !== null
      ? Math.max(0, configIntervalMinutes - minutesago)
      : minituesnext;
  // Handlers to apply remote configuration changes to the UI immediately after saving, even if the backend request fails. This ensures the user sees their changes reflected in the dashboard right away, providing a more responsive experience.
  const applyRemoteTuningToUI = (payload: RemoteConfigPayload) => {
    setRemoteConfig((prev) => ({
      ...prev,
      aiConfidence: payload.aiConfidence,
      sensorPollingRateMinutes: payload.sensorPollingRateMinutes,
      BeanAge: payload.plantingDate,
    }));

    setConfigIntervalMinutes(payload.sensorPollingRateMinutes);
  };

  // Handler to apply updated bean planting date to the UI immediately after saving, ensuring the new planting date is reflected in the dashboard without waiting for a backend response.
  const applyBeanAgeToUI = (payload: BeanAgePayload) => {
    setRemoteConfig((prev) => ({
      ...prev,
      BeanAge: payload.plantingDate,
    }));
  };

  // Handler for when the user saves new remote configuration settings from the dashboard UI. This will send the updated config to the backend and also update local state to reflect the new settings immediately in the UI.
  const handleRemoteSettingsSave = async (payload: ESP32ANDAIconfiguration) => {
    console.log("Data leaving frontend:", {
      aiConfidence: payload.aiConfidence,
      sensorPollingRateMinutes: payload.sensorPollingRateMinutes,
      machine_location: payload.machine_location,
    });
    try {
      const response = await BACKENDAPI.post("/Device/Configuration", {
        aiConfidence: payload.aiConfidence,
        sensorPollingRateMinutes: payload.sensorPollingRateMinutes,
        machine_location: payload.machine_location,
      });
      if (response) {
        applyRemoteTuningToUI(payload as RemoteConfigPayload);
      }
    } catch (error) {
      console.error("Failed to save remote settings:", error);
      // applyRemoteTuningToUI(payload);
    }
  };

  const handleBeanAgeSave = async (payload: BeanAgePayload) => {
    try {
      const response = await BACKENDAPI.post(
        "/update/BeanPlantingDate",
        payload,
      );
      if (response) {
        applyBeanAgeToUI(payload);
      }
    } catch (error) {
      console.error("Failed to save bean age:", error);
      // applyBeanAgeToUI(payload);
    }
  };

  const handleThresholdSave = async (payload: ThresholdPayload) => {
    try {
      const response = await BACKENDAPI.post("Device/Thresholds", payload);
      console.log("Thresholds saved successfully:", response.data);
      setThresholdConfig(payload);
    } catch (error) {
      console.error("Failed to save thresholds:", error);
      setThresholdConfig(payload);
    }
  };

  return (
    <div>
      <TopNav
        navClassName={ui.topNavTheme}
        borderColor={ui.topNavBorder}
        dotColor={ui.topNavDot}
        descriptionColor={ui.topNavTitle}
        clockBorderColor={ui.topNavClockBorder}
      />
      <div className={`${ui.dividerBg} py-4`}></div>

      <Header
        description={safeLocationName}
        theme={ui.headerTheme}
        dotColor={ui.dotColor}
        titleColor={ui.headerTitleColor}
        readingColor={ui.readingColor}
        lastReading={displayLastReading}
        nextReading={displayNextReading}
      />

      <FarmstatusBox
        imageurl={ui.image}
        AIconfidence={Math.round(safeAIData.confidence)}
        statusLabel={ui.statusLabel}
        Title={safeAIData.ui_title}
        subtitle={safeAIData.description}
        backgroundClass={ui.bodyBg}
        statusColor={ui.statusColor}
        titleColor={ui.titleColor}
        subtitleColor={ui.subtitleColor}
        confidenceLabel={ui.confidenceLabel}
        confidenceColor={ui.confidenceColor}
        predictionLabel={ui.predictionLabel}
      />

      <AlertStrip
        sprayAction={safeAIData.spray_action}
        smsAlertSent={safeAIData.sms_alert_sent}
        alertStripBg={ui.alertStripBg}
        alertTextColor={ui.alertTextColor}
        alertBadgeBg={ui.alertBadgeBg}
        alertBadgeTextColor={ui.alertBadgeTextColor}
      />

      <SensorGrid
        sensors={dashboardData?.sensors ?? []}
        status={status}
        sectionBg={ui.sensorSectionBg}
        cardBg={ui.sensorCardBg}
        cardBorderColor={ui.sensorCardBorderColor}
        valueColor={ui.sensorValueColor}
        labelColor={ui.sensorLabelColor}
        hintColor={ui.sensorHintColor}
      />
      <ClimateLineChart
        data={climateChartData}
        isConnected={isConnected}
        status={status}
        dataSourceLabel={dataSourceLabel}
        isLoading={isHistoryLoading && climateChartData.length === 0}
      />
      <section className="bg-[#f9f9f9] p-4">
        <h3 className="mb-3 text-sm font-bold tracking-[0.08em] text-[#5c6672] uppercase">
          Farm Monitoring Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:items-stretch">
          <Solution farmData={dashboardData} status={status} />
          <Alerthistory
            AlertHistory={alertHistory}
            status={status}
            isLoading={isAlertHistoryLoading}
          />
        </div>
      </section>

      <section className="bg-[#eef1f5] px-4 py-5">
        <div className="mb-3">
          <h3 className="text-sm font-bold tracking-[0.08em] text-[#4a5565] uppercase">
            ESP32 Installation & Farm Setup
          </h3>
          <p className="mt-1 text-xs text-[#6a7382]">
            These controls are for system setup and commissioning, separate from
            live monitoring data.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:items-stretch">
          <RemoteConfiguration
            status={status}
            defaultConfidence={remoteConfig.aiConfidence}
            defaultIntervalMinutes={remoteConfig.sensorPollingRateMinutes}
            machineLocation={machineLocation}
            onSave={handleRemoteSettingsSave}
          />
          <BeanAgeConfiguration
            status={status}
            defaultBeanAge={remoteConfig.BeanAge}
            onSave={handleBeanAgeSave}
            machineLocation={machineLocation}
          />
        </div>

        <div className="mt-4">
          <Link
            href="/Dashboard/test"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-linear-to-r from-[#67b978] to-[#2f7f3a] text-[#f4fff7] font-semibold text-sm rounded-lg hover:shadow-lg transition-all duration-300 hover:shadow-[#2f7f3a]/50 hover:scale-105 active:scale-95 w-full justify-center"
          >
            <span className="hidden sm:inline">Test Algorithm Prediction</span>
            <span className="sm:hidden">Test Algorithm</span>
          </Link>
        </div>

        {/* <div className="mt-4">
          <ThresholdConfiguration
            status={status}
            defaultThresholds={thresholdConfig}
            onSave={handleThresholdSave}
          />
        </div> */}
      </section>
    </div>
  );
};

export default DashboardPage;
