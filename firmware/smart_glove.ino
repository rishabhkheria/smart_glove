/*
  Smart Glove - ESP32
  MPU6050 (I2Cdev / Jeff Rowberg) version
  - Reads 5 flex sensors + MPU6050 (getMotion6)
  - Sends readings to gesture server: /callback.gesture/<thumb+256>/.../<roll+256>
  - Optionally asks Google Translate API for Kannada (if key is set)
*/

#include <Arduino.h>
#include <Wire.h>
#include "I2Cdev.h"
#include "MPU6050.h"

#include "secrets.h"

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <Adafruit_Sensor.h>  // just to satisfy include, not directly used
#include <math.h>

#ifndef M_PI
#define M_PI 3.14159265358979323846
#endif

// ---------- Pins ----------
#define DAC_PIN 25   // (currently unused, kept for future DAC/audio use)

const int thumb_flex_pin         = 32;
const int index_finger_flex_pin  = 39;
const int middle_finger_flex_pin = 34;
const int ring_finger_flex_pin   = 35;
const int pinky_finger_flex_pin  = 33;

// ---------- Globals ----------
MPU6050 mpu;

int thumb_flex_value         = 0;
int index_finger_flex_value  = 0;
int middle_finger_flex_value = 0;
int ring_finger_flex_value   = 0;
int pinky_finger_flex_value  = 0;

// Gesture send timing
unsigned long lastSendTime = 0;
const unsigned long SEND_INTERVAL = 1000;  // send to server every 1s

// WiFi & API
// WiFi / API keys are loaded from firmware/secrets.h (keep that file local and gitignored)
const char* ssid     = WIFI_SSID;
const char* password = WIFI_PASSWORD;
const char* googleApiKey = GOOGLE_API_KEY;

// 🔴 PRODUCTION RENDER SERVER URL
const char* gestureServerIP   = "smart-glove-backend.onrender.com";
const int   gestureServerPort = 443;

// ---------- Forward declarations ----------
void mpu_setup();
void read_mpu_and_compute_angles(int &pitchInt, int &rollInt, int &gx_raw, int &gy_raw);
String urlEncode(const String &str);
String translateText(const char* text, const String &targetLang);
void get_gesture(int &pitch, int &roll);

// ---------- Setup ----------
void setup() {
  Serial.begin(115200);
  delay(200);

#if defined(ARDUINO_ARCH_ESP32)
  analogReadResolution(12); // ESP32 ADC: 0..4095
#endif

  pinMode(thumb_flex_pin,         INPUT);
  pinMode(index_finger_flex_pin,  INPUT);
  pinMode(middle_finger_flex_pin, INPUT);
  pinMode(ring_finger_flex_pin,   INPUT);
  pinMode(pinky_finger_flex_pin,  INPUT);

  // MPU setup
  mpu_setup();

  // WiFi connect
  Serial.println("Connecting to WiFi...");
  WiFi.begin(ssid, password);
  unsigned long start = millis();
  const unsigned long wifiTimeout = 20000; // 20s
  while (WiFi.status() != WL_CONNECTED && millis() - start < wifiTimeout) {
    delay(500);
    Serial.print(".");
  }
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n✅ WiFi connected!");
    Serial.print("IP: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("\n❌ WiFi connect timeout - will retry in loop");
  }
}

// ---------- MPU setup ----------
void mpu_setup() {
  Serial.println("Initializing MPU6050 (I2Cdevlib)...");
  Wire.begin();
  mpu.initialize();

  if (mpu.testConnection()) {
    Serial.println("MPU6050 connection OK");
  } else {
    Serial.println("MPU6050 connection FAILED - check wiring/power");
  }

  // If you have calibrated offsets, you can set them here:
  // mpu.setXGyroOffset(0);
  // mpu.setYGyroOffset(0);
  // mpu.setZGyroOffset(0);
}

// ---------- MPU read + angles ----------
void read_mpu_and_compute_angles(int &pitchInt, int &rollInt, int &gx_raw, int &gy_raw) {
  int16_t ax_raw = 0, ay_raw = 0, az_raw = 0;
  int16_t gx = 0, gy = 0, gz = 0;

  mpu.getMotion6(&ax_raw, &ay_raw, &az_raw, &gx, &gy, &gz);

  gx_raw = (int)gx;
  gy_raw = (int)gy;

  // Convert accel raw -> g (assuming ±2g => 16384 LSB/g)
  const float accel_sens = 16384.0f;
  float ax_g = (float)ax_raw / accel_sens;
  float ay_g = (float)ay_raw / accel_sens;
  float az_g = (float)az_raw / accel_sens;

  float pitch_f = -(atan2(ax_g, sqrt(ay_g * ay_g + az_g * az_g)) * 180.0f) / M_PI;
  float roll_f  =  (atan2(ay_g, sqrt(ax_g * ax_g + az_g * az_g)) * 180.0f) / M_PI;

  pitchInt = (int)round(pitch_f);
  rollInt  = (int)round(roll_f);
}

// ---------- URL encoder ----------
String urlEncode(const String &str) {
  String encoded = "";
  char c;
  for (size_t i = 0; i < str.length(); ++i) {
    c = str[i];
    if ((c >= 'a' && c <= 'z') ||
        (c >= 'A' && c <= 'Z') ||
        (c >= '0' && c <= '9') ||
        c == '-' || c == '_' || c == '.' || c == '~') {
      encoded += c;
    } else if (c == ' ') {
      encoded += '+';
    } else {
      char buf[4];
      sprintf(buf, "%%%02X", (uint8_t)c);
      encoded += buf;
    }
  }
  return encoded;
}

