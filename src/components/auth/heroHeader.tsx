"use client";

import React from "react";
import { motion } from "framer-motion";

export default function HeroHeader() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25, filter: "blur(4px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-start md:items-center text-left md:text-center w-full select-none relative pt-6 md:pt-12"
    >
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-36 bg-linear-to-r from-[#b893ff]/10 to-[#4deeea]/5 blur-3xl pointer-events-none rounded-full hidden md:block" />

      {/* 1. Main Title */}
      <motion.h1
        variants={itemVariants}
        className="mb-6 w-full font-sans text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-[1.12] tracking-tight text-white antialiased max-w-4xl animate-pulse animation-duration-[4s]"
      >
        Intelligent System for Early{" "}
        <span className="relative inline-block bg-linear-to-r from-[#b893ff] via-[#4deeea] to-[#b893ff] bg-size-[200%_auto] bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(184,147,255,0.35)] animate-[shimmer_5s_linear_infinite] select-none">
          Pest & Disease Detection
        </span>{" "}
        in Beans Farm.
      </motion.h1>

      {/* 2. Sub-Description Panel */}
      <motion.p
        variants={itemVariants}
        className="mb-8 max-w-xl font-sans text-[13.5px] md:text-[14px] leading-relaxed text-white/50 font-medium antialiased self-start md:self-center"
      >
        {/* Real-time environmental telemetry streaming backed by an adaptive
        machine learning engine, engineered for immediate identification of
        localized anomaly vectors and pathogens. */}
      </motion.p>
    </motion.div>
  );
}
