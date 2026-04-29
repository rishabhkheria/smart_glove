import DashboardPanel from "../components/DashboardPanel";
import useDashboardData from "../hooks/useDashboardData";

function DashboardPage() {
  const { data, isOnline, lastUpdated, error } = useDashboardData(1000);

  return (
    <section>
      <div style={{ marginBottom: '2rem' }}>
        <h1>Telemetry Dashboard</h1>
        <p className="pageSubtext">
          Real-time values from flex sensors and MPU motion streams, interpreted instantly.
        </p>
      </div>

      <DashboardPanel
        data={data}
        isOnline={isOnline}
        lastUpdated={lastUpdated}
        error={error}
      />
    </section>
  );
}

export default DashboardPage;
