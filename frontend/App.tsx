/**
 * The citizen-facing app. Deliberately plain – the UX is yours to design (35% of the jury score!).
 *
 * 👉 EXTEND HERE – ideas:
 *   - Voice input/output (Web Speech API, or Workers AI speech-to-text / text-to-speech models)
 *   - A guided step-by-step view next to the chat (progress: understand → check → fill → confirm)
 *   - Render answers as Markdown (e.g. react-markdown)
 *   - Proactive hints ("Your passport expires in 2 months")
 *   - A confirmation step before anything is submitted or booked
 *   - A way to reach a human (backend: POST /api/gov/handoffs, see api.handoff and HandoffCard)
 */
import { useAgentChat } from "@cloudflare/ai-chat/react";
import { useAgent } from "agents/react";
import { useEffect, useRef, useState } from "react";
import { DEFAULT_SETTINGS, type AssistantSettings, type Language } from "../src/shared/types";
import { api, type Persona } from "./api";
import { MessageView } from "./components";
import { TEXT } from "./i18n";

function getSessionId(reset = false): string {
	let id = localStorage.getItem("sessionId");
	if (!id || reset) {
		id = crypto.randomUUID();
		localStorage.setItem("sessionId", id);
	}
	return id;
}

export function App() {
	const [sessionId, setSessionId] = useState(() => getSessionId());
	const [settings, setSettings] = useState<AssistantSettings>(DEFAULT_SETTINGS);
	const [personas, setPersonas] = useState<Persona[]>([]);
	const [fontScale, setFontScale] = useState(1);
	const t = TEXT[settings.language];

	// One agent instance per session. State (persona, language) syncs both ways.
	const agent = useAgent<AssistantSettings>({
		agent: "CitizenAssistant",
		name: sessionId,
		onStateUpdate: (state) => setSettings({ ...DEFAULT_SETTINGS, ...state }),
	});

	const { messages, sendMessage, clearHistory, status } = useAgentChat({ agent });
	const busy = status === "submitted" || status === "streaming";

	useEffect(() => {
		api.personas().then(setPersonas).catch(console.error);
	}, []);

	// Accessibility: keep <html lang> and font size in sync with the settings.
	useEffect(() => {
		document.documentElement.lang = settings.language;
		document.documentElement.style.fontSize = `${fontScale * 100}%`;
		document.title = t.title;
	}, [settings.language, fontScale, t.title]);

	function updateSettings(patch: Partial<AssistantSettings>) {
		const next = { ...settings, ...patch };
		setSettings(next);
		agent.setState(next);
	}

	function newConversation() {
		clearHistory();
		setSessionId(getSessionId(true));
	}

	return (
		<>
			<a className="skip-link" href="#chat-input">
				{t.skip}
			</a>

			{/* 90s theme: the whole app is one "Windows 95" program window. Decoration is aria-hidden. */}
			<div className="window">
				<div className="title-bar" aria-hidden="true">
					<span>🏛 {t.title}.exe</span>
					<span className="title-bar-buttons">
						<span>_</span>
						<span>□</span>
						<span>×</span>
					</span>
				</div>
				<div className="menu-bar" aria-hidden="true">
					{t.menu.map((item) => (
						<span key={item}>{item}</span>
					))}
				</div>

				<header className="header">
					<div>
						<h1>{t.title}</h1>
						<p className="subtitle">{t.subtitle}</p>
					</div>

					<div className="controls" role="group" aria-label="Settings">
						<label>
							{t.loginLabel}
							<select value={settings.personaId} onChange={(e) => updateSettings({ personaId: e.target.value })}>
								{personas.map((p) => (
									<option key={p.id} value={p.id}>
										{p.name} – {p.scenarioHint}
									</option>
								))}
							</select>
						</label>

						<fieldset className="segmented">
							<legend>{t.language}</legend>
							{(["de", "en"] as Language[]).map((lang) => (
								<button key={lang} type="button" aria-pressed={settings.language === lang} onClick={() => updateSettings({ language: lang })}>
									{lang === "de" ? "Deutsch" : "English"}
								</button>
							))}
						</fieldset>

						<fieldset className="segmented">
							<legend>{t.textSize}</legend>
							{[1, 1.25, 1.5].map((scale) => (
								<button key={scale} type="button" aria-pressed={fontScale === scale} onClick={() => setFontScale(scale)} aria-label={`${t.textSize} ${scale * 100}%`}>
									<span style={{ fontSize: `${scale}em` }}>A</span>
								</button>
							))}
						</fieldset>

						<button type="button" onClick={newConversation}>
							{t.newChat}
						</button>
					</div>
				</header>

				<div className="marquee" aria-hidden="true">
					<span>{t.marquee}</span>
				</div>

				<main className="main">
					<p className="notice">{t.mockNotice}</p>

					{/* aria-live announces new messages to screen reader users */}
					<section className="messages" aria-live="polite" aria-busy={busy} aria-label="Chat">
						{messages.length === 0 && (
							<div className="examples">
								<h2>{t.examplesTitle}</h2>
								{t.examples.map((ex) => (
									<button key={ex} type="button" onClick={() => sendMessage({ text: ex })}>
										{ex}
									</button>
								))}
							</div>
						)}

						{messages.map((message) => (
							<MessageView
								key={message.id}
								message={message}
								language={settings.language}
							/>
						))}

						{busy && <p className="status">{t.thinking}</p>}
					</section>

					<ChatInput disabled={busy} placeholder={t.placeholder} sendLabel={t.send} onSend={(text) => sendMessage({ text })} />
				</main>

				<div className="status-bar" aria-hidden="true">
					<span>{busy ? t.statusBusy : t.statusReady}</span>
					<span>{messages.length} 💬</span>
				</div>
			</div>

			<footer className="footer" aria-hidden="true">
				<hr />
				<p>🚧 {t.bestViewed} 🚧</p>
				<p>
					{t.visitors} <span className="counter">{String(1337 + messages.length).padStart(6, "0")}</span>
				</p>
			</footer>

		</>
	);
}

function ChatInput(props: { disabled: boolean; placeholder: string; sendLabel: string; onSend: (text: string) => void }) {
	const [text, setText] = useState("");
	const inputRef = useRef<HTMLTextAreaElement>(null);

	function submit() {
		const value = text.trim();
		if (!value || props.disabled) return;
		props.onSend(value);
		setText("");
		inputRef.current?.focus();
	}

	return (
		<form
			className="chat-input"
			onSubmit={(e) => {
				e.preventDefault();
				submit();
			}}
		>
			<label htmlFor="chat-input" className="visually-hidden">
				{props.placeholder}
			</label>
			<textarea
				id="chat-input"
				ref={inputRef}
				rows={2}
				value={text}
				placeholder={props.placeholder}
				onChange={(e) => setText(e.target.value)}
				onKeyDown={(e) => {
					// Enter sends, Shift+Enter adds a new line
					if (e.key === "Enter" && !e.shiftKey) {
						e.preventDefault();
						submit();
					}
				}}
			/>
			<button type="submit" disabled={props.disabled || !text.trim()}>
				{props.sendLabel}
			</button>
		</form>
	);
}
