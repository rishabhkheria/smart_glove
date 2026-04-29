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

function DashboardPanel({ data, isOnline, lastUpdated, error }) {
  const currentGesture = isOnline ? (data.gesture || "IDLE") : "OFFLINE";
  
  return (
    <div className="dashboardWrap">
      <div className="dashboardHeader">
        <div className="statusIndicator">
          <span className={`statusDot ${isOnline ? "online" : "offline"}`} />
          <span>{isOnline ? "System Online" : "System Offline"}</span>
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

      <div className="dashboardFooter">
        <span>Last Sync: {lastUpdated}</span>
        {error && <span style={{ color: '#ff3d00' }}>{error}</span>}
      </div>
    </div>
  );
}

export default DashboardPanel;
