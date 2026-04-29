import axios from "axios";

const dashboardClient = axios.create({
  baseURL: "/",
  timeout: 4000,
});

export async function fetchLatestDashboardData() {
  const response = await dashboardClient.get("api/latest");
  return response.data ?? {};
}
