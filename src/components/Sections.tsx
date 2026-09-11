import { useState } from "react";
import { motion } from "framer-motion";
import {
  Check,
  Copy,
  FileCode2,
  Heart,
  Languages,
  Rocket,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { GithubIcon } from "./icons";
import { toFa, type Notify } from "../lib/translator";

function CodeBlock({ code, notify }: { code: string; notify: Notify }) {
  const [done, setDone] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = code;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setDone(true);
    notify("دستورات کپی شد", "success");
    setTimeout(() => setDone(false), 1500);
  };
  return (
    <div className="relative mt-3 overflow-hidden rounded-2xl bg-black/40 ring-1 ring-white/10" dir="ltr">
      <button
        onClick={copy}
        className="absolute right-3 top-3 flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-white/20"
      >
        {done ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
        {done ? "کپی شد" : "کپی"}
      </button>
      <pre className="overflow-x-auto p-4 pt-11 font-mono text-[13px] leading-7 text-emerald-200">
        {code}
      </pre>
    </div>
  );
}

export function Features() {
  const items = [
    {
      icon: Zap,
      title: "سریع، رایگان، بدون ثبت‌نام",
      desc: "فقط بنویس و ترجمه بگیر. با API آزاد MyMemory بیش از ۲۰ زبان پشتیبانی می‌شود؛ متن‌های طولانی هم خودکار تکه‌تکه ترجمه می‌شوند.",
    },
    {
      icon: ShieldCheck,
      title: "حریم خصوصی تو دست خودته",
      desc: "تاریخچه، علاقه‌مندی‌ها و تنظیمات فقط داخل مرورگر خودت (LocalStorage) ذخیره می‌شود و هیچ سروری آن‌ها را نمی‌بیند.",
    },
    {
      icon: GithubIcon,
      title: "متن‌باز و آماده گیت‌هاب",
      desc: "خروجی نهایی فقط یک فایل HTML است؛ روی گیت‌هاب پیجز، Netlify یا هر هاست دیگری بدون هیچ تنظیمی اجرا می‌شود.",
    },
  ];
  return (
    <section className="mx-auto max-w-6xl px-4 pt-16 sm:px-6">
      <div className="grid gap-4 md:grid-cols-3">
        {items.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-pine-900/8 transition hover:-translate-y-1 hover:shadow-lg dark:bg-white/[0.04] dark:ring-white/10"
          >
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-pine-800 to-pine-950 text-gold-400 shadow-md dark:from-gold-400 dark:to-gold-500 dark:text-pine-950">
              <f.icon className="h-5 w-5" />
            </span>
            <h3 className="mt-4 text-[16px] font-black text-pine-950 dark:text-white">
              {f.title}
            </h3>
            <p className="mt-2 text-sm leading-7 text-ink/60 dark:text-white/60">
              {f.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

const BUILD_CMD = "npm run build";
const GIT_CMDS = `git add .
git commit -m "salam translator"
git branch -M main
git remote add origin https://github.com/USERNAME/salam-translator.git
git push -u origin main`;

export function Deploy({ notify }: { notify: Notify }) {
  return (
    <section id="deploy" className="mx-auto max-w-6xl scroll-mt-24 px-4 pt-16 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6 }}
        className="grain relative overflow-hidden rounded-[2rem] bg-pine-950 p-7 text-white shadow-2xl sm:p-10"
      >
        <div className="pattern-girih absolute inset-0" />
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-clay-600/25 blur-[100px]" />
        <div className="absolute -right-24 -bottom-24 h-72 w-72 rounded-full bg-gold-500/15 blur-[100px]" />

        <div className="relative">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10 text-gold-400 ring-1 ring-white/15">
              <Rocket className="h-6 w-6" />
            </span>
            <div>
              <h2 className="text-2xl font-black">انتشار روی گیت‌هاب در ۳ قدم</h2>
              <p className="mt-1 text-sm text-white/55">
                این پروژه آماده انتشار است؛ فقط قدم‌های زیر را برو:
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            <div className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-clay-500 text-lg font-black text-white shadow-lg">
                {toFa(1)}
              </span>
              <h3 className="mt-4 text-[16px] font-black">بیلد بگیر</h3>
              <p className="mt-1.5 text-[13px] leading-7 text-white/60">
                با این دستور، کل سایت تبدیل به یک فایل <code dir="ltr" className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[12px] text-gold-400">dist/index.html</code> می‌شود:
              </p>
              <CodeBlock code={BUILD_CMD} notify={notify} />
            </div>

            <div className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-clay-500 text-lg font-black text-white shadow-lg">
                {toFa(2)}
              </span>
              <h3 className="mt-4 text-[16px] font-black">پوش کن به گیت‌هاب</h3>
              <p className="mt-1.5 text-[13px] leading-7 text-white/60">
                یک ریپوی جدید بساز، بعد این دستورات را اجرا کن (به‌جای <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[12px] text-gold-400">USERNAME</code> یوزرنیم خودت را بگذار):
              </p>
              <CodeBlock code={GIT_CMDS} notify={notify} />
            </div>

            <div className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-clay-500 text-lg font-black text-white shadow-lg">
                {toFa(3)}
              </span>
              <h3 className="mt-4 text-[16px] font-black">پیجز را فعال کن</h3>
              <p className="mt-1.5 text-[13px] leading-7 text-white/60">
                دو راه داری:
              </p>
              <ul className="mt-3 space-y-3 text-[13px] leading-7 text-white/75">
                <li className="rounded-2xl bg-white/5 p-3 ring-1 ring-white/10">
                  <strong className="text-gold-400">راه آسان:</strong> فایل{" "}
                  <code dir="ltr" className="font-mono text-[12px]">dist/index.html</code> را
                  در ریشه ریپو آپلود کن، بعد از مسیر <code className="font-mono text-[12px]" dir="ltr">Settings → Pages → Deploy from branch → main</code> پیجز را روشن کن.
                </li>
                <li className="rounded-2xl bg-white/5 p-3 ring-1 ring-white/10">
                  <strong className="text-gold-400">راه حرفه‌ای:</strong> با GitHub Actions
                  روی هر پوش، خودکار بیلد بگیر و روی پیجز منتشر کن.
                </li>
              </ul>
            </div>
          </div>

          <p className="mt-6 rounded-2xl bg-emerald-400/10 p-4 text-center text-sm leading-8 font-bold text-emerald-200 ring-1 ring-emerald-400/20">
            چون خروجی نهایی تک‌فایل است، روی آدرس‌هایی مثل{" "}
            <code dir="ltr" className="font-mono">username.github.io/repo</code> بدون هیچ
            تنظیم اضافه‌ای کار می‌کند.
          </p>
          <div className="mt-5 text-center">
            <a
              href="#source"
              className="inline-flex items-center gap-2 rounded-2xl bg-gold-400 px-6 py-3 text-sm font-black text-pine-950 shadow-lg transition hover:-translate-y-0.5 hover:bg-gold-500"
            >
              <FileCode2 className="h-4 w-4" />
              git بلد نیستی؟ هر ۲۰ فایل را یکی‌یکی از اینجا کپی کن
            </a>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

export function Footer() {
  const year = new Date().toLocaleDateString("fa-IR", { year: "numeric" });
  return (
    <footer className="mt-16 border-t border-pine-900/8 dark:border-white/8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-center sm:flex-row sm:text-start sm:px-6">
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-clay-500 to-clay-600 text-white">
            <Languages className="h-4 w-4" />
          </span>
          <span className="text-[15px] font-black text-pine-950 dark:text-white">
            مترجم سلام
          </span>
        </div>
        <p className="text-[13px] font-medium leading-7 text-ink/50 dark:text-white/50">
          قدرت‌گرفته از API رایگان MyMemory • تاریخچه فقط در مرورگر تو ذخیره می‌شود
        </p>
        <p className="flex items-center gap-1.5 text-[13px] font-bold text-ink/60 dark:text-white/60">
          {year} • ساخته‌شده با
          <Heart className="h-4 w-4 fill-clay-500 text-clay-500" />
        </p>
      </div>
    </footer>
  );
}
