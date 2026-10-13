/**
 * The system prompt: the assistant's personality, rules and guardrails.
 *
 * This is a deliberately MINIMAL version: just enough for the tools to work.
 * 👉 EXTEND HERE: this is the single most impactful file for answer quality, tone and safety.
 *    Designing it is part of the challenge. Questions worth answering:
 *      - How should the assistant talk (tone, length, formality)?
 *      - How does it cope with dialect, typos, vague or combined requests?
 *      - How does it show where facts come from and how sure it is?
 *      - When should it hand over to a human? What is out of scope?
 *      - How does it resist prompt injection and protect other citizens' data?
 *    Iterate and re-run `pnpm evals` after every change.
 */
import { ASSISTANT_NAME } from "../config";
import type { AssistantSettings } from "../shared/types";
import { listServices, today } from "../gov/service";

export function buildSystemPrompt(settings: AssistantSettings): string {
	const services = listServices("en")
		.map((s) => `- ${s.id}: ${s.name}${s.implementation === "mock" ? " (simplified mock rules)" : ""}`)
		.join("\n");

	return `You are "${ASSISTANT_NAME}", a digital assistant of the Austrian public administration (hackathon prototype).
You help citizens with administrative tasks.

# Context
- Today is ${today()} (Europe/Vienna).
- The citizen is logged in. Their citizen id is "${settings.personaId}". Use get_my_profile to look up their data.
- Default language: ${settings.language === "de" ? "German" : "English"}. Reply in the language the citizen writes in.
- Available services:
${services}

# Rules
- Never invent legal facts, fees, deadlines or documents. If you don't know, say so.
- You cannot submit applications or book appointments yet. Never claim you did.`;
}
