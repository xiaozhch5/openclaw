import { describe, expect, it } from "vitest";
import {
  applyMinimaxApiProviderConfig,
  applyMinimaxApiProviderConfigCn,
} from "./onboard-auth.config-minimax.js";
import { MINIMAX_CN_API_BASE_URL } from "./onboard-auth.models.js";

describe("applyMinimaxApiProviderConfig", () => {
  it("sets authHeader: true and api: anthropic-messages for minimax provider", () => {
    const result = applyMinimaxApiProviderConfig({});

    expect(result.models?.providers?.minimax).toMatchObject({
      api: "anthropic-messages",
      authHeader: true,
    });
  });

  it("preserves existing provider models when merging", () => {
    const existing = {
      models: {
        providers: {
          minimax: {
            baseUrl: "https://existing.example.com",
            api: "anthropic-messages" as const,
            authHeader: true,
            models: [
              {
                id: "MiniMax-M2.5",
                name: "MiniMax M2.5",
                contextWindow: 1000000,
                maxTokens: 8192,
                input: ["text"] as ["text"],
                cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
                reasoning: true,
              },
            ],
          },
        },
      },
    };

    const result = applyMinimaxApiProviderConfig(existing);

    const models = result.models?.providers?.minimax?.models ?? [];
    const ids = models.map((m) => m.id);
    expect(ids).toContain("MiniMax-M2.5");
    // should not duplicate existing model
    expect(ids.filter((id) => id === "MiniMax-M2.5")).toHaveLength(1);
  });
});

describe("applyMinimaxApiProviderConfigCn", () => {
  it("sets authHeader: true and api: anthropic-messages for minimax-cn provider", () => {
    const result = applyMinimaxApiProviderConfigCn({});

    expect(result.models?.providers?.["minimax-cn"]).toMatchObject({
      api: "anthropic-messages",
      authHeader: true,
    });
  });

  it("uses the China API base URL for minimax-cn provider", () => {
    const result = applyMinimaxApiProviderConfigCn({});

    expect(result.models?.providers?.["minimax-cn"]?.baseUrl).toBe(MINIMAX_CN_API_BASE_URL);
  });
});
