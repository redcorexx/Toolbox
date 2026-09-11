/* ============================================================
   دوزبانه‌سازی رابط کاربری (فارسی / English)
   هر کلید یک متن فارسی و یک متن انگلیسی دارد.
   برای تغییر یا اصلاح متن‌ها فقط همین فایل را ویرایش کن.
   ============================================================ */
import { createContext, useContext } from "react";
import { langByCode, toFa } from "./translator";

export type UiLang = "fa" | "en";
export const UI_LANG_KEY = "salam-tr-lang";

export const dict = {
  /* ---------- عمومی ---------- */
  doc_title: { fa: "مترجم متن | ترجمه فارسی به انگلیسی و بالعکس", en: "Text Translator | Persian ↔ English & 20+ languages" },
  brand: { fa: "مترجم متن", en: "Text Translator" },
  tagline: { fa: "رایگان • بدون ثبت‌نام • متن‌باز", en: "Free • No sign-up • Open source" },
  copy: { fa: "کپی", en: "Copy" },
  copied: { fa: "کپی شد", en: "Copied" },
  save: { fa: "ذخیره", en: "Save" },
  delete: { fa: "حذف", en: "Delete" },
  lang_switch: { fa: "Switch to English", en: "تغییر به فارسی" },
  lang_switch_label: { fa: "EN", en: "فارسی" },

  /* ---------- هدر ---------- */
  nav_translator: { fa: "مترجم", en: "Translator" },
  nav_history: { fa: "تاریخچه", en: "History" },
  nav_deploy: { fa: "انتشار در گیت‌هاب", en: "Deploy to GitHub" },
  nav_source: { fa: "فایل‌های سورس", en: "Source files" },
  github_btn: { fa: "سورس در گیت‌هاب", en: "Source on GitHub" },
  theme_light: { fa: "حالت روشن", en: "Light mode" },
  theme_dark: { fa: "حالت تیره", en: "Dark mode" },

  /* ---------- هیرو ---------- */
  hero_badge: { fa: "{n} زبان • ترجمه خودکار • ورودی صوتی", en: "{n} languages • Auto-translate • Voice input" },
  hero_title_before: { fa: "هر متنی را در یک چشم‌به‌هم‌زدن", en: "Translate any text" },
  hero_title_accent: { fa: "ترجمه", en: "in a blink" },
  hero_title_after: { fa: "کن", en: "" },
  hero_desc: {
    fa: "فارسی به انگلیسی و بالعکس، به‌علاوه بیش از {n} زبان دیگر — رایگان، بدون ثبت‌نام، با تاریخچه و تلفظ صوتی.",
    en: "Persian ↔ English plus {n}+ other languages — free, no sign-up, with history and text-to-speech.",
  },
  hero_cta_start: { fa: "شروع ترجمه", en: "Start translating" },
  hero_cta_files: { fa: "دریافت فایل‌های گیت‌هاب", en: "Get GitHub files" },

  /* ---------- مترجم ---------- */
  try_it: { fa: "امتحان کن:", en: "Try:" },
  engine_title: { fa: "موتور ترجمه", en: "Translation engine" },
  swap_langs: { fa: "جابه‌جایی زبان‌ها", en: "Swap languages" },
  source_label: { fa: "متن مبدأ", en: "Source text" },
  detected: { fa: "تشخیص: {lang}", en: "Detected: {lang}" },
  input_placeholder: { fa: "متنت را اینجا بنویس، بچسبان یا با میکروفون بخوان...", en: "Type, paste, or dictate your text here..." },
  counter: { fa: "{chars} / {max} حرف • {words} کلمه", en: "{chars} / {max} chars • {words} words" },
  btn_mic: { fa: "ورودی صوتی", en: "Voice input" },
  btn_paste: { fa: "چسباندن از کلیپ‌بورد", en: "Paste from clipboard" },
  btn_speak_src: { fa: "خواندن متن مبدأ", en: "Read source aloud" },
  btn_clear: { fa: "پاک کردن", en: "Clear" },
  target_label: { fa: "ترجمه ({lang})", en: "Translation ({lang})" },
  via_engine: { fa: "با {engine}", en: "via {engine}" },
  btn_speak_tgt: { fa: "خواندن ترجمه", en: "Read translation aloud" },
  btn_copy_tr: { fa: "کپی ترجمه", en: "Copy translation" },
  output_placeholder: { fa: "ترجمه اینجا نمایش داده می‌شود...", en: "Translation will appear here..." },
  long_progress: { fa: "متن طولانی است؛ در حال ترجمه بخش {done} از {total}...", en: "Long text — translating part {done} of {total}..." },
  alternatives_title: { fa: "ترجمه‌های جایگزین (برای کپی بزن روشون):", en: "Alternative translations (tap to copy):" },
  auto_translate: { fa: "ترجمه خودکار", en: "Auto-translate" },
  quota_btn: { fa: "افزایش سهمیه MyMemory", en: "Increase MyMemory quota" },
  translating: { fa: "در حال ترجمه...", en: "Translating..." },
  translate_btn: { fa: "ترجمه کن", en: "Translate" },
  email_hint: {
    fa: "سهمیه رایگان روزانه محدود است. با ثبت ایمیل (فقط در مرورگر تو ذخیره می‌شود)، سهمیه‌ات چند برابر می‌شود:",
    en: "The free daily quota is limited. Add your email (stored only in your browser) to multiply it:",
  },
  stat_today: { fa: "ترجمه امروز", en: "Translated today" },
  stat_total: { fa: "کل ترجمه‌ها", en: "Total translations" },
  stat_chars: { fa: "حروف ترجمه‌شده", en: "Characters translated" },
  stat_langs: { fa: "زبان پشتیبانی‌شده", en: "Supported languages" },

  /* ---------- خروجی PDF ---------- */
  btn_pdf: { fa: "دانلود ترجمه به‌صورت PDF", en: "Download translation as PDF" },
  pdf_subtitle: { fa: "ترجمه سریع و دقیق", en: "Fast & accurate translation" },
  pdf_translation: { fa: "ترجمه", en: "Translation" },
  pdf_source_lang: { fa: "زبان مبدأ", en: "Source language" },
  pdf_target_lang: { fa: "زبان مقصد", en: "Target language" },
  pdf_datetime: { fa: "تاریخ و زمان", en: "Date & time" },
  pdf_continued: { fa: "ادامه", en: "continued" },
  pdf_page: { fa: "صفحه {a} از {b}", en: "Page {a} of {b}" },
  n_pdf_done: { fa: "فایل PDF ترجمه دانلود شد", en: "Translation PDF downloaded" },
  n_pdf_err: { fa: "ساخت PDF ناموفق بود؛ دوباره تلاش کن", en: "Couldn't create the PDF; please try again" },

  /* ---------- اعلان‌ها ---------- */
  n_target_changed: { fa: "زبان مقصد خودکار به «{lang}» تغییر کرد", en: "Target language switched to “{lang}”" },
  n_fallback: { fa: "{engine} پاسخ نداد؛ با MyMemory ترجمه می‌شود", en: "{engine} didn't respond; falling back to MyMemory" },
  n_quota: { fa: "سهمیه روزانه MyMemory تمام شد! ایمیلت را ثبت کن یا موتور را روی «گوگل» بگذار", en: "MyMemory daily quota exhausted! Add your email or switch the engine to Google" },
  n_blocked: { fa: "گوگل موقتاً دسترسی را محدود کرده؛ موتور را روی «خودکار» یا MyMemory بگذار", en: "Google temporarily limited access; switch to “Auto” or MyMemory" },
  n_network: { fa: "اتصال اینترنت را بررسی کن یا موتور ترجمه را عوض کن", en: "Check your internet connection or switch the engine" },
  n_generic: { fa: "خطایی رخ داد؛ دوباره تلاش کن یا موتور ترجمه را عوض کن", en: "Something went wrong; try again or switch the engine" },
  n_no_stt: { fa: "مرورگر شما از ورودی صوتی پشتیبانی نمی‌کند (پیشنهاد: کروم)", en: "Your browser doesn't support voice input (try Chrome)" },
  n_listening: { fa: "در حال گوش دادن... صحبت کن", en: "Listening... speak now" },
  n_copied: { fa: "متن کپی شد", en: "Copied to clipboard" },
  n_clip_empty: { fa: "کلیپ‌بورد خالی است", en: "Clipboard is empty" },
  n_clip_denied: { fa: "مرورگر اجازه دسترسی به کلیپ‌بورد نداد", en: "Clipboard access was denied" },
  n_email_invalid: { fa: "ایمیل معتبر وارد کن", en: "Enter a valid email" },
  n_email_saved: { fa: "ایمیل ذخیره شد؛ سهمیه‌ات بیشتر شد", en: "Email saved — your quota is increased" },
  n_email_removed: { fa: "ایمیل حذف شد", en: "Email removed" },
  n_history_cleared: { fa: "تاریخچه پاک شد", en: "History cleared" },
  n_confirm_clear: { fa: "برای تایید پاک‌سازی، دوباره بزن", en: "Tap again to confirm" },
  n_cmds_copied: { fa: "دستورات کپی شد", en: "Commands copied" },
  n_file_copied: { fa: "فایل {path} کپی شد", en: "{path} copied" },
  n_file_downloaded: { fa: "فایل {path} دانلود شد", en: "{path} downloaded" },
  n_zip_done: { fa: "فایل ZIP همه سورس‌ها دانلود شد", en: "Source ZIP downloaded" },
  n_zip_err: { fa: "خطا در ساخت ZIP؛ دوباره تلاش کن", en: "Failed to build ZIP; try again" },

  /* ---------- انتخاب زبان ---------- */
  auto_detect: { fa: "تشخیص خودکار", en: "Auto-detect" },
  search_lang: { fa: "جست‌وجوی زبان...", en: "Search languages..." },
  no_lang: { fa: "زبانی پیدا نشد", en: "No language found" },

  /* ---------- تاریخچه ---------- */
  history_title: { fa: "تاریخچه ترجمه‌ها", en: "Translation history" },
  clear_all: { fa: "پاک کردن همه", en: "Clear all" },
  clear_confirm: { fa: "مطمئنی؟ پاک کن!", en: "Sure? Clear!" },
  tab_all: { fa: "همه ({n})", en: "All ({n})" },
  tab_fav: { fa: "علاقه‌مندی‌ها ({n})", en: "Favorites ({n})" },
  empty_fav_title: { fa: "هنوز چیزی را نشان نکرده‌ای", en: "No favorites yet" },
  empty_all_title: { fa: "هنوز ترجمه‌ای انجام نشده", en: "No translations yet" },
  empty_fav_desc: { fa: "روی ستاره هر ترجمه بزن تا اینجا ذخیره شود و همیشه در دسترست باشد.", en: "Tap the star on any translation to keep it here." },
  empty_all_desc: { fa: "اولین متنت را بالا بنویس تا ترجمه شود و تاریخچه‌ات اینجا ساخته شود.", en: "Type your first text above and your history will appear here." },
  reuse: { fa: "استفاده مجدد", en: "Reuse" },
  fav_add: { fa: "افزودن به علاقه‌مندی‌ها", en: "Add to favorites" },
  fav_remove: { fa: "حذف از علاقه‌مندی‌ها", en: "Remove from favorites" },
  favorite: { fa: "علاقه‌مندی", en: "Favorite" },

  /* ---------- ویژگی‌ها ---------- */
  f1_title: { fa: "دو موتور ترجمه: گوگل و MyMemory", en: "Two engines: Google & MyMemory" },
  f1_desc: {
    fa: "بین موتور گوگل (کیفیت بالا) و MyMemory انتخاب کن، یا حالت خودکار را بگذار تا اگر یکی جواب نداد، دیگری ترجمه کند. متن‌های طولانی هم خودکار تکه‌تکه ترجمه می‌شوند.",
    en: "Pick Google (high quality) or MyMemory, or use Auto so one takes over if the other fails. Long texts are split and translated automatically.",
  },
  f2_title: { fa: "حریم خصوصی تو دست خودته", en: "Your privacy, your control" },
  f2_desc: {
    fa: "تاریخچه، علاقه‌مندی‌ها و تنظیمات فقط داخل مرورگر خودت (LocalStorage) ذخیره می‌شود و هیچ سروری آن‌ها را نمی‌بیند.",
    en: "History, favorites and settings live only in your browser (LocalStorage) — no server ever sees them.",
  },
  f3_title: { fa: "متن‌باز و آماده گیت‌هاب", en: "Open source & GitHub-ready" },
  f3_desc: {
    fa: "خروجی نهایی فقط یک فایل HTML است؛ روی گیت‌هاب پیجز، Netlify یا هر هاست دیگری بدون هیچ تنظیمی اجرا می‌شود.",
    en: "The build is a single HTML file that runs on GitHub Pages, Netlify or any host with zero config.",
  },

  /* ---------- انتشار ---------- */
  deploy_title: { fa: "انتشار روی گیت‌هاب در ۳ قدم", en: "Deploy to GitHub in 3 steps" },
  deploy_sub: { fa: "این پروژه آماده انتشار است؛ فقط قدم‌های زیر را برو:", en: "This project is deploy-ready — just follow these steps:" },
  step1_title: { fa: "بیلد بگیر", en: "Build it" },
  step1_desc: { fa: "این دستور کل سایت را به یک فایل dist/index.html تبدیل می‌کند:", en: "This command bundles the whole site into a single dist/index.html:" },
  step2_title: { fa: "پوش کن به گیت‌هاب", en: "Push to GitHub" },
  step2_desc: { fa: "یک ریپوی جدید بساز، بعد این دستورات را اجرا کن (به‌جای USERNAME یوزرنیم خودت را بگذار):", en: "Create a new repo, then run these commands (replace USERNAME with yours):" },
  step3_title: { fa: "پیجز را فعال کن", en: "Enable Pages" },
  step3_desc: { fa: "دو راه داری:", en: "You have two options:" },
  easy_label: { fa: "راه آسان:", en: "Easy way:" },
  easy_text: {
    fa: "فایل dist/index.html را در ریشه ریپو آپلود کن، بعد از Settings → Pages → Deploy from branch → main پیجز را روشن کن.",
    en: "upload dist/index.html to the repo root, then enable Pages via Settings → Pages → Deploy from branch → main.",
  },
  pro_label: { fa: "راه حرفه‌ای:", en: "Pro way:" },
  pro_text: { fa: "با GitHub Actions روی هر پوش، خودکار بیلد بگیر و روی پیجز منتشر کن.", en: "let GitHub Actions build and deploy to Pages automatically on every push." },
  single_file_note: {
    fa: "چون خروجی نهایی تک‌فایل است، روی آدرس‌هایی مثل username.github.io/repo بدون هیچ تنظیم اضافه‌ای کار می‌کند.",
    en: "Since the build is a single file, it works at URLs like username.github.io/repo with no extra config.",
  },
  deploy_files_btn: { fa: "git بلد نیستی؟ همه فایل‌ها را یکی‌یکی از اینجا کپی کن", en: "Not into git? Copy every file one by one here" },

  /* ---------- فوتر ---------- */
  footer_powered: { fa: "قدرت‌گرفته از موتورهای ترجمه گوگل و MyMemory • تاریخچه فقط در مرورگر تو ذخیره می‌شود", en: "Powered by Google & MyMemory • History is stored only in your browser" },
  footer_made: { fa: "ساخته‌شده با", en: "Made with" },

  /* ---------- مرکز کپی فایل‌ها ---------- */
  src_badge: { fa: "مرکز کپی فایل‌ها", en: "File copy center" },
  src_title: { fa: "هر {n} فایل، به ترتیب، آماده کپی", en: "All {n} files, in order, ready to copy" },
  src_desc: {
    fa: "بدون نیاز به git و ترمینال؛ از همین‌جا یکی‌یکی کپی کن و در ریپوی گیت‌هابت بچسبان. ترتیب کارت‌ها همان ترتیب پیشنهادی ساخت فایل‌هاست.",
    en: "No git or terminal needed — copy each file here and paste it into your GitHub repo. Cards are in the recommended creation order.",
  },
  zip_btn: { fa: "دانلود یک‌جای همه فایل‌ها (ZIP)", en: "Download all files (ZIP)" },
  zip_building: { fa: "در حال ساخت ZIP...", en: "Building ZIP..." },
  zip_hint: {
    fa: "راحت‌ترین راه: ZIP را دانلود کن، از حالت فشرده خارج کن، بعد همه فایل‌ها و پوشه‌ها را یک‌جا با درگ‌ودراپ داخل ریپوی گیت‌هابت آپلود کن.",
    en: "Easiest way: download the ZIP, extract it, then drag & drop all files and folders into your GitHub repo at once.",
  },
  steps_title: { fa: "روش کپی دستی در سایت گیت‌هاب (بدون git)", en: "Manual copy on github.com (no git)" },
  step_1: { fa: "در سایت گیت‌هاب، یک ریپوی جدید و Public بساز (اسم پیشنهادی: salam-translator).", en: "On GitHub, create a new Public repository (suggested name: salam-translator)." },
  step_2: { fa: "داخل ریپو، دکمه Add file و بعد Create new file را بزن.", en: "Inside the repo, click “Add file” → “Create new file”." },
  step_3: { fa: "در کادر نام فایل، دقیقاً همان مسیری را بنویس که بالای هر کارت هست — مثلاً src/App.tsx (گیت‌هاب خودش پوشه‌ها را می‌سازد).", en: "In the filename box, type the exact path shown on each card — e.g. src/App.tsx (GitHub creates the folders for you)." },
  step_4: { fa: "با دکمه «کپی» همان کارت، محتوای فایل را بردار، در کادر بزرگ بچسبان و Commit changes را بزن.", en: "Click “Copy” on that card, paste the content into the big editor and hit “Commit changes”." },
  step_5: { fa: "به همین ترتیب برای هر {n} فایل تکرار کن و هر کدام را که گذاشتی، دکمه «گذاشتم» را بزن تا چیزی جا نماند.", en: "Repeat for all {n} files, ticking “Uploaded” on each so nothing is missed." },
  step_6: { fa: "در آخر از مسیر Settings ← Pages گزینه GitHub Actions را انتخاب کن؛ بعد از ۱-۲ دقیقه سایتت بالا می‌آید.", en: "Finally go to Settings → Pages and choose GitHub Actions; your site goes live in 1–2 minutes." },
  steps_note: {
    fa: "نکته: فایل‌هایی که با نقطه شروع می‌شوند (.gitignore) یا داخل پوشه‌اند (.github/workflows/...) هم دقیقاً با همین روش و با همان مسیر کامل ساخته می‌شوند — فقط مسیر کامل را در کادر نام فایل بنویس.",
    en: "Note: files starting with a dot (.gitignore) or inside folders (.github/workflows/...) are created the same way — just type the full path in the filename box.",
  },
  progress: { fa: "{done} از {total} فایل گذاشته شده", en: "{done} of {total} files uploaded" },
  pct: { fa: "({n}٪)", en: "({n}%)" },
  show_all: { fa: "نمایش همه کدها", en: "Show all code" },
  hide_all: { fa: "بستن همه کدها", en: "Hide all code" },
  reset: { fa: "شروع دوباره", en: "Reset" },
  all_done: { fa: "آفرین! همه فایل‌ها گذاشته شد. حالا فقط کافی است از Settings ← Pages گزینه GitHub Actions را فعال کنی.", en: "All files uploaded — nice! Now just enable GitHub Actions under Settings → Pages." },
  lines: { fa: "{n} خط", en: "{n} lines" },
  changed_badge: { fa: "🔄 تغییر کرده: {what}", en: "🔄 Changed: {what}" },
  new_badge: { fa: "✨ فایل جدید: {what}", en: "✨ New file: {what}" },
  done_yes: { fa: "گذاشتم", en: "Uploaded" },
  done_ask: { fa: "گذاشتم؟", en: "Uploaded?" },
  download_file: { fa: "دانلود فایل", en: "Download file" },
  show_code: { fa: "نمایش کد", en: "Show code" },
  hide: { fa: "بستن", en: "Hide" },
} as const;

