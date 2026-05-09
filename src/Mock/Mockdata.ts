export const mockHealthy = {
  timestamp: new Date().toISOString(),
  sensors: [
    { id: "temp", label: "Temperature", value: 24.5, unit: "°C" },
    { id: "hum", label: "Air Humidity", value: 60, unit: "%" },
    { id: "rain", label: "Rain Level", value: 0, unit: "mm" },
    { id: "soil", label: "Soil Moisture", value: 60, unit: "%" },
    { id: "light", label: "Light Level", value: 450, unit: "Lux" },
  ],
  AIData: {
    ui_status: "healthy",
    ui_title: "Farm is Healthy",
    spray_action:
      "No action needed — continue routine monitoring every 30 minute",
    description:
      "All environmental conditions are within optimal thresholds. Continue standard monitoring.",
    confidence: 98.2,
    sms_alert_sent: false,
  },
  farmInfo: {
    name: "Green Valley Farm",
    location: "Springfield",
  },
};

export const mockDisease = {
  timestamp: new Date().toISOString(),
  sensors: [
    { id: "temp", label: "Temperature", value: 23.5, unit: "°C" },
    { id: "hum", label: "Air Humidity", value: 94, unit: "%" },
    { id: "rain", label: "Rain Level", value: 12, unit: "mm" },
    { id: "soil", label: "Soil Moisture", value: 75, unit: "%" },
    { id: "light", label: "Light Level", value: 450, unit: "Lux" },
  ],
  AIData: {
    ui_status: "disease",
    ui_title: "Angular Leaf Spot Detected",
    spray_action: "Apply Copper-based Fungicide",
    description:
      "Angular leaf spot thrives in wet, humid conditions. Spray copper-based fungicide and improve drainage to reduce soil saturation.",
    confidence: 80.8,
    sms_alert_sent: true, // Test Twilio Success
  },
  farmInfo: {
    name: "Green Valley Farm",
    location: "Springfield",
  },
};

export const mockPest = {
  timestamp: new Date().toISOString(),
  sensors: [
    { id: "temp", label: "Temperature", value: 34.2, unit: "°C" },
    { id: "hum", label: "Air Humidity", value: 35, unit: "%" },
    { id: "rain", label: "Rain Level", value: 0, unit: "mm" },
    { id: "soil", label: "Soil Moisture", value: 20, unit: "%" },
    { id: "light", label: "Light Level", value: 450, unit: "Lux" },
  ],
  AIData: {
    ui_status: "pest",
    ui_title: "Aphid Infestation Warning",
    spray_action: "Spray Neem Oil",
    description:
      "Aphid vectors thrive in current heat and dry conditions. Focus spray on the under-leaves.",
    confidence: 88.5,
    sms_alert_sent: false, // Test Twilio Failure
  },
  farmInfo: {
    name: "Green Valley Farm",
    location: "Springfield",
  },
};
