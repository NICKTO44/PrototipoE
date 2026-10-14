/**
 * Limitador de ventana deslizante en memoria.
 * Suficiente para la demo; en producción con varias instancias
 * serverless se reemplaza por un almacén compartido (Redis / Upstash).
 */
export function createRateLimiter({ limit, windowMs }: { limit: number; windowMs: number }) {
  const hits = new Map<string, number[]>();

  return function check(key: string, now = Date.now()): { ok: boolean; retryAfterSec: number } {
    const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
    if (recent.length >= limit) {
      hits.set(key, recent);
      const oldest = recent[0] ?? now;
      return { ok: false, retryAfterSec: Math.ceil((windowMs - (now - oldest)) / 1000) };
    }
    recent.push(now);
    hits.set(key, recent);
    // Limpieza oportunista para que el mapa no crezca sin control.
    if (hits.size > 5000) {
      for (const [k, v] of hits) if (v.every((t) => now - t >= windowMs)) hits.delete(k);
    }
    return { ok: true, retryAfterSec: 0 };
  };
}
