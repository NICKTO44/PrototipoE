import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import type { AgentModelOutput, ChatMessage } from "../../schema";
import { AgentUpstreamError, describeError, reasonFromStatus } from "../errors";
import { outputJsonSchema, parseModelOutput } from "../output";

const TOOL_NAME = "registrar_cotizacion";

let client: Anthropic | undefined;

/**
 * Claude con salida estructurada vía "tool use" forzado:
 * el modelo siempre responde llamando a la herramienta con el esquema del contrato.
 */
export async function callAnthropic(opts: {
  apiKey: string;
  model: string;
  system: string;
  turns: ChatMessage[];
  timeoutMs: number;
}): Promise<AgentModelOutput> {
  client ??= new Anthropic({ apiKey: opts.apiKey, maxRetries: 1 });
  try {
    const response = await client.messages.create(
      {
        model: opts.model,
        max_tokens: 1024,
        system: opts.system,
        messages: opts.turns.map((t) => ({ role: t.role, content: t.content })),
        tools: [
          {
            name: TOOL_NAME,
            description:
              "Registra la respuesta para el cliente y los datos de cotización extraídos en este turno.",
            input_schema: outputJsonSchema as Anthropic.Tool.InputSchema,
          },
        ],
        tool_choice: { type: "tool", name: TOOL_NAME },
      },
      { timeout: opts.timeoutMs },
    );
    const block = response.content.find((b) => b.type === "tool_use");
    if (!block || block.type !== "tool_use") {
      throw new AgentUpstreamError(
        "empty_output",
        `Sin tool_use (stop_reason: ${response.stop_reason})`,
      );
    }
    return parseModelOutput(block.input);
  } catch (error) {
    if (error instanceof AgentUpstreamError) throw error;
    if (error instanceof Anthropic.APIConnectionTimeoutError) {
      throw new AgentUpstreamError("timeout", describeError(error));
    }
    const status = error instanceof Anthropic.APIError ? error.status : undefined;
    throw new AgentUpstreamError(reasonFromStatus(status), describeError(error));
  }
}
