import { SENSOR_KEYS } from "../state/dashboardState";

function toTitleCase(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function DashboardPanel({ data, isOnline, lastUpdated, error }) {
  return (
    <section className="dashboardWrap">
      <div className="dashboardHeader">
        <div className="connectionState">
          <span className={`dot ${isOnline ? "dotOnline" : "dotOffline"}`} />
          <strong>{isOnline ? "Connected" : "Offline"}</strong>
        </div>

        <button type="button" className="liveBadge">
          LIVE
        </button>
      </div>

      <h2 className="gestureHeading">
        Gesture: {isOnline ? data.gesture || "Unknown" : "Waiting for Smart Glove..."}
      </h2>

      <div className="sensorCards">
        {SENSOR_KEYS.map((key) => (
          <article className="sensorCard" key={key}>
            <span>{toTitleCase(key)}</span>
            <strong>{isOnline ? data[key] ?? "--" : "--"}</strong>
          </article>
        ))}
      </div>

      <div className="dashboardMeta">
        <span>Last Updated: {lastUpdated}</span>
        {error ? <span className="errorText">{error}</span> : null}
      </div>
    </section>
  );
}

export default DashboardPanel;
