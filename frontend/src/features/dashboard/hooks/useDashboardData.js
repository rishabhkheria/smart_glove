import { useCallback, useEffect, useState } from "react";
import { fetchLatestDashboardData } from "../services/dashboardApi";
import {
  createOfflineState,
  createOnlineState,
  hasPayload,
  initialDashboardState,
} from "../state/dashboardState";

export default function useDashboardData(intervalMs = 1000) {
  const [state, setState] = useState(initialDashboardState);

  const refresh = useCallback(async () => {
    try {
      const payload = await fetchLatestDashboardData();
      if (hasPayload(payload)) {
        setState(createOnlineState(payload));
      } else {
        setState((prev) => createOfflineState(prev.data));
      }
    } catch (error) {
      setState((prev) => ({
        ...createOfflineState(prev.data),
        error: error.message || "Unable to fetch glove data",
      }));
    }
  }, []);

  useEffect(() => {
    refresh();
    const timer = setInterval(refresh, intervalMs);
    return () => clearInterval(timer);
  }, [intervalMs, refresh]);

  return {
    ...state,
    refresh,
  };
}
