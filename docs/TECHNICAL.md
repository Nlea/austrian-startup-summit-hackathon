# Technical Documentation – <Your Team / Product Name>

> Skeleton for the required technical documentation deliverable. Replace the placeholders.
> The parts that describe the template are pre-filled. Update them to match what you changed.

## 1. Overview

- **Problem:** <one paragraph>
- **Solution:** <one paragraph>
- **Target groups:** <e.g. older citizens, non-native speakers, …>
- **Demo URL:** <https://….workers.dev>

## 2. Architecture

```
Browser (React, Vite)
   │  WebSocket (Agents SDK)            REST (Hono)
   ▼                                       ▼
CitizenAssistant (Durable Object) ──tools──► Gov service layer ──► D1
   │                                          ▲
   └──► Workers AI / <other model> via AI Gateway   └── Knowledge base (facts + sources)
```

| Component | Technology | Purpose |
|---|---|---|
| Frontend | React + Vite, Workers Static Assets | <…> |
| API | Hono on Cloudflare Workers | Mock e-government REST API |
| Agent | Agents SDK `AIChatAgent` (Durable Object + SQLite) | Conversation state, tool calling |
| Model | `<MODEL_ID>` via AI Gateway | <why this model> |
| Data | D1 (SQLite) | Synthetic citizens, applications, appointments, handoffs |
| <your additions> | | |

## 3. Data & APIs

- **Data sources:** synthetic personas (`src/gov/data/personas.ts`); service facts from <pages on oesterreich.gv.at, verified on DATE>.
- **APIs:** see README "The mock API". <Describe new endpoints.>
- **Personal data:** all data is fictional. <How would you handle real data: ID Austria, data minimisation, retention?>

## 4. AI design

- **System prompt:** `src/agent/system-prompt.ts`. <Key rules you added.>
- **Tools:** <list, and what each does>
- **Grounding:** <how answers are tied to sources>
- **Languages / plain language:** <…>

## 5. Error handling & guardrails

| Risk | Mitigation |
|---|---|
| Hallucinated requirements | <…> |
| Unwanted submission | Server-side validation of incomplete forms (template). <Your confirmation step.> |
| Backend outage | <…> |
| Prompt injection | Tools scoped to the logged-in persona (template). <…> |
| Citizen overwhelmed | <…> |
| <…> | <…> |

## 6. Testing

- **Evals:** `pnpm evals`. Results are in `test-results/report.md` (<X/Y passed>).
- **Unit tests:** `pnpm test`
- **Accessibility testing:** <screen reader, keyboard-only, contrast checks, …>
- **Logs:** AI Gateway (prompts and responses), Workers Observability

## 7. Limitations

- Service rules are simplified mocks. <…>
- <Model limitations, e.g. dialect understanding>
- <What's not built yet>

## 8. Setup

See README "Quick start". <Add any new secrets or bindings.>
