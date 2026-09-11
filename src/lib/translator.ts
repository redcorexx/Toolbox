/* ============================================================
   Salam Translator — core library
   Translation via the free MyMemory API (no key required).
   https://mymemory.translated.net/doc/spec.php
   ============================================================ */

export interface Lang {
  code: string;
  fa: string;
  native: string;
  speech: string;
}

export const LANGUAGES: Lang[] = [
  { code: "fa", fa: "فارسی", native: "فارسی", speech: "fa-IR" },
  { code: "en", fa: "انگلیسی", native: "English", speech: "en-US" },
  { code: "ar", fa: "عربی", native: "العربية", speech: "ar-SA" },
  { code: "tr", fa: "ترکی", native: "Türkçe", speech: "tr-TR" },
  { code: "fr", fa: "فرانسوی", native: "Français", speech: "fr-FR" },
  { code: "de", fa: "آلمانی", native: "Deutsch", speech: "de-DE" },
  { code: "es", fa: "اسپانیایی", native: "Español", speech: "es-ES" },
  { code: "it", fa: "ایتالیایی", native: "Italiano", speech: "it-IT" },
  { code: "ru", fa: "روسی", native: "Русский", speech: "ru-RU" },
  { code: "zh", fa: "چینی", native: "中文", speech: "zh-CN" },
  { code: "ja", fa: "ژاپنی", native: "日本語", speech: "ja-JP" },
  { code: "ko", fa: "کره‌ای", native: "한국어", speech: "ko-KR" },
  { code: "hi", fa: "هندی", native: "हिन्दी", speech: "hi-IN" },
  { code: "pt", fa: "پرتغالی", native: "Português", speech: "pt-PT" },
  { code: "nl", fa: "هلندی", native: "Nederlands", speech: "nl-NL" },
  { code: "sv", fa: "سوئدی", native: "Svenska", speech: "sv-SE" },
  { code: "pl", fa: "لهستانی", native: "Polski", speech: "pl-PL" },
  { code: "uk", fa: "اوکراینی", native: "Українська", speech: "uk-UA" },
  { code: "id", fa: "اندونزیایی", native: "Indonesia", speech: "id-ID" },
  { code: "ms", fa: "مالایی", native: "Melayu", speech: "ms-MY" },
  { code: "th", fa: "تایلندی", native: "ไทย", speech: "th-TH" },
  { code: "vi", fa: "ویتنامی", native: "Tiếng Việt", speech: "vi-VN" },
];

export const langByCode = (code: string): Lang =>
  LANGUAGES.find((l) => l.code === code) ?? LANGUAGES[1];

const FA_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

export const toFa = (value: string | number): string =>
  String(value).replace(/[0-9]/g, (d) => FA_DIGITS[+d]);

/* ---------------- language detection (script based) ---------------- */

export function detectLang(text: string): string {
  const t = text.trim();
  if (!t) return "en";
  if (/[\u3040-\u30FF\u31F0-\u31FF]/.test(t)) return "ja"; // kana
  if (/[\uAC00-\uD7AF]/.test(t)) return "ko"; // hangul
  if (/[\u4E00-\u9FFF]/.test(t)) return "zh"; // cjk
  if (/[\u0400-\u04FF]/.test(t)) return "ru"; // cyrillic
  if (/[\u0900-\u097F]/.test(t)) return "hi"; // devanagari
  if (/[\u0E00-\u0E7F]/.test(t)) return "th"; // thai
  if (/[\u0600-\u06FF]/.test(t)) {
    // Persian-specific chars (گ چ پ ژ) + Persian yeh/kaf + ZWNJ
    return /[گچپژ\u06CC\u06A9\u200C]/.test(t) ? "fa" : "ar";
  }
  return "en";
}

/* ---------------- chunking (API limit ≈ 500 chars/query) ---------------- */

const MAX_CHUNK = 450;

