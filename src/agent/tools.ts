/**
 * The tools the AI assistant can use. Each tool calls the mock government backend.
 *
 * Shared by the live chat agent and the evaluation endpoint (/api/evals/chat), so tests
 * exercise exactly the same logic.
 *
 * The template ships with ONE example tool. Deciding which tools the assistant needs, how they
 * are described and how they chain together is part of the challenge.
 *
 * Rule worth copying: `citizenId` comes from the session (the simulated ID Austria login),
 * NEVER from the model's input. Otherwise a prompt like "show me Josef's data" could make the
 * AI read another citizen's profile.
 *
 * 👉 EXTEND HERE: the backend (src/gov/service.ts) already implements:
 *   findServices(query, lang)                         keyword search over the services
 *   getServiceInfo(serviceId, lang)                   facts, sources, form fields
 *   checkEligibility(env, citizenId, serviceId)       eligibility + missing documents
 *   startApplication(env, citizenId, serviceId, data, lang)   draft, pre-filled from the profile
 *   updateApplication(env, applicationId, data, lang)          returns remaining missing fields
 *   submitApplication(env, applicationId, lang)       validates server-side, returns a reference number
 *   getAppointmentSlots(env, serviceId)               free slots (passport)
 *   bookAppointment(env, citizenId, slotId, lang)
 *   createHandoff(env, {citizenId, sessionId, reason, summary}, lang)   ticket for a human case worker
 *
 * Things to think about: confirmation before anything is submitted or booked (hint: the AI SDK's
 * `needsApproval`), what the citizen hears when the backend fails (try MOCK_FAILURE_RATE), and
 * adding write tools to EVAL_STUBBED_TOOLS below.
 */
import { tool, type ToolSet } from "ai";
import { z } from "zod";
import type { AssistantSettings } from "../shared/types";
import * as gov from "../gov/service";

export type ToolContext = {
	env: Env;
	settings: AssistantSettings;
	sessionId: string;
	/** "eval" replaces the tools in EVAL_STUBBED_TOOLS with stubs that never execute. */
	mode: "chat" | "eval";
};

/**
 * Tools that change something (submit, book, …). In eval mode they are replaced by stubs, so
 * `pnpm evals` can see that the model TRIED to call them, but nothing is ever submitted.
 * 👉 Add the names of your write tools here.
 */
export const EVAL_STUBBED_TOOLS = ["submit_application", "book_appointment"];

export function buildTools(ctx: ToolContext): ToolSet {
	const { env, settings } = ctx;
	const citizenId = settings.personaId; // from the session – never from the model

	const tools: ToolSet = {
		get_my_profile: tool({
			description:
				"Get the logged-in citizen's profile: name, addresses, documents (with expiry status), household, residence status. Use it instead of asking for data you already have.",
			inputSchema: z.object({}),
			execute: async () => gov.getCitizenProfile(env, citizenId),
		}),

		// 👉 EXTEND HERE: add your tools.
	};

	if (ctx.mode === "eval") {
		for (const name of EVAL_STUBBED_TOOLS) {
			const original = tools[name];
			if (!original) continue;
			tools[name] = tool({
				description: original.description,
				inputSchema: original.inputSchema,
				execute: async () => ({ status: "not_executed", note: "Eval mode: nothing was submitted or booked." }),
			});
		}
	}
	return tools;
}
