/* ============================================================
   موتورهای هوش مصنوعی با کلید اختصاصی کاربر
   همه درخواست‌ها مستقیم از مرورگر به سرویس می‌روند (بدون سرور واسطه).
   کلیدها فقط در localStorage مرورگر کاربر ذخیره می‌شوند.
   ============================================================ */

export type ProviderId = "gemini" | "openai" | "groq" | "openrouter" | "mistral";

export interface ProviderInfo {
  id: ProviderId;
  name: string;
  /** آیا پلن رایگان دارد؟ */
  free: boolean;
  /** صفحه ساخت کلید */
  keyUrl: string;
  /** پیشوند معمول کلید — فقط برای راهنمایی کاربر */
  keyHint: string;
  models: string[];
  /** endpoint سازگار با OpenAI (برای همه به‌جز Gemini) */
  endpoint?: string;
  /** رنگ نشان */
  color: string;
}

export const PROVIDERS: ProviderInfo[] = [
  {
    id: "gemini",
    name: "Google Gemini",
    free: true,
    keyUrl: "https://aistudio.google.com/app/apikey",
    keyHint: "AIza…",
    models: ["gemini-2.0-flash", "gemini-2.0-flash-lite", "gemini-1.5-flash", "gemini-1.5-pro"],
    color: "#4285F4",
  },
  {
    id: "openai",
    name: "OpenAI",
    free: false,
    keyUrl: "https://platform.openai.com/api-keys",
    keyHint: "sk-…",
    models: ["gpt-4o-mini", "gpt-4o", "gpt-4.1-mini", "gpt-4.1", "gpt-3.5-turbo"],
    endpoint: "https://api.openai.com/v1/chat/completions",
    color: "#10A37F",
  },
  {
    id: "groq",
    name: "Groq",
    free: true,
    keyUrl: "https://console.groq.com/keys",
    keyHint: "gsk_…",
    models: ["llama-3.3-70b-versatile", "llama-3.1-8b-instant", "gemma2-9b-it", "mixtral-8x7b-32768"],
    endpoint: "https://api.groq.com/openai/v1/chat/completions",
    color: "#F55036",
  },
  {
    id: "openrouter",
    name: "OpenRouter",
    free: true,
    keyUrl: "https://openrouter.ai/settings/keys",
    keyHint: "sk-or-…",
    models: [
      "meta-llama/llama-3.3-70b-instruct:free",
      "google/gemini-2.0-flash-exp:free",
      "mistralai/mistral-7b-instruct:free",
      "openai/gpt-4o-mini",
      "anthropic/claude-3.5-haiku",
      "deepseek/deepseek-chat",
    ],
    endpoint: "https://openrouter.ai/api/v1/chat/completions",
    color: "#7C3AED",
  },
  {
    id: "mistral",
    name: "Mistral",
    free: true,
    keyUrl: "https://console.mistral.ai/api-keys",
    keyHint: "…",
    models: ["mistral-small-latest", "open-mistral-nemo", "mistral-large-latest"],
    endpoint: "https://api.mistral.ai/v1/chat/completions",
    color: "#F97316",
  },
];

export const providerById = (id: string): ProviderInfo =>
  PROVIDERS.find((p) => p.id === id) ?? PROVIDERS[0];

export const isProviderId = (v: string): v is ProviderId =>
  PROVIDERS.some((p) => p.id === v);

/* ---------------- ذخیره‌سازی تنظیمات ---------------- */

export interface ApiSettings {
  provider: ProviderId;
  /** کلید هر سرویس جداگانه ذخیره می‌شود تا با تعویض سرویس از بین نرود */
  keys: Partial<Record<ProviderId, string>>;
  models: Partial<Record<ProviderId, string>>;
}

const KEY = "salam-tr-api-v1";

export function loadApiSettings(): ApiSettings {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) ?? "null");
    if (v && typeof v === "object") {
      return {
        provider: isProviderId(v.provider) ? v.provider : "gemini",
        keys: v.keys && typeof v.keys === "object" ? v.keys : {},
        models: v.models && typeof v.models === "object" ? v.models : {},
      };
    }
  } catch {
    /* noop */
  }
  return { provider: "gemini", keys: {}, models: {} };
}

export function saveApiSettings(s: ApiSettings) {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* noop */
  }
}

export const activeKey = (s: ApiSettings): string => (s.keys[s.provider] ?? "").trim();
export const activeModel = (s: ApiSettings): string =>
  (s.models[s.provider] ?? "").trim() || providerById(s.provider).models[0];
export const hasActiveKey = (s: ApiSettings): boolean => activeKey(s).length > 0;

/** نام کوتاه مدل برای نمایش (بدون پیشوند سازنده و پسوند :free) */
export function shortModel(model: string): string {
  return model.split("/").pop()?.replace(/:free$/, "") ?? model;
}

/* ---------------- خطاها ---------------- */

export type ProviderErrorKind = "unauthorized" | "ratelimit" | "model" | "network" | "generic";

export class ProviderError extends Error {
  kind: ProviderErrorKind;
  constructor(kind: ProviderErrorKind, detail?: string) {
    super(detail ?? kind);
    this.kind = kind;
  }
}

const isAbort = (e: unknown) => (e as Error)?.name === "AbortError";

function kindFromStatus(status: number): ProviderErrorKind {
  if (status === 401 || status === 403) return "unauthorized";
  if (status === 429 || status === 402) return "ratelimit";
  if (status === 404) return "model";
  return "generic";
}

