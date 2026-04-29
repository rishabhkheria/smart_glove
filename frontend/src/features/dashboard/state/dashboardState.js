export const SENSOR_KEYS = [
  "thumb",
  "index",
  "middle",
  "ring",
  "pinky",
  "pitch",
  "roll",
];

export const initialDashboardState = {
  data: {},
  isOnline: false,
  lastUpdated: "--",
  error: null,
};

export function hasPayload(payload) {
  return Boolean(payload) && Object.keys(payload).length > 0;
}

export function createOnlineState(payload) {
  return {
    data: payload,
    isOnline: true,
    lastUpdated: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
    error: null,
  };
}

export function createOfflineState(lastKnownData = {}) {
  return {
    data: lastKnownData,
    isOnline: false,
    lastUpdated: "--",
    error: null,
  };
}
