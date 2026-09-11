import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Check,
  ExternalLink,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  PlugZap,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import {
  PROVIDERS,
  ProviderError,
  providerById,
  shortModel,
  testProvider,
  type ApiSettings,
  type ProviderId,
} from "../lib/providers";
import type { Notify } from "../lib/translator";
import { useI18n } from "../lib/i18n";
import { cn } from "../utils/cn";

interface Props {
  settings: ApiSettings;
  onChange: (s: ApiSettings) => void;
  notify: Notify;
}

const CUSTOM = "__custom__";

export function providerErrorMessage(
  e: unknown,
  t: ReturnType<typeof useI18n>["t"],
  providerName: string
): string {
  const kind = e instanceof ProviderError ? e.kind : "generic";
  if (kind === "unauthorized") return t("n_api_unauthorized");
  if (kind === "ratelimit") return t("n_api_ratelimit");
  if (kind === "model") return t("n_api_model");
  if (kind === "network") return t("n_api_network", { provider: providerName });
  return t("n_api_generic", { provider: providerName });
}

export default function ApiKeyPanel({ settings, onChange, notify }: Props) {
  const { t, n } = useI18n();
  const provider = providerById(settings.provider);
  const savedKey = settings.keys[provider.id] ?? "";
  const savedModel = settings.models[provider.id] ?? provider.models[0];

  const [keyDraft, setKeyDraft] = useState(savedKey);
  const [modelSel, setModelSel] = useState(provider.models.includes(savedModel) ? savedModel : CUSTOM);
  const [modelCustom, setModelCustom] = useState(provider.models.includes(savedModel) ? "" : savedModel);
  const [show, setShow] = useState(false);
  const [testing, setTesting] = useState(false);
  const [okMs, setOkMs] = useState<number | null>(null);

  // با تعویض سرویس، فرم را با مقادیر ذخیره‌شده همان سرویس پر کن
  useEffect(() => {
    const k = settings.keys[provider.id] ?? "";
    const m = settings.models[provider.id] ?? provider.models[0];
    setKeyDraft(k);
    const known = provider.models.includes(m);
    setModelSel(known ? m : CUSTOM);
    setModelCustom(known ? "" : m);
    setOkMs(null);
    setShow(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provider.id]);

  const effectiveModel = (modelSel === CUSTOM ? modelCustom.trim() : modelSel) || provider.models[0];

  const draftSettings = (): ApiSettings => ({
    provider: provider.id,
    keys: { ...settings.keys, [provider.id]: keyDraft.trim() },
    models: { ...settings.models, [provider.id]: effectiveModel },
  });

  const pickProvider = (id: ProviderId) => onChange({ ...settings, provider: id });

  const save = () => {
    if (!keyDraft.trim()) {
      notify(t("n_api_empty"), "error");
      return;
    }
    onChange(draftSettings());
    notify(t("n_api_saved", { provider: provider.name }), "success");
  };

  const clear = () => {
    const keys = { ...settings.keys };
    delete keys[provider.id];
    onChange({ ...settings, keys });
    setKeyDraft("");
    setOkMs(null);
    notify(t("n_api_removed"), "info");
  };

  const test = async () => {
    if (!keyDraft.trim()) {
      notify(t("n_api_empty"), "error");
      return;
    }
    setTesting(true);
    setOkMs(null);
    try {
      const ms = await testProvider(draftSettings());
      setOkMs(ms);
      notify(t("n_api_ok", { ms: n(ms) }), "success");
    } catch (e) {
      notify(providerErrorMessage(e, t, provider.name), "error");
    } finally {
      setTesting(false);
    }
  };

  const input =
    "w-full rounded-xl border-2 border-pine-900/10 bg-cream px-4 py-2.5 text-sm font-medium text-ink outline-none transition placeholder:text-ink/30 focus:border-pine-700 dark:border-white/10 dark:bg-white/8 dark:text-white dark:placeholder:text-white/30 dark:focus:border-gold-400/60";

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden"
    >
      <div className="mt-3 rounded-2xl bg-cream p-4 ring-1 ring-pine-900/8 sm:p-5 dark:bg-white/5 dark:ring-white/10">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-pine-950 text-gold-400 dark:bg-gold-400 dark:text-pine-950">
            <KeyRound className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="text-[15px] font-black text-pine-950 dark:text-white">{t("api_panel_title")}</p>
            <p className="mt-1 text-[13px] leading-7 text-ink/60 dark:text-white/60">{t("api_panel_desc")}</p>
          </div>
        </div>

        {/* سرویس */}
        <p className="mt-4 text-[13px] font-black text-ink/60 dark:text-white/60">{t("api_provider")}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {PROVIDERS.map((p) => {
            const active = p.id === provider.id;
            const has = !!(settings.keys[p.id] ?? "").trim();
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => pickProvider(p.id)}
                className={cn(
                  "flex items-center gap-2 rounded-xl px-3.5 py-2 text-[13px] font-black transition active:scale-95",
                  active
                    ? "bg-pine-950 text-white shadow-md dark:bg-gold-400 dark:text-pine-950"
                    : "bg-white text-ink/70 ring-1 ring-pine-900/10 hover:text-pine-950 dark:bg-white/8 dark:text-white/70 dark:ring-white/10 dark:hover:text-white"
                )}
              >
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: p.color }} />
                {p.name}
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.5 text-[10px]",
                    active ? "bg-white/15 dark:bg-pine-950/15" : "bg-pine-950/6 dark:bg-white/10"
                  )}
                >
                  {p.free ? t("api_free") : t("api_paid")}
                </span>
                {has && <Check className="h-3.5 w-3.5 text-emerald-500" strokeWidth={3} />}
              </button>
            );
          })}
        </div>

        {/* کلید و مدل */}
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-[13px] font-black text-ink/60 dark:text-white/60">
                {t("api_key_label")}{" "}
                <span className="font-mono text-[11px] text-ink/40 dark:text-white/40" dir="ltr">
                  ({provider.keyHint})
                </span>
              </label>
              <a
                href={provider.keyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[12px] font-black text-clay-600 hover:underline dark:text-gold-400"
              >
                {t("api_get_key")}
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            <div className="relative">
              <input
                value={keyDraft}
                onChange={(e) => {
                  setKeyDraft(e.target.value);
                  setOkMs(null);
                }}
                type={show ? "text" : "password"}
                autoComplete="off"
                spellCheck={false}
                placeholder={t("api_key_placeholder")}
                dir="ltr"
                className={cn(input, "pe-11 text-left font-mono")}
              />
              <button
                type="button"
                onClick={() => setShow((v) => !v)}
                title={show ? t("api_hide") : t("api_show")}
                aria-label={show ? t("api_hide") : t("api_show")}
                className="absolute end-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-ink/45 transition hover:bg-pine-950/5 hover:text-pine-950 dark:text-white/45 dark:hover:bg-white/10 dark:hover:text-white"
              >
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-[13px] font-black text-ink/60 dark:text-white/60">
              {t("api_model")}
            </label>
            <select
              value={modelSel}
              onChange={(e) => {
                setModelSel(e.target.value);
                setOkMs(null);
              }}
              dir="ltr"
              className={cn(input, "cursor-pointer text-left font-mono")}
            >
              {provider.models.map((m) => (
                <option key={m} value={m}>
                  {shortModel(m)}
                  {/:free$/.test(m) ? "  (free)" : ""}
                </option>
              ))}
              <option value={CUSTOM}>{t("api_custom_model")}</option>
            </select>
            {modelSel === CUSTOM && (
              <input
                value={modelCustom}
                onChange={(e) => {
                  setModelCustom(e.target.value);
                  setOkMs(null);
                }}
                placeholder={provider.models[0]}
                dir="ltr"
                spellCheck={false}
                className={cn(input, "mt-2 text-left font-mono")}
              />
            )}
          </div>
        </div>

        {/* دکمه‌ها */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => void test()}
            disabled={testing}
            className="inline-flex items-center gap-1.5 rounded-xl bg-white px-4 py-2.5 text-[13px] font-black text-pine-950 ring-1 ring-pine-900/12 transition hover:bg-sand disabled:opacity-60 dark:bg-white/8 dark:text-white dark:ring-white/12 dark:hover:bg-white/15"
          >
            {testing ? <Loader2 className="h-4 w-4 animate-spin" /> : <PlugZap className="h-4 w-4" />}
            {testing ? t("api_testing") : t("api_test")}
          </button>
          <button
            type="button"
            onClick={save}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-l from-clay-500 to-clay-600 px-5 py-2.5 text-[13px] font-black text-white shadow-lg shadow-clay-500/25 transition hover:-translate-y-0.5"
          >
            <Check className="h-4 w-4" strokeWidth={3} />
            {t("api_save")}
          </button>
          {savedKey && (
            <button
              type="button"
              onClick={clear}
              className="inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2.5 text-[13px] font-black text-red-500 transition hover:bg-red-500/10"
            >
              <Trash2 className="h-4 w-4" />
              {t("api_clear")}
            </button>
          )}
          {okMs !== null && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1.5 text-[12px] font-black text-emerald-600 ring-1 ring-emerald-500/20 dark:text-emerald-400">
              <Check className="h-3.5 w-3.5" strokeWidth={3} />
              {t("n_api_ok", { ms: n(okMs) })}
            </span>
          )}
          {savedKey && okMs === null && (
            <span className="ms-auto text-[12px] font-bold text-emerald-600 dark:text-emerald-400" dir="auto">
              {t("api_ready", { provider: provider.name, model: shortModel(savedModel) })}
            </span>
          )}
        </div>

        {/* نکات */}
        <div className="mt-4 space-y-2">
          <p className="flex items-start gap-2 text-[12px] leading-6 text-ink/55 dark:text-white/55">
            <ShieldCheck className="mt-1 h-4 w-4 shrink-0 text-emerald-500" />
            {t("api_privacy")}
          </p>
          <p className="flex items-start gap-2 text-[12px] leading-6 text-ink/55 dark:text-white/55">
            <AlertTriangle className="mt-1 h-4 w-4 shrink-0 text-amber-500" />
            {t("api_vpn_note")}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
