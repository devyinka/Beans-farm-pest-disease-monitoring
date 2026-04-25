import Image from "next/image";
import { DOt } from "@/types/type";
import { farmStatusBox } from "@/types/type";
import { alertStrip } from "@/types/type";
import { DashboardStatus } from "@/types/type";
import { SensorItem } from "@/types/type";
import { sensorGrid } from "@/types/type";
import { header } from "@/types/type";

export const DotNameDescription = ({
  description,
  dotColor,
  titleColor,
}: DOt) => {
  return (
    <div className="flex w-full items-center gap-3 pb-3 pr-0 justify-start self-stretch border-b border-[rgba(184,147,255,0.18)] sm:w-auto sm:gap-5 sm:pb-0 sm:pr-4 sm:border-b-0 sm:border-r">
      <div
        className="w-2 h-2 rounded-full shadow-[0_0_0_3px_rgba(184,147,255,0.2)]"
        style={{ backgroundColor: dotColor }}
      ></div>
      <div>
        <div
          className="text-[13px] font-bold tracking-[0.02em]"
          style={{ color: titleColor }}
        >
          BeanFarm Monitor
        </div>
        <div className="text-[10px] text-[rgba(255,255,255,0.35)] mt-px tracking-[0.04em]">
          {description}
        </div>
      </div>
    </div>
  );
};

export const Header = ({
  description,
  theme,
  dotColor,
  titleColor,
  readingColor,
  lastReading,
  nextReading,
}: header) => {
  return (
    <div className={theme}>
      <div className="mx-4 flex flex-col items-start justify-between gap-4 sm:mx-6 sm:flex-row sm:items-center sm:gap-6">
        <DotNameDescription
          description={description}
          dotColor={dotColor}
          titleColor={titleColor}
        />
        <div className="w-full shrink-0 text-left text-[11px] text-[rgba(255,255,255,0.38)] tracking-[0.04em] sm:w-auto sm:text-right">
          <h4 style={{ color: readingColor }}>
            Last reading: {lastReading} mins ago
          </h4>
          <h4>Next reading in: {nextReading} mins</h4>
        </div>
      </div>
    </div>
  );
};

export const AlertStrip = ({
  sprayAction,
  smsAlertSent,
  alertStripBg,
  alertTextColor,
  alertBadgeBg,
  alertBadgeTextColor,
}: alertStrip) => {
  const alertMessage = `${sprayAction} — ${smsAlertSent ? "farmer notified via SMS" : "no alert sent yet"}`;

  return (
    <div
      className={`${alertStripBg} border-t border-[rgba(255,255,255,0.14)] px-4 py-3 sm:px-6`}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p
          className="text-sm font-medium leading-relaxed sm:text-base"
          style={{ color: alertTextColor }}
        >
          {smsAlertSent ? "⚠️" : "✅"} {alertMessage}
        </p>

        <span
          className="w-fit rounded-md px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em]"
          style={{
            backgroundColor: alertBadgeBg,
            color: alertBadgeTextColor,
          }}
        >
          {smsAlertSent ? "SMS SENT ✓" : "NO ALERT SENT"}
        </span>
      </div>
    </div>
  );
};

const getSensorHint = (
  status: DashboardStatus,
  sensorId: string,
  value: number,
  unit: string,
) => {
  if (sensorId === "temp") {
    if (value > 30) return `${unit} — high`;
    if (value < 20) return `${unit} — low`;
    return `${unit} — normal`;
  }

  if (sensorId === "hum") {
    if (value > 80) return `% RH — high`;
    if (value < 40) return `% RH — low`;
    return `% RH — good`;
  }

  if (sensorId === "soil") {
    if (value > 70) return `% — saturated`;
    if (value < 30) return `% — low`;
    return `% — adequate`;
  }

  if (sensorId === "rain") {
    return value > 0 ? `${value} ${unit} rain` : "dry";
  }

  if (sensorId === "light") {
    if (value > 800) return "lux — high";
    if (value < 400) return "lux — cloudy";
    return "lux";
  }

  if (sensorId === "ph") {
    if (value < 6.5) return "slightly acid";
    if (value > 7.5) return "alkaline";
    return "neutral";
  }

  return status;
};

const getSensorDisplayValue = (sensor: SensorItem) => {
  if (sensor.id === "rain") {
    return sensor.value > 0 ? "Yes" : "No";
  }

  if (Number.isInteger(sensor.value)) {
    return sensor.value.toString();
  }

  return sensor.value.toFixed(1);
};

export const SensorGrid = ({
  sensors,
  status,
  sectionBg,
  cardBg,
  cardBorderColor,
  valueColor,
  labelColor,
  hintColor,
}: sensorGrid) => {
  return (
    <div className={`${sectionBg} px-4 py-3 sm:px-6`}>
      <div className="grid grid-cols-3 gap-2 lg:grid-cols-6">
        {sensors.map((sensor) => {
          const displayValue = getSensorDisplayValue(sensor);
          const hint = getSensorHint(
            status,
            sensor.id,
            sensor.value,
            sensor.unit,
          );

          return (
            <div
              key={sensor.id}
              className={`${cardBg} rounded-lg border px-3 py-2.5`}
              style={{ borderColor: cardBorderColor }}
            >
              <p
                className="text-[9px] font-bold uppercase tracking-[0.14em]"
                style={{ color: labelColor }}
              >
                {sensor.label}
              </p>
              <h4
                className="mt-1 text-3xl font-bold leading-none lg:text-4xl"
                style={{ color: valueColor }}
              >
                {displayValue}
              </h4>
              <p
                className="mt-1 truncate text-[11px]"
                style={{ color: hintColor }}
                title={hint}
              >
                {hint}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
