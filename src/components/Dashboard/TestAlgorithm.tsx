"use client";

import { useState } from "react";
import BACKENDAPI from "@/API";
import { AlgorithmTestData } from "@/types/type";
import { withAuth } from "../auth/withAuth";

const testPalette = {
  outerBg: "bg-white",
  cardBg: "bg-[#f7faf4]",
  borderColor: "border-[#2f7f3a]",
  headerBg: "bg-white",
  headerTitle: "text-[#0f4a27]",
  labelText: "text-[#1c4a2b]",
  subText: "text-[#4f7059]",
  inputBorder: "border-[#d4dfcd]",
  inputFocus: "border-[#2f7f3a]",
  buttonBg: "#67b978",
  buttonText: "#f4fff7",
  buttonHover: "#579f66",
  sectionBg: "bg-[#f0f5ee]",
};

// Separate component to prevent re-creation on each render
const InputField = ({
  label,
  field,
  value,
  onChange,
  type = "number",
  step = "0.1",
}: {
  label: string;
  field: keyof AlgorithmTestData;
  value: any;
  onChange: (field: keyof AlgorithmTestData, value: string) => void;
  type?: string;
  step?: string;
}) => (
  <div className="group animate-fadeIn">
    <label
      htmlFor={String(field)}
      className={`block text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2 transition-colors ${testPalette.labelText}`}
    >
      {label}
    </label>
    <input
      id={String(field)}
      type={type}
      step={step}
      value={value}
      onChange={(e) => onChange(field, e.target.value)}
      autoComplete="off"
      spellCheck={type === "text" ? "false" : undefined}
      className={`w-full px-3 sm:px-4 py-1.5 sm:py-2 bg-white border-2 border-[#d4dfcd] rounded-lg transition-all duration-200 focus:outline-none focus:ring-0 text-xs sm:text-base text-[#1c4a2b] hover:border-[#2f7f3a] focus:border-[#2f7f3a] focus:bg-[#f7faf4] focus:shadow-[0_0_15px_rgba(47,127,58,0.2)]`}
      placeholder="Enter value"
    />
    <style jsx>{`
      input::placeholder {
        opacity: 0.5;
        color: #4f7059;
      }
    `}</style>
  </div>
);

