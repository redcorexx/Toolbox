import { GitBranch, Languages, Moon, Sun } from "lucide-react";
import { GithubIcon } from "./icons";

interface Props {
  theme: "dark" | "light";
  onToggleTheme: () => void;
}

export default function Header({ theme, onToggleTheme }: Props) {
  return (
    <header className="sticky top-0 z-40 border-b border-pine-900/8 bg-cream/85 backdrop-blur-xl dark:border-white/8 dark:bg-pine-950/85">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <a href="#top" className="group flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-clay-500 to-clay-600 text-white shadow-lg shadow-clay-500/25 transition-transform group-hover:rotate-6 group-hover:scale-105">
            <Languages className="h-5 w-5" strokeWidth={2.2} />
          </span>
          <span className="leading-tight">
            <span className="block text-lg font-black text-pine-950 dark:text-white">
              مترجم سلام
            </span>
            <span className="block text-[11px] font-medium text-ink/50 dark:text-white/50">
              رایگان • بدون ثبت‌نام • متن‌باز
            </span>
          </span>
        </a>

        <nav className="hidden items-center gap-1 text-sm font-bold text-ink/60 md:flex dark:text-white/60">
          <a href="#translator" className="rounded-xl px-4 py-2 transition hover:bg-pine-950/5 hover:text-pine-950 dark:hover:bg-white/8 dark:hover:text-white">
            مترجم
          </a>
          <a href="#history" className="rounded-xl px-4 py-2 transition hover:bg-pine-950/5 hover:text-pine-950 dark:hover:bg-white/8 dark:hover:text-white">
            تاریخچه
          </a>
          <a href="#deploy" className="rounded-xl px-4 py-2 transition hover:bg-pine-950/5 hover:text-pine-950 dark:hover:bg-white/8 dark:hover:text-white">
            انتشار در گیت‌هاب
          </a>
          <a href="#source" className="rounded-xl px-4 py-2 transition hover:bg-pine-950/5 hover:text-pine-950 dark:hover:bg-white/8 dark:hover:text-white">
            فایل‌های سورس
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="#deploy"
            className="hidden items-center gap-2 rounded-xl bg-pine-950 px-4 py-2.5 text-[13px] font-black text-white shadow-md transition hover:-translate-y-0.5 hover:bg-clay-600 sm:inline-flex dark:bg-gold-400 dark:text-pine-950 dark:hover:bg-gold-500"
          >
            <GithubIcon className="h-4 w-4" />
            سورس در گیت‌هاب
          </a>
          <a
            href="#deploy"
            aria-label="انتشار در گیت‌هاب"
            className="grid h-10 w-10 place-items-center rounded-xl bg-pine-950 text-white shadow-md transition hover:bg-clay-600 sm:hidden dark:bg-gold-400 dark:text-pine-950"
          >
            <GitBranch className="h-4 w-4" />
          </a>
          <button
            onClick={onToggleTheme}
            aria-label={theme === "dark" ? "حالت روشن" : "حالت تیره"}
            className="grid h-10 w-10 place-items-center rounded-xl bg-pine-950/6 text-pine-950 ring-1 ring-pine-900/10 transition hover:bg-pine-950/10 dark:bg-white/8 dark:text-gold-400 dark:ring-white/10 dark:hover:bg-white/15"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </div>
      </div>
      <nav className="flex items-center gap-1 overflow-x-auto px-4 pb-3 text-[13px] font-black text-ink/60 md:hidden dark:text-white/60">
        <a href="#translator" className="whitespace-nowrap rounded-lg bg-pine-950/5 px-3.5 py-2 dark:bg-white/8">
          مترجم
        </a>
        <a href="#history" className="whitespace-nowrap rounded-lg bg-pine-950/5 px-3.5 py-2 dark:bg-white/8">
          تاریخچه
        </a>
        <a href="#deploy" className="whitespace-nowrap rounded-lg bg-pine-950/5 px-3.5 py-2 dark:bg-white/8">
          انتشار در گیت‌هاب
        </a>
        <a href="#source" className="whitespace-nowrap rounded-lg bg-clay-500/12 px-3.5 py-2 text-clay-600 dark:text-gold-400">
          فایل‌های سورس
        </a>
      </nav>
    </header>
  );
}
