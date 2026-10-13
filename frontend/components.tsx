/**
 * UI building blocks: chat messages, tool status, handoff card.
 */
import type { UIMessage } from "ai";
import type { Language } from "../src/shared/types";
import type { HandoffResult } from "./api";
import { TEXT, TOOL_LABELS } from "./i18n";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyPart = any;

type MessageViewProps = {
	message: UIMessage;
	language: Language;
};

function toolNameOf(part: AnyPart): string | null {
	if (part.type === "dynamic-tool") return part.toolName;
	if (typeof part.type === "string" && part.type.startsWith("tool-")) return part.type.slice(5);
	return null;
}

export function MessageView({ message, language }: MessageViewProps) {
	const t = TEXT[language];
	const isUser = message.role === "user";

	return (
		<article className={`message ${isUser ? "user" : "assistant"}`}>
			<h3 className="visually-hidden">{isUser ? t.you : t.assistant}</h3>
			{message.parts.map((part: AnyPart, i: number) => {
				if (part.type === "text") {
					return part.text.trim() ? (
						<p key={i} className="text">
							{part.text}
						</p>
					) : null;
				}
				const toolName = toolNameOf(part);
				if (!toolName) return null;
				return <ToolPart key={part.toolCallId ?? i} part={part} toolName={toolName} language={language} />;
			})}
		</article>
	);
}

function ToolPart(props: { part: AnyPart; toolName: string; language: Language }) {
	const { part, toolName, language } = props;
	const t = TEXT[language];

	// 👉 EXTEND HERE: render tool results as proper UI (e.g. a confirmation step before submitting,
	//    a success card with the reference number) instead of the raw JSON log below.

	// 1. Finished: show the result as a small expandable log
	if (part.state === "output-available") {
		const output = part.output ?? {};
		// Not produced by any tool yet – ready for when you add a human handoff.
		if (output.type === "handoff_result") return <HandoffCard result={output} language={language} />;
		return (
			<details className="tool-log">
				<summary>✓ {TOOL_LABELS[toolName]?.[language] ?? toolName}</summary>
				<pre>{JSON.stringify(output, null, 2)}</pre>
			</details>
		);
	}

	if (part.state === "output-error") return <p className="tool-status error">{t.error}</p>;

	// 2. Still running
	return <p className="tool-status">⏳ {TOOL_LABELS[toolName]?.[language] ?? t.toolWorking}</p>;
}

export function HandoffCard({ result, language }: { result: HandoffResult; language: Language }) {
	const t = TEXT[language];
	return (
		<div className="card handoff" role="status">
			<h4>☎ {t.handoffTitle}</h4>
			<p>{result.message}</p>
			<p>
				<strong>{result.phone}</strong> · {result.hours}
				<br />
				{result.office}
			</p>
			<p>
				{t.ticket}: <strong>{result.ticketId}</strong>
			</p>
		</div>
	);
}
