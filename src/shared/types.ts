/**
 * Types shared between the Worker (server) and the React frontend.
 * Keep this file free of runtime dependencies so both sides can import it.
 */

export type Language = "de" | "en";

/** Settings the frontend syncs to the chat agent (via Agent state). */
export type AssistantSettings = {
	/** Which synthetic citizen is "logged in" (simulated ID Austria login). */
	personaId: string;
	/** Default reply language. The agent still answers in the language the citizen writes in. */
	language: Language;
};

export const DEFAULT_SETTINGS: AssistantSettings = {
	personaId: "lena-huber",
	language: "de",
};