// ---------- Google Translate (optional) ----------
String translateText(const char* text, const String &targetLang) {
  // If no real key, skip API
  if (googleApiKey == nullptr ||
      String(googleApiKey).length() == 0 ||
      String(googleApiKey) == "REPLACE_WITH_YOUR_KEY") {
    Serial.print("Gesture (no translation): ");
    Serial.println(text);
    return "";
  }

  String translatedText = "";

  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    String q = urlEncode(String(text));
    String url = "https://translation.googleapis.com/language/translate/v2?key=" +
                 String(googleApiKey) +
                 "&q=" + q +
                 "&target=" + targetLang +
                 "&source=en";

    Serial.print("translateText URL: ");
    Serial.println(url);

    http.begin(url);
    int httpCode = http.GET();
    if (httpCode > 0) {
      String payload = http.getString();
      StaticJsonDocument<4096> doc;
      DeserializationError error = deserializeJson(doc, payload);
      if (!error) {
        if (doc.containsKey("data") &&
            doc["data"]["translations"].size() > 0) {
          const char* translation = doc["data"]["translations"][0]["translatedText"];
          translatedText = String(translation);
        }
      } else {
        Serial.print("translateText JSON parse error: ");
        Serial.println(error.c_str());
      }
    } else {
      Serial.printf("translateText HTTP failed: %d\n", httpCode);
    }
    http.end();
  } else {
    Serial.println("translateText - WiFi not connected");
  }

  return translatedText;
}

// ---------- Call gesture server ----------
void get_gesture(int &pitch, int &roll) {
  String url = String("https://") +
               String(gestureServerIP) +
               "/callback.gesture/" +
               String(256 + thumb_flex_value)         + "/" +
               String(256 + index_finger_flex_value)  + "/" +
               String(256 + middle_finger_flex_value) + "/" +
               String(256 + ring_finger_flex_value)   + "/" +
               String(256 + pinky_finger_flex_value)  + "/" +
               String(256 + pitch)                    + "/" +
               String(256 + roll);

  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.setFollowRedirects(HTTPC_STRICT_FOLLOW_REDIRECTS); // Useful for Render redirects
    Serial.print("Requesting: ");
    Serial.println(url);

    http.begin(url);
    int httpResponseCode = http.GET();

    if (httpResponseCode > 0) {
      String payload = http.getString();
      Serial.print("HTTP response: ");
      Serial.println(httpResponseCode);
      Serial.print("Payload: ");
      Serial.println(payload);

      StaticJsonDocument<1024> doc;
      DeserializationError error = deserializeJson(doc, payload);
      if (!error) {
        const char* classValue = doc["class"];
        if (classValue != nullptr) {
          // Try translate (if key available)
          String kannadaTranslation = translateText(classValue, "kn");

          Serial.print("Gesture: ");
          Serial.print(classValue);
          if (kannadaTranslation.length() > 0) {
            Serial.print(" -> ");
            Serial.println(kannadaTranslation);
          } else {
            Serial.println();
          }
        } else {
          Serial.println("get_gesture - 'class' not found in JSON");
        }
      } else {
        Serial.print("get_gesture - JSON parse error: ");
        Serial.println(error.c_str());
      }
    } else {
      Serial.printf("get_gesture - HTTP failed. Code: %d\n", httpResponseCode);
    }
    http.end();
  } else {
    Serial.println("get_gesture - WiFi not connected");
  }
}

// ---------- Main loop ----------
void loop() {
  // 1) Read flex sensors (0..4095) → map to 0..255
  thumb_flex_value         = map(analogRead(thumb_flex_pin),         0, 4095, 0, 255);
  index_finger_flex_value  = map(analogRead(index_finger_flex_pin),  0, 4095, 0, 255);
  middle_finger_flex_value = map(analogRead(middle_finger_flex_pin), 0, 4095, 0, 255);
  ring_finger_flex_value   = map(analogRead(ring_finger_flex_pin),   0, 4095, 0, 255);
  pinky_finger_flex_value  = map(analogRead(pinky_finger_flex_pin),  0, 4095, 0, 255);

  // If middle accidentally 0, approximate from neighbors
  if (middle_finger_flex_value == 0) {
    middle_finger_flex_value =
      (index_finger_flex_value + ring_finger_flex_value) / 2;
  }

  // 2) Read MPU angles
  int pitch = 0, roll = 0;
  int gx_raw = 0, gy_raw = 0;
  read_mpu_and_compute_angles(pitch, roll, gx_raw, gy_raw);

  // 3) Debug print
  Serial.printf(
    "flex: T%d I%d M%d R%d P%d | pitch:%d roll:%d | gx:%d gy:%d\n",
    thumb_flex_value, index_finger_flex_value, middle_finger_flex_value,
    ring_finger_flex_value, pinky_finger_flex_value,
    pitch, roll, gx_raw, gy_raw
  );

  // 4) Send gesture to server every SEND_INTERVAL ms
  unsigned long now = millis();
  if (now - lastSendTime >= SEND_INTERVAL) {
    lastSendTime = now;
    get_gesture(pitch, roll);
  }

  // 5) WiFi auto-reconnect every 5s if disconnected
  static unsigned long lastWiFiRetry = 0;
  if (WiFi.status() != WL_CONNECTED &&
      millis() - lastWiFiRetry > 5000) {
    Serial.println("Reconnecting WiFi...");
    WiFi.disconnect();
    WiFi.begin(ssid, password);
    lastWiFiRetry = millis();
  }

  delay(100);
}
