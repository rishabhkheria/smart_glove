import { SENSOR_KEYS } from "../state/dashboardState";

function toTitleCase(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

// Simple icons for sensors
const SENSOR_ICONS = {
  thumb: "👍",
  index: "☝️",
  middle: "🖕",
  ring: "💍",
  pinky: "🤙",
  pitch: "↕️",
  roll: "↔️"
};

// Map values to 0-100% for the progress bars (assuming analog values around 0-4095 or similar, adapt max as needed)
// If values are e.g. 0-1023:
const getFillWidth = (val) => {
  if (!val || isNaN(val)) return 0;
  // Fallback map logic - just keeping it visual
  const max = 4095; 
  let percent = (Math.abs(val) / max) * 100;
  if (percent > 100) percent = 100;
  return percent;
};

function getRelativeTimeStatus(timestampMs) {
  if (!timestampMs || timestampMs === "--") {
    return { text: "⚪ No data", color: "var(--text-muted)" };
  }

  const diffSec = Math.floor((Date.now() - timestampMs) / 1000);

  if (diffSec <= 5) {
    return { text: "🟢 Live now", color: "var(--status-online)" };
  }

  if (diffSec <= 15) {
    // Round to nearest 5 (e.g. 10 sec ago, 15 sec ago)
    const rounded = Math.round(diffSec / 5) * 5; 
    return { text: `🟡 (${rounded} sec ago)`, color: "#ffeb3b" };
  }

  if (diffSec <= 30) {
    // Round to nearest 10 (e.g. 20 sec ago, 30 sec ago)
    const rounded = Math.round(diffSec / 10) * 10;
    return { text: `🟠 (${rounded} sec ago)`, color: "#ff9800" };
  }

  // Above 30s is considered offline for a 1-3s polling system
  const diffMin = Math.max(1, Math.floor(diffSec / 60));
  return { text: `🔴 Offline (${diffMin} min ago)`, color: "var(--status-offline)" };
}

function getLatencyStatus(latency) {
  if (latency === null || latency === undefined) return { color: "var(--text-muted)" };
  if (latency < 100) return { color: "var(--status-online)" }; // Excellent
  if (latency < 300) return { color: "#ffeb3b" }; // Good
  if (latency < 700) return { color: "#ff9800" }; // Okay
  return { color: "var(--status-offline)" }; // Lag
}

function getSystemStatus(lastUpdated) {
  if (!lastUpdated || lastUpdated === "--") return "offline";
  const diffSec = Math.floor((Date.now() - lastUpdated) / 1000);
  if (diffSec <= 10) return "online";
  if (diffSec <= 30) return "unstable";
  return "offline";
}

function DashboardPanel({ data, isOnline, lastUpdated, latency, error }) {
  const currentGesture = isOnline ? (data.gesture || "IDLE") : "OFFLINE";
  const { text: syncText, color: syncColor } = getRelativeTimeStatus(lastUpdated);
  const { color: latencyColor } = getLatencyStatus(latency);
  
  let sysStatus = "offline";
  let sysText = "System Offline";
  
  if (isOnline) {
    sysStatus = getSystemStatus(lastUpdated);
    if (sysStatus === "online") sysText = "System Online";
    else if (sysStatus === "unstable") sysText = "System Unstable";
  }
  
  return (
    <div className="dashboardWrap">
      <div className="dashboardHeader">
        <div className="statusIndicator">
          <span className={`statusDot ${sysStatus}`} />
          <span>{sysText}</span>
        </div>
      </div>

      <div className="gestureCard">
        <div className="gestureLabel">Detected Gesture</div>
        <div className={`gestureValue ${isOnline && data.gesture ? 'active' : ''}`} key={currentGesture}>
          {currentGesture}
        </div>
      </div>

      <div className="sensorGrid">
        {SENSOR_KEYS.map((key) => {
          const val = isOnline ? data[key] ?? 0 : 0;
          return (
            <article className="sensorCard" key={key}>
              <div className="sensorHeader">
                <span className="sensorIcon">{SENSOR_ICONS[key] || "⚡"}</span>
                <span>{toTitleCase(key)}</span>
              </div>
              <div className="sensorValue">
                {isOnline ? data[key] ?? "--" : "--"}
              </div>
              <div className="sensorBarContainer">
                <div 
                  className="sensorBarFill" 
                  style={{ width: `${getFillWidth(val)}%` }}
                ></div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="dashboardFooter" style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
          <span>
            Last Sync: <strong style={{ color: syncColor, marginLeft: '0.25rem' }}>{syncText}</strong>
          </span>
          {latency !== null && (
            <span>
              API Latency: <strong style={{ color: latencyColor, marginLeft: '0.25rem' }}>{latency} ms</strong>
            </span>
          )}
        </div>
        {error && <span style={{ color: '#ff3d00' }}>{error}</span>}
      </div>
    </div>
  );
}

export default DashboardPanel;
