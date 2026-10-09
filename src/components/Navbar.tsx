import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { List, X, Heart, BookOpen } from "@phosphor-icons/react";
import { useChurch } from "@/context/ChurchContext";

const LINKS = [
  { href: "#home", label: "Home" },
  { href: "#ministries", label: "Ministries" },
  { href: "#sermons", label: "Sermons" },
  { href: "#books", label: "Books" },
  { href: "#giving", label: "Giving" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const { content, isAuthed, previewDraft, hasDrafts } = useChurch();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        scrolled ? "bg-stone-50/90 shadow-sm backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="#home" className="flex items-center gap-2.5">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-700 text-white shadow-sm">
            <BookOpen size={22} weight="fill" />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="font-serif text-[17px] font-semibold tracking-tight text-stone-900">{content.identity.shortName}</span>
            <span className="text-[11px] uppercase tracking-[0.18em] text-emerald-700">Ministries</span>
          </span>
        </a>

        <nav className="hidden items-center gap-7 lg:flex">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="text-sm font-medium text-stone-600 transition hover:text-emerald-700">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {isAuthed && (
            <span
              className={`hidden items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold sm:inline-flex ${
                previewDraft && hasDrafts ? "bg-amber-100 text-amber-800" : "bg-stone-200 text-stone-700"
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${previewDraft && hasDrafts ? "bg-amber-500" : "bg-emerald-500"}`} />
              {previewDraft && hasDrafts ? `Draft preview (${hasDrafts})` : "Live view"}
            </span>
          )}
          <a
            href="#giving"
            className="hidden items-center gap-1.5 rounded-full bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800 active:scale-[0.98] sm:inline-flex"
          >
            <Heart size={16} weight="fill" /> Give
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle navigation"
            className="grid h-10 w-10 place-items-center rounded-lg text-stone-700 lg:hidden"
          >
            {open ? <X size={22} /> : <List size={22} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-stone-200 bg-stone-50 lg:hidden"
          >
            <div className="mx-auto flex max-w-6xl flex-col px-4 py-3">
              {LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="border-b border-stone-100 py-3 text-sm font-medium text-stone-700"
                >
                  {l.label}
                </a>
              ))}
              <a href="#giving" onClick={() => setOpen(false)} className="mt-3 rounded-full bg-emerald-700 py-3 text-center text-sm font-semibold text-white">
                Give Online
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}