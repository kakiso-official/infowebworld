# AI & ML Listing Re-mapping Notes (v3)

After the v3 taxonomy migration deletes the old AI&ML categories, the 6 existing
AI&ML submissions need a `category_id` re-pointed at the closest match in the
new tree. These UPDATE statements live in **Section F** at the bottom of
`database/migration-aiml-taxonomy-v3.sql`.

All 6 mapped to **DB L5** (the deepest level — most specific match).

| id | Company | Old category | New category (full path) | New slug |
|---|---|---|---|---|
| 24 | Claude | All-Purpose AI Chat Companions | AI Core & Models → LLMs & Chat Assistants → General Chat Assistants → AI chat assistant | `ai-chat-assistant` |
| 25 | ChatGPT | All-Purpose AI Chat Companions | AI Core & Models → LLMs & Chat Assistants → General Chat Assistants → AI general purpose chatbot | `ai-general-purpose-chatbot` |
| 26 | Gemini | All-Purpose AI Chat Companions | AI Core & Models → LLMs & Chat Assistants → Large Language Models → Multimodal LLM | `multimodal-llm` |
| 27 | Microsoft Copilot | All-Purpose AI Chat Companions | AI Core & Models → LLMs & Chat Assistants → General Chat Assistants → AI chat assistant | `ai-chat-assistant` |
| 28 | Perplexity | All-Purpose AI Chat Companions | Productivity & Workflow → Search & Discovery → AI Search Engines → AI answer engine | `ai-answer-engine` |
| 31 | DeepSeek | All-Purpose AI Chat Companions | AI Core & Models → LLMs & Chat Assistants → Large Language Models → Open source LLM | `open-source-llm` |

## Reasoning

- **Claude & Microsoft Copilot** → `ai-chat-assistant` — both are positioned as everyday assistants; the "general chat assistant" framing fits how users interact with them.
- **ChatGPT** → `ai-general-purpose-chatbot` — ChatGPT is the canonical example of a general-purpose AI chatbot; this is a more distinct slug than the generic chat-assistant one (avoids putting all four under the same node).
- **Gemini** → `multimodal-llm` — Gemini's description leans heavily on multimodality (image, voice, video, text). Better fit than a generic chat assistant.
- **Perplexity** → `ai-answer-engine` — Perplexity describes itself explicitly as an "answer engine", which matches the new taxonomy exactly. NOT an LLM by itself.
- **DeepSeek** → `open-source-llm` — DeepSeek-V3 and DeepSeek-R1 are open-weight models; the company IS the model lab. Better fit than the consumer-app categorization.

If any of these mappings feels off, override the slug in Section F before running
the SQL — every UPDATE looks up the target category by `slug + level=5 LIMIT 1`
so swapping the slug is enough.
