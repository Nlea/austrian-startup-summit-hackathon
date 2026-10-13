/**
 * All UI texts in German and English.
 * 👉 EXTEND HERE: add more languages (e.g. Turkish, BCS, Arabic, Ukrainian) – remember `dir="rtl"` for Arabic.
 */
import type { Language } from "../src/shared/types";

export const TEXT = {
	de: {
		title: "Digital-Assistent 2030",
		subtitle: "Ihr Behördenweg – einfach erledigt. (Hackathon-Prototyp, alle Daten sind erfunden)",
		skip: "Zum Chat springen",
		loginLabel: "Angemeldet als (simulierte ID Austria)",
		language: "Sprache",
		textSize: "Schriftgröße",
		newChat: "Neues Gespräch",
		placeholder: "Schreiben Sie Ihr Anliegen … z. B. „Ich bin umgezogen“",
		send: "Senden",
		you: "Sie",
		assistant: "Assistent",
		thinking: "Der Assistent arbeitet …",
		examplesTitle: "Beispiele",
		examples: ["Ich bin nach Wien umgezogen. Was muss ich tun?", "Mein Reisepass ist abgelaufen.", "Wir haben ein Baby bekommen – welche Unterstützung gibt es?"],
		handoffTitle: "Ein Mensch hilft Ihnen weiter",
		ticket: "Fallnummer",
		toolWorking: "Wird abgefragt …",
		error: "Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.",
		mockNotice: "Prototyp mit Testdaten. Keine echten Anträge.",
		// 90s decoration (purely visual)
		menu: ["Datei", "Bearbeiten", "Ansicht", "Hilfe"],
		marquee: "+++ Willkommen im Digitalen Amt +++ Jetzt NEU: Behördenwege per Mausklick! +++ Diese Seite ist im Aufbau +++",
		statusReady: "Fertig",
		statusBusy: "Verbindung wird hergestellt …",
		bestViewed: "Optimiert für Netscape Navigator 3.0 bei 800×600 Bildpunkten",
		visitors: "Besucher:",
	},
	en: {
		title: "Digital Assistant 2030",
		subtitle: "Your government errands – done simply. (Hackathon prototype, all data is fictional)",
		skip: "Skip to chat",
		loginLabel: "Logged in as (simulated ID Austria)",
		language: "Language",
		textSize: "Text size",
		newChat: "New conversation",
		placeholder: "Describe what you need … e.g. “I just moved”",
		send: "Send",
		you: "You",
		assistant: "Assistant",
		thinking: "The assistant is working …",
		examplesTitle: "Examples",
		examples: ["I moved within Vienna. What do I need to do?", "My passport expired.", "We just had a baby – what support is there?"],
		handoffTitle: "A person will help you",
		ticket: "Case number",
		toolWorking: "Checking …",
		error: "Something went wrong. Please try again.",
		mockNotice: "Prototype with test data. No real applications.",
		// 90s decoration (purely visual)
		menu: ["File", "Edit", "View", "Help"],
		marquee: "+++ Welcome to the Digital Office +++ NEW: government errands with one mouse click! +++ This page is under construction +++",
		statusReady: "Done",
		statusBusy: "Connecting …",
		bestViewed: "Best viewed with Netscape Navigator 3.0 at 800×600",
		visitors: "Visitors:",
	},
} satisfies Record<Language, Record<string, string | string[]>>;

export type UIText = (typeof TEXT)["de"];

/** Friendly labels for tool calls shown while the assistant works. */
export const TOOL_LABELS: Record<string, Record<Language, string>> = {
	get_my_profile: { de: "Ihre Daten abrufen", en: "Loading your data" },
};
