import type { ChatMessage } from "./schema";

/**
 * Adapta el historial del chat al formato que exigen los modelos:
 * debe empezar con un mensaje del usuario y alternar turnos.
 * El widget muestra saludos y preguntas del asistente seguidos, así que se
 * descartan los mensajes del asistente iniciales y se unen los consecutivos.
 */
export function toModelTurns(messages: ChatMessage[]): ChatMessage[] {
  const firstUser = messages.findIndex((m) => m.role === "user");
  if (firstUser === -1) return [];
  const turns: ChatMessage[] = [];
  for (const m of messages.slice(firstUser)) {
    const last = turns.at(-1);
    if (last && last.role === m.role) last.content = `${last.content}\n${m.content}`;
    else turns.push({ role: m.role, content: m.content });
  }
  return turns;
}
