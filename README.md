                            Executive Summary
This repository contains the full-stack implementation of BeanGuard, a closed-loop precision agriculture system designed to protect bean crops from their three most destructive threats — Anthracnose fungal disease, Bean Aphid infestations, and Bean Pod Borer attacks. The system deploys a network of physical environmental sensors on the farm edge, streams live data to a cloud backend, runs a trained Random Forest machine learning classifier to predict outbreaks before they become visible, and delivers instant SMS alerts to the farmer's mobile phone. When a threat is confirmed, the farmer opens a live web dashboard, reviews the real-time sensor data, reads a dedicated AI-generated recommendation card that prescribes the exact remedy for the detected threat, and remotely triggers a physical sprayer pump with a single click — without stepping foot on the farm.

                               The Core Problem
In traditional bean farming, crops are constantly under threat from three quiet killers:
Anthracnose: A destructive fungal disease that spreads rapidly under specific humidity and dew conditions, often invisible until the damage is already catastrophic.
Bean Aphids: Pests that silently destroy leaves and reduce yield before a farmer even notices their presence.
Bean Pod Borer: A moth larvae that bores directly into bean pods and destroys the seeds inside, causing severe yield loss that is almost impossible to reverse once the infestation takes hold.

Farmers typically do not detect these threats until physical damage is already visible. By that point, two expensive outcomes are almost guaranteed:

Late intervention: The crop is already significantly damaged, reducing or destroying the harvest.
Chemical over-spraying: Without knowing exactly what the threat is or where it is developing, farmers blanket the entire farm with harsh, expensive chemicals as a precaution — wasting money and degrading soil health.

BeanMonitor was built to eliminate both outcomes by detecting threats at the environmental signature level, before any physical damage occurs, and prescribing the exact targeted remedy rather than leaving the farmer to guess.

                               The Solution
BeanMonitor implements a 24/7 digital monitoring and response system for bean farms. Rather than relying on human observation and guesswork, it deploys four physical electronic sensors to continuously measure the farm's micro-climate, streams that data to a cloud brain that runs artificial intelligence to predict outbreak conditions, and gives the farmer a live Next.js web dashboard to monitor the farm's health in real-time. When the AI detects a threat, a dedicated recommendation card on the dashboard displays the exact action the farmer should take for that specific threat. The farmer can then deploy the targeted chemical treatment remotely with a single button click.
The system is built on a Human-in-the-Loop philosophy — the AI detects, scores, and recommends. The farmer retains the final executive decision on whether to spray.
                             System Architecture
The system operates as a closed-loop network divided into three distinct stages: collecting the data at the farm edge, analyzing it in the cloud, and enabling the farmer's response.
Stage 1 — The Farm Edge: Collecting the Data
On the physical farm, an ESP32 microcontroller acts as the central edge device. Its built-in Wi-Fi connects it to the cloud backend, and four electronic sensors plugged into it continuously measure the bean farm's micro-climate:

    Sensor                                        Measurement
DHT22                                 Ambient air temperature and humidity
Capacitive Soil Moisture Sensor       Water levels in the soil around the roots
Rain Droplet Sensor                   Quantity of rainfall with respect to time
LDR (Light Dependent Resistor)       Solar radiation and light intensity

Why combining these four sensors matters: Fungal diseases like Anthracnose thrive when leaves remain wet from morning dew for extended periods. Bean Pod Borers are more active during specific temperature and light intensity windows. By combining all four readings, the system can track the precise environmental signatures that precede each of the three threats — before any physical damage is visible to the human eye.

Stage 2 — The Cloud Brain: Analyzing and Broadcasting Live Data The ESP32 uses its built-in Wi-Fi to establish a continuous live WebSocket connection directly to a Node.js/Express backend server hosted on Railway. The moment sensor readings are captured, they travel instantly to the cloud where the data splits into two parallel processing paths:

Path A — The Live Analytics Stream:
The server uses Socket.io to instantly push every incoming sensor reading to the farmer's Next.js web dashboard. The dashboard displays live updating Recharts graphs covering a rolling 24-hour window of farm environmental data pulled from MongoDB. Charts move and refresh automatically — the farmer never needs to reload the page.
Path B — The AI Prediction Engine:
The server bundles three inputs into a specialized data payload and dispatches it to a second cloud service running a trained machine learning model:

Current real-time sensor readings
Historical environmental records from the past 10 days
The exact age of the bean crop in days

Rather than running predictions continuously on every sensor reading — which would be computationally wasteful and environmentally meaningless — the system uses a node-cron scheduled job to trigger the AI prediction exactly twice per day:

6:00 AM: Captures the overnight environmental accumulation — peak dew formation, overnight humidity buildup, and soil saturation levels — the exact window when Anthracnose risk is highest.
6:00 PM: Captures the end-of-day conditions — peak daytime temperature, light intensity wind-down, and the onset of evening — the exact window when Bean Pod Borer moths are most active for egg-laying.

At each scheduled trigger, the server bundles the current sensor snapshot alongside the 10-day historical record and crop age, then dispatches the full payload to the FastAPI service running the trained Random Forest Machine Learning Classifier, which returns a threat prediction — Anthracnose, Bean Aphids, Bean Pod Borer, or No Threat — alongside a confidence score.

Why crop age is a critical input?: Bean plants are biologically vulnerable to different pests and diseases at different stages of their life cycle. Young sprouting leaves carry different risk profiles than older flowering or podding stages, and Bean Pod Borers specifically target the podding stage. Feeding the crop's exact age into the model alongside environmental data allows the classifier to deliver significantly more accurate threat predictions than environmental data alone could produce.

Stage 3 — The Farmer's Response: Alerts, Recommendations, and Remote Actuation
Telecommunication Alert:
When the Random Forest classifier detects an anomaly and returns a threat confidence score above the farmer's configured threshold (for example, "Bean Pod Borer detected with 85% probability"), the cloud backend immediately fires an alert request to the Africa's Talking SMS Gateway. The gateway routes a live text message across cellular networks directly to the farmer's mobile handset — no smartphone, no internet connection, and no app required on the farmer's end.
Dashboard Assessment and Recommendation Card:
The farmer receives the SMS alert and opens the web dashboard. Alongside the live 24-hour sensor charts, a dedicated AI Recommendation Card is dynamically rendered based on the specific threat the classifier detected. This card displays:

The identified threat name and confidence score
A plain-language explanation of why conditions are dangerous
The exact prescribed remedy for that specific threat (fungicide for Anthracnose, pesticide for Bean Aphids, or targeted larvicide for Bean Pod Borer)
The recommended application urgency level

The farmer does not need to guess what to do or which sprayer to activate — the system identifies the exact threat, prescribes the exact remedy, and when the farmer clicks the deploy button, the correct sprayer fires automatically based on the AI classification.
Remote Spraying — Manual Actuation:
From the dashboard, the farmer deploys the AI-recommended remedy by clicking a single button. This action sends an immediate MQTT control signal from the cloud backend down to the ESP32 on the farm. The ESP32 controls two dedicated relay channels, each wired to a separate physical sprayer pump:

Relay One activates the fungicide sprayer — deployed for Anthracnose detections.
Relay Two activates the pesticide sprayer — deployed for Bean Aphid and Bean Pod Borer detections.

The correct sprayer is activated automatically based on the threat the AI identified — the farmer never risks applying the wrong chemical to the wrong threat. Both sprayers can only be triggered from the dashboard and never fire simultaneously.

                        Key Engineering Workflows
A. Multi-Threat Environmental Signature Detection
Rather than applying a single generic threshold to trigger alerts, BeanMonitor models the distinct environmental signatures of all three threats simultaneously:

Anthracnose is flagged when the LDR detects nighttime or dawn conditions, humidity is elevated, and temperature is dropping — the precise dew-formation signature.
Bean Aphids are flagged when temperatures are warm, humidity is moderate, and soil moisture is low — the stress conditions that make plants most vulnerable to aphid colonization.
Bean Pod Borer is flagged when light intensity and temperature align with the moth's known active flight and egg-laying windows, cross-referenced against crop age to confirm the plant is in the podding stage.

All four sensors working together produce a detection resolution that no single sensor could achieve alone.

B. Scheduled Twice-Daily Prediction Cycle — Precision Over Frequency
Rather than triggering the Random Forest classifier on every incoming sensor reading, BeanMonitor uses a node-cron scheduled job to run predictions at the two most environmentally significant moments of the agricultural day:

6:00 AM prediction: Assesses the overnight environmental accumulation. By dawn, dew has fully formed, overnight humidity has peaked, and soil saturation reflects the full effect of nighttime conditions — the precise window when Anthracnose fungal risk is at its highest and most accurately measurable.
6:00 PM prediction: Assesses end-of-day conditions. Daytime temperature has peaked, light intensity is declining, and evening conditions are setting in — the precise window when Bean Pod Borer moths are most active for flight and egg-laying on bean pods.

This scheduled approach means the AI is always evaluating the farm at the moments of highest diagnostic value, rather than burning compute resources on midday readings when environmental conditions are stable and threat signatures are least likely to appear. It also means the farmer receives at most two SMS alerts per day — preventing alert fatigue while ensuring no critical threat window is ever missed.

