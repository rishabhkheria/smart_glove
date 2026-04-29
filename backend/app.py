import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.neighbors import KNeighborsClassifier
from flask import Flask
from flask_cors import CORS
from flask_restful import Api, Resource
from twilio.rest import Client
from gtts import gTTS
import io
import os
import pygame
import time

# ==============================
#  CONFIG
# ==============================

# Local dataset file
DATASET_PATH = "dataset.csv"

# Twilio – load from environment (create backend/.env locally, do NOT commit)
TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID", "")
TWILIO_AUTH_TOKEN  = os.getenv("TWILIO_AUTH_TOKEN", "")
TWILIO_FROM_NUMBER = os.getenv("TWILIO_FROM_NUMBER", "")
TWILIO_TO_NUMBER   = os.getenv("TWILIO_TO_NUMBER", "")

# ==============================
#  LOAD DATA & TRAIN MODEL
# ==============================

print("Loading dataset from:", DATASET_PATH)
dataset = pd.read_csv(DATASET_PATH)

# Assumes last column is label
X = dataset.iloc[:, :-1].values
y = dataset.iloc[:, -1].values

sc = StandardScaler()
X_scaled = sc.fit_transform(X)

classifier = KNeighborsClassifier(n_neighbors=5, metric="minkowski", p=2)
classifier.fit(X_scaled, y)
print(f"✅ Model trained on {len(X)} samples")

# ==============================
#  INIT TWILIO & PYGAME
# ==============================

if TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN:
    try:
        twilio_client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
        print("✅ Twilio client initialized")
    except Exception as e:
        print("⚠️ Twilio init failed:", e)
        twilio_client = None
else:
    print("⚠️ Twilio credentials not set; Twilio disabled. Put real values into backend/.env and do not commit them.")
    twilio_client = None

pygame.mixer.init()
print("✅ Pygame mixer initialized")

# ==============================
#  HELPER FUNCTIONS
# ==============================

def send_emergency_alert(message_text="Emergency! Natasha needs immediate help. Please check on her now."):
    """Send SMS via Twilio when 'help' gesture is detected."""
    if twilio_client is None:
        print("⚠️ Twilio client not ready, cannot send SMS.")
        return

    try:
        msg = twilio_client.messages.create(
            body=message_text,
            from_=TWILIO_FROM_NUMBER,
            to=TWILIO_TO_NUMBER
        )
        print("📩 Emergency SMS sent. SID:", msg.sid)
    except Exception as e:
        print("❌ Error sending Twilio SMS:", e)


def speak_text(text, lang="en"):
    """Speak the given text using gTTS + pygame."""
    try:
        print("🔊 Speaking:", text)
        tts = gTTS(text, lang=lang)
        audio_file = io.BytesIO()
        tts.write_to_fp(audio_file)
        audio_file.seek(0)

        pygame.mixer.music.load(audio_file, "mp3")
        pygame.mixer.music.play()
        # Wait until audio finished
        while pygame.mixer.music.get_busy():
            pygame.time.Clock().tick(10)
    except Exception as e:
        print("⚠️ Error during TTS playback:", e)


def rule_based_label(thumb_raw, index_raw, middle_raw, ring_raw, pinky_raw, pitch_raw, roll_raw):
    """
    Very simple, rough rule-based layer to force different outputs
    for different gestures (for demo).
    All raw values are 0..255 after subtracting 256 on server side.
    """

    # 1) Fist closed strongly -> "help"
    if (thumb_raw > 170 and index_raw > 170 and
        middle_raw > 170 and ring_raw > 170 and
        pinky_raw > 170):
        return "help"

    # 2) Hand straight / open -> "hello"
    if (thumb_raw < 90 and index_raw < 90 and
        middle_raw < 90 and ring_raw < 90 and
        pinky_raw < 90):
        return "hello"

    # 3) Thumb bent, others mostly straight -> "yes"
    if thumb_raw > 150 and index_raw < 120 and middle_raw < 120 and ring_raw < 120:
        return "yes"

    # 4) Large roll (tilt sideways) -> "no"
    if abs(roll_raw) > 30:
        return "no"

    # 5) Otherwise fallback to model prediction later
    return None

# ==============================
#  FLASK APP
# ==============================

app = Flask(__name__)
CORS(app) # Enable CORS for all routes
api = Api(app)
latest_data = {}


class GestureCallback(Resource):
    def get(self, thumb, index, middle, ring, pinky, pitch, roll):
        """
        Called by ESP32:
        URL: /callback.gesture/<thumb>/<index>/<middle>/<ring>/<pinky>/<pitch>/<roll>
        Where each value = raw(0..255) + 256 on ESP32 side.
        """

        # -----------------------------------
        # 1) Convert incoming to raw (0..255 / approx)
        # -----------------------------------
        thumb_raw  = thumb  - 256
        index_raw  = index  - 256
        middle_raw = middle - 256
        ring_raw   = ring   - 256
        pinky_raw  = pinky  - 256
        pitch_raw  = pitch  - 256
        roll_raw   = roll   - 256

        print("\n=== Incoming gesture ===")
        print(f"thumb={thumb_raw}, index={index_raw}, middle={middle_raw}, "
              f"ring={ring_raw}, pinky={pinky_raw}, pitch={pitch_raw}, roll={roll_raw}")

        # -----------------------------------
        # 2) Build feature vector for model
        # -----------------------------------
        x_test = np.array([[thumb_raw, index_raw, middle_raw,
                            ring_raw, pinky_raw, pitch_raw, roll_raw]])
        x_scaled = sc.transform(x_test)

        # Model prediction (for reference)
        model_pred = classifier.predict(x_scaled)[0]
        print("🤖 KNN model prediction:", model_pred)

        # -----------------------------------
        # 3) Rule-based override
        # -----------------------------------
        rb_label = rule_based_label(
            thumb_raw, index_raw, middle_raw, ring_raw, pinky_raw,
            pitch_raw, roll_raw
        )

        if rb_label is not None:
            label = rb_label
            print("📐 Rule-based label used:", label)
        else:
            label = str(model_pred)
            print("📌 Falling back to model label:", label)

        # -----------------------------------
        # 4) Twilio for emergency
        # -----------------------------------
        if label.lower() == "help":
            print("🚨 HELP detected – sending SMS")
            send_emergency_alert()

        latest_data["gesture"] = label
        latest_data["thumb"] = thumb_raw
        latest_data["index"] = index_raw
        latest_data["middle"] = middle_raw
        latest_data["ring"] = ring_raw
        latest_data["pinky"] = pinky_raw
        latest_data["pitch"] = pitch_raw
        latest_data["roll"] = roll_raw
        latest_data["timestamp"] = int(time.time() * 1000)

        # -----------------------------------
        # 5) Speak the label
        # -----------------------------------
        speak_text(label, lang="en")

        # -----------------------------------
        # 6) Return JSON to ESP32
        # -----------------------------------
        result = {"class": label}
        print("➡️ Response JSON:", result)
        return result, 200


api.add_resource(
    GestureCallback,
    "/callback.gesture/<int:thumb>/<int:index>/<int:middle>/<int:ring>/<int:pinky>/<int:pitch>/<int:roll>"
)

@app.route("/api/latest")
def latest():
    return latest_data

if __name__ == "__main__":
    # Run Flask server
    app.run(host="0.0.0.0", port=5000, debug=True)
