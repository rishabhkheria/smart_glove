import DashboardPanel from "../components/DashboardPanel";
import useDashboardData from "../hooks/useDashboardData";

function DashboardPage() {
  const { data, isOnline, lastUpdated, error } = useDashboardData(1000);

  return (
    <section className="dashboardPage">
      <h1>Live Glove Output Dashboard</h1>
      <p className="pageSubtext">
        Realtime values from thumb, finger flex sensors, and MPU motion streams.
      </p>

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