C. Crop-Age-Aware Random Forest Classifier
The Random Forest classifier was trained with crop age as an explicit feature variable alongside all four sensor readings and 10 days of historical environmental data. This means the model understands that the same humidity and temperature readings carry entirely different risk profiles depending on whether the plant is a two-week seedling or a ten-week podding crop — the stage at which Bean Pod Borer becomes a primary threat. This produces accurate predictions across the full growth cycle rather than a one-size-fits-all environmental threshold.

D. Dynamic Threat Recommendation Card
When the AI returns a threat prediction, the dashboard does not simply display an alert banner. A fully dynamic Recommendation Card component built in Next.js with shadcn/ui and animated with Framer Motion is rendered, containing the threat identity, confidence score, plain-language explanation, and the exact prescribed chemical remedy for that specific threat. This means a farmer with no agronomic training can read the card and know precisely what product to deploy and at what urgency — reducing the knowledge barrier that often leads to wrong chemical choices or delayed response.

E. Human-in-the-Loop Control — Farmer Retains Final Authority
BeanGuard deliberately does not automate the spraying decision. The AI detects, scores, and recommends. The farmer reviews the live data, reads the recommendation card, makes the judgment call, and initiates the spray. This design choice exists for two reasons: first, false positives in automated spraying waste expensive chemicals and stress the crop; second, farmers have contextual knowledge about their specific field that no sensor array can fully capture. The system amplifies the farmer's judgment rather than replacing it.

F. Real-Time Live Dashboard — Zero Refresh Architecture
Every sensor reading that arrives at the cloud server is instantly broadcast to the farmer's browser through Socket.io, with no polling interval and no manual refresh required. The Recharts graphs pull the past 24 hours of historical readings from MongoDB on initial load and then update in real-time as new readings stream in. The same Socket.io layer handles live threat alert banners and triggers the Recommendation Card render the moment the AI returns a high-confidence prediction — all animated smoothly through Framer Motion.

                                    Tech Stack
      Layer                                 Technology
Farm Edge Device               ESP32 Microcontroller
Environmental Sensors          DHT22, Capacitive Soil Moisture, Rain Droplet, LDR
Edge-to-Cloud Communication    Websocket(socket.io)
Hardware Actuation Protocol    MQTT
Physical Actuation             two pumps(pesticide & fungicide) control by relay
Backend Server                 Node.js + Express.js
Prediction Scheduling          node-cron
Real-Time Dashboard Events     Socket.io
Machine Learning Service       FastAPI (Python)
ML Model                       Random Forest Classifier
SMS Alert Gateway              Africa's Talking SMS API
Frontend Dashboard             Next.js
UI Components                  shadcn/ui
Styling                        Tailwind CSS
Animations                     Framer Motion
Data Visualization             Recharts
Database                       MongoDB
Cloud Hosting                  Railway

                            Database Schema
Collection                                                   Purpose
sensor_readings               Timestamped environmental readings from the ESP32
prediction_logs               AI prediction results, confidence and threat type
spray_events                  control of remote actuation
crop_records                  Active crop planting date and calculated age in days
alert_logs                    SMS alert history, message content, delivery status
farmer_settings              Configurable threat confidence threshold for SMS.

                       Project Objectives
Detect Anthracnose, Bean Aphid, and Bean Pod Borer threats at the environmental signature level before physical crop damage occurs
Eliminate chemical over-spraying by delivering targeted, AI-confirmed threat alerts with specific remedy prescriptions
Give farmers 24/7 real-time visibility into their farm's micro-climate through a live updating web dashboard
Schedule AI predictions at the two most diagnostically valuable moments of the day — 6AM and 6PM — preventing alert fatigue while ensuring no threat window is missed
Deliver threat alerts directly to the farmer's basic mobile handset via SMS, requiring no smartphone or internet on the farmer's end
Prescribe the exact correct remedy for each specific threat through a dynamic AI Recommendation Card
Enable remote targeted crop treatment through two dedicated sprayers, each automatically selected based on AI threat classification
Maintain Human-in-the-Loop control so the farmer retains final authority over all chemical deployment decisions

                        Quick Start
Prerequisites

Node.js v18 or higher
Python 3.9 or higher
MongoDB instance (Atlas)
Railway account for cloud hosting
Africa's Talking account and API key
ESP32 flashed with farm edge firmware
MQTT broker instance (HiveMQ)

                         Backend Server
git clone https://github.com/your-username/beanguard-server
cd beanguard-server
npm install
cp .env.example .env
# Fill in your MongoDB URI, Africa's Talking key, MQTT broker address, and FastAPI URL
npm run dev

                  ML Prediction Service
git clone https://github.com/your-username/beanguard-ml
cd beanguard-ml
pip install -r requirements.txt
uvicorn main:app --reload

                   Frontend Dashboard
bashgit clone https://github.com/your-username/beanguard-dashboard
cd beanguard-dashboard
npm install
npm run dev






