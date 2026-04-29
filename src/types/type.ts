export type TopNavProps = {
  navClassName?: string;
  borderColor?: string;
  descriptionColor?: string;
  dotColor?: string;
  clockBorderColor?: string;
};

export interface DOt {
  description: string;
  dotColor: string;
  titleColor: string;
}
export interface header {
  description: string;
  theme: string;
  dotColor: string;
  titleColor: string;
  readingColor: string;
  lastReading: number;
  nextReading: number;
}

export interface farmStatusBox {
  imageurl: string;
  AIconfidence: number;
  statusLabel: string;
  Title: string;
  subtitle: string;
  backgroundClass: string;
  statusColor: string;
  titleColor: string;
  subtitleColor: string;
  confidenceLabel: string;
  confidenceColor: string;
  predictionLabel: string;
}

export interface alertStrip {
  sprayAction: string;
  smsAlertSent: boolean;
  alertStripBg: string;
  alertTextColor: string;
  alertBadgeBg: string;
  alertBadgeTextColor: string;
}

export type DashboardStatus = "healthy" | "disease" | "pest";

export interface SensorItem {
  id: string;
  label: string;
  value: number;
  unit: string;
}

export interface sensorGrid {
  sensors: SensorItem[];
  status: DashboardStatus;
  sectionBg: string;
  cardBg: string;
  cardBorderColor: string;
  valueColor: string;
  labelColor: string;
  hintColor: string;
}

export type SensorReading = {
  id: "temp" | "hum" | "rain" | "soil" | "light" | "ph" | string;
  label: string;
  value: number;
  unit: string;
};

export type FarmUpdatePayload = {
  timestamp: string;
  datainterval?: number;
  sensors: SensorReading[];
  AIData: {
    ui_status: "healthy" | "disease" | "pest";
    ui_title: string;
    spray_action: string;
    description: string;
    confidence: number;
    sms_alert_sent: boolean;
  };
  farmInfo: {
    name: string;
    location: string;
  };
};

export type BaseChartPoint = {
  time: string;
  alert: boolean;
  status: FarmUpdatePayload["AIData"]["ui_status"];
};

export type ClimateChartPoint = BaseChartPoint & {
  temp: number;
  hum: number;
};

// Backward-compatible alias (prefer ClimateChartPoint for new code).
export type FarmChartPoint = ClimateChartPoint;

export type ChartDataSourceLabel = "LIVE STREAM" | "MOCK SEED";

export type ClimateLineChartProps = {
  data: ClimateChartPoint[];
  isConnected: boolean;
  status: "healthy" | "disease" | "pest";
  dataSourceLabel: ChartDataSourceLabel;
};

export type SoilChartPoint = BaseChartPoint & {
  soil: number;
  ph: number;
};

export type SoilLineChartProps = {
  data: SoilChartPoint[];
  isConnected: boolean;
  status: "healthy" | "disease" | "pest";
  dataSourceLabel: ChartDataSourceLabel;
};

export type ChartColorScheme = {
  line1: string;
  line2: string;
  area1: string;
  area2: string;
  axis1: string;
  axis2: string;
  grid: string;
  tick: string;
};

export type conditionalUI = {
  topNavTheme: string;
  topNavBorder: string;
  topNavDot: string;
  topNavTitle: string;
  topNavClockBorder: string;
  dividerBg: string;
  headerTheme: string;
  dotColor: string;
  headerTitleColor: string;
  readingColor: string;
  bodyBg: string;
  statusLabel: string;
  statusColor: string;
  titleColor: string;
  subtitleColor: string;
  confidenceColor: string;
  predictionLabel: string;
  confidenceLabel: string;
  image: string;
  alertStripBg: string;
  alertTextColor: string;
  alertBadgeBg: string;
  alertBadgeTextColor: string;
  sensorSectionBg: string;
  sensorCardBg: string;
  sensorCardBorderColor: string;
  sensorValueColor: string;
  sensorLabelColor: string;
  sensorHintColor: string;
};

export type UIStatus = "healthy" | "disease" | "pest";

export type AlertHistoryItem = {
  farmstatus: string;
  smsAlertSent: boolean;
  timestamp: string;
  status: UIStatus;
};

export type solutionProps = {
  farmData: FarmUpdatePayload;
  status: UIStatus;
};

export type alertHistoryprops = {
  AlertHistory: AlertHistoryItem[];
  status: UIStatus;
};

export type RemoteConfigPayload = {
  aiConfidence: number;
  sensorPollingRateMinutes: number;
  plantingDate: string;
  updatedAt: string;
};

export type RemoteTuningPayload = {
  aiConfidence: number;
  sensorPollingRateMinutes: number;
  updatedAt: string;
};

export type BeanAgePayload = {
  plantingDate: string;
  updatedAt: string;
};

export type RemoteConfig = {
  aiConfidence: number;
  sensorPollingRateMinutes: number;
  BeanAge: string;
};

export type RemoteConfigurationProps = {
  status: UIStatus;
  defaultConfidence?: number;
  defaultIntervalMinutes?: number;
  onSave?: (payload: RemoteTuningPayload) => void | Promise<void>;
};

export type BeanAgeConfigurationProps = {
  status: UIStatus;
  defaultBeanAge?: string;
  onSave?: (payload: BeanAgePayload) => void | Promise<void>;
};
