import { useCallback, useRef, useState } from "react";
import type { AlertHistoryItem } from "@/types/type";
import BACKENDAPI from "@/API";

type AlertHistoryResponse = {
  machine_location: string;
  data: AlertHistoryItem[];
};

export const useAlertHistory = () => {
  // State to hold the alert history data
  const [alertHistory, setAlertHistory] = useState<AlertHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const loadedLocationRef = useRef<string | null>(null);
  const loadingLocationRef = useRef<string | null>(null);

  const fetchAlertHistory = useCallback(async (machineLocation?: string) => {
    if (!machineLocation) return;

    // Avoid repeated fetches for the same location when the dashboard re-renders
    // because of live socket updates.
    if (
      loadedLocationRef.current === machineLocation ||
      loadingLocationRef.current === machineLocation
    ) {
      return;
    }

    loadingLocationRef.current = machineLocation;
    setIsLoading(true);
    setError(null);

    try {
      // Pull the latest history from the backend and keep it typed for the UI.
      const response = await BACKENDAPI.get<AlertHistoryResponse>(
        "/alert/alert-history",
        {
          params: { machine_location: machineLocation },
        },
      );

      setAlertHistory(response.data.data ?? []);
      loadedLocationRef.current = machineLocation;
    } catch (error) {
      // Clear the list on error so the dashboard can safely fall back to mock data.
      console.error("Error fetching alert history:", error);
      setAlertHistory([]);
      setError("Failed to load alert history.");
    } finally {
      loadingLocationRef.current = null;
      setIsLoading(false);
    }
  }, []);

  return { alertHistory, fetchAlertHistory, isLoading, error };
};
