"use client";

import { useState } from "react";
import BACKENDAPI from "@/API";
import { AlgorithmTestData } from "@/types/type";
import { inputField } from "@/types/type";

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

export const TestAlgorithm = () => {
  const [formData, setFormData] = useState<AlgorithmTestData>({
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
  const [submitMessage, setSubmitMessage] = useState("");
  const [error, setError] = useState("");

  const handleInputChange = (
    field: keyof AlgorithmTestData,
    value: string | number,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: typeof value === "string" ? parseFloat(value) || value : value,
    }));
    setError("");
  };

  const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");
    setError("");

    try {
      const payload = {
        ...formData,
        Time_of_Day: formData.Time_of_Day === 0 ? "morning" : "evening",
      };

      const response = await BACKENDAPI.post("/test/AIAlgorithm", payload);
      setSubmitMessage(
        `Test submitted successfully! Prediction: ${response.data?.prediction || "Processing..."}`,
      );
      setTimeout(() => setSubmitMessage(""), 5000);
    } catch (err) {
      setError(
        `Failed to submit test: ${err instanceof Error ? err.message : "Unknown error"}`,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const InputField = ({
    label,
    field,
    type = "number",
    step = "0.1",
  }:inputField) => (
    <div className="group animate-fadeIn">
      <label
        className={`block text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2 transition-colors ${testPalette.labelText}`}
      >
        {label}
      </label>
      <input
        type={type}
        step={step}
        value={formData[field]}
        onChange={(e) =>
          handleInputChange(field, type === "number" ? e.target.value : e.target.value)
        }
        className={`w-full px-3 sm:px-4 py-1.5 sm:py-2 bg-white border-2 rounded-lg transition-all duration-300 focus:outline-none text-xs sm:text-base text-[#1c4a2b] ${testPalette.inputBorder} hover:border-[#2f7f3a] focus:border-[#2f7f3a] focus:bg-[#f7faf4]`}
        style={{
          borderColor: "#d4dfcd",
        }}
        placeholder="Enter value"
        onFocus={(e) => {
          e.currentTarget.style.borderColor = "#2f7f3a";
          e.currentTarget.style.boxShadow = "0 0 15px rgba(47, 127, 58, 0.2)";
          e.currentTarget.style.backgroundColor = "#f7faf4";
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = "#d4dfcd";
          e.currentTarget.style.boxShadow = "none";
          e.currentTarget.style.backgroundColor = "white";
        }}
      />
      <style jsx>{`
        input::placeholder {
          opacity: 0.5;
          color: #4f7059;
        }
      `}</style>
    </div>
  );

  const SelectField = ({
    label,
    field,
    options,
  }: {
    label: string;
    field: keyof AlgorithmTestData;
    options: Array<{ label: string; value: number | string }>;
  }) => (
    <div className="group animate-fadeIn">
      <label
        className={`block text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2 transition-colors ${testPalette.labelText}`}
      >
        {label}
      </label>
      <select
        value={formData[field]}
        onChange={(e) => handleInputChange(field, e.target.value)}
        className={`w-full px-3 sm:px-4 py-1.5 sm:py-2 bg-white border-2 rounded-lg transition-all duration-300 focus:outline-none text-xs sm:text-base text-[#1c4a2b] ${testPalette.inputBorder} hover:border-[#2f7f3a] focus:border-[#2f7f3a] focus:bg-[#f7faf4]`}
        style={{
          borderColor: "#d4dfcd",
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = "#2f7f3a";
          e.currentTarget.style.boxShadow = "0 0 15px rgba(47, 127, 58, 0.2)";
          e.currentTarget.style.backgroundColor = "#f7faf4";
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = "#d4dfcd";
          e.currentTarget.style.boxShadow = "none";
          e.currentTarget.style.backgroundColor = "white";
        }}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-white text-[#1c4a2b]">
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className={`${testPalette.outerBg} min-h-screen`}>
      {/* Header */}
      <div className={`${testPalette.headerBg} shadow-sm border-b-2 border-[#d4dfcd]`}>
        <div className="px-2 sm:px-4 md:px-6 py-3 sm:py-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="animate-pulse">
              <div className="w-8 sm:w-10 h-8 sm:h-10 bg-[#2f7f3a]/15 rounded-full flex items-center justify-center text-lg sm:text-xl">
              </div>
            </div>
            <div>
              <h1 className={`text-lg sm:text-2xl font-bold ${testPalette.headerTitle}`}>
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
            {/* Time of Day Section */}
            <div
              className={`${testPalette.cardBg} p-3 sm:p-4 rounded-xl border-2 ${testPalette.borderColor} shadow-md hover:shadow-lg transition-all duration-300 lg:col-span-3 hover:border-[#67b978]`}
            >
              <h3 className={`text-base sm:text-lg font-bold mb-3 sm:mb-4 ${testPalette.labelText}`}>
                 Time Configuration
              </h3>
              <SelectField
                label="Time of Day"
                field="Time_of_Day"
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
              <h3 className={`text-base sm:text-lg font-bold mb-3 sm:mb-4 ${testPalette.labelText}`}>
                 Plant Information
              </h3>
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <InputField
                  label="Plant Age (Days)"
                  field="Plant_Age_Days"
                  step="1"
                />
                <InputField label="Growth Stage" field="Growth_Stage" type="text" />
              </div>
            </div>

            {/* Climate Data Section */}
            <div
              className={`${testPalette.cardBg} p-3 sm:p-4 rounded-xl border-2 ${testPalette.borderColor} shadow-md hover:shadow-lg transition-all duration-300 lg:col-span-3 hover:border-[#67b978]`}
            >
              <h3 className={`text-base sm:text-lg font-bold mb-3 sm:mb-4 ${testPalette.labelText}`}>
                 Climate Data
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                <InputField
                  label="Max Temperature (°C)"
                  field="Max_Temp_C"
                />
                <InputField
                  label="Min Temperature (°C)"
                  field="Min_Temp_C"
                />
                <InputField
                  label="Sunlight Hours"
                  field="Sunlight_Hours"
                />
                <InputField
                  label="Avg Day Humidity (%)"
                  field="Avg_Day_Hum"
                />
                <InputField
                  label="Avg Night Humidity (%)"
                  field="Avg_Night_Hum"
                />
                <InputField
                  label="Rain Level (mm)"
                  field="Rain_Level_mm"
                />
              </div>
            </div>

            {/* Soil Data Section */}
            <div
              className={`${testPalette.cardBg} p-3 sm:p-4 rounded-xl border-2 ${testPalette.borderColor} shadow-md hover:shadow-lg transition-all duration-300 lg:col-span-3 hover:border-[#67b978]`}
            >
              <h3 className={`text-base sm:text-lg font-bold mb-3 sm:mb-4 ${testPalette.labelText}`}>
                Soil Data
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                <InputField
                  label="Soil Moisture (%)"
                  field="Soil_Moisture"
                />
                <InputField
                  label="Leaf Wetness Hours"
                  field="Leaf_Wetness_Hours"
                />
                <InputField
                  label="Cumulative Stress Index"
                  field="Cumulative_Stress_Index"
                />
              </div>
            </div>

            {/* Past 10 Days Indicators Section */}
            <div
              className={`${testPalette.cardBg} p-3 sm:p-4 rounded-xl border-2 ${testPalette.borderColor} shadow-md hover:shadow-lg transition-all duration-300 lg:col-span-3 hover:border-[#67b978]`}
            >
              <h3 className={`text-base sm:text-lg font-bold mb-3 sm:mb-4 ${testPalette.labelText}`}>
                 Past 10 Days Indicators
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-3 lg:gap-4">
                <InputField
                  label="Hot Days"
                  field="Hot_Days_Past_10_Days"
                  step="1"
                />
                <InputField
                  label="Wet Nights"
                  field="Wet_Nights_Past_10_Days"
                  step="1"
                />
                <InputField
                  label="Dry Soil Days"
                  field="Dry_Soil_Days_Past_10_Days"
                  step="1"
                />
                <InputField
                  label="Flooded Days"
                  field="Flooded_Days_Past_10_Days"
                  step="1"
                />
                <InputField
                  label="Rainy Days"
                  field="Rainy_Days_Past_10_Days"
                  step="1"
                />
                <InputField
                  label="Total Rain Volume (mm)"
                  field="Total_Rain_Volume_mm_Past_10_Days"
                />
              </div>
            </div>
          </div>

          {/* Submit Section */}
          <div className="mt-6 sm:mt-8 flex flex-col gap-3 sm:gap-4">
            {submitMessage && (
              <div className="animate-slideIn p-3 sm:p-4 bg-linear-to-r from-[#2f7f3a]/20 to-[#67b978]/20 border-l-4 border-[#2f7f3a] rounded">
                <p className="text-[#1c4a2b] font-semibold text-sm sm:text-base">{submitMessage}</p>
              </div>
            )}

            {error && (
              <div className="animate-slideIn p-3 sm:p-4 bg-linear-to-r from-red-200/50 to-orange-200/50 border-l-4 border-red-500 rounded">
                <p className="text-red-700 font-semibold text-sm sm:text-base">{error}</p>
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

                  <span className="hidden sm:inline">Test Algorithm Prediction</span>
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

export default TestAlgorithm;
