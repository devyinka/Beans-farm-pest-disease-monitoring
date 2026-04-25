"use client";

import { useEffect } from "react";
import TopNav from "@/components/Topnav";
import { useSocketStatus } from "@/context/socketContext";
import { useFarmData } from "@/hook/useFarmData";
import { useAlertHistory } from "@/hook/useAlertHistory";

import { mockDisease, mockHealthy, mockPest } from "@/Mock/Mockdata";
import { alertHistoryMock } from "@/Mock/Alertmock";

import {
  ChartDataSourceLabel,
  ClimateChartPoint,
  SoilChartPoint,
  FarmUpdatePayload,
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
  const { isConnected } = useSocketStatus();

  // Live values supplied by the socket hook (no mock fallback).
  const { farmData, chartdata, soilchartdata, minutesago, minituesnext } =
    useFarmData();

  const { alertHistory, fetchAlertHistory } = useAlertHistory();

  useEffect(() => {
    fetchAlertHistory();
  }, [fetchAlertHistory]);

  // Determine if we have live data or should fall back to mock for initial display.
  const hasLiveData = farmData !== null;
  const dashboardData = (farmData ?? mockDisease) as FarmUpdatePayload;

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
        lastReading={minutesago}
        nextReading={minituesnext}
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
      <div className="grid grid-cols-1 gap-4 bg-[#f9f9f9] p-4 md:grid-cols-2 md:items-stretch lg:grid-cols-3">
        <Solution farmData={dashboardData} status={status} />
        <Alerthistory
          AlertHistory={alertHistory.length ? alertHistory : alertHistoryMock}
          status={status}
        />
      </div>
    </div>
  );
};

export default DashboardPage;