export type DictKey = keyof typeof dict;
export type Vars = Record<string, string | number>;

export function translate(lang: UiLang, key: DictKey, vars?: Vars): string {
  let s: string = dict[key][lang];
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      s = s.split(`{${k}}`).join(String(v));
    }
  }
  return s;
}

export interface I18n {
  lang: UiLang;
  dir: "rtl" | "ltr";
  isFa: boolean;
  setLang: (l: UiLang) => void;
  toggle: () => void;
  /** متن ترجمه‌شده */
  t: (key: DictKey, vars?: Vars) => string;
  /** عدد: در فارسی با ارقام فارسی، در انگلیسی با ارقام لاتین */
  n: (v: string | number) => string;
  /** نام یک زبان (fa / en) با کد آن */
  ln: (code: string) => string;
}

export function createI18n(lang: UiLang, setLang: (l: UiLang) => void): I18n {
  return {
    lang,
    dir: lang === "fa" ? "rtl" : "ltr",
    isFa: lang === "fa",
    setLang,
    toggle: () => setLang(lang === "fa" ? "en" : "fa"),
    t: (key, vars) => translate(lang, key, vars),
    n: (v) => (lang === "fa" ? toFa(v) : String(v)),
    ln: (code) => langByCode(code)[lang],
  };
}

export function readStoredLang(): UiLang {
  try {
    return localStorage.getItem(UI_LANG_KEY) === "en" ? "en" : "fa";
  } catch {
    return "fa";
  }
}

export const I18nContext = createContext<I18n>(createI18n("fa", () => {}));
export const useI18n = () => useContext(I18nContext);
