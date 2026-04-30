import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

// Cycling gesture demo for the visual card
const DEMO_GESTURES = ["HELLO", "HELP", "YES", "THANK YOU", "WATER", "IDLE"];
const DEMO_SENSORS = [
  { label: "Thumb",  value: 2841 },
  { label: "Index",  value: 1204 },
  { label: "Middle", value: 3392 },
  { label: "Pitch",  value: -14  },
  { label: "Roll",   value: 8    },
];

function HeroVisualCard() {
  const [gestureIdx, setGestureIdx] = useState(0);
  const [active, setActive] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive(false);
      setTimeout(() => {
        setGestureIdx((i) => (i + 1) % DEMO_GESTURES.length);
        setActive(true);
      }, 180);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="heroVisualCard">
      {/* Header */}
      <div className="heroCardHeader">
        <span className="heroCardDot" style={{ background: "#ff2d78" }} />
        <span className="heroCardDot" style={{ background: "#ffba08" }} />
        <span className="heroCardDot" style={{ background: "#00e87a" }} />
        <span className="heroCardTitle">Live Telemetry · Demo</span>
        <span className="heroCardBadge">
          <span className="heroPulseDot" />
          LIVE
        </span>
      </div>

      {/* Gesture Output */}
      <div className="heroCardGesture">
        <div className="heroCardGestureLabel">Detected Gesture</div>
        <div className={`heroCardGestureValue ${active ? "heroCardActive" : ""}`}>
          {DEMO_GESTURES[gestureIdx]}
        </div>
      </div>

      {/* Sensor mini bars */}
      <div className="heroCardSensors">
        {DEMO_SENSORS.map((s) => {
          const pct = Math.min((Math.abs(s.value) / 4095) * 100, 100);
          return (
            <div className="heroSensorRow" key={s.label}>
              <span className="heroSensorLabel">{s.label}</span>
              <div className="heroSensorBar">
                <div className="heroSensorFill" style={{ width: `${pct}%` }} />
              </div>
              <span className="heroSensorVal">{s.value}</span>
            </div>
          );
        })}
      </div>

      {/* Footer chips */}
      <div className="heroCardChips">
        <span className="heroChip">KNN · 5 sensors</span>
        <span className="heroChip">ESP32 · WiFi</span>
        <span className="heroChip">Flask API</span>
      </div>
    </div>
  );
}

function LandingPage() {
  useEffect(() => { document.title = "Smart Glove"; }, []);
  return (
    <section className="heroSection">
      {/* ── Left content ── */}
      <div className="heroLeft">
        <div className="heroBadge">
          <div className="pulseDot" />
          Assistive Wearable Technology
        </div>

        <h1 className="heroHeading">
          Smart Glove<br />
          for <span className="heroGradientWord">Gesture</span><br />
          to <span className="heroGradientWord2">Speech</span>
        </h1>

        <p className="pageSubtext">
          A wearable system that reads hand gestures in real-time via 5 flex sensors + IMU,
          classifies them using KNN, and instantly synthesizes speech — streamed live to a dashboard.
        </p>

        {/* Stats row */}
        <div className="heroStats">
          <div className="heroStat">
            <span className="heroStatNum">5</span>
            <span className="heroStatLabel">Flex Sensors</span>
          </div>
          <div className="heroStatDivider" />
          <div className="heroStat">
            <span className="heroStatNum">KNN</span>
            <span className="heroStatLabel">ML Classifier</span>
          </div>
          <div className="heroStatDivider" />
          <div className="heroStat">
            <span className="heroStatNum">&lt;1s</span>
            <span className="heroStatLabel">Response Time</span>
          </div>
        </div>

        <div className="heroCta">
          <Link to="/dashboard" className="btn btnPrimary">
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
            Open Live Dashboard
          </Link>
          <Link to="/project-info" className="btn btnSecondary">
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="12" x2="2" y2="12" />
              <polyline points="15 5 22 12 15 19" />
            </svg>
            View Architecture
          </Link>
        </div>
      </div>

      {/* ── Right visual ── */}
      <div className="heroRight">
        <HeroVisualCard />
      </div>
    </section>
  );
}

export default LandingPage;
