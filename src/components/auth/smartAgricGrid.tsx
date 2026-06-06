"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
// High-fidelity telecom engineering icons from lucide-react
import { Activity, Cpu, BarChart3, Radio, Droplet } from "lucide-react";

export default function SmartAgriInteractiveGrid() {
  const [index, setIndex] = useState(0);

  const features = [
    {
      title: "5 Live Sensors",
      subtitle: "TELEMETRY MATRIX",
      meta: "STREAMS ACTIVE",
      desc: "Continuously monitors temperature, humidity, soil moisture, rainfall, and light intensity from the bean farm environment and sends the readings to the backend server in real time.",
      color: "from-[#b893ff] to-[#8040ff]",
      accent: "#b893ff",
      shadow: "rgba(184, 147, 255, 0.15)",
      icon: Activity,
    },
    {
      title: "ML Prediction Engine",
      subtitle: "CLASSIFIER NODE",
      meta: "ACCURACY: 94.8%",
      desc: "Analyses aggregated sensor data twice daily using a trained Random Forest model to detect early signs of Anthracnose, Bean Aphids, or Bean Pod Borer before visible damage occurs on the crop.",
      color: "from-[#4deeea] to-[#0070f3]",
      accent: "#4deeea",
      shadow: "rgba(77, 238, 234, 0.15)",
      icon: Cpu,
    },
    {
      title: "Advanced Analytics",
      subtitle: "GRAPH DATACORE",
      meta: "OPTIMIZED",
      desc: "Displays historical and real-time sensor readings on the dashboard using charts and graphs, helping the farmer understand farm conditions and track changes over time.",
      color: "from-[#ff007a] to-[#7928ca]",
      accent: "#ff007a",
      shadow: "rgba(255, 0, 122, 0.15)",
      icon: BarChart3,
    },
    {
      title: "Automated Alerts",
      subtitle: "TELECOM REPEATER",
      meta: "LATENCY: 42ms",
      desc: "Sends an SMS directly to the farmer's phone via Africastalking whenever the system detects a disease or pest threat, so the farmer is notified even without opening the dashboard.",
      color: "from-[#ff9900] to-[#ff5500]",
      accent: "#ff9900",
      shadow: "rgba(255, 153, 0, 0.15)",
      icon: Radio,
    },
    {
      title: "Remote Spraying",
      subtitle: "ACTUATOR SYSTEM",
      meta: "VALVES IDLE",
      desc: "Allows the farmer to activate the fungicide or insecticide pump remotely from the web dashboard to the farm through MQTT and the correct pump is triggered automatically.",
      color: "from-[#00df00] to-[#007000]",
      accent: "#00df00",
      shadow: "rgba(0, 223, 0, 0.15)",
      icon: Droplet,
    },
  ];

  // Upgraded autonomous interval engine: cycles continuously without being interrupted by user pointer hovers
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % features.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [features.length]);

  const active = features[index];
  const ActiveIcon = active.icon;

  return (
    <div className="w-full max-w-3xl mx-auto p-4 select-none text-left">
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 140, damping: 22 }}
      >
        <Card
          className="relative overflow-hidden border border-white/5 bg-[rgba(10,8,14,0.75)] backdrop-blur-3xl rounded-2xl p-1 transition-all duration-1000 group"
          style={{
            boxShadow: `0 30px 60px -20px ${active.shadow}, inset 0 0 0 1px rgba(255,255,255,0.02)`,
          }}
        >
          {/* Dynamic Aura Matrix Backdrop Blurs */}
          <div
            className="absolute -top-32 -left-32 h-64 w-64 rounded-full opacity-[0.16] blur-[80px] transition-all duration-1000 pointer-events-none"
            style={{ backgroundColor: active.accent }}
          />
          <div
            className="absolute -bottom-32 -right-32 h-64 w-64 rounded-full opacity-[0.06] blur-[100px] transition-all duration-1000 pointer-events-none hidden md:block"
            style={{ backgroundColor: active.accent }}
          />

          <CardContent className="p-4 md:p-6 flex flex-col md:flex-row items-stretch gap-6 min-h-55">
            {/* LEFT COLUMN: Asymmetrical Split Navigation Sidebar Deck */}
            <div className="flex flex-row md:flex-col justify-between gap-1.5 md:w-60 shrink-0 border-b md:border-b-0 md:border-r border-[rgba(255,255,255,0.06)] pb-4 md:pb-0 md:pr-4">
              {features.map((item, i) => {
                const isSelected = i === index;
                const TabIcon = item.icon;
                return (
                  <button
                    key={i}
                    onClick={() => setIndex(i)}
                    className="relative flex items-center gap-3 w-full p-2.5 rounded-xl text-left select-none transition-all duration-300 group/btn cursor-pointer"
                  >
                    {/* Active dynamic visual capsule glider */}
                    {isSelected && (
                      <motion.div
                        layoutId="activeTabGlow"
                        className="absolute inset-0 bg-white/3 border border-white/5 rounded-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
                        transition={{
                          type: "spring",
                          stiffness: 160,
                          damping: 20,
                        }}
                      />
                    )}

                    {/* Node Connection Status Pin Beacon */}
                    <div
                      className="h-1.5 w-1.5 rounded-full transition-all duration-500 shrink-0"
                      style={{
                        backgroundColor: isSelected
                          ? item.accent
                          : "rgba(255,255,255,0.15)",
                        boxShadow: isSelected
                          ? `0 0 8px ${item.accent}`
                          : "none",
                      }}
                    />

                    <span
                      className={`text-[12.5px] font-mono tracking-wide transition-all duration-300 truncate hidden md:block ${
                        isSelected
                          ? "text-white font-black"
                          : "text-white/40 font-medium group-hover/btn:text-white/70"
                      }`}
                    >
                      {item.title}
                    </span>

                    {/* Compact Mobile Native Icon Display Block */}
                    <div className="md:hidden flex h-7 w-7 items-center justify-center rounded-lg bg-white/2">
                      <TabIcon
                        size={14}
                        style={{
                          color: isSelected
                            ? item.accent
                            : "rgba(255,255,255,0.3)",
                        }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* RIGHT COLUMN: High-Vibrancy System Control Terminal */}
            <div className="flex-1 flex flex-col justify-between relative min-h-40 pt-1 md:pt-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 15, filter: "blur(5px)" }}
                  animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, x: -15, filter: "blur(5px)" }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full flex flex-col gap-3.5"
                >
                  {/* Metadata Header Line */}
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black tracking-[0.15em] opacity-40 text-white font-mono uppercase">
                        {active.subtitle}
                      </span>
                      <span className="h-1 w-1 rounded-full bg-white/20" />
                      <span
                        className="text-[10px] font-bold font-mono tracking-wider transition-colors duration-500"
                        style={{ color: active.accent }}
                      >
                        {active.meta}
                      </span>
                    </div>

                    {/* DEDICATED TOP RIGHT ANGLE SLOT: High-Vibrancy Lucide Mini-Bay Terminal */}
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-lg bg-linear-to-br ${active.color} p-px shadow-md hidden md:flex`}
                    >
                      <div className="flex h-full w-full items-center justify-center rounded-[8px] bg-[#0c0a0f]">
                        <ActiveIcon
                          size={16}
                          style={{
                            color: active.accent,
                            filter: `drop-shadow(0 0 5px ${active.accent})`,
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Main Display Title */}
                  <h2 className="text-lg md:text-xl font-black tracking-tight text-white antialiased">
                    {active.title}
                  </h2>

                  {/* Contextual Technical Paragraph Readout */}
                  <p className="text-[13px] leading-relaxed text-white/50 antialiased font-medium max-w-xl">
                    {active.desc}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Bottom Metrics Bar: Houses Progress indicators and timeline tracking */}
              <div className="mt-6 flex items-center justify-between border-t border-[rgba(255,255,255,0.05)] pt-4 w-full">
                {/* Simulated Automated Loop Pipeline Line */}
                <div className="flex-1 max-w-35 bg-white/4 h-0.5 rounded-full overflow-hidden relative hidden sm:block">
                  <motion.div
                    key={index}
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 8, ease: "linear" }}
                    className="h-full bg-linear-to-r"
                    style={{
                      backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.1), ${active.accent})`,
                    }}
                  />
                </div>

                {/* Index Dot Arrays mapped cleanly onto state bounds */}
                <div className="flex gap-1.5 items-center ml-auto">
                  {features.map((_, i) => (
                    <div
                      key={i}
                      className="h-1 rounded-full transition-all duration-500"
                      style={{
                        width: i === index ? "20px" : "5px",
                        backgroundColor:
                          i === index ? "white" : "rgba(255, 255, 255, 0.1)",
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