// Separate component to prevent re-creation on each render
const SelectField = ({
  label,
  field,
  value,
  onChange,
  options,
}: {
  label: string;
  field: keyof AlgorithmTestData;
  value: any;
  onChange: (field: keyof AlgorithmTestData, value: string) => void;
  options: Array<{ label: string; value: number | string }>;
}) => (
  <div className="group animate-fadeIn">
    <label
      htmlFor={String(field)}
      className={`block text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2 transition-colors ${testPalette.labelText}`}
    >
      {label}
    </label>
    <select
      id={String(field)}
      value={value}
      onChange={(e) => onChange(field, e.target.value)}
      className={`w-full px-3 sm:px-4 py-1.5 sm:py-2 bg-white border-2 border-[#d4dfcd] rounded-lg transition-all duration-200 focus:outline-none focus:ring-0 text-xs sm:text-base text-[#1c4a2b] hover:border-[#2f7f3a] focus:border-[#2f7f3a] focus:bg-[#f7faf4] focus:shadow-[0_0_15px_rgba(47,127,58,0.2)] cursor-pointer`}
    >
      {options.map((opt) => (
        <option
          key={opt.value}
          value={opt.value}
          className="bg-white text-[#1c4a2b]"
        >
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

export const TestAlgorithm = () => {
  const [formData, setFormData] = useState<AlgorithmTestData>({
    machine_location: "farm-01",
    Time_of_Day: 1,
    Plant_Age_Days: 38,
    Growth_Stage: "flowering",
    Max_Temp_C: 26.5,
    Min_Temp_C: 19.2,
    Avg_Day_Hum: 72.0,
    Avg_Night_Hum: 91.5,
    Soil_Moisture: 68.0,
    Sunlight_Hours: 6.5,
    Rain_Level_mm: 12.0,
    Leaf_Wetness_Hours: 8.5,
    Cumulative_Stress_Index: 4.2,
    Hot_Days_Past_10_Days: 2,
    Wet_Nights_Past_10_Days: 7,
    Dry_Soil_Days_Past_10_Days: 0,
    Flooded_Days_Past_10_Days: 0,
    Rainy_Days_Past_10_Days: 6,
    Total_Rain_Volume_mm_Past_10_Days: 62.0,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiResponse, setAiResponse] = useState<{
    status: string;
    threat_name: string;
    percentage: number;
  } | null>(null);
  const [error, setError] = useState("");

  const handleInputChange = (
    field: keyof AlgorithmTestData,
    value: string | number,
  ) => {
    let finalValue: any = value;

    // Only parse as number for numeric fields, keep text fields as strings
    if (field !== "machine_location" && field !== "Growth_Stage") {
      if (typeof value === "string" && value !== "") {
        const parsed = parseFloat(value);
        if (!isNaN(parsed)) {
          finalValue = parsed;
        } else {
          finalValue = value;
        }
      }
    }

    setFormData((prev) => ({
      ...prev,
      [field]: finalValue,
    }));
    setError("");
  };

  const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setAiResponse(null);
    setError("");

    try {
      const payload = {
        ...formData,
        Time_of_Day: formData.Time_of_Day === 0 ? 0 : 1,
      };

      const response = await BACKENDAPI.post("/test/AIAlgorithm", payload);

      if (response.data?.ai) {
        setAiResponse(response.data.ai);
      }
    } catch (err) {
      setError(
        `Failed to submit test: ${err instanceof Error ? err.message : "Unknown error"}`,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`${testPalette.outerBg} min-h-screen`}>
      {/* Header */}
      <div
        className={`${testPalette.headerBg} shadow-sm border-b-2 border-[#d4dfcd]`}
      >
        <div className="px-2 sm:px-4 md:px-6 py-3 sm:py-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="animate-pulse">
              <div className="w-8 sm:w-10 h-8 sm:h-10 bg-[#2f7f3a]/15 rounded-full flex items-center justify-center text-lg sm:text-xl"></div>
            </div>
            <div>
              <h1
                className={`text-lg sm:text-2xl font-bold ${testPalette.headerTitle}`}
              >
                Test Unit
              </h1>
              <p className="text-[#4f7059] text-xs sm:text-sm mt-0.5 sm:mt-1">
                Provide sensor data to test predictions
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form Container */}
      <div className="p-2 sm:p-4 md:p-6 max-w-full lg:max-w-6xl mx-auto bg-white">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 lg:gap-6">
            {/* Farm Location Section */}
            <div
              className={`${testPalette.cardBg} p-3 sm:p-4 rounded-xl border-2 ${testPalette.borderColor} shadow-md hover:shadow-lg transition-all duration-300 lg:col-span-3 hover:border-[#67b978]`}
            >
              <h3
                className={`text-base sm:text-lg font-bold mb-3 sm:mb-4 ${testPalette.labelText}`}
              >
                Farm Configuration
              </h3>
              <InputField
                label="Machine Location"
                field="machine_location"
                value={formData.machine_location}
                onChange={handleInputChange}
                type="text"
              />
              <p className={`text-xs mt-2 ${testPalette.subText}`}>
                Enter the farm location identifier (e.g., farm-01, farm-02)
              </p>
            </div>

            {/* Time of Day Section */}
            <div
              className={`${testPalette.cardBg} p-3 sm:p-4 rounded-xl border-2 ${testPalette.borderColor} shadow-md hover:shadow-lg transition-all duration-300 lg:col-span-3 hover:border-[#67b978]`}
            >
              <h3
                className={`text-base sm:text-lg font-bold mb-3 sm:mb-4 ${testPalette.labelText}`}
              >
                Time Configuration
              </h3>
              <SelectField
                label="Time of Day"
                field="Time_of_Day"
                value={formData.Time_of_Day}
                onChange={handleInputChange}
                options={[
                  { label: "Morning", value: 0 },
                  { label: "Evening", value: 1 },
                ]}
              />
              <p className={`text-xs mt-2 ${testPalette.subText}`}>
                Random Forest expects 0 for morning, 1 for evening
              </p>
            </div>

            {/* Plant Info Section */}
            <div
              className={`${testPalette.cardBg} p-3 sm:p-4 rounded-xl border-2 ${testPalette.borderColor} shadow-md hover:shadow-lg transition-all duration-300 lg:col-span-3 hover:border-[#67b978]`}
            >
              <h3
                className={`text-base sm:text-lg font-bold mb-3 sm:mb-4 ${testPalette.labelText}`}
              >
                Plant Information
              </h3>
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <InputField
                  label="Plant Age (Days)"
                  field="Plant_Age_Days"
                  value={formData.Plant_Age_Days}
                  onChange={handleInputChange}
                  step="1"
                />
                <InputField
                  label="Growth Stage"
                  field="Growth_Stage"
                  value={formData.Growth_Stage}
                  onChange={handleInputChange}
                  type="text"
                />
              </div>
            </div>

            {/* Climate Data Section */}
            <div
              className={`${testPalette.cardBg} p-3 sm:p-4 rounded-xl border-2 ${testPalette.borderColor} shadow-md hover:shadow-lg transition-all duration-300 lg:col-span-3 hover:border-[#67b978]`}
            >
              <h3
                className={`text-base sm:text-lg font-bold mb-3 sm:mb-4 ${testPalette.labelText}`}
              >
                Climate Data
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                <InputField
                  label="Max Temperature (°C)"
                  field="Max_Temp_C"
                  value={formData.Max_Temp_C}
                  onChange={handleInputChange}
                />
                <InputField
                  label="Min Temperature (°C)"
                  field="Min_Temp_C"
                  value={formData.Min_Temp_C}
                  onChange={handleInputChange}
                />
                <InputField
                  label="Sunlight Hours"
                  field="Sunlight_Hours"
                  value={formData.Sunlight_Hours}
                  onChange={handleInputChange}
                />
                <InputField
                  label="Avg Day Humidity (%)"
                  field="Avg_Day_Hum"
                  value={formData.Avg_Day_Hum}
                  onChange={handleInputChange}
                />
                <InputField
                  label="Avg Night Humidity (%)"
                  field="Avg_Night_Hum"
                  value={formData.Avg_Night_Hum}
                  onChange={handleInputChange}
                />
                <InputField
                  label="Rain Level (mm)"
                  field="Rain_Level_mm"
                  value={formData.Rain_Level_mm}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Soil Data Section */}
            <div
              className={`${testPalette.cardBg} p-3 sm:p-4 rounded-xl border-2 ${testPalette.borderColor} shadow-md hover:shadow-lg transition-all duration-300 lg:col-span-3 hover:border-[#67b978]`}
            >
              <h3
                className={`text-base sm:text-lg font-bold mb-3 sm:mb-4 ${testPalette.labelText}`}
              >
                Soil Data
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                <InputField
                  label="Soil Moisture (%)"
                  field="Soil_Moisture"
                  value={formData.Soil_Moisture}
                  onChange={handleInputChange}
                />
                <InputField
                  label="Leaf Wetness Hours"
                  field="Leaf_Wetness_Hours"
                  value={formData.Leaf_Wetness_Hours}
                  onChange={handleInputChange}
                />
                <InputField
                  label="Cumulative Stress Index"
                  field="Cumulative_Stress_Index"
                  value={formData.Cumulative_Stress_Index}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Past 10 Days Indicators Section */}
            <div
              className={`${testPalette.cardBg} p-3 sm:p-4 rounded-xl border-2 ${testPalette.borderColor} shadow-md hover:shadow-lg transition-all duration-300 lg:col-span-3 hover:border-[#67b978]`}
            >
              <h3
                className={`text-base sm:text-lg font-bold mb-3 sm:mb-4 ${testPalette.labelText}`}
              >
                Past 10 Days Indicators
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-3 lg:gap-4">
                <InputField
                  label="Hot Days"
                  field="Hot_Days_Past_10_Days"
                  value={formData.Hot_Days_Past_10_Days}
                  onChange={handleInputChange}
                  step="1"
                />
                <InputField
                  label="Wet Nights"
                  field="Wet_Nights_Past_10_Days"
                  value={formData.Wet_Nights_Past_10_Days}
                  onChange={handleInputChange}
                  step="1"
                />
                <InputField
                  label="Dry Soil Days"
                  field="Dry_Soil_Days_Past_10_Days"
                  value={formData.Dry_Soil_Days_Past_10_Days}
                  onChange={handleInputChange}
                  step="1"
                />
                <InputField
                  label="Flooded Days"
                  field="Flooded_Days_Past_10_Days"
                  value={formData.Flooded_Days_Past_10_Days}
                  onChange={handleInputChange}
                  step="1"
                />
                <InputField
                  label="Rainy Days"
                  field="Rainy_Days_Past_10_Days"
                  value={formData.Rainy_Days_Past_10_Days}
                  onChange={handleInputChange}
                  step="1"
                />
                <InputField
                  label="Total Rain Volume (mm)"
                  field="Total_Rain_Volume_mm_Past_10_Days"
                  value={formData.Total_Rain_Volume_mm_Past_10_Days}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          {/* Submit Section */}
          <div className="mt-6 sm:mt-8 flex flex-col gap-3 sm:gap-4">
            {aiResponse && (
              <div className="animate-slideIn p-4 sm:p-6 bg-gradient-to-br from-[#2f7f3a]/15 to-[#67b978]/15 border-2 border-[#2f7f3a] rounded-xl">
                <h3 className="text-base sm:text-lg font-bold text-[#0f4a27] mb-4">
                  AI Prediction Results
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  <div className="bg-white p-3 sm:p-4 rounded-lg border-2 border-[#d4dfcd]">
                    <p className="text-xs text-[#4f7059] font-semibold uppercase mb-1">
                      Status
                    </p>
                    <p className="text-lg sm:text-xl font-bold text-[#1c4a2b]">
                      {aiResponse.status}
                    </p>
                  </div>
                  <div className="bg-white p-3 sm:p-4 rounded-lg border-2 border-[#d4dfcd]">
                    <p className="text-xs text-[#4f7059] font-semibold uppercase mb-1">
                      Threat
                    </p>
                    <p className="text-lg sm:text-xl font-bold text-[#1c4a2b]">
                      {aiResponse.threat_name || "None"}
                    </p>
                  </div>
                  <div className="bg-white p-3 sm:p-4 rounded-lg border-2 border-[#d4dfcd]">
                    <p className="text-xs text-[#4f7059] font-semibold uppercase mb-1">
                      Confidence
                    </p>
                    <p className="text-lg sm:text-xl font-bold text-[#2f7f3a]">
                      {aiResponse.percentage.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="animate-slideIn p-3 sm:p-4 bg-linear-to-r from-red-200/50 to-orange-200/50 border-l-4 border-red-500 rounded">
                <p className="text-red-700 font-semibold text-sm sm:text-base">
                  {error}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 sm:py-3 px-4 sm:px-6 bg-[#67b978] text-[#f4fff7] font-bold text-sm sm:text-lg rounded-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 hover:shadow-[#2f7f3a]/50 hover:bg-[#579f66]"
              style={{
                boxShadow: "0 4px 15px rgba(47, 127, 58, 0.3)",
              }}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⏳</span>
                  <span className="hidden sm:inline">Testing...</span>
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <span className="hidden sm:inline">
                    Test Algorithm Prediction
                  </span>
                  <span className="sm:hidden">Test Algorithm</span>
                </span>
              )}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }

        .animate-slideIn {
          animation: slideIn 0.4s ease-out;
        }
      `}</style>
    </div>
  );
};

export default withAuth(TestAlgorithm);
