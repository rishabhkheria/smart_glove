import { SENSOR_KEYS } from "../state/dashboardState";

function toTitleCase(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

const SENSOR_ICONS = {
  thumb:  "👍",
  index:  "☝️",
  middle: "🖕",
  ring:   "💍",
  pinky:  "🤙",
  pitch:  "↕️",
  roll:   "↔️",
};

const getFillWidth = (val) => {
  if (!val || isNaN(val)) return 0;
  const max = 4095;
  const percent = (Math.abs(val) / max) * 100;
  return Math.min(percent, 100);
};

function getRelativeTimeStatus(timestampMs) {
  if (!timestampMs || timestampMs === "--") {
    return { text: "No data", color: "var(--text-dim)" };
  }
  const diffSec = Math.floor((Date.now() - timestampMs) / 1000);
  if (diffSec <= 5)  return { text: "Live",  color: "var(--status-online)" };
  if (diffSec <= 15) return { text: `${Math.round(diffSec / 5) * 5}s ago`, color: "var(--status-unstable)" };
  if (diffSec <= 30) return { text: `${Math.round(diffSec / 10) * 10}s ago`, color: "#ff8c42" };
  const diffMin = Math.max(1, Math.floor(diffSec / 60));
  return { text: `${diffMin}m ago (Offline)`, color: "var(--status-offline)" };
}

function getLatencyStatus(latency) {
  if (latency === null || latency === undefined) return { label: "--", color: "var(--text-dim)" };
  if (latency < 100) return { label: `${latency} ms ·  fast`,  color: "var(--status-online)" };
  if (latency < 300) return { label: `${latency} ms ·  good`,  color: "var(--status-unstable)" };
  if (latency < 700) return { label: `${latency} ms ·  slow`,  color: "#ff8c42" };
  return                    { label: `${latency} ms ·  lag`,   color: "var(--status-offline)" };
}

function getSystemStatus(lastUpdated) {
  if (!lastUpdated || lastUpdated === "--") return "offline";
  const diffSec = Math.floor((Date.now() - lastUpdated) / 1000);
  if (diffSec <= 10) return "online";
  if (diffSec <= 30) return "unstable";
  return "offline";
}

const STATUS_LABELS = { online: "System Online", unstable: "Unstable", offline: "Offline" };

function DashboardPanel({ data, isOnline, lastUpdated, latency, error }) {
  const currentGesture = isOnline ? (data.gesture || "IDLE") : "OFFLINE";
  const { text: syncText, color: syncColor } = getRelativeTimeStatus(lastUpdated);
  const { label: latencyLabel, color: latencyColor } = getLatencyStatus(latency);

  let sysStatus = "offline";
  if (isOnline) sysStatus = getSystemStatus(lastUpdated);

  return (
    <div className="dashboardWrap">

      {/* ── Top status bar ── */}
      <div className="dashboardHeader">
        <div className="statusIndicator">
          <span className={`statusDot ${sysStatus}`} />
          <span style={{ color: sysStatus === "online" ? "var(--status-online)" : sysStatus === "unstable" ? "var(--status-unstable)" : "var(--status-offline)" }}>
            {STATUS_LABELS[sysStatus]}
          </span>
        </div>

        {/* Live latency chip */}
        {latency !== null && (
          <div className="statusIndicator" style={{ fontSize: '0.8rem' }}>
            <span style={{ color: 'var(--text-dim)' }}>Latency</span>
            <span style={{ color: latencyColor, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>
              {latencyLabel}
            </span>
          </div>
        )}
      </div>

      {/* ── Gesture hero card ── */}
      <div className="gestureCard">
        <div className="gestureLabel">Detected Gesture</div>
        <div
          className={`gestureValue ${isOnline && data.gesture ? "active" : ""}`}
          key={currentGesture}
        >
          {currentGesture}
        </div>

        {/* Last sync inline */}
        <div style={{ marginTop: '1.25rem', fontSize: '0.78rem', color: 'var(--text-dim)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          Last sync&nbsp;·&nbsp;
          <span style={{ color: syncColor, fontWeight: 700 }}>{syncText}</span>
        </div>
      </div>

      {/* ── Sensor grid ── */}
      <div className="sensorGrid">
        {SENSOR_KEYS.map((key) => {
          const val = isOnline ? data[key] ?? 0 : 0;
          const fill = getFillWidth(val);
          return (
            <article className="sensorCard" key={key}>
              <div className="sensorHeader">
                <span className="sensorIcon">{SENSOR_ICONS[key] || "⚡"}</span>
                <span>{toTitleCase(key)}</span>
              </div>
              <div className="sensorValue">
                {isOnline ? (data[key] ?? "--") : "--"}
              </div>
              <div className="sensorBarContainer">
                <div className="sensorBarFill" style={{ width: `${fill}%` }} />
              </div>
            </article>
          );
        })}
      </div>

      {/* ── Footer ── */}
      <div className="dashboardFooter">
        <span>Polling every 1s &nbsp;·&nbsp; KNN classifier</span>
        {error && <span style={{ color: "var(--status-offline)" }}>{error}</span>}
      </div>
    </div>
  );
}

export default DashboardPanel;
