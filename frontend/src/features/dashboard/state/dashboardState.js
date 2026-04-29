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
  latency: null,
  error: null,
};

export function hasPayload(payload) {
  return Boolean(payload) && Object.keys(payload).length > 0;
}

export function createOnlineState(payload, latency) {
  return {
    data: payload,
    isOnline: true,
    lastUpdated: payload.timestamp || Date.now(),
    latency,
    error: null,
  };
}

export function createOfflineState(lastKnownData = {}) {
  return {
    data: lastKnownData,
    isOnline: false,
    lastUpdated: lastKnownData.timestamp || null,
    latency: null,
    error: null,
  };
}
