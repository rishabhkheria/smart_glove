import { useEffect } from "react";
import DashboardPanel from "../components/DashboardPanel";
import VoiceControlPanel from "../components/VoiceControlPanel";
import useDashboardData from "../hooks/useDashboardData";

function DashboardPage() {
  useEffect(() => { document.title = "Smart Glove | Dashboard"; }, []);
  const { data, isOnline, lastUpdated, latency, error } = useDashboardData(1000);

  const currentGesture = isOnline ? data.gesture : null;

  return (
    <section>
      <div style={{ marginBottom: '2rem' }}>
        <h1>Telemetry Dashboard</h1>
        <p className="pageSubtext">
          Real-time values from flex sensors and MPU motion streams, interpreted instantly.
        </p>
      </div>

      <VoiceControlPanel currentGesture={currentGesture} />

      <DashboardPanel
        data={data}
        isOnline={isOnline}
        lastUpdated={lastUpdated}
        latency={latency}
        error={error}
      />
    </section>
  );
}

export default DashboardPage;
