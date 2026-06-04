import { useState, useEffect, useCallback, useRef } from "react";
import { FarmSocket } from "@/socket/socket";
import { useSocket } from "./useSocket";
import { useUserLoginContext } from "@/context/userLogincontex";
import BACKENDAPI from "@/API";
import type {
  FarmUpdatePayload,
  ClimateChartPoint,
  SensorReading,
  SoilChartPoint,
  RawSensorHistoryRecord,
} from "@/types/type";

const HISTORY_WINDOW_HOURS = 24;
const HISTORY_WINDOW_MS = HISTORY_WINDOW_HOURS * 60 * 60 * 1000;

// Helper to extract a sensor value by ID with a fallback if missing or malformed.
const getSensorValue = (
  sensors: SensorReading[],
  sensorId: string,
  fallback: number,
): number => {
  const sensor = sensors.find((entry) => entry.id === sensorId);
  return typeof sensor?.value === "number" ? sensor.value : fallback;
};

// Transform a raw sensor history record into a ClimateChartPoint for the charts.
const toClimatePoint = (
  reading: RawSensorHistoryRecord,
  status: FarmUpdatePayload["AIData"]["ui_status"],
): ClimateChartPoint => ({
  timeStamp: reading.timeStamp,
  temp: Number(reading.temperature ?? 0),
  hum: Number(reading.humidity ?? 0),
  soil: Number(reading.soil_moisture ?? 0),
  alert: false,
  status,
});

const toSoilPoint = (
  reading: RawSensorHistoryRecord,
  status: FarmUpdatePayload["AIData"]["ui_status"],
): SoilChartPoint => ({
  timeStamp: reading.timeStamp,
  soil: Number(reading.soil_moisture ?? 0),
  alert: false,
  status,
});

const trimToHistoryWindow = <T extends { timeStamp: string }>(
  points: T[],
): T[] => {
  if (points.length === 0) return points;

  const latestTimeMs = new Date(points[points.length - 1].timeStamp).getTime();
  const cutoffTimeMs = latestTimeMs - HISTORY_WINDOW_MS;

  return points.filter(
    (point) => new Date(point.timeStamp).getTime() >= cutoffTimeMs,
  );
};

const getStoredMachineLocation = (): string => {
  if (typeof window === "undefined") return "";

  return localStorage.getItem("beanfarm_machine_location")?.trim() ?? "";
};

