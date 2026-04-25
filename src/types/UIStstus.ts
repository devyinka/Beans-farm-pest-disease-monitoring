import { UIStatus } from "./type";
export const STATUS_STYLES: Record<
  UIStatus,
  {
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
  }
> = {
  healthy: {
    topNavTheme:
      "bg-[linear-gradient(90deg,#0b2a18_0%,#0d3b22_55%,#124f2d_100%)]",
    topNavBorder: "rgba(125,237,155,0.35)",
    topNavDot: "#7DED9B",
    topNavTitle: "#C6FFD8",
    topNavClockBorder: "rgba(125,237,155,0.25)",
    dividerBg: "bg-[#0f4a27]",
    headerTheme: "bg-[#1E3A26] pt-2 pb-4",
    dotColor: "#7DED9B",
    headerTitleColor: "#F7FAFF",
    readingColor: "#f6be5a",
    bodyBg: "bg-[#0f4a27]",
    statusLabel: "SYSTEM STATUS",
    statusColor: "#7DED9B",
    titleColor: "#7DED9B",
    subtitleColor: "rgba(200,255,220,0.75)",
    confidenceColor: "#7DED9B",
    predictionLabel: "SAFE prediction",
    confidenceLabel: "",
    image: "/healthy.png",
    alertStripBg: "bg-[#d7ddcf]",
    alertTextColor: "#1f6b3b",
    alertBadgeBg: "#c8d5c1",
    alertBadgeTextColor: "#2f6d42",
    sensorSectionBg: "bg-[#e3e7dd]",
    sensorCardBg: "bg-[#f3f5ef]",
    sensorCardBorderColor: "#5ab66f",
    sensorValueColor: "#0b2d1a",
    sensorLabelColor: "#8f977f",
    sensorHintColor: "#8c947d",
  },
  pest: {
    topNavTheme:
      "bg-[linear-gradient(90deg,#2a1204_0%,#3f1a08_55%,#5a250a_100%)]",
    topNavBorder: "rgba(255,154,79,0.38)",
    topNavDot: "#ff9a4f",
    topNavTitle: "#ffd6bd",
    topNavClockBorder: "rgba(255,154,79,0.28)",
    dividerBg: "bg-[#4a1a04]",
    headerTheme: "bg-[#2A0f02] pt-2 pb-4",
    dotColor: "#ff9a4f",
    headerTitleColor: "#F7FAFF",
    readingColor: "#ff9a4f",
    bodyBg: "bg-[#4a1a04]",
    statusLabel: "PEST ALERT",
    statusColor: "#ff9a4f",
    titleColor: "#ff8b3d",
    subtitleColor: "rgba(255,210,180,0.72)",
    confidenceColor: "#ff8b3d",
    predictionLabel: "PEST prediction",
    confidenceLabel: "",
    image: "/pest.png",
    alertStripBg: "bg-[#d8cfc3]",
    alertTextColor: "#e46c12",
    alertBadgeBg: "#efd1b5",
    alertBadgeTextColor: "#d26b18",
    sensorSectionBg: "bg-[#ece6de]",
    sensorCardBg: "bg-[#f5f2ec]",
    sensorCardBorderColor: "#e1782c",
    sensorValueColor: "#cf5c0b",
    sensorLabelColor: "#9e978f",
    sensorHintColor: "#979188",
  },
  disease: {
    topNavTheme:
      "bg-[linear-gradient(90deg,#051430_0%,#08224a_55%,#0a2f63_100%)]",
    topNavBorder: "rgba(79,152,255,0.38)",
    topNavDot: "#6ea8ff",
    topNavTitle: "#c8ddff",
    topNavClockBorder: "rgba(79,152,255,0.28)",
    dividerBg: "bg-[#03163f]",
    headerTheme: "bg-[#040e24] pt-2 pb-4",
    dotColor: "#6ea8ff",
    headerTitleColor: "#F7FAFF",
    readingColor: "#58a0ff",
    bodyBg: "bg-[#03163f]",
    statusLabel: "DISEASE ALERT",
    statusColor: "#4f98ff",
    titleColor: "#4f98ff",
    subtitleColor: "rgba(180,210,255,0.72)",
    confidenceColor: "#4f98ff",
    predictionLabel: "DISEASE prediction",
    confidenceLabel: "",
    image: "/disease.png",
    alertStripBg: "bg-[#d6d8de]",
    alertTextColor: "#2d55d7",
    alertBadgeBg: "#c7d3eb",
    alertBadgeTextColor: "#2f5fb5",
    sensorSectionBg: "bg-[#dbdee4]",
    sensorCardBg: "bg-[#f1f3f6]",
    sensorCardBorderColor: "#4f81e0",
    sensorValueColor: "#2b59be",
    sensorLabelColor: "#8f96a3",
    sensorHintColor: "#8d93a0",
  },
};
