"use client";

import TopNav from "@/components/Topnav";
import TestAlgorithm from "@/components/Dashboard/TestAlgorithm";

const TestAlgorithmPage = () => {
  return (
    <div>
      <TopNav
        navClassName="bg-white"
        borderColor="#d4dfcd"
        dotColor="#2f7f3a"
        descriptionColor="text-[#4f7059] text-xs sm:text-sm mt-0.5 sm:mt-1"
        clockBorderColor="#2f7f3a"
        clockTextColor="#0f4a27"
      />
      <TestAlgorithm />
    </div>
  );
};

export default TestAlgorithmPage;
