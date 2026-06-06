"use client";

import React from "react";

const AuthProjectDetailsPanel = () => {
  const projectDetails = [
    ["Name", "Salam Sodiq"],
    ["Matric No", "2021/1/81914CM"],
    ["Department", "Telecommunication Engineering"],
    [
      "Project Title",
      "Intelligent system for early Pest and disease Detection in bean farm.",
    ],
    ["Supervisor", "Engr. Dr. B. A. Salihu"],
  ];

  return (
    <div
      className="relative overflow-hidden mt-4 mb-5 rounded-2xl border border-[rgba(184,147,255,0.15)] bg-[rgba(10,8,14,0.6)] backdrop-blur-2xl p-5 md:p-6 transition-all duration-500 group shadow-2xl"
      style={{
        boxShadow:
          "0 20px 40px -15px rgba(184, 147, 255, 0.08), inset 0 1px 1px rgba(255, 255, 255, 0.03)",
      }}
    >
      {/* Living Tech Glow Backdrop Aura */}
      <div className="absolute -top-16 -right-16 h-32 w-32 rounded-full opacity-[0.08] blur-3xl bg-[#b893ff] pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 h-32 w-32 rounded-full opacity-[0.04] blur-3xl bg-[#b893ff] pointer-events-none" />

      {/* Header Deck */}
      <div className="flex items-center mx-auto mb-5 w-[94%] border-b border-white/4 pb-3">
        <div className="text-sm font-black tracking-wide text-[rgb(184,147,255)] antialiased md:text-base">
          Project Details
        </div>
      </div>

      {/* Structural Data Grid */}
      <div className="mx-auto w-[94%] space-y-3.5">
        {projectDetails.map(([label, value]) => {
          const isProjectTitle = label === "Project Title";
          const isMatricNo = label === "Matric No";

          return (
            <div
              key={label}
              className="grid w-full grid-cols-[110px_1fr] sm:grid-cols-[140px_1fr] items-start gap-x-4 border-b border-white/2 last:border-0 pb-2.5 last:pb-0"
            >
              {/* Data Label */}
              <span className="font-mono text-[11px] sm:text-xs font-bold tracking-wider text-white/40 uppercase pt-0.5">
                {label}
              </span>

              {/* Data Value Output Block */}
              <span
                className={`font-semibold text-white/90 leading-relaxed whitespace-normal break-all antialiased text-sm md:text-base ${
                  isProjectTitle
                    ? "text-[13px] md:text-[15px] font-black text-white leading-snug tracking-tight"
                    : isMatricNo
                      ? "font-mono font-bold text-[13px] tracking-wide text-[rgb(184,147,255)]"
                      : ""
                }`}
              >
                {value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AuthProjectDetailsPanel;
