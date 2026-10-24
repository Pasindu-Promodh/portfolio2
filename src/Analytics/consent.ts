import { readStorage, writeStorage } from "./storage";

const OPT_OUT_KEY = "analytics_opt_out";
const NOTICE_SEEN_KEY = "analytics_notice_seen";

export const GA_MEASUREMENT_ID = "G-QF1L8QFVR2";

const isLocalhost = ["localhost", "127.0.0.1", "::1"].includes(
  location.hostname
);

export function isOptedOut() {
  return readStorage(OPT_OUT_KEY) === "1";
}

// Only production builds served from a real host are tracked, so the dev
// server (including from a phone on the LAN) never writes visitor data.
export function isTrackingEnabled() {
  return import.meta.env.PROD && !isLocalhost && !isOptedOut();
}

export function hasSeenNotice() {
  return readStorage(NOTICE_SEEN_KEY) === "1";
}

export function acknowledgeNotice(optOut: boolean) {
  writeStorage(NOTICE_SEEN_KEY, "1");
  if (optOut) {
    writeStorage(OPT_OUT_KEY, "1");
    (window as unknown as Record<string, unknown>)[
      `ga-disable-${GA_MEASUREMENT_ID}`
    ] = true;
  }
}
