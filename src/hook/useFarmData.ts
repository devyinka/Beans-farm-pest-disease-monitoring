import { useState, useEffect, useCallback, useRef } from "react";
import { FarmSocket } from "@/socket/socket";
import { useSocket } from "./useSocket";
import BACKENDAPI from "@/API";
import type {
  FarmUpdatePayload,
  ClimateChartPoint,
  SensorReading,
  SoilChartPoint,
  RawSensorHistoryRecord,
} from "@/types/type";

const HISTORY_WINDOW_HOURS = 24;

const getSensorValue = (
  sensors: SensorReading[],
  sensorId: string,
  fallback: number,
): number => {
  const sensor = sensors.find((entry) => entry.id === sensorId);
  return typeof sensor?.value === "number" ? sensor.value : fallback;
};

const toClimatePoint = (
  reading: RawSensorHistoryRecord,
  status: FarmUpdatePayload["AIData"]["ui_status"],
): ClimateChartPoint => ({
  time: reading.timeStamp,
  temp: Number(reading.temperature ?? 0),
  hum: Number(reading.humidity ?? 0),
  // Historical points come from MongoDB, so we leave alert off and let live
  // Socket.IO updates paint any current alert markers.
  alert: false,
  status,
});

const toSoilPoint = (
  reading: RawSensorHistoryRecord,
  status: FarmUpdatePayload["AIData"]["ui_status"],
): SoilChartPoint => ({
  time: reading.timeStamp,
  soil: Number(reading.soil_moisture ?? 0),
  ph: Number(reading.soil_ph ?? 0),
  alert: false,
  status,
});

// Custom hook to manage farm data and chart updates
export const useFarmData = () => {
  // Latest payload from backend Socket.IO event (single source of truth for dashboard cards/status).
  const [farmData, setFarmData] = useState<FarmUpdatePayload | null>(null);

  // Live chart history built only from backend socket events (no mock seed, no localStorage restore).
  const [chartdata, setChartdata] = useState<ClimateChartPoint[]>([]);
  const [soilchartdata, setSoilChartdata] = useState<SoilChartPoint[]>([]);
  const [currentinterval, setCurrentInterval] = useState<number>(30);

  const [lastminue, setLastminute] = useState<number | null>(null);
  const [minutesago, setMinutesago] = useState<number>(0);
  const [minituesnext, setMinutesnext] = useState<number>(0);
  const loadedHistoryForLocation = useRef<string | null>(null);

  const loadHistoryForLocation = useCallback(
    async (
      machineLocation: string,
      status: FarmUpdatePayload["AIData"]["ui_status"],
    ) => {
      // Load the initial 24-hour series only once per farm location.
      if (
        !machineLocation ||
        loadedHistoryForLocation.current === machineLocation
      ) {
        return;
      }

      try {
        const response = await BACKENDAPI.get<{
          readings: RawSensorHistoryRecord[];
        }>("/sensor/history", {
          params: {
            machine_location: machineLocation,
            hours: HISTORY_WINDOW_HOURS,
          },
        });

        const readings = response.data.readings ?? [];

        const historicalClimate = readings.map((reading) =>
          toClimatePoint(reading, status),
        );
        const historicalSoil = readings.map((reading) =>
          toSoilPoint(reading, status),
        );

        // Replace the empty chart state with MongoDB history before live socket updates arrive.
        setChartdata(historicalClimate);
        setSoilChartdata(historicalSoil);

        loadedHistoryForLocation.current = machineLocation;
        console.info(
          "Loaded 24-hour raw sensor history for chart seed:",
          machineLocation,
          readings.length,
        );
      } catch (error) {
        console.error("Failed to load raw sensor history for charts:", error);
      }
    },
    [],
  );

  const onfarmupdate = useCallback(
    (data: FarmUpdatePayload) => {
      // 1) Save latest backend payload.
      setFarmData(data);
      const activeInterval = data.datainterval || currentinterval;
      setCurrentInterval(activeInterval);

      // 2) Append temperature/humidity point from backend sensors.
      setChartdata((prev) => {
        const previousPoint = prev[prev.length - 1];

        // Reuse the last reading as a fallback so a missing sensor value does not break the line.
        const newpoint: ClimateChartPoint = {
          time: data.timestamp,
          temp: Number(
            getSensorValue(data.sensors, "temp", previousPoint?.temp ?? 0),
          ),
          hum: Number(
            getSensorValue(data.sensors, "hum", previousPoint?.hum ?? 0),
          ),
          alert:
            data.AIData.sms_alert_sent || data.AIData.ui_status !== "healthy",
          status: data.AIData.ui_status,
        };

        return [...prev, newpoint];
      });

      // 3) Append soil moisture/pH point from backend sensors.
      setSoilChartdata((prev) => {
        const previousPoint = prev[prev.length - 1];

        // Same fallback rule here: keep the graph flowing even if one sensor is absent.
        const newsoilpoint: SoilChartPoint = {
          time: data.timestamp,
          soil: Number(
            getSensorValue(data.sensors, "soil", previousPoint?.soil ?? 0),
          ),
          ph: Number(
            getSensorValue(data.sensors, "ph", previousPoint?.ph ?? 0),
          ),
          alert:
            data.AIData.sms_alert_sent || data.AIData.ui_status !== "healthy",
          status: data.AIData.ui_status,
        };

        return [...prev, newsoilpoint];
      });

      // 4) Reset timing counters for "last reading" and "next reading" labels.
      setLastminute(Date.now());
      setMinutesago(0);
      setMinutesnext(activeInterval);
    },
    [currentinterval],
  );

  // Listen for backend "farmupdate" events and feed the live pipeline above.
  useSocket(FarmSocket, "farmupdate", onfarmupdate);

  useEffect(() => {
    const machineLocation = farmData?.farmInfo?.name?.trim();
    const liveStatus = farmData?.AIData.ui_status ?? "healthy";
    if (!machineLocation) return;

    void loadHistoryForLocation(machineLocation, liveStatus);
  }, [
    farmData?.farmInfo?.name,
    farmData?.AIData.ui_status,
    loadHistoryForLocation,
  ]);

  useEffect(() => {
    if (lastminue === null) {
      setMinutesago(0);
      setMinutesnext(currentinterval);
      return;
    }

    const Timer = setInterval(() => {
      const diffminutes = Math.floor((Date.now() - lastminue) / 60000);
      setMinutesago(diffminutes);
      setMinutesnext(Math.max(0, currentinterval - diffminutes));
    }, 60000);
    return () => clearInterval(Timer);
  }, [currentinterval, lastminue]);

  return {
    farmData,
    chartdata,
    soilchartdata,
    minutesago,
    minituesnext,
    currentinterval,
  };
};
