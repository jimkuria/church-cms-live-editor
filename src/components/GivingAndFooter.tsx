import { useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  CheckCircle,
  Clock,
  Copy,
  Cross,
  DeviceMobile,
  EnvelopeSimple,
  Heart,
  MapPin,
  PaperPlaneTilt,
  Phone,
  ShareNetwork,
} from "@phosphor-icons/react";
import { useChurch, EditBadge } from "@/context/ChurchContext";

function CopyField({ label, value }: { label: string; value: string }) {
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success(`${label} copied`);
    } catch {
      toast.error("Could not copy to clipboard");
    }
  };
  return (
    <button
      type="button"
      onClick={copy}
      className="flex w-full items-center justify-between rounded-xl border border-emerald-700/40 bg-emerald-950/30 px-4 py-3 text-left transition hover:border-emerald-400 active:scale-[0.99]"
    >
      <span>
        <span className="block text-[11px] uppercase tracking-wider text-emerald-200/70">{label}</span>
        <span className="font-mono text-lg font-semibold tracking-wide text-white">{value}</span>
      </span>
      <Copy size={18} className="text-emerald-300" />
    </button>
  );
}

export default function GivingAndFooter() {
  const { content, openPanel, isAuthed } = useChurch();
  const { identity, givingTypes } = content;
  const [activeType, setActiveType] = useState(givingTypes[0]?.id ?? "");
  const current = givingTypes.find((g) => g.id === activeType) ?? givingTypes[0];

  const socials = [
    { label: "YouTube", url: identity.socials.youtube },
    { label: "Facebook", url: identity.socials.facebook },
    { label: "Instagram", url: identity.socials.instagram },
    { label: "X (Twitter)", url: identity.socials.twitter },
  ].filter((s) => s.url);

  return (
    <>
      <section id="giving" className="relative bg-emerald-950 py-20 text-emerald-50">
        <div className="pointer-events-none absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "28px 28px" }} />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <div className="relative max-w-2xl">
            <EditBadge label="Edit giving" panel="identity" />
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">Giving & Tithes</p>
            <h2 className="mt-3 font-serif text-3xl tracking-tight text-white sm:text-4xl">Give with joy, give with purpose</h2>
            <p className="mt-4 text-emerald-100/80">
              Every gift fuels worship, outreach, and the new sanctuary. Choose a fund below and give securely by M-Pesa.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap gap-2">
            {givingTypes.map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() => setActiveType(g.id)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  activeType === g.id ? "bg-amber-400 text-emerald-950" : "border border-emerald-700/60 text-emerald-100 hover:border-amber-300"
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.5 }} className="rounded-2xl border border-emerald-800 bg-emerald-900/50 p-6">
              <div className="flex items-center gap-2 text-sm font-semibold text-amber-300">
                <DeviceMobile size={18} weight="bold" /> M-Pesa Paybill
              </div>
              <p className="mt-2 text-sm text-emerald-100/80">{current?.label} - {current?.description}</p>
              <div className="mt-5 grid gap-3">
                <CopyField label="Paybill Number" value={identity.mpesa.paybill} />
                <CopyField label="Account Number" value={identity.mpesa.accountNo} />
                <div className="rounded-xl border border-emerald-700/40 bg-emerald-950/30 px-4 py-3">
                  <span className="block text-[11px] uppercase tracking-wider text-emerald-200/70">Account Name</span>
                  <span className="text-lg font-semibold text-white">{identity.mpesa.accountName}</span>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.5, delay: 0.08 }} className="rounded-2xl border border-emerald-800 bg-emerald-900/50 p-6">
              <div className="flex items-center gap-2 text-sm font-semibold text-amber-300">
                <Heart size={18} weight="fill" /> How to give in 4 steps
              </div>
              <ol className="mt-5 space-y-4">
                {[
                  `Open M-Pesa on your phone and select "Lipa na M-Pesa".`,
                  `Choose "Pay Bill" and enter business number ${identity.mpesa.paybill}.`,
                  `Enter account number ${identity.mpesa.accountNo} for a ${current?.label ?? "gift"}.`,
                  "Enter your amount, confirm with your PIN, and keep the SMS receipt.",
                ].map((step, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-amber-400 text-sm font-bold text-emerald-950">{i + 1}</span>
                    <span className="text-sm leading-relaxed text-emerald-50/90">{step}</span>
                  </li>
                ))}
              </ol>
              <a
                href={`tel:${identity.phonePrimary.replace(/\s/g, "")}`}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-amber-400 px-5 py-3 text-sm font-semibold text-emerald-950 transition hover:bg-amber-300 active:scale-[0.98]"
              >
                <Phone size={16} weight="fill" /> Need help? Call the office
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="contact" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="relative grid gap-8 lg:grid-cols-5">
          <EditBadge label="Edit contacts" panel="identity" />
          <div className="lg:col-span-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Contact & Location</p>
            <h2 className="mt-3 font-serif text-3xl tracking-tight text-stone-900 sm:text-4xl">Come and worship with us</h2>
            <p className="mt-4 max-w-[60ch] text-stone-600">
              We are on Ring Road in Westlands, easy to reach by matatu and with secure parking on site. Reach out any time - we would love to hear from you.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-stone-200 bg-white p-5">
                <MapPin size={22} weight="duotone" className="text-emerald-700" />
                <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-stone-500">Visit</p>
                <p className="mt-1 text-sm text-stone-800">{identity.address}</p>
              </div>
              <div className="rounded-2xl border border-stone-200 bg-white p-5">
                <Phone size={22} weight="duotone" className="text-emerald-700" />
                <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-stone-500">Call</p>
                <p className="mt-1 text-sm text-stone-800">{identity.phonePrimary}</p>
                <p className="text-sm text-stone-600">{identity.phoneSecondary}</p>
              </div>
              <div className="rounded-2xl border border-stone-200 bg-white p-5">
                <EnvelopeSimple size={22} weight="duotone" className="text-emerald-700" />
                <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-stone-500">Email</p>
                <a href={`mailto:${identity.email}`} className="mt-1 block text-sm text-emerald-700 hover:underline">
                  {identity.email}
                </a>
              </div>
              <div className="rounded-2xl border border-stone-200 bg-white p-5">
                <Clock size={22} weight="duotone" className="text-emerald-700" />
                <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-stone-500">Office Hours</p>
                <p className="mt-1 text-sm text-stone-800">Mon - Fri, 9:00 AM - 5:00 PM</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-stone-200 bg-stone-900 p-6 text-stone-100">
              <div className="flex items-center gap-2 text-amber-300">
                <Cross size={18} weight="fill" />
                <span className="text-sm font-semibold uppercase tracking-wider">Send a prayer request</span>
              </div>
              <p className="mt-3 text-sm text-stone-300">
                Share a need and our pastoral team will stand with you in prayer this week.
              </p>
              <a
                href={`mailto:${identity.email}?subject=Prayer%20Request&body=I%20would%20like%20to%20share%20a%20prayer%20request...`}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-emerald-700 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 active:scale-[0.98]"
              >
                <PaperPlaneTilt size={16} weight="fill" /> Submit request
              </a>
              <div className="mt-6 border-t border-stone-700 pt-5">
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-stone-400">
                  <ShareNetwork size={15} /> Follow us
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {socials.map((s) => (
                    <a
                      key={s.label}
                      href={s.url}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full border border-stone-700 px-3.5 py-1.5 text-xs font-medium text-stone-200 transition hover:border-emerald-500 hover:text-white"
                    >
                      {s.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-stone-200 bg-stone-50 py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-emerald-700 text-white">
                  <BookOpen size={18} weight="fill" />
                </span>
                <span className="font-serif text-lg text-stone-900">{identity.shortName}</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-stone-600">{identity.tagline}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">Service Times</p>
              <ul className="mt-3 space-y-1.5 text-sm text-stone-600">
                {identity.serviceTimes.map((s) => (
                  <li key={s.id}>
                    {s.day} - {s.label}, {s.time}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">Reach Us</p>
              <ul className="mt-3 space-y-1.5 text-sm text-stone-600">
                <li>{identity.address}</li>
                <li>{identity.phonePrimary}</li>
                <li>{identity.email}</li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">Give</p>
              <p className="mt-3 text-sm text-stone-600">
                M-Pesa Paybill {identity.mpesa.paybill}
                <br />
                Account {identity.mpesa.accountNo}
              </p>
              <a href="#giving" className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 hover:underline">
                Give now <ArrowRight size={14} weight="bold" />
              </a>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-stone-200 pt-6 sm:flex-row">
            <p className="flex items-center gap-2 text-xs text-stone-500">
              <CheckCircle size={14} weight="fill" className="text-emerald-600" />
              &copy; {new Date().getFullYear()} {identity.name}. All rights reserved.
            </p>
            <button
              type="button"
              onClick={() => openPanel("login")}
              title={isAuthed ? "Staff Portal - signed in" : "Scripture & Staff Access"}
              aria-label={isAuthed ? "Open staff portal" : "Staff access"}
              className="group inline-flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-stone-300 transition hover:bg-stone-100 hover:text-emerald-700"
            >
              <BookOpen size={17} weight="duotone" />
              <span className="text-[11px] font-medium tracking-wide opacity-0 transition-opacity group-hover:opacity-100">
                {isAuthed ? "Staff Portal" : "Scripture & Staff Access"}
              </span>
            </button>
          </div>
        </div>
      </footer>
    </>
  );
}