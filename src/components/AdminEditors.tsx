import { useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { PencilSimple, Plus, Trash, X } from "@phosphor-icons/react";
import { useChurch } from "@/context/ChurchContext";
import type { PastorBook } from "@/data";

export function Field({
  label,
  value,
  onChange,
  type = "text",
  rows,
}: {
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  type?: string;
  rows?: number;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-stone-500">{label}</span>
      {rows ? (
        <textarea
          value={value}
          rows={rows}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 outline-none focus:border-emerald-600"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 outline-none focus:border-emerald-600"
        />
      )}
    </label>
  );
}

export function Drawer({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[60] flex justify-end bg-stone-900/50 backdrop-blur-sm" onClick={onClose}>
      <motion.aside
        initial={{ x: 480, opacity: 0.6 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 480, opacity: 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 34 }}
        className="flex h-full w-full max-w-md flex-col bg-stone-50 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-stone-200 bg-white px-5 py-4">
          <h3 className="font-serif text-lg text-stone-900">{title}</h3>
          <button type="button" onClick={onClose} aria-label="Close" className="grid h-9 w-9 place-items-center rounded-lg text-stone-500 hover:bg-stone-100">
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
      </motion.aside>
    </div>
  );
}

export function HeroEditor() {
  const { content, updateHero } = useChurch();
  const { hero } = content;
  return (
    <div className="space-y-4">
      <Field label="Eyebrow" value={hero.eyebrow} onChange={(v) => updateHero({ eyebrow: v })} />
      <Field label="Headline" value={hero.headline} onChange={(v) => updateHero({ headline: v })} rows={2} />
      <Field label="Subtext" value={hero.subtext} onChange={(v) => updateHero({ subtext: v })} rows={3} />
      <div className="grid grid-cols-2 gap-3">
        <Field label="Primary CTA" value={hero.primaryCta} onChange={(v) => updateHero({ primaryCta: v })} />
        <Field label="Secondary CTA" value={hero.secondaryCta} onChange={(v) => updateHero({ secondaryCta: v })} />
      </div>
      <Field label="Verse" value={hero.verse} onChange={(v) => updateHero({ verse: v })} rows={2} />
      <Field label="Verse Reference" value={hero.verseRef} onChange={(v) => updateHero({ verseRef: v })} />
      <p className="rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-800">Changes stay in draft until you publish.</p>
    </div>
  );
}

export function IdentityEditor() {
  const { content, updateIdentity, updateMpesa, updateSocials } = useChurch();
  const { identity } = content;
  return (
    <div className="space-y-4">
      <Field label="Church Name" value={identity.name} onChange={(v) => updateIdentity({ name: v })} />
      <Field label="Short Name" value={identity.shortName} onChange={(v) => updateIdentity({ shortName: v })} />
      <Field label="Tagline" value={identity.tagline} onChange={(v) => updateIdentity({ tagline: v })} rows={2} />
      <Field label="Mission" value={identity.mission} onChange={(v) => updateIdentity({ mission: v })} rows={3} />
      <Field label="Address" value={identity.address} onChange={(v) => updateIdentity({ address: v })} />
      <div className="grid grid-cols-2 gap-3">
        <Field label="Primary Phone" value={identity.phonePrimary} onChange={(v) => updateIdentity({ phonePrimary: v })} />
        <Field label="Secondary Phone" value={identity.phoneSecondary} onChange={(v) => updateIdentity({ phoneSecondary: v })} />
      </div>
      <Field label="Email" value={identity.email} onChange={(v) => updateIdentity({ email: v })} />

      <div className="rounded-xl border border-stone-200 bg-white p-4">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">M-Pesa Paybill</p>
        <div className="mt-3 space-y-3">
          <Field label="Paybill Number" value={identity.mpesa.paybill} onChange={(v) => updateMpesa({ paybill: v })} />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Account Number" value={identity.mpesa.accountNo} onChange={(v) => updateMpesa({ accountNo: v })} />
            <Field label="Account Name" value={identity.mpesa.accountName} onChange={(v) => updateMpesa({ accountName: v })} />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-stone-200 bg-white p-4">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">Social links</p>
        <div className="mt-3 space-y-3">
          <Field label="YouTube" value={identity.socials.youtube} onChange={(v) => updateSocials({ youtube: v })} />
          <Field label="Facebook" value={identity.socials.facebook} onChange={(v) => updateSocials({ facebook: v })} />
          <Field label="Instagram" value={identity.socials.instagram} onChange={(v) => updateSocials({ instagram: v })} />
          <Field label="X (Twitter)" value={identity.socials.twitter} onChange={(v) => updateSocials({ twitter: v })} />
        </div>
      </div>
    </div>
  );
}

const EMPTY_BOOK: PastorBook = {
  id: "",
  title: "",
  subtitle: "",
  author: "Pastor Samuel Kamau",
  priceKes: 1000,
  priceUsd: 8,
  cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80",
  summary: "",
  excerpt: "",
  formats: ["Paperback"],
  featured: false,
  inStock: true,
};

export function BooksEditor() {
  const { content, upsertBook, removeBook } = useChurch();
  const [bookForm, setBookForm] = useState<PastorBook | null>(null);

  const saveBook = () => {
    if (!bookForm) return;
    if (!bookForm.title.trim()) {
      toast.error("A book title is required");
      return;
    }
    const book = { ...bookForm, id: bookForm.id || `b-${Date.now()}` };
    upsertBook(book);
    setBookForm(null);
    toast.success(`"${book.title}" saved to draft`);
  };

  if (bookForm) {
    return (
      <div className="space-y-4">
        <Field label="Title" value={bookForm.title} onChange={(v) => setBookForm({ ...bookForm, title: v })} />
        <Field label="Subtitle" value={bookForm.subtitle} onChange={(v) => setBookForm({ ...bookForm, subtitle: v })} />
        <Field label="Author" value={bookForm.author} onChange={(v) => setBookForm({ ...bookForm, author: v })} />
        <div className="grid grid-cols-2 gap-3">
          <Field label="Price (KES)" type="number" value={bookForm.priceKes} onChange={(v) => setBookForm({ ...bookForm, priceKes: Number(v) || 0 })} />
          <Field label="Price (USD)" type="number" value={bookForm.priceUsd} onChange={(v) => setBookForm({ ...bookForm, priceUsd: Number(v) || 0 })} />
        </div>
        <Field label="Cover image URL" value={bookForm.cover} onChange={(v) => setBookForm({ ...bookForm, cover: v })} />
        <Field label="Summary" value={bookForm.summary} onChange={(v) => setBookForm({ ...bookForm, summary: v })} rows={3} />
        <Field label="Sample excerpt" value={bookForm.excerpt} onChange={(v) => setBookForm({ ...bookForm, excerpt: v })} rows={3} />
        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-sm text-stone-700">
            <input type="checkbox" checked={bookForm.featured} onChange={(e) => setBookForm({ ...bookForm, featured: e.target.checked })} className="h-4 w-4 accent-emerald-700" />
            Featured
          </label>
          <label className="flex items-center gap-2 text-sm text-stone-700">
            <input type="checkbox" checked={bookForm.inStock} onChange={(e) => setBookForm({ ...bookForm, inStock: e.target.checked })} className="h-4 w-4 accent-emerald-700" />
            In stock
          </label>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={saveBook} className="flex-1 rounded-full bg-emerald-700 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800">
            Save book
          </button>
          <button type="button" onClick={() => setBookForm(null)} className="rounded-full border border-stone-300 px-4 py-2.5 text-sm font-semibold text-stone-600">
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => setBookForm({ ...EMPTY_BOOK })}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-emerald-700 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800"
      >
        <Plus size={16} weight="bold" /> Add new book
      </button>
      {content.books.map((b) => (
        <div key={b.id} className="flex items-center gap-3 rounded-xl border border-stone-200 bg-white p-3">
          <img src={b.cover} alt={b.title} className="h-14 w-11 rounded-md object-cover" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-stone-900">{b.title}</p>
            <p className="text-xs text-stone-500">KES {b.priceKes} &middot; {b.inStock ? "In stock" : "Restocking"}</p>
          </div>
          <button type="button" onClick={() => setBookForm(b)} aria-label="Edit book" className="grid h-8 w-8 place-items-center rounded-lg text-stone-500 hover:bg-stone-100">
            <PencilSimple size={16} />
          </button>
          <button
            type="button"
            onClick={() => {
              removeBook(b.id);
              toast.success(`Removed "${b.title}" from draft`);
            }}
            aria-label="Delete book"
            className="grid h-8 w-8 place-items-center rounded-lg text-red-500 hover:bg-red-50"
          >
            <Trash size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}