import { describe, expect, it } from "vitest";
import { createRateLimiter } from "./rate-limit";

describe("rate limiter", () => {
  it("bloquea al superar el límite y libera al pasar la ventana", () => {
    const check = createRateLimiter({ limit: 2, windowMs: 1000 });
    expect(check("ip", 0).ok).toBe(true);
    expect(check("ip", 10).ok).toBe(true);
    const blocked = check("ip", 20);
    expect(blocked.ok).toBe(false);
    expect(blocked.retryAfterSec).toBeGreaterThan(0);
    expect(check("ip", 1500).ok).toBe(true);
  });
});
