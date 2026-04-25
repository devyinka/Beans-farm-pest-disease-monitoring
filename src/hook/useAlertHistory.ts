import { useState } from "react";
import axios from "axios";
import type { AlertHistoryItem } from "@/types/type";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";
export const useAlertHistory = () => {
  // State to hold the alert history data
  const [alertHistory, setAlertHistory] = useState<AlertHistoryItem[]>([]);
  const fetchAlertHistory = async () => {
    try {
      // Pull the latest history from the backend and keep it typed for the UI.
      const response = await axios.get(`${BACKEND_URL}/AlertHistory`);
      setAlertHistory(response.data as AlertHistoryItem[]);
    } catch (error) {
      // Clear the list on error so the dashboard can safely fall back to mock data.
      console.error("Error fetching alert history:", error);
      setAlertHistory([]);
    }
  };

  return { alertHistory, fetchAlertHistory };
};
