import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, CheckCircle, MagnifyingGlass, PaperPlaneTilt, Sparkle, X } from "@phosphor-icons/react";
import { useChurch, EditBadge } from "@/context/ChurchContext";
import type { PastorBook } from "@/data";

function waLink(phone: string, book: PastorBook) {
  const digits = phone.replace(/[^0-9]/g, "");
  const msg = `Hello Grace Sanctuary, I would like to order "${book.title}" (${book.formats[0]}) at KES ${book.priceKes}. Please share payment and delivery details.`;
  return `https://wa.me/${digits}?text=${encodeURIComponent(msg)}`;
}

export default function BooksCatalog() {
  const { content, editMode } = useChurch();
  const { books, identity } = content;
  const [format, setFormat] = useState("All");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<PastorBook | null>(null);

  const formats = useMemo(() => ["All", ...Array.from(new Set(books.flatMap((b) => b.formats)))], [books]);

  const filtered = books.filter((b) => {
    const matchesFormat = format === "All" || b.formats.includes(format);
    const matchesQuery = `${b.title} ${b.subtitle} ${b.author}`.toLowerCase().includes(query.toLowerCase().trim());
    return matchesFormat && matchesQuery;
  });

  return (
    <section id="books" className="relative bg-stone-50 py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative flex flex-wrap items-end justify-between gap-6">
          <EditBadge label="Manage books" panel="books" />
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Pastor's Books</p>
            <h2 className="mt-3 font-serif text-3xl tracking-tight text-stone-900 sm:text-4xl">
              Reading that anchors the soul
            </h2>
            <p className="mt-4 text-stone-600">
              Order any title with M-Pesa or WhatsApp and collect it at the welcome desk after service.
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <label className="flex items-center gap-2 rounded-full border border-stone-300 bg-white px-4 py-2.5">
              <MagnifyingGlass size={16} className="text-stone-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search titles"
                className="w-full bg-transparent text-sm text-stone-800 outline-none placeholder:text-stone-400 sm:w-44"
              />
            </label>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          {formats.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFormat(f)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                format === f ? "bg-emerald-700 text-white shadow-sm" : "border border-stone-300 bg-white text-stone-600 hover:border-emerald-400"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-dashed border-stone-300 bg-white py-16 text-center">
            <BookOpen size={34} className="mx-auto text-stone-300" />
            <p className="mt-4 font-serif text-lg text-stone-700">No titles match your search</p>
            <p className="mt-1 text-sm text-stone-500">Try a different format or clear your search.</p>
          </div>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((b, i) => (
              <motion.article
                key={b.id}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="group flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-stone-200/60"
              >
                <div className="relative h-56 overflow-hidden bg-stone-100">
                  <img src={b.cover} alt={b.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" />
                  {b.featured && (
                    <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-amber-400 px-2.5 py-1 text-[11px] font-bold text-amber-950">
                      <Sparkle size={12} weight="fill" /> Featured
                    </span>
                  )}
                  <span
                    className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                      b.inStock ? "bg-emerald-600 text-white" : "bg-stone-800/80 text-white"
                    }`}
                  >
                    {b.inStock ? "In stock" : "Restocking"}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-serif text-xl leading-snug text-stone-900">{b.title}</h3>
                  <p className="mt-1 text-sm text-stone-500">{b.subtitle}</p>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-stone-600">{b.summary}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <p className="font-serif text-lg font-semibold text-stone-900">KES {b.priceKes.toLocaleString()}</p>
                      <p className="text-xs text-stone-500">USD {b.priceUsd.toFixed(2)}</p>
                    </div>
                    <div className="flex flex-wrap justify-end gap-1.5">
                      {b.formats.map((f) => (
                        <span key={f} className="rounded-md bg-stone-100 px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-stone-500">
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="mt-5 flex gap-2">
                    <button
                      type="button"
                      onClick={() => setSelected(b)}
                      className="flex-1 rounded-full border border-stone-300 py-2.5 text-sm font-semibold text-stone-700 transition hover:border-emerald-500 hover:text-emerald-800 active:scale-[0.98]"
                    >
                      Read excerpt
                    </button>
                    <a
                      href={waLink(identity.phonePrimary, b)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 active:scale-[0.98]"
                    >
                      Order <ArrowRight size={15} weight="bold" />
                    </a>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}

        {editMode && (
          <p className="mt-8 rounded-xl border border-dashed border-emerald-400 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            Edit mode is active. Use the floating admin dock below to add, edit, or reprice any title.
          </p>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-stone-900/70 p-4 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid w-full max-w-3xl overflow-hidden rounded-2xl bg-white sm:grid-cols-2"
            onClick={(e) => e.stopPropagation()}
          >
            <img src={selected.cover} alt={selected.title} className="h-52 w-full object-cover sm:h-full" />
            <div className="relative p-6">
              <button
                type="button"
                onClick={() => setSelected(null)}
                aria-label="Close"
                className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-lg text-stone-500 hover:bg-stone-100"
              >
                <X size={18} />
              </button>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">{selected.author}</p>
              <h3 className="mt-2 font-serif text-2xl leading-snug text-stone-900">{selected.title}</h3>
              <p className="mt-1 text-sm text-stone-500">{selected.subtitle}</p>
              <div className="mt-4 rounded-xl bg-stone-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">Sample excerpt</p>
                <p className="mt-2 font-serif text-[15px] italic leading-relaxed text-stone-700">"{selected.excerpt}"</p>
              </div>
              <div className="mt-5 flex items-center gap-4">
                <span className="font-serif text-xl font-semibold text-stone-900">KES {selected.priceKes.toLocaleString()}</span>
                <span className="text-sm text-stone-500">USD {selected.priceUsd.toFixed(2)}</span>
                {selected.inStock ? (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
                    <CheckCircle size={15} weight="fill" /> Available
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-stone-500">Restocking soon</span>
                )}
              </div>
              <a
                href={waLink(identity.phonePrimary, selected)}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-emerald-700 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 active:scale-[0.98]"
              >
                <PaperPlaneTilt size={16} weight="fill" /> Order via WhatsApp
              </a>
              <p className="mt-3 text-center text-xs text-stone-500">
                Or pay via M-Pesa Paybill {identity.mpesa.paybill} using account {identity.mpesa.accountNo}.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
}