import { useState } from "react";
import { motion } from "framer-motion";
import JSZip from "jszip";
import {
  Check,
  ChevronDown,
  Copy,
  Download,
  FileArchive,
  FileCode2,
  ListChecks,
  Loader2,
  RotateCcw,
} from "lucide-react";
import type { Notify } from "../lib/translator";
import { useI18n, type DictKey } from "../lib/i18n";
import { cn } from "../utils/cn";

/* محتوای خام همه فایل‌ها — مستقیم از سورس پروژه خوانده می‌شود */
import pkgRaw from "../../package.json?raw";
import viteConfigRaw from "../../vite.config.ts?raw";
import tsconfigRaw from "../../tsconfig.json?raw";
import indexHtmlRaw from "../../index.html?raw";
import mainRaw from "../main.tsx?raw";
import appRaw from "../App.tsx?raw";
import cssRaw from "../index.css?raw";
import envRaw from "../vite-env.d.ts?raw";
import libRaw from "../lib/translator.ts?raw";
import i18nRaw from "../lib/i18n.ts?raw";
import pdfRaw from "../lib/pdf.ts?raw";
import providersRaw from "../lib/providers.ts?raw";
import cnRaw from "../utils/cn.ts?raw";
import headerRaw from "./Header.tsx?raw";
import apiPanelRaw from "./ApiKeyPanel.tsx?raw";
import langSelectRaw from "./LanguageSelect.tsx?raw";
import historyRaw from "./HistoryPanel.tsx?raw";
import translatorRaw from "./Translator.tsx?raw";
import sectionsRaw from "./Sections.tsx?raw";
import iconsRaw from "./icons.tsx?raw";
import sourceExportRaw from "./SourceExport.tsx?raw";
import readmeRaw from "../../README.md?raw";
import gitignoreRaw from "../../.gitignore?raw";
import deployRaw from "../../.github/workflows/deploy.yml?raw";

type Bi = { fa: string; en: string };

interface FileEntry {
  path: string;
  code: string;
  /** در آخرین نسخه تغییر کرده — اگر قبلاً آپلود کرده‌ای باید جایگزین شود */
  changed?: Bi;
  /** فایل کاملاً جدید است */
  isNew?: boolean;
}

/* ترتیب پیشنهادی ساخت فایل‌ها در گیت‌هاب */
const FILES: FileEntry[] = [
  { path: "package.json", code: pkgRaw },
  { path: "vite.config.ts", code: viteConfigRaw },
  { path: "tsconfig.json", code: tsconfigRaw },
  { path: "index.html", code: indexHtmlRaw },
  { path: "src/main.tsx", code: mainRaw },
  { path: "src/App.tsx", code: appRaw },
  { path: "src/index.css", code: cssRaw },
  { path: "src/vite-env.d.ts", code: envRaw },
  { path: "src/lib/translator.ts", code: libRaw, changed: { fa: "موتور «کلید اختصاصی»", en: "custom-key engine" } },
  { path: "src/lib/i18n.ts", code: i18nRaw, changed: { fa: "متن‌های پنل کلید API", en: "API-key panel strings" } },
  { path: "src/lib/pdf.ts", code: pdfRaw, changed: { fa: "نمایش نام مدل در PDF", en: "model name in PDF" } },
  { path: "src/lib/providers.ts", code: providersRaw, isNew: true, changed: { fa: "OpenAI، Gemini، Groq، OpenRouter، Mistral", en: "OpenAI, Gemini, Groq, OpenRouter, Mistral" } },
  { path: "src/utils/cn.ts", code: cnRaw },
  { path: "src/components/Header.tsx", code: headerRaw },
  { path: "src/components/LanguageSelect.tsx", code: langSelectRaw },
  { path: "src/components/HistoryPanel.tsx", code: historyRaw },
  { path: "src/components/ApiKeyPanel.tsx", code: apiPanelRaw, isNew: true, changed: { fa: "پنل ورود کلید API", en: "API-key settings panel" } },
  { path: "src/components/Translator.tsx", code: translatorRaw, changed: { fa: "کارت «کلید اختصاصی»", en: "“Your API key” card" } },
  { path: "src/components/Sections.tsx", code: sectionsRaw },
  { path: "src/components/icons.tsx", code: iconsRaw },
  { path: "src/components/SourceExport.tsx", code: sourceExportRaw, changed: { fa: "افزودن فایل‌های جدید به لیست", en: "new files added to the list" } },
  { path: "README.md", code: readmeRaw, changed: { fa: "معرفی کلید اختصاصی", en: "API-key feature mentioned" } },
  { path: ".gitignore", code: gitignoreRaw },
  { path: ".github/workflows/deploy.yml", code: deployRaw },
];

const LS_KEY = "salam-tr-uploaded-v1";

function loadDone(): string[] {
  try {
    const v = JSON.parse(localStorage.getItem(LS_KEY) ?? "[]");
    return Array.isArray(v) ? v.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

const STEP_KEYS: DictKey[] = ["step_1", "step_2", "step_3", "step_4", "step_5", "step_6"];

export default function SourceExport({ notify }: { notify: Notify }) {
  const { t, n, lang } = useI18n();
  const [done, setDone] = useState<string[]>(loadDone);
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState("");
  const [zipping, setZipping] = useState(false);

  const toggleOpen = (p: string) => setOpen((s) => ({ ...s, [p]: !s[p] }));
  const allOpen = FILES.every((f) => open[f.path]);
  const toggleAll = () =>
    setOpen(allOpen ? {} : Object.fromEntries(FILES.map((f) => [f.path, true])));

  const toggleDone = (path: string) =>
    setDone((prev) => {
      const next = prev.includes(path)
        ? prev.filter((p) => p !== path)
        : [...prev, path];
      try {
        localStorage.setItem(LS_KEY, JSON.stringify(next));
      } catch {
        /* noop */
      }
      return next;
    });

  const resetDone = () => {
    setDone([]);
    try {
      localStorage.removeItem(LS_KEY);
    } catch {
      /* noop */
    }
  };

  const copyFile = async (f: FileEntry) => {
    try {
      await navigator.clipboard.writeText(f.code);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = f.code;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(f.path);
    notify(t("n_file_copied", { path: f.path }), "success");
    setTimeout(() => setCopied((p) => (p === f.path ? "" : p)), 1600);
  };

  const downloadFile = (f: FileEntry) => {
    const blob = new Blob([f.code], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = f.path.split("/").pop() ?? "file.txt";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    notify(t("n_file_downloaded", { path: f.path }), "success");
  };

  const downloadZip = async () => {
    setZipping(true);
    try {
      const zip = new JSZip();
      for (const f of FILES) zip.file(f.path, f.code);
      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "salam-translator-source.zip";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      notify(t("n_zip_done"), "success");
    } catch {
      notify(t("n_zip_err"), "error");
    } finally {
      setZipping(false);
    }
  };

  const pct = Math.round((done.length / FILES.length) * 100);
  const total = n(FILES.length);

  return (
    <section id="source" className="mx-auto max-w-6xl scroll-mt-24 px-4 pt-16 sm:px-6">
      <div className="text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-[13px] font-black text-pine-800 shadow-sm ring-1 ring-pine-900/10 dark:bg-white/8 dark:text-gold-400 dark:ring-white/10">
          <FileCode2 className="h-4 w-4" />
          {t("src_badge")}
        </span>
        <h2 className="mt-4 text-3xl font-black leading-snug text-pine-950 sm:text-4xl dark:text-white">
          {t("src_title", { n: total })}
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-[15px] leading-8 text-ink/60 dark:text-white/60">
          {t("src_desc")}
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={() => void downloadZip()}
            disabled={zipping}
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-l from-emerald-500 to-teal-600 px-6 py-3 text-sm font-black text-white shadow-xl shadow-emerald-500/25 transition hover:-translate-y-0.5 disabled:opacity-70"
          >
            {zipping ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <FileArchive className="h-4 w-4" />
            )}
            {zipping ? t("zip_building") : t("zip_btn")}
          </button>
        </div>
        <p className="mx-auto mt-3 max-w-xl text-[13px] leading-7 text-ink/50 dark:text-white/50">
          {t("zip_hint")}
        </p>
      </div>

      {/* راهنمای قدم‌به‌قدم */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5 }}
        className="grain relative mt-8 overflow-hidden rounded-[2rem] bg-pine-950 p-6 text-white sm:p-8"
      >
        <div className="pattern-girih absolute inset-0" />
        <div className="relative">
          <h3 className="flex items-center gap-2.5 text-lg font-black">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gold-400 text-pine-950">
              <ListChecks className="h-5 w-5" />
            </span>
            {t("steps_title")}
          </h3>
          <ol className="mt-5 space-y-2.5">
            {STEP_KEYS.map((k, i) => (
              <li
                key={k}
                className="flex items-start gap-3 rounded-2xl bg-white/5 p-3.5 ring-1 ring-white/10"
              >
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-clay-500 text-sm font-black text-white">
                  {n(i + 1)}
                </span>
                <span className="text-sm leading-7 text-white/85">{t(k, { n: total })}</span>
              </li>
            ))}
          </ol>
          <p className="mt-4 rounded-2xl bg-gold-400/10 p-4 text-[13px] leading-7 font-bold text-gold-100 ring-1 ring-gold-400/25">
            {t("steps_note")}
          </p>
        </div>
      </motion.div>

      {/* پیشرفت */}
      <div className="mt-5 rounded-3xl bg-white p-5 ring-1 ring-pine-900/8 dark:bg-white/[0.04] dark:ring-white/10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-black text-pine-950 dark:text-white">
            {t("progress", { done: n(done.length), total })}
            <span className="mx-2 text-emerald-600 dark:text-emerald-400">
              {t("pct", { n: n(pct) })}
            </span>
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={toggleAll}
              className="rounded-xl bg-pine-950/6 px-4 py-2 text-[13px] font-black text-pine-950 transition hover:bg-pine-950/10 dark:bg-white/8 dark:text-white dark:hover:bg-white/15"
            >
              {allOpen ? t("hide_all") : t("show_all")}
            </button>
            <button
              onClick={resetDone}
              className="flex items-center gap-1.5 rounded-xl bg-pine-950/6 px-4 py-2 text-[13px] font-black text-pine-950 transition hover:bg-pine-950/10 dark:bg-white/8 dark:text-white dark:hover:bg-white/15"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              {t("reset")}
            </button>
          </div>
        </div>
        <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-pine-950/8 dark:bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-l from-emerald-500 to-teal-400 transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        {done.length === FILES.length && (
          <p className="mt-3 rounded-2xl bg-emerald-500/10 p-3 text-center text-sm font-black text-emerald-600 ring-1 ring-emerald-500/20 dark:text-emerald-400">
            {t("all_done")}
          </p>
        )}
      </div>

      {/* لیست فایل‌ها */}
      <div className="mt-4 space-y-3">
        {FILES.map((f, i) => {
          const isDone = done.includes(f.path);
          const isOpen = !!open[f.path];
          const isCopied = copied === f.path;
          return (
            <motion.div
              key={f.path}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.3 }}
              className={cn(
                "overflow-hidden rounded-3xl bg-white ring-1 transition dark:bg-white/[0.04]",
                isDone
                  ? "ring-2 ring-emerald-500"
                  : "ring-pine-900/8 dark:ring-white/10"
              )}
            >
              <div className="flex flex-wrap items-center gap-2 p-4 sm:px-5">
                <span
                  className={cn(
                    "grid h-9 w-9 shrink-0 place-items-center rounded-xl text-sm font-black",
                    isDone
                      ? "bg-emerald-500 text-white"
                      : "bg-pine-950 text-gold-400 dark:bg-gold-400 dark:text-pine-950"
                  )}
                >
                  {isDone ? (
                    <Check className="h-4 w-4" strokeWidth={3} />
                  ) : (
                    n(i + 1)
                  )}
                </span>
                <code
                  dir="ltr"
                  className="font-mono text-[13px] font-bold text-pine-950 dark:text-white"
                >
                  {f.path}
                </code>
                <span className="text-xs font-bold text-ink/40 dark:text-white/40">
                  {t("lines", { n: n(f.code.split("\n").length) })}
                </span>
                {f.changed && (
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-1 text-[11px] font-black ring-1",
                      f.isNew
                        ? "bg-violet-500/15 text-violet-700 ring-violet-500/30 dark:text-violet-300"
                        : "bg-amber-400/20 text-amber-700 ring-amber-500/30 dark:text-amber-300"
                    )}
                  >
                    {t(f.isNew ? "new_badge" : "changed_badge", { what: f.changed[lang] })}
                  </span>
                )}
                <div className="ms-auto flex flex-wrap items-center gap-1.5">
                  <button
                    onClick={() => toggleDone(f.path)}
                    className={cn(
                      "flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-[13px] font-black ring-1 transition active:scale-95",
                      isDone
                        ? "bg-emerald-500/10 text-emerald-600 ring-emerald-500/30 dark:text-emerald-400"
                        : "text-ink/55 ring-pine-900/15 hover:bg-pine-950/5 dark:text-white/60 dark:ring-white/15 dark:hover:bg-white/8"
                    )}
                  >
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                    {isDone ? t("done_yes") : t("done_ask")}
                  </button>
                  <button
                    onClick={() => void copyFile(f)}
                    className={cn(
                      "flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-[13px] font-black transition active:scale-95",
                      isCopied
                        ? "bg-emerald-500 text-white"
                        : "bg-pine-950 text-white hover:bg-clay-600 dark:bg-gold-400 dark:text-pine-950 dark:hover:bg-gold-500"
                    )}
                  >
                    {isCopied ? (
                      <Check className="h-3.5 w-3.5" strokeWidth={3} />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                    {isCopied ? t("copied") : t("copy")}
                  </button>
                  <button
                    onClick={() => downloadFile(f)}
                    title={t("download_file")}
                    aria-label={`${t("download_file")}: ${f.path}`}
                    className="grid h-9 w-9 place-items-center rounded-xl text-ink/55 ring-1 ring-pine-900/15 transition hover:bg-pine-950/5 active:scale-95 dark:text-white/60 dark:ring-white/15 dark:hover:bg-white/8"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => toggleOpen(f.path)}
                    className="flex items-center gap-1 rounded-xl bg-pine-950/6 px-3.5 py-2 text-[13px] font-black text-pine-950 transition hover:bg-pine-950/10 dark:bg-white/8 dark:text-white dark:hover:bg-white/15"
                  >
                    {isOpen ? t("hide") : t("show_code")}
                    <ChevronDown
                      className={cn("h-3.5 w-3.5 transition-transform", isOpen && "rotate-180")}
                    />
                  </button>
                </div>
              </div>
              {isOpen && (
                <div className="px-4 pb-4 sm:px-5 sm:pb-5">
                  <pre
                    dir="ltr"
                    className="max-h-[420px] overflow-auto rounded-2xl bg-pine-950 p-4 text-left font-mono text-[12.5px] leading-6 text-emerald-100 dark:bg-black/50 dark:ring-1 dark:ring-white/10"
                  >
                    {f.code}
                  </pre>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
