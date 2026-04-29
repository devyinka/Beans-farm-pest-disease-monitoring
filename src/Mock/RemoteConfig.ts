import { RemoteConfig } from "@/types/type";

// Default remote configuration values used in the dashboard when no real backend connection is available. These can be overridden by the user via the RemoteConfiguration component, but will not persist across page reloads since there is no real backend connection in this mock setup.
export const remoteConfigDefault: RemoteConfig = {
  aiConfidence: 75,
  sensorPollingRateMinutes: 30,
  BeanAge: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0],
};
