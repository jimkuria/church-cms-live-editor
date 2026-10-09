import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Clock, Cross, HandHeart, Heart, MapPin, Play, Sparkle, Users, X } from "@phosphor-icons/react";
import { useChurch, EditBadge } from "@/context/ChurchContext";

const MINISTRY_ICONS = [Heart, Users, HandHeart, Cross];

function useNextService(times: { id: string; label: string; day: string; time: string }[]) {
  const [tick, setTick] = useState(() => Date.now());
  useEffect(() => {
    const t = window.setInterval(() => setTick(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, []);

  return useMemo(() => {
    const target = new Date();
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const primary = times.find((t) => t.day === "Sunday") ?? times[0];
    const targetDayIndex = dayNames.indexOf(primary?.day ?? "Sunday");
    const [clock, meridiem] = (primary?.time ?? "10:30 AM").split(" ");
    const [hh, mm] = clock.split(":").map(Number);
    let hour = hh % 12;
    if (meridiem === "PM") hour += 12;
    const diffDays = (targetDayIndex - target.getDay() + 7) % 7;
    target.setDate(target.getDate() + diffDays);
    target.setHours(hour, mm, 0, 0);
    if (target.getTime() <= tick) target.setDate(target.getDate() + 7);
    const ms = Math.max(0, target.getTime() - tick);
    return {
      label: primary?.label ?? "Sunday Celebration",
      time: primary?.time ?? "10:30 AM",
      days: Math.floor(ms / 86400000),
      hours: Math.floor((ms / 3600000) % 24),
      minutes: Math.floor((ms / 60000) % 60),
      seconds: Math.floor((ms / 1000) % 60),
    };
  }, [tick, times]);
}

export default function HeroAndContent() {
  const { content } = useChurch();
  const { identity, hero, ministries, sermons } = content;
  const countdown = useNextService(identity.serviceTimes);
  const [activeSermon, setActiveSermon] = useState<string | null>(null);

  const poster = sermons.find((s) => s.id === activeSermon);

  return (
    <>
      <section id="home" className="relative overflow-hidden bg-stone-50 pt-10 pb-20 sm:pt-16">
        <div className="pointer-events-none absolute -right-32 -top-24 h-96 w-96 rounded-full bg-emerald-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -left-24 top-40 h-72 w-72 rounded-full bg-amber-200/40 blur-3xl" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-12">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative lg:col-span-7"
          >
            <EditBadge label="Edit hero" panel="hero" />
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-800">
              <Sparkle size={14} weight="fill" /> {hero.eyebrow}
            </span>
            <h1 className="mt-5 font-serif text-4xl leading-[1.05] tracking-tight text-stone-900 sm:text-5xl lg:text-6xl">
              {hero.headline}
            </h1>
            <p className="mt-5 max-w-[52ch] text-base leading-relaxed text-stone-600">{hero.subtext}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-full bg-emerald-700 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800 active:scale-[0.98]"
              >
                {hero.primaryCta} <ArrowRight size={16} weight="bold" />
              </a>
              <a
                href="#sermons"
                className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white/70 px-6 py-3 text-sm font-semibold text-stone-800 transition hover:border-emerald-600 hover:text-emerald-800 active:scale-[0.98]"
              >
                <Play size={16} weight="fill" /> {hero.secondaryCta}
              </a>
            </div>

            <div className="mt-9 rounded-2xl border border-stone-200 bg-white/70 p-5 backdrop-blur">
              <p className="font-serif text-lg italic leading-relaxed text-stone-700">"{hero.verse}"</p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">{hero.verseRef}</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
            className="lg:col-span-5"
          >
            <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-xl shadow-stone-200/60">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">
                <Clock size={15} weight="bold" /> Next Gathering
              </div>
              <p className="mt-2 font-serif text-2xl text-stone-900">{countdown.label}</p>
              <p className="text-sm text-stone-500">{countdown.time}</p>
              <div className="mt-5 grid grid-cols-4 gap-2">
                {[
                  { v: countdown.days, l: "Days" },
                  { v: countdown.hours, l: "Hrs" },
                  { v: countdown.minutes, l: "Min" },
                  { v: countdown.seconds, l: "Sec" },
                ].map((x) => (
                  <div key={x.l} className="rounded-xl bg-stone-100 py-3 text-center">
                    <p className="font-serif text-2xl font-semibold text-stone-900">{String(x.v).padStart(2, "0")}</p>
                    <p className="text-[10px] uppercase tracking-wider text-stone-500">{x.l}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 space-y-2.5">
                {identity.serviceTimes.map((s) => (
                  <div key={s.id} className="flex items-center justify-between border-b border-stone-100 pb-2 text-sm last:border-0">
                    <span className="text-stone-600">{s.day}</span>
                    <span className="font-medium text-stone-900">{s.label} · {s.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="overflow-hidden border-y border-emerald-800/20 bg-emerald-900 py-3">
        <div className="flex animate-[marquee-x_28s_linear_infinite] gap-10 whitespace-nowrap text-sm text-emerald-50/90">
          {[0, 1].map((rep) => (
            <div key={rep} className="flex gap-10">
              {content.announcements.map((a) => (
                <span key={`${rep}-${a.id}`} className="flex items-center gap-2">
                  <Sparkle size={14} weight="fill" className="text-amber-300" /> {a.text}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <section id="ministries" className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Our Ministries</p>
          <h2 className="mt-3 font-serif text-3xl tracking-tight text-stone-900 sm:text-4xl">
            Places to grow, serve, and belong
          </h2>
          <p className="mt-4 text-stone-600">
            Every ministry exists to help you take one honest step closer to Christ and to the people around you.
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {ministries.map((m, i) => {
            const Icon = MINISTRY_ICONS[i % MINISTRY_ICONS.length];
            return (
              <motion.article
                key={m.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="group rounded-2xl border border-stone-200 bg-white p-6 transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-100/70"
              >
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-50 text-emerald-700 transition group-hover:bg-emerald-700 group-hover:text-white">
                  <Icon size={22} weight="duotone" />
                </span>
                <h3 className="mt-4 font-serif text-lg text-stone-900">{m.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-600">{m.description}</p>
              </motion.article>
            );
          })}
        </div>
      </section>

      <section id="sermons" className="bg-stone-100/70 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Sermons & Teachings</p>
              <h2 className="mt-3 font-serif text-3xl tracking-tight text-stone-900 sm:text-4xl">Listen again, go deeper</h2>
            </div>
            <span className="rounded-full border border-stone-300 px-4 py-1.5 text-xs font-medium text-stone-600">
              New message every Sunday
            </span>
          </div>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {sermons.map((s) => (
              <article key={s.id} className="flex flex-col rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
                <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-stone-100 px-3 py-1 text-[11px] font-medium text-stone-600">
                  <Clock size={13} /> {s.date}
                </span>
                <h3 className="mt-4 font-serif text-xl leading-snug text-stone-900">{s.title}</h3>
                <p className="mt-2 text-sm text-stone-600">{s.description}</p>
                <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-emerald-700">{s.speaker}</p>
                <button
                  type="button"
                  onClick={() => setActiveSermon(s.id)}
                  className="mt-5 inline-flex items-center gap-2 self-start rounded-full bg-stone-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 active:scale-[0.98]"
                >
                  <Play size={15} weight="fill" /> Watch message
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid items-center gap-8 rounded-3xl border border-stone-200 bg-white p-8 sm:p-12 lg:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Visit Us</p>
            <h2 className="mt-3 font-serif text-3xl tracking-tight text-stone-900">{identity.name}</h2>
            <p className="mt-4 leading-relaxed text-stone-600">{identity.mission}</p>
            <div className="mt-6 flex items-start gap-3 text-sm text-stone-700">
              <MapPin size={20} weight="duotone" className="mt-0.5 shrink-0 text-emerald-700" />
              <span>{identity.address}</span>
            </div>
          </div>
          <img
            src="https://images.unsplash.com/photo-1438032005730-c779502df39b?auto=format&fit=crop&w=900&q=80"
            alt="Congregation in worship at Grace Sanctuary"
            className="h-64 w-full rounded-2xl object-cover shadow-lg lg:h-80"
            loading="lazy"
          />
        </div>
      </section>

      {poster && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-stone-900/70 p-4 backdrop-blur-sm" onClick={() => setActiveSermon(null)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-stone-200 px-5 py-3">
              <p className="font-serif text-lg text-stone-900">{poster.title}</p>
              <button type="button" onClick={() => setActiveSermon(null)} aria-label="Close" className="grid h-8 w-8 place-items-center rounded-lg text-stone-500 hover:bg-stone-100">
                <X size={18} />
              </button>
            </div>
            <div className="aspect-video w-full bg-stone-900">
              <iframe
                className="h-full w-full"
                src={`https://www.youtube.com/embed/${poster.youtubeId}`}
                title={poster.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}