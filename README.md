# Smart Glove – AI Gesture to Speech System

## Overview

Smart Glove is an IoT + AI based wearable communication system designed to convert hand gestures into speech and text in real time.

The project uses a glove embedded with flex sensors and an MPU6050 motion sensor connected to an ESP32 microcontroller. Sensor readings are sent wirelessly to a Python Flask backend where machine learning (KNN) predicts gestures. The detected gesture is then displayed on a React frontend dashboard and converted into voice output through the browser speaker (laptop/mobile after deployment).

It also includes an SOS emergency feature using Twilio SMS alerts.

## Key Features

- Real-time hand gesture recognition
- Gesture to speech conversion
- React live dashboard
- Emergency SOS alert via Twilio SMS
- Multi-language translation support using Google Translate API
- Live sensor monitoring
- IoT wearable glove system
- Full-stack deployed project

## Tech Stack

### Frontend

- React (Vite)
- CSS
- Axios
- REST API Integration

### Backend

- Python
- Flask
- Flask-CORS
- Flask-RESTful

### Machine Learning

- Scikit-learn
- KNN Classifier
- Pandas
- NumPy

### Embedded / Hardware

- ESP32
- Arduino IDE
- Embedded C++
- Flex Sensors
- MPU6050 Gyroscope + Accelerometer
- I2C Communication Protocol

### APIs / Services

- Twilio SMS API
- Google Translate API
- Browser Speech Output

## Hardware Components

- Smart Glove
- ESP32 Dev Board
- 5 Flex Sensors
- MPU6050 Motion Sensor
- Jumper Wires
- Power Supply / USB

## How It Works

```text
Flex Sensors + MPU6050
				↓
			ESP32
				↓ (WiFi HTTP Requests)
	 Python Flask Backend
				↓
 KNN Gesture Prediction
				↓
Text + Voice Output
				↓
React Dashboard
```

### Gesture Recognition Flow

- Finger bends are captured using flex sensors
- Hand motion/orientation is captured using MPU6050
- ESP32 reads sensor values in real time
- Data is sent to the Flask server through REST API
- KNN model predicts the gesture
- Output is shown on the dashboard
- Voice is generated through browser/laptop/mobile speaker
- If the HELP gesture is detected, an SOS SMS is sent

### Machine Learning Model

#### Algorithm Used

- K-Nearest Neighbors (KNN)

#### Why KNN?

- Lightweight
- Fast for small-medium datasets
- Suitable for gesture classification
- Easy real-time implementation

#### Dataset

Custom sensor dataset containing:

- Thumb Flex
- Index Flex
- Middle Flex
- Ring Flex
- Pinky Flex
- Pitch
- Roll
- Gesture Label

Approx samples:

- 4499+ records

### Embedded Systems Concepts Used

- Real-Time Sensor Reading
- ADC Analog Input Processing
- I2C Protocol Communication
- Wireless Data Transfer
- Interrupt / Continuous Loop Processing
- Sensor Fusion Concepts
- Embedded Firmware Development
- Real-Time Operating Concept

Although no dedicated RTOS is used, the project follows real-time embedded behavior:

- Continuous sensor polling
- Immediate gesture response
- Low latency communication
- Timed request intervals

(ESP32 can be extended with FreeRTOS in future versions.)

### Emergency SOS Feature

If a dangerous/help gesture is detected:

- Automatic SMS is sent using Twilio
- Useful for elderly users, mute users, women safety, and emergency support

### Translation Support

Using Google Translate API:

- Gesture text can be translated into regional languages
- Example:
	- English → Kannada
	- English → Hindi
	- More languages possible

### Voice Output

After deployment:

- Browser speaker can speak the detected gesture
- Works on:
	- Laptop speaker
	- Mobile speaker
	- External speaker

Example:

- Gesture Detected: Hello
- Voice Output: "Hello"

## Folder Structure

```text
Smart-Glove/
│── frontend/      # React Dashboard
│── backend/       # Flask + ML Server
│── firmware/      # ESP32 Arduino Code
│── docs/          # Images / Screenshots
│── README.md
```

## Local Setup

### Backend

```powershell
cd backend
pip install -r requirements.txt
python app.py
```

If you do not have a `requirements.txt`, install the packages used by the backend manually:

```powershell
python -m pip install flask flask-cors flask-restful pandas scikit-learn twilio gTTS pygame
```

### Frontend

```powershell
cd frontend
npm install
npm run dev
```

### Firmware

Open:

```text
firmware/smart_glove.ino
```

Upload using Arduino IDE to the ESP32.

## Deployment

### Frontend

Deploy on Render Static Site.

### Backend

Deploy on Render Web Service.

After deployment:

- Frontend calls backend APIs
- Backend returns live gesture data

## Environment Variables

Create `.env` inside `backend`:

```env
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_FROM_NUMBER=
TWILIO_TO_NUMBER=
GOOGLE_TRANSLATE_API_KEY=
```

## API Endpoints

### ESP32 Callback

```text
/callback.gesture/<sensor-values>
```

### Frontend Data

```text
/api/latest
```

## Important Notes

- Keep API keys private
- Do not upload `.env`
- Twilio free accounts may have SMS limits
- Render free tier may sleep after inactivity
- Google Translate API usage may incur billing after free quota
- Browser voice depends on permission/device audio

## Future Improvements

- Mobile App Integration
- Bluetooth Version
- Better ML Models (Random Forest / XGBoost)
- Custom Gesture Training
- Cloud Database Logging
- FreeRTOS Task Scheduling
- Battery Powered Portable Model

## Resume Highlights

- Built full-stack IoT Smart Glove using React, Flask, ESP32, and machine learning
- Implemented real-time gesture to speech conversion system
- Developed wearable emergency SOS alert solution
- Integrated sensors using I2C communication
- Designed deployed dashboard with live monitoring

## Author

Rishabh Kheria

## License

This project is created for educational and portfolio purposes.

## Project Safety Notes

- Server secrets (Twilio SID/token and phone numbers) should stay in `backend/.env`
- Device secrets (Wi‑Fi SSID/password and optional API key) should stay in `firmware/secrets.h`
- Keep both files local and ignored by git
- Never put private production keys into frontend variables that are exposed to the browser

## Quick Setup Recap

### Backend

```powershell
cd backend
copy NUL .env
notepad .env
python app.py
```

### Frontend

```powershell
cd frontend
npm install
npm run dev
```

### Git Push

```powershell
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/rishabhkheria/smart_glove.git
git push -u origin main
```

## If Secrets Were Ever Exposed

- Rotate Twilio credentials immediately
- Update local `backend/.env`
- Keep `firmware/secrets.h` private
- If a secret was committed, remove it from tracking with `git rm --cached` and rewrite history only if needed

