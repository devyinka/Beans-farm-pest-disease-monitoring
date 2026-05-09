"use client";

import { useEffect, useState } from "react";
import TopNav from "@/components/Topnav";
import { useSocketStatus } from "@/context/socketContext";
import { useFarmData } from "@/hook/useFarmData";
import { useAlertHistory } from "@/hook/useAlertHistory";

import { mockDisease, mockHealthy, mockPest } from "@/Mock/Mockdata";
import { remoteConfigDefault } from "@/Mock/RemoteConfig";

import {
  ChartDataSourceLabel,
  FarmUpdatePayload,
  BeanAgePayload,
  RemoteTuningPayload,
  RemoteConfig,
  UIStatus,
  ThresholdPayload,
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
import axios from "axios";

const getStoredMachineLocation = (): string => {
  if (typeof window === "undefined") return "";

  return localStorage.getItem("beanfarm_machine_location")?.trim() ?? "";
};

// Main dashboard page component
const DashboardPage = () => {
  const BACKENDURL =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5001";
  const { isConnected } = useSocketStatus();

  const [remoteConfig, setRemoteConfig] =
    useState<RemoteConfig>(remoteConfigDefault);

  const [thresholdConfig, setThresholdConfig] = useState<ThresholdPayload>({
    luxThreshold: 5000,
    hotDayTempThreshold: 35,
    wetNightHumThreshold: 85,
    drySoilThreshold: 20,
    floodedSoilThreshold: 80,
  });

  // Local header timing override used after remote configuration is successfully saved.
  const [configAppliedAt, setConfigAppliedAt] = useState<number | null>(null);
  const [configIntervalMinutes, setConfigIntervalMinutes] = useState<
    number | null
  >(null);
  // Keep the initial render deterministic so SSR and hydration agree.
  const [clockTick, setClockTick] = useState<number>(0);

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

  useEffect(() => {
    if (!machineLocation) return;

    void fetchAlertHistory(machineLocation);
  }, [fetchAlertHistory, machineLocation]);

  useEffect(() => {
    if (configAppliedAt === null || configIntervalMinutes === null) return;

    const timer = setInterval(() => {
      setClockTick(Date.now());
    }, 60000);

    return () => clearInterval(timer);
  }, [configAppliedAt, configIntervalMinutes]);

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
    ui_status: dashboardData?.AIData?.ui_status ?? "healthy",
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

  const hasConfigTimingOverride =
    configAppliedAt !== null && configIntervalMinutes !== null;

  const elapsedSinceConfigSave = hasConfigTimingOverride
    ? Math.floor((clockTick - configAppliedAt) / 60000)
    : 0;

  const displayLastReading = hasConfigTimingOverride
    ? Math.max(0, elapsedSinceConfigSave)
    : minutesago;

  const displayNextReading = hasConfigTimingOverride
    ? Math.max(0, configIntervalMinutes - elapsedSinceConfigSave)
    : minituesnext;

  // Handlers to apply remote configuration changes to the UI immediately after saving, even if the backend request fails. This ensures the user sees their changes reflected in the dashboard right away, providing a more responsive experience.
  const applyRemoteTuningToUI = (payload: RemoteTuningPayload) => {
    setRemoteConfig((prev) => ({
      aiConfidence: payload.aiConfidence,
      sensorPollingRateMinutes: payload.sensorPollingRateMinutes,
      BeanAge: prev.BeanAge,
    }));

    const now = Date.now();
    setConfigAppliedAt(now);
    setConfigIntervalMinutes(payload.sensorPollingRateMinutes);
    setClockTick(now);
  };

  const applyBeanAgeToUI = (payload: BeanAgePayload) => {
    setRemoteConfig((prev) => ({
      ...prev,
      BeanAge: payload.plantingDate,
    }));
  };

  // Handler for when the user saves new remote configuration settings from the dashboard UI. This will send the updated config to the backend and also update local state to reflect the new settings immediately in the UI.
  const handleRemoteSettingsSave = async (payload: RemoteTuningPayload) => {
    try {
      const response = await axios.post(
        `${BACKENDURL}/api/device-config/remote-settings`,
        payload,
      );
      console.log("Remote settings saved successfully:", response.data);
      applyRemoteTuningToUI(payload);
    } catch (error) {
      console.error("Failed to save remote settings:", error);
      applyRemoteTuningToUI(payload);
    }
  };

  const handleBeanAgeSave = async (payload: BeanAgePayload) => {
    try {
      const response = await axios.post(
        `${BACKENDURL}/api/device-config/bean-age`,
        payload,
      );
      console.log("Bean age saved successfully:", response.data);
      applyBeanAgeToUI(payload);
    } catch (error) {
      console.error("Failed to save bean age:", error);
      applyBeanAgeToUI(payload);
    }
  };

  const handleThresholdSave = async (payload: ThresholdPayload) => {
    try {
      const response = await axios.post(
        `${BACKENDURL}/api/device-config/thresholds`,
        payload,
      );
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
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:items-stretch">
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

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:items-stretch">
          <RemoteConfiguration
            status={status}
            defaultConfidence={remoteConfig.aiConfidence}
            defaultIntervalMinutes={remoteConfig.sensorPollingRateMinutes}
            onSave={handleRemoteSettingsSave}
          />
          <BeanAgeConfiguration
            status={status}
            defaultBeanAge={remoteConfig.BeanAge}
            onSave={handleBeanAgeSave}
          />
        </div>

        <div className="mt-4">
          <ThresholdConfiguration
            status={status}
            defaultThresholds={thresholdConfig}
            onSave={handleThresholdSave}
          />
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