export function chunkText(text: string): string[] {
  const tokens = text.split(/(\n+)/);
  const out: string[] = [];
  for (const tok of tokens) {
    if (!tok) continue;
    if (/^\n+$/.test(tok)) {
      out.push(tok);
      continue;
    }
    const sentences = tok.match(/[^.!?…؟!;\n]+[.!?…؟!;]*\s*/g) ?? [tok];
    let cur = "";
    const flush = () => {
      if (cur.trim()) out.push(cur);
      cur = "";
    };
    for (let s of sentences) {
      if ((cur + s).length > MAX_CHUNK) {
        flush();
        while (s.length > MAX_CHUNK) {
          let cut = s.lastIndexOf(" ", MAX_CHUNK);
          if (cut < 60) cut = MAX_CHUNK;
          out.push(s.slice(0, cut));
          s = s.slice(cut);
        }
        cur = s;
      } else {
        cur += s;
      }
    }
    flush();
  }
  return out.filter((p) => p.length > 0);
}

/* ---------------- API ---------------- */

function decodeHtml(s: string): string {
  const el = document.createElement("textarea");
  el.innerHTML = s;
  return el.value;
}

export class TranslateError extends Error {
  kind: "quota" | "network" | "generic";
  constructor(kind: "quota" | "network" | "generic") {
    super(kind);
    this.kind = kind;
  }
}

interface ChunkOut {
  text: string;
  matches: { translation?: string; quality?: string | number }[];
}

async function translateChunk(
  q: string,
  src: string,
  tgt: string,
  email: string | undefined,
  signal: AbortSignal | undefined
): Promise<ChunkOut> {
  let url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
    q
  )}&langpair=${src}|${tgt}`;
  if (email) url += `&de=${encodeURIComponent(email)}`;

  let res: Response;
  try {
    res = await fetch(url, { signal });
  } catch (e) {
    if ((e as Error).name === "AbortError") throw e;
    throw new TranslateError("network");
  }
  if (res.status === 429) throw new TranslateError("quota");
  if (!res.ok) throw new TranslateError("generic");

  const data = await res.json().catch(() => null);
  if (!data) throw new TranslateError("generic");

  const status = String(data.responseStatus ?? "");
  const translated: string = String(data.responseData?.translatedText ?? "");
  const details: string = String(data.responseDetails ?? "");

  if (
    /MYMEMORY WARNING|QUERY LENGTH LIMIT|NO QUERY SPECIFIED/i.test(translated) ||
    status === "403" ||
    /limit|quota|invalid email/i.test(details)
  ) {
    throw new TranslateError("quota");
  }
  if (!status.startsWith("2") || !translated) {
    throw new TranslateError("generic");
  }
  return {
    text: decodeHtml(translated),
    matches: Array.isArray(data.matches) ? data.matches : [],
  };
}

export interface TranslateResult {
  text: string;
  alternatives: string[];
  chunks: number;
}

export async function translateText(
  text: string,
  src: string,
  tgt: string,
  opts: {
    email?: string;
    signal?: AbortSignal;
    onProgress?: (done: number, total: number) => void;
  } = {}
): Promise<TranslateResult> {
  const parts = chunkText(text);
  const jobs = parts.filter((p) => !/^\n+$/.test(p));
  const total = jobs.length || 1;
  opts.onProgress?.(0, total);

  let done = 0;
  let firstMatches: ChunkOut["matches"] = [];
  const outParts: string[] = [];

  for (const p of parts) {
    if (/^\n+$/.test(p)) {
      outParts.push(p);
      continue;
    }
    const r = await translateChunk(p, src, tgt, opts.email || undefined, opts.signal);
    if (firstMatches.length === 0) firstMatches = r.matches;
    outParts.push(r.text);
    done += 1;
    opts.onProgress?.(done, total);
  }

  const full = outParts
    .join("")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  const mainFirst =
    outParts.find((p) => !/^\n+$/.test(p))?.trim().toLowerCase() ?? "";
  const seen = new Set([mainFirst]);
  const alternatives: string[] = [];
  for (const m of firstMatches) {
    const t = decodeHtml(String(m.translation ?? "")).trim();
    const q = Number(m.quality ?? 0);
    if (!t || q <= 0 || seen.has(t.toLowerCase())) continue;
    seen.add(t.toLowerCase());
    alternatives.push(t);
    if (alternatives.length >= 3) break;
  }

  return { text: full, alternatives, chunks: total };
}

/* ---------------- speech (TTS / STT) ---------------- */

declare global {
  interface Window {
    SpeechRecognition?: any;
    webkitSpeechRecognition?: any;
  }
}

export function speak(text: string, speechLang: string, onEnd?: () => void) {
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = speechLang;
    const prefix = speechLang.slice(0, 2).toLowerCase();
    const voice = window.speechSynthesis
      .getVoices()
      .find((v) => v.lang.toLowerCase().startsWith(prefix));
    if (voice) u.voice = voice;
    u.onend = () => onEnd?.();
    u.onerror = () => onEnd?.();
    window.speechSynthesis.speak(u);
  } catch {
    onEnd?.();
  }
}

export function stopSpeak() {
  try {
    window.speechSynthesis.cancel();
  } catch {
    /* noop */
  }
}

export function canListen(): boolean {
  return (
    typeof window !== "undefined" &&
    !!(window.SpeechRecognition || window.webkitSpeechRecognition)
  );
}

/* ---------------- storage ---------------- */

export interface HistoryItem {
  id: string;
  src: string;
  tgt: string;
  sourceText: string;
  translatedText: string;
  time: number;
  fav: boolean;
}

const HKEY = "salam-tr-history-v1";
const SKEY = "salam-tr-stats-v1";

export function loadHistory(): HistoryItem[] {
  try {
    const v = JSON.parse(localStorage.getItem(HKEY) ?? "[]");
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

export function saveHistory(items: HistoryItem[]) {
  try {
    localStorage.setItem(HKEY, JSON.stringify(items.slice(0, 100)));
  } catch {
    /* noop */
  }
}

export interface Stats {
  translations: number;
  chars: number;
  day: string;
  dayCount: number;
}

export function loadStats(): Stats {
  const today = new Date().toISOString().slice(0, 10);
  try {
    const s = JSON.parse(localStorage.getItem(SKEY) ?? "null");
    if (s && typeof s.translations === "number") {
      if (s.day !== today) {
        s.day = today;
        s.dayCount = 0;
      }
      return s as Stats;
    }
  } catch {
    /* noop */
  }
  return { translations: 0, chars: 0, day: today, dayCount: 0 };
}

export function recordTranslation(chars: number): Stats {
  const s = loadStats();
  s.translations += 1;
  s.chars += chars;
  s.dayCount += 1;
  try {
    localStorage.setItem(SKEY, JSON.stringify(s));
  } catch {
    /* noop */
  }
  return s;
}

export const store = {
  get(k: string, fb = ""): string {
    try {
      return localStorage.getItem(k) ?? fb;
    } catch {
      return fb;
    }
  },
  set(k: string, v: string) {
    try {
      localStorage.setItem(k, v);
    } catch {
      /* noop */
    }
  },
};

export function timeAgo(ts: number): string {
  const s = Math.max(1, Math.floor((Date.now() - ts) / 1000));
  if (s < 60) return "لحظاتی پیش";
  const m = Math.floor(s / 60);
  if (m < 60) return `${toFa(m)} دقیقه پیش`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${toFa(h)} ساعت پیش`;
  const d = Math.floor(h / 24);
  if (d === 1) return "دیروز";
  if (d < 30) return `${toFa(d)} روز پیش`;
  return new Date(ts).toLocaleDateString("fa-IR");
}

export const QUICK_PHRASES = [
  "سلام! حالت چطوره؟",
  "این قیمتش چنده؟",
  "لطفاً آروم‌تر صحبت کن.",
  "ببخشید، اینجا کجاست؟",
  "من گم شدم، می‌تونی کمکم کنی؟",
  "یک قهوه لطفاً.",
  "فردا ساعت چند همو ببینیم؟",
  "خیلی ممنون از کمکت!",
];

export type ToastType = "success" | "error" | "info";
export type Notify = (msg: string, type?: ToastType) => void;