// Custom hook to manage farm data and chart updates
export const useFarmData = () => {
  const { userProfile } = useUserLoginContext();
  
  // Latest payload from backend Socket.IO event
  const [farmData, setFarmData] = useState<FarmUpdatePayload | null>(null);

  // Charts start empty and are seeded from backend MongoDB history on login
  const [chartdata, setChartdata] = useState<ClimateChartPoint[]>([]);
  const [soilchartdata, setSoilChartdata] = useState<SoilChartPoint[]>([]);
  const [currentinterval, setCurrentInterval] = useState<number>(30);

  const [lastminue, setLastminute] = useState<number | null>(null);
  const [minutesago, setMinutesago] = useState<number>(0);
  const [minituesnext, setMinutesnext] = useState<number>(0);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [seedLocation, setSeedLocation] = useState<string>(
    getStoredMachineLocation(),
  );
  
  const loadedHistoryForLocation = useRef<string | null>(null);
  const loadingHistoryForLocation = useRef<string | null>(null);
  const pendingLiveUpdateRef = useRef<FarmUpdatePayload | null>(null);

  // Fetch the latest UI configuration from the backend
  const getUI = useCallback(async (locationToFetch: string) => {
    if (!locationToFetch) {
      console.warn("getUI aborted: No machine location provided.");
      return;
    }

    try {
      const response = await BACKENDAPI.get("/UIStatus/getUI", {
        params: {
          machine_location: locationToFetch,
        },
      });

      if (response.status >= 200 && response.status < 300) {
        const savedUI = response.data?.data || response.data;

        setFarmData(savedUI);
        if (savedUI?.timeStamp) {
          setLastminute(new Date(savedUI.timeStamp).getTime());
        }
      } else {
        console.error("Failed to fetch UI configuration: ", response.statusText);
      }
    } catch (error) {
      console.error("Failed to fetch UI configuration:", error);
    }
  }, []);

  useEffect(() => {
    const safeLocation = userProfile?.machineLocation?.trim() || seedLocation;

    if (safeLocation) {
      setSeedLocation(safeLocation);
      getUI(safeLocation);
    }
  }, [userProfile?.machineLocation, seedLocation, getUI]);

  // LEAN appendLivePoint: Strictly trusts the structured MongoDB format
  const appendLivePoint = useCallback((data: FarmUpdatePayload) => {
    setChartdata((prev) => {
      const previousPoint = prev[prev.length - 1];

      const nextPoint: ClimateChartPoint = {
        timeStamp: data.timeStamp,
        temp: Number(getSensorValue(data.sensors, "temp", previousPoint?.temp ?? 0)),
        hum: Number(getSensorValue(data.sensors, "hum", previousPoint?.hum ?? 0)),
        soil: Number(getSensorValue(data.sensors, "soil", previousPoint?.soil ?? 0)),
        alert: data.AIData.sms_alert_sent || data.AIData.ui_status !== "healthy",
        status: data.AIData.ui_status,
      };

      return trimToHistoryWindow([...prev, nextPoint]);
    });

    setSoilChartdata((prev) => {
      const previousPoint = prev[prev.length - 1];

      const nextPoint: SoilChartPoint = {
        timeStamp: data.timeStamp,
        soil: Number(getSensorValue(data.sensors, "soil", previousPoint?.soil ?? 0)),
        alert: data.AIData.sms_alert_sent || data.AIData.ui_status !== "healthy",
        status: data.AIData.ui_status,
      };

      return trimToHistoryWindow([...prev, nextPoint]);
    });
  }, []);

  const loadHistoryForLocation = useCallback(
    async (
      machineLocation: string,
      status: FarmUpdatePayload["AIData"]["ui_status"],
    ) => {
      if (!machineLocation) return;

      if (
        loadedHistoryForLocation.current === machineLocation ||
        loadingHistoryForLocation.current === machineLocation
      ) {
        return;
      }

      loadingHistoryForLocation.current = machineLocation;
      setIsHistoryLoading(true);

      try {
        const response = await BACKENDAPI.get<{
          readings: RawSensorHistoryRecord[];
        }>("/sensor/history", {
          params: {
            machine_location: machineLocation,
            hours: HISTORY_WINDOW_HOURS,
          },
        });

        const readings = [...(response.data.readings ?? [])].sort(
          (left, right) =>
            new Date(left.timeStamp).getTime() -
            new Date(right.timeStamp).getTime(),
        );

        const historicalClimate = readings.map((reading) =>
          toClimatePoint(reading, status),
        );
        const historicalSoil = readings.map((reading) =>
          toSoilPoint(reading, status),
        );

        setChartdata(historicalClimate);
        setSoilChartdata(historicalSoil);

        loadedHistoryForLocation.current = machineLocation;

        console.info(
          "Loaded 24-hour raw sensor history for chart seed:",
          machineLocation,
          readings.length,
        );

        if (pendingLiveUpdateRef.current) {
          const pendingUpdate = pendingLiveUpdateRef.current;
          pendingLiveUpdateRef.current = null;
          appendLivePoint(pendingUpdate);
        }
      } catch (error) {
        console.error("Failed to load raw sensor history for charts:", error);
      } finally {
        loadingHistoryForLocation.current = null;
        setIsHistoryLoading(false);
      }
    },
    [appendLivePoint],
  );

  // LEAN onfarmupdate: Overwrites state cleanly based on exact backend schema
  const onfarmupdate = useCallback(
    (data: FarmUpdatePayload) => {
      setFarmData(data);

      const activeInterval = data.datainterval || currentinterval;
      setCurrentInterval(activeInterval);

      setLastminute(new Date(data.timeStamp).getTime());
      setMinutesago(0);
      setMinutesnext(activeInterval);

      const incomingLocation = data.machine_location;

      if (!incomingLocation || loadedHistoryForLocation.current !== incomingLocation) {
        pendingLiveUpdateRef.current = data;
        return;
      }

      appendLivePoint(data);
    },
    [appendLivePoint, currentinterval],
  );

  useSocket(FarmSocket, "farmupdate", onfarmupdate);

  useEffect(() => {
    const machineLocation = farmData?.farmInfo?.name?.trim() || seedLocation;
    const liveStatus = farmData?.AIData?.ui_status ?? "healthy";
    
    if (!machineLocation) return;

    void loadHistoryForLocation(machineLocation, liveStatus);
  }, [
    farmData?.farmInfo?.name,
    farmData?.AIData?.ui_status,
    seedLocation,
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
    isHistoryLoading,
  };
};