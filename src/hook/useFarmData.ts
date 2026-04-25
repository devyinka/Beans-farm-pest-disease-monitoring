import { useState, useEffect, useCallback } from "react";
import { FarmSocket } from "@/socket/socket";
import { useSocket } from "./useSocket";
import type {
  FarmUpdatePayload,
  ClimateChartPoint,
  SensorReading,
  SoilChartPoint,
} from "@/types/type";

const getSensorValue = (
  sensors: SensorReading[],
  sensorId: string,
  fallback: number,
): number => {
  const sensor = sensors.find((entry) => entry.id === sensorId);
  return typeof sensor?.value === "number" ? sensor.value : fallback;
};

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

  const onfarmupdate = useCallback(
    (data: FarmUpdatePayload) => {
      // 1) Save latest backend payload.
      setFarmData(data);
      const activeInterval = data.datainterval || currentinterval;
      setCurrentInterval(activeInterval);

      // 2) Append temperature/humidity point from backend sensors.
      setChartdata((prev) => {
        const previousPoint = prev[prev.length - 1];

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

        const updatedData = [...prev, newpoint];
        const maxPointsFor24Hours = Math.ceil((24 * 60) / activeInterval);

        return updatedData.length > maxPointsFor24Hours
          ? updatedData.slice(updatedData.length - maxPointsFor24Hours)
          : updatedData;
      });

      // 3) Append soil moisture/pH point from backend sensors.
      setSoilChartdata((prev) => {
        const previousPoint = prev[prev.length - 1];

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

        const updatedData = [...prev, newsoilpoint];
        const maxPointsFor24Hours = Math.ceil((24 * 60) / activeInterval);

        return updatedData.length > maxPointsFor24Hours
          ? updatedData.slice(updatedData.length - maxPointsFor24Hours)
          : updatedData;
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
