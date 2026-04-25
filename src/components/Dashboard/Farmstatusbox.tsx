"use client";

import type { farmStatusBox } from "@/types/type";
import Image from "next/image";
export const FarmstatusBox = ({
  imageurl,
  AIconfidence,
  statusLabel,
  Title,
  subtitle,
  backgroundClass,
  statusColor,
  titleColor,
  subtitleColor,
  confidenceLabel,
  confidenceColor,
  predictionLabel,
}: farmStatusBox) => {
  return (
    <div className={`${backgroundClass} py-5`}>
      <div className="mx-4 flex flex-col items-start justify-between gap-6 sm:mx-6 lg:flex-row lg:gap-8">
        <div className="flex w-full items-start gap-3 sm:gap-5">
          <Image
            src={imageurl}
            alt={statusLabel}
            width={60}
            height={60}
            className="h-12 w-12 shrink-0 sm:h-15 sm:w-15 lg:h-12 lg:w-12"
          />
          <div>
            <h5
              className="text-[10px] font-bold uppercase tracking-[0.15em] sm:text-[13px]"
              style={{ color: statusColor }}
            >
              {statusLabel}
            </h5>
            <h2
              className="mt-1 text-1xl leading-tight font-bold  lg:text-2xl"
              style={{ color: titleColor }}
            >
              {Title}
            </h2>
            <p
              className="mt-2 text-[15px] lg:text-xl font-mono"
              style={{ color: subtitleColor }}
            >
              {subtitle}
            </p>
          </div>
        </div>
        <div className="w-full text-left lg:w-auto lg:text-right">
          <h5 className="text-xl font-semibold uppercase tracking-[0.15em] text-[rgba(255,255,255,0.35)] text-[8px]">
            ML CONFIDENCE
          </h5>
          <div
            className="mt-1 text-xl leading-none font-bold sm:text-5xl lg:text-1xl"
            style={{ color: confidenceColor }}
          >
            {AIconfidence}%
          </div>
          <p className="mt-1 text-[12px] tracking-[0.08em] text-[rgba(255,255,255,0.45)] sm:text-[13px]">
            {predictionLabel}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FarmstatusBox;
