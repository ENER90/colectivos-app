import { describe, it, expect } from "vitest";
import { ROUTE_STOPS, ROUTE_CENTER, ROUTE_BOUNDS } from "../config/route.config";

describe("route config (Colectivo 501)", () => {
  it("starts and ends at terminal stops", () => {
    expect(ROUTE_STOPS.length).toBeGreaterThan(2);
    expect(ROUTE_STOPS[0].type).toBe("terminal");
    expect(ROUTE_STOPS[ROUTE_STOPS.length - 1].type).toBe("terminal");
  });

  it("has unique stop names and coordinates within Santiago", () => {
    const names = ROUTE_STOPS.map((s) => s.name);
    expect(new Set(names).size).toBe(names.length);
    for (const { coordinates: [lat, lng] } of ROUTE_STOPS) {
      expect(lat).toBeGreaterThan(-34);
      expect(lat).toBeLessThan(-33);
      expect(lng).toBeGreaterThan(-71);
      expect(lng).toBeLessThan(-70.4);
    }
  });

  it("center lies within bounds", () => {
    const [[a, b], [c, d]] = ROUTE_BOUNDS;
    const [lat, lng] = ROUTE_CENTER;
    expect(lat).toBeGreaterThanOrEqual(Math.min(a, c));
    expect(lat).toBeLessThanOrEqual(Math.max(a, c));
    expect(lng).toBeGreaterThanOrEqual(Math.min(b, d));
    expect(lng).toBeLessThanOrEqual(Math.max(b, d));
  });
});
