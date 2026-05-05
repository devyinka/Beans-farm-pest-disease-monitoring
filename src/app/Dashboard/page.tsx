"use client";

import { useEffect, useState } from "react";
import TopNav from "@/components/Topnav";
import { useSocketStatus } from "@/context/socketContext";
import { useFarmData } from "@/hook/useFarmData";
import { useAlertHistory } from "@/hook/useAlertHistory";

import { mockDisease, mockHealthy, mockPest } from "@/Mock/Mockdata";
import { alertHistoryMock } from "@/Mock/Alertmock";
import { remoteConfigDefault } from "@/Mock/RemoteConfig";

import {
  ChartDataSourceLabel,
  ClimateChartPoint,
  SoilChartPoint,
  FarmUpdatePayload,
  BeanAgePayload,
  RemoteTuningPayload,
  RemoteConfig,
  UIStatus,
} from "@/types/type";
import ClimateLineChart from "@/components/Dashboard/ClimateLineChart";
import SoilLineChart from "@/components/Dashboard/SoilLineChart";
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
import axios from "axios";
// Helper to extract specific sensor values from the farm data payload
const getSensorValue = (
  sensors: Array<{ id: string; value: number }>,
  sensorId: string,
  fallback = 0,
) => {
  const sensor = sensors.find((entry) => entry.id === sensorId);
  return typeof sensor?.value === "number" ? sensor.value : fallback;
};

// Main dashboard page component
const DashboardPage = () => {
  const BACKENDURL =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5001";
  const { isConnected } = useSocketStatus();

  const [remoteConfig, setRemoteConfig] =
    useState<RemoteConfig>(remoteConfigDefault);

  // Local header timing override used after remote configuration is successfully saved.
  const [configAppliedAt, setConfigAppliedAt] = useState<number | null>(null);
  const [configIntervalMinutes, setConfigIntervalMinutes] = useState<
    number | null
  >(null);
  // Keep the initial render deterministic so SSR and hydration agree.
  const [clockTick, setClockTick] = useState<number>(0);

  // Live values supplied by the socket hook (no mock fallback).
  const { farmData, chartdata, soilchartdata, minutesago, minituesnext } =
    useFarmData();

  const { alertHistory, fetchAlertHistory } = useAlertHistory();

  useEffect(() => {
    fetchAlertHistory();
  }, [fetchAlertHistory]);

  useEffect(() => {
    if (configAppliedAt === null || configIntervalMinutes === null) return;

    const timer = setInterval(() => {
      setClockTick(Date.now());
    }, 60000);

    return () => clearInterval(timer);
  }, [configAppliedAt, configIntervalMinutes]);

  // Determine if we have live data or should fall back to mock for initial display.
  const hasLiveData = farmData !== null;
  const dashboardData = (farmData ?? mockHealthy) as FarmUpdatePayload;

  const status = (dashboardData.AIData.ui_status as UIStatus) ?? "healthy";
  const ui = STATUS_STYLES[status] ?? STATUS_STYLES.healthy;

  // Seed data points for charts to ensure they render even if live data hasn't arrived yet.
  const climateSeed: ClimateChartPoint = {
    time: dashboardData.timestamp,
    temp: getSensorValue(dashboardData.sensors, "temp"),
    hum: getSensorValue(dashboardData.sensors, "hum"),
    alert:
      dashboardData.AIData.sms_alert_sent ||
      dashboardData.AIData.ui_status !== "healthy",
    status,
  };
  // For soil chart, we also want to include pH as a key metric, so we create a separate seed point.
  const soilSeed: SoilChartPoint = {
    time: dashboardData.timestamp,
    soil: getSensorValue(dashboardData.sensors, "soil"),
    ph: getSensorValue(dashboardData.sensors, "ph"),
    alert:
      dashboardData.AIData.sms_alert_sent ||
      dashboardData.AIData.ui_status !== "healthy",
    status,
  };
  // Use live chart data if available, otherwise use the seed point to render an initial chart.
  const climateChartData = chartdata.length ? chartdata : [climateSeed];
  const soilChartData = soilchartdata.length ? soilchartdata : [soilSeed];

  // Data source badge for chart headers.
  const dataSourceLabel: ChartDataSourceLabel = hasLiveData
    ? "LIVE STREAM"
    : "MOCK SEED";

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
        description={dashboardData.farmInfo.name}
        theme={ui.headerTheme}
        dotColor={ui.dotColor}
        titleColor={ui.headerTitleColor}
        readingColor={ui.readingColor}
        lastReading={displayLastReading}
        nextReading={displayNextReading}
      />

      <FarmstatusBox
        imageurl={ui.image}
        AIconfidence={Math.round(dashboardData.AIData.confidence)}
        statusLabel={ui.statusLabel}
        Title={dashboardData.AIData.ui_title}
        subtitle={dashboardData.AIData.description}
        backgroundClass={ui.bodyBg}
        statusColor={ui.statusColor}
        titleColor={ui.titleColor}
        subtitleColor={ui.subtitleColor}
        confidenceLabel={ui.confidenceLabel}
        confidenceColor={ui.confidenceColor}
        predictionLabel={ui.predictionLabel}
      />

      <AlertStrip
        sprayAction={dashboardData.AIData.spray_action}
        smsAlertSent={dashboardData.AIData.sms_alert_sent}
        alertStripBg={ui.alertStripBg}
        alertTextColor={ui.alertTextColor}
        alertBadgeBg={ui.alertBadgeBg}
        alertBadgeTextColor={ui.alertBadgeTextColor}
      />

      <SensorGrid
        sensors={dashboardData.sensors}
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
      />
      <SoilLineChart
        data={soilChartData}
        isConnected={isConnected}
        status={status}
        dataSourceLabel={dataSourceLabel}
      />
      <section className="bg-[#f9f9f9] p-4">
        <h3 className="mb-3 text-sm font-bold tracking-[0.08em] text-[#5c6672] uppercase">
          Farm Monitoring Insights
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:items-stretch">
          <Solution farmData={dashboardData} status={status} />
          <Alerthistory
            AlertHistory={alertHistory.length ? alertHistory : alertHistoryMock}
            status={status}
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

        <div className="grid grid-cols- gap-4 md:grid-cols-2 md:items-stretch">
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
      </section>
    </div>
  );
};

export default DashboardPage;
