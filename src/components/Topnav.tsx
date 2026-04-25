"use client";
import Clock from "./clock";
import { DotNameDescription } from "./Dashboard/topHeader";
import { TopNavProps } from "@/types/type";

const TopNav = ({
  navClassName = "bg-[linear-gradient(90deg,#09060f_0%,#13071f_55%,#1b0b2a_100%)]",
  borderColor = "rgba(184,147,255,0.22)",
  descriptionColor = "#B893FF",
  dotColor = "rgba(184,147,255,0.2)",
  clockBorderColor = "rgba(184,147,255,0.18)",
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
        className="flex items-center justify-end pr-2 pl-2 font-medium font-sans border-l text-white self-stretch"
        style={{ borderColor: clockBorderColor }}
      >
        <Clock />
      </div>
    </div>
  );
};

export default TopNav;