/* ---------------- پرامپت ترجمه ---------------- */

const LANG_NAMES: Record<string, string> = {
  fa: "Persian (Farsi)", en: "English", ar: "Arabic", tr: "Turkish", fr: "French",
  de: "German", es: "Spanish", it: "Italian", ru: "Russian", zh: "Chinese (Simplified)",
  ja: "Japanese", ko: "Korean", hi: "Hindi", pt: "Portuguese", nl: "Dutch", sv: "Swedish",
  pl: "Polish", uk: "Ukrainian", id: "Indonesian", ms: "Malay", th: "Thai", vi: "Vietnamese",
};

const langName = (code: string) => LANG_NAMES[code] ?? code;

function buildPrompt(src: string, tgt: string): string {
  const from = src === "auto" ? "the source language (detect it automatically)" : langName(src);
  return [
    `You are a professional translator. Translate the user's text from ${from} into ${langName(tgt)}.`,
    "Rules:",
    "- Output ONLY the translation. No explanations, no notes, no quotation marks, no preamble.",
    "- Preserve the meaning, tone, register and formatting (line breaks, lists, punctuation).",
    "- Keep names, numbers, URLs and code unchanged.",
    "- Make the translation natural and fluent, as a native speaker would write it.",
    "- If the text is already in the target language, return it unchanged.",
  ].join("\n");
}

/** پاک‌سازی خروجی مدل: حذف گیومه‌ها، برچسب‌ها و بلوک‌های تفکر */
function clean(out: string): string {
  let s = out.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();
  s = s.replace(/^(translation|ترجمه)\s*[:：]\s*/i, "");
  if (/^```[\s\S]*```$/.test(s)) s = s.replace(/^```[a-z]*\n?/i, "").replace(/```$/, "").trim();
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("«") && s.endsWith("»"))) {
    s = s.slice(1, -1).trim();
  }
  return s;
}

/* ---------------- فراخوانی سرویس‌ها ---------------- */

async function doFetch(url: string, init: RequestInit, signal?: AbortSignal): Promise<Response> {
  try {
    return await fetch(url, { ...init, signal });
  } catch (e) {
    if (isAbort(e)) throw e;
    throw new ProviderError("network");
  }
}

async function readError(res: Response): Promise<string> {
  try {
    const j = await res.json();
    return String(j?.error?.message ?? j?.message ?? res.statusText);
  } catch {
    return res.statusText;
  }
}

/** سرویس‌های سازگار با OpenAI: OpenAI، Groq، OpenRouter، Mistral */
async function chatCompletion(
  p: ProviderInfo,
  key: string,
  model: string,
  system: string,
  user: string,
  signal?: AbortSignal
): Promise<string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${key}`,
  };
  if (p.id === "openrouter") {
    headers["HTTP-Referer"] = typeof location !== "undefined" ? location.origin : "https://github.com";
    headers["X-Title"] = "Text Translator";
  }
  const res = await doFetch(
    p.endpoint!,
    {
      method: "POST",
      headers,
      body: JSON.stringify({
        model,
        temperature: 0.2,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
      }),
    },
    signal
  );
  if (!res.ok) {
    const msg = await readError(res);
    const kind = res.status === 400 && /model/i.test(msg) ? "model" : kindFromStatus(res.status);
    throw new ProviderError(kind, msg);
  }
  const data = await res.json().catch(() => null);
  const text = data?.choices?.[0]?.message?.content;
  if (typeof text !== "string" || !text.trim()) throw new ProviderError("generic");
  return text;
}

/** Google Gemini (generateContent) */
async function gemini(
  key: string,
  model: string,
  system: string,
  user: string,
  signal?: AbortSignal
): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
    model
  )}:generateContent?key=${encodeURIComponent(key)}`;
  const res = await doFetch(
    url,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents: [{ role: "user", parts: [{ text: user }] }],
        generationConfig: { temperature: 0.2 },
      }),
    },
    signal
  );
  if (!res.ok) {
    const msg = await readError(res);
    const kind = res.status === 400 && /api key/i.test(msg) ? "unauthorized" : kindFromStatus(res.status);
    throw new ProviderError(kind, msg);
  }
  const data = await res.json().catch(() => null);
  const parts = data?.candidates?.[0]?.content?.parts;
  const text = Array.isArray(parts) ? parts.map((x: { text?: string }) => x.text ?? "").join("") : "";
  if (!text.trim()) throw new ProviderError("generic");
  return text;
}

/** ترجمه یک تکه متن با سرویس انتخابی */
export async function providerTranslate(
  settings: ApiSettings,
  text: string,
  src: string,
  tgt: string,
  signal?: AbortSignal
): Promise<string> {
  const p = providerById(settings.provider);
  const key = activeKey(settings);
  const model = activeModel(settings);
  if (!key) throw new ProviderError("unauthorized");
  const system = buildPrompt(src, tgt);
  const raw =
    p.id === "gemini"
      ? await gemini(key, model, system, text, signal)
      : await chatCompletion(p, key, model, system, text, signal);
  return clean(raw);
}

/** تست اتصال: یک ترجمه خیلی کوتاه؛ زمان پاسخ را برمی‌گرداند */
export async function testProvider(settings: ApiSettings, signal?: AbortSignal): Promise<number> {
  const t0 = performance.now();
  await providerTranslate(settings, "Hello", "en", "fa", signal);
  return Math.round(performance.now() - t0);
}
