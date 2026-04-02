"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import type { Locale } from "@/shared/types";

const languages: { code: Locale; label: string; flag: string }[] = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
  { code: "uz", label: "O'zbekcha", flag: "🇺🇿" },
  { code: "kz", label: "Қазақша", flag: "🇰🇿" },
];

export function LanguageSwitcher({ currentLang, transparent = false }: { currentLang: Locale; transparent?: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const switchLang = (locale: Locale) => {
    const segments = pathname.split("/");
    segments[1] = locale;
    router.push(segments.join("/"));
    setOpen(false);
  };

  const current = languages.find((l) => l.code === currentLang) || languages[0];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors duration-200 ${
          transparent
            ? "bg-white/10 border-white/20 text-white hover:bg-white/20"
            : "bg-slate-50 border-slate-200/60 text-slate-700 hover:bg-slate-100"
        }`}
      >
        <div className="flex h-6 w-6 items-center justify-center text-base leading-none">{current.flag}</div>
        <span className="hidden sm:inline text-[13px]">{current.label}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.12 }}
            className="absolute right-0 top-full mt-1.5 w-40 rounded-lg bg-white border border-slate-200 shadow-lg shadow-slate-200/50 overflow-hidden z-50"
          >
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => switchLang(lang.code)}
                className={`flex w-full items-center gap-2.5 px-3.5 py-2.5 text-sm transition-colors ${
                  currentLang === lang.code
                    ? "bg-primary/[0.06] text-primary font-medium"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <span className="text-base">{lang.flag}</span>
                {lang.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
