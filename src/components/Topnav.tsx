"use client";
import Clock from "./clock";
import { DotNameDescription } from "./Dashboard/topHeader";
import { TopNavProps } from "@/types/type";

const TopNav = ({
  navClassName = "bg-[linear-gradient(90deg,#09060f_0%,#13071f_55%,#1b0b2a_100%)]",
  borderColor = "rgba(184,147,255,0.22)",
  descriptionColor = "#FFFFFF",
  dotColor = "rgba(184,147,255,0.2)",
  clockBorderColor = "rgba(184,147,255,0.18)",
  clockTextColor = "#FFFFFF",
  endContent,
}: TopNavProps) => {
  return (
    <div
      className={`${navClassName} h-15 w-full flex items-center justify-between sticky top-0 z-100 border-b pl-6`}
      style={{ borderColor }}
    >
      <DotNameDescription
        description="Early Pest & Disease Detection"
        titleColor={descriptionColor}
        dotColor={dotColor}
      />
      <div
        className="flex h-full items-stretch justify-end border-l pr-2 pl-2 font-medium font-sans"
        style={{ borderColor: clockBorderColor, color: clockTextColor }}
      >
        <div className="flex items-center gap-3 pr-2">
          {endContent}
        </div>
        <div className="flex items-center justify-end self-stretch border-l pl-2">
          <Clock />
        </div>
      </div>
    </div>
  );
};

export default TopNav;
