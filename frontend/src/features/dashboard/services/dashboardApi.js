import axios from "axios";

const dashboardClient = axios.create({
  baseURL: "https://smart-glove-backend.onrender.com/",
  timeout: 4000,
});

export async function fetchLatestDashboardData() {
  const start = Date.now();
  const response = await dashboardClient.get("api/latest");
  const end = Date.now();
  return {
    payload: response.data ?? {},
    latency: end - start
  };
}
