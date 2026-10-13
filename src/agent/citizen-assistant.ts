/**
 * The chat agent. One instance (a Durable Object with its own SQLite) per browser session:
 * it stores the conversation and the session settings, and streams answers to the browser.
 *
 * Docs: https://developers.cloudflare.com/agents/examples/chat-agent/
 */
import { AIChatAgent } from "@cloudflare/ai-chat";
import { convertToModelMessages, pruneMessages, stepCountIs, streamText } from "ai";
import { getModel, MAX_STEPS } from "../config";
import { DEFAULT_SETTINGS, type AssistantSettings } from "../shared/types";
import { PERSONAS } from "../gov/data/personas";
import { buildSystemPrompt } from "./system-prompt";
import { buildTools } from "./tools";

export class CitizenAssistant extends AIChatAgent<Env, AssistantSettings> {
	// Settings synced with the frontend (persona, language).
	initialState: AssistantSettings = DEFAULT_SETTINGS;

	// Reject invalid settings sent by a client.
	validateStateChange(next: AssistantSettings) {
		if (!PERSONAS.some((p) => p.id === next.personaId)) throw new Error(`Unknown persona ${next.personaId}`);
		if (next.language !== "de" && next.language !== "en") throw new Error("language must be de or en");
	}

	async onChatMessage() {
		const settings = { ...DEFAULT_SETTINGS, ...this.state };

		const result = streamText({
			// Metadata shows up in AI Gateway logs – filter by session or persona when debugging.
			model: getModel(this.env, { app: "gov-assistant", session: this.name, persona: settings.personaId }),
			system: buildSystemPrompt(settings),
			messages: pruneMessages({
				messages: await convertToModelMessages(this.messages),
				toolCalls: "before-last-2-messages",
			}),
			tools: buildTools({ env: this.env, settings, sessionId: this.name, mode: "chat" }),
			stopWhen: stepCountIs(MAX_STEPS),
			onError: ({ error }) => console.error("[agent error]", error),
		});

		return result.toUIMessageStreamResponse();
	}
}
