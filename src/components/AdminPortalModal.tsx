import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, CheckCircle, Eye, Gear, Lock, Rocket, ShieldCheck, SignOut, Warning, X } from "@phosphor-icons/react";
import { useChurch } from "@/context/ChurchContext";
import { MAX_ATTEMPTS, STAFF_ACCOUNTS } from "@/data";
import { BooksEditor, Drawer, Field, HeroEditor, IdentityEditor } from "@/components/AdminEditors";

export default function AdminPortalModal() {
  const {
    panel,
    closePanel,
    openPanel,
    session,
    isAuthed,
    isSuperAdmin,
    previewDraft,
    setPreviewDraft,
    hasDrafts,
    changes,
    logs,
    login,
    logout,
    lockedUntil,
    attemptsLeft,
    discardDrafts,
    publish,
  } = useChurch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (!lockedUntil) {
      setCountdown(0);
      return;
    }
    const tick = () => setCountdown(Math.max(0, Math.ceil((lockedUntil - Date.now()) / 1000)));
    tick();
    const t = window.setInterval(tick, 500);
    return () => window.clearInterval(t);
  }, [lockedUntil]);

  const submitLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (lockedUntil) return;
    const res = login(email, password);
    if (res.ok) {
      toast.success("Welcome back to the Staff Portal");
      setEmail("");
      setPassword("");
      setError("");
      closePanel();
      setPreviewDraft(true);
    } else {
      setError(res.error ?? "Sign in failed");
      toast.error(res.error ?? "Sign in failed");
    }
  };

  const showLogin = panel === "login" && !isAuthed;

  return (
    <>
      <AnimatePresence>
        {showLogin && (
          <div className="fixed inset-0 z-[60] grid place-items-center bg-stone-900/70 p-4 backdrop-blur-sm" onClick={closePanel}>
            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              className="w-full max-w-md rounded-2xl bg-white p-7 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-700 text-white">
                    <Lock size={20} weight="fill" />
                  </span>
                  <div>
                    <h2 className="font-serif text-xl text-stone-900">Staff Portal</h2>
                    <p className="text-xs text-stone-500">Scripture & ministry administration</p>
                  </div>
                </div>
                <button type="button" onClick={closePanel} aria-label="Close" className="grid h-9 w-9 place-items-center rounded-lg text-stone-500 hover:bg-stone-100">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={submitLogin} className="mt-6 space-y-4">
                <Field label="Staff Email" value={email} onChange={setEmail} type="email" />
                <Field label="Password" value={password} onChange={setPassword} type="password" />

                {error && (
                  <p className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                    <Warning size={16} weight="fill" /> {error}
                  </p>
                )}
                {lockedUntil && (
                  <p className="flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
                    <Lock size={16} weight="fill" /> Locked. Try again in {countdown}s
                  </p>
                )}

                <button
                  type="submit"
                  disabled={Boolean(lockedUntil)}
                  className="w-full rounded-full bg-emerald-700 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.99]"
                >
                  Sign in securely
                </button>
                {!lockedUntil && (
                  <p className="text-center text-xs text-stone-500">
                    {attemptsLeft} of {MAX_ATTEMPTS} attempts remaining
                  </p>
                )}
              </form>

              <div className="mt-6 border-t border-stone-200 pt-5">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">Demo accounts</p>
                <div className="mt-3 grid gap-2">
                  {STAFF_ACCOUNTS.map((a, i) => (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => {
                        setEmail(a.email);
                        setPassword(a.password);
                        setError("");
                      }}
                      className="flex items-center justify-between rounded-lg border border-stone-200 px-3 py-2 text-left text-xs transition hover:border-emerald-500 hover:bg-emerald-50"
                    >
                      <span className="font-medium text-stone-700">{i === 0 ? "Super Admin" : `Admin ${i}`}</span>
                      <span className="font-mono text-stone-500">{a.email}</span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {panel === "hero" && isAuthed && (
          <Drawer title="Edit home hero" onClose={closePanel}>
            <HeroEditor />
          </Drawer>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {panel === "identity" && isAuthed && (
          <Drawer title="Site identity & M-Pesa" onClose={closePanel}>
            <IdentityEditor />
          </Drawer>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {panel === "books" && isAuthed && (
          <Drawer title="Pastor's Books manager" onClose={closePanel}>
            <BooksEditor />
          </Drawer>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {panel === "publish" && isAuthed && (
          <div className="fixed inset-0 z-[60] grid place-items-center bg-stone-900/70 p-4 backdrop-blur-sm" onClick={closePanel}>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-lg rounded-2xl bg-white p-7 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-2.5">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-700 text-white">
                  <Rocket size={20} weight="fill" />
                </span>
                <div>
                  <h2 className="font-serif text-xl text-stone-900">Review & publish</h2>
                  <p className="text-xs text-stone-500">Publishing as {session?.name}</p>
                </div>
              </div>

              {hasDrafts ? (
                <ul className="mt-6 space-y-2">
                  {changes.map((c) => (
                    <li key={c} className="flex items-center gap-2 rounded-lg bg-stone-50 px-3 py-2 text-sm text-stone-700">
                      <CheckCircle size={16} weight="fill" className="text-emerald-600" /> {c}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-6 rounded-lg bg-stone-50 px-3 py-3 text-sm text-stone-600">
                  No unpublished changes. The draft matches the live site.
                </p>
              )}

              {logs.length > 0 && (
                <div className="mt-5 rounded-lg border border-stone-200 p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">Recent activity</p>
                  <ul className="mt-2 space-y-1 text-xs text-stone-500">
                    {logs.slice(0, 3).map((l) => (
                      <li key={l.id}>
                        {l.actor} - {l.action} ({l.at})
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-7 flex gap-3">
                <button
                  type="button"
                  disabled={!hasDrafts}
                  onClick={() => {
                    publish();
                    toast.success("Changes published to the live site");
                    closePanel();
                  }}
                  className="flex-1 rounded-full bg-emerald-700 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Publish to live
                </button>
                <button
                  type="button"
                  disabled={!hasDrafts}
                  onClick={() => {
                    discardDrafts();
                    toast.success("Draft changes discarded");
                    closePanel();
                  }}
                  className="rounded-full border border-stone-300 px-5 py-3 text-sm font-semibold text-stone-600 transition hover:border-red-400 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Discard
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {isAuthed && (
        <motion.div initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="fixed inset-x-0 bottom-4 z-50 flex justify-center px-3">
          <div className="flex max-w-[95vw] flex-wrap items-center gap-2 rounded-2xl border border-white/15 bg-stone-900/90 px-3 py-2.5 text-white shadow-2xl backdrop-blur-xl">
            <div className="flex items-center gap-2 pr-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-600">
                {isSuperAdmin ? <ShieldCheck size={17} weight="fill" /> : <BookOpen size={17} weight="fill" />}
              </span>
              <div className="leading-tight">
                <p className="text-xs font-semibold">{session?.name}</p>
                <p className="text-[10px] uppercase tracking-wider text-emerald-300">{isSuperAdmin ? "Super Admin" : "Admin"}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setPreviewDraft(!previewDraft)}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold transition ${
                previewDraft ? "bg-amber-400 text-amber-950" : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              <Eye size={15} weight="bold" /> {previewDraft ? "Edit mode on" : "Edit mode off"}
            </button>

            <button type="button" onClick={() => openPanel("books")} className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-2 text-xs font-semibold hover:bg-white/20">
              <BookOpen size={15} /> Books
            </button>
            <button type="button" onClick={() => openPanel("identity")} className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-2 text-xs font-semibold hover:bg-white/20">
              <Gear size={15} /> Site & Paybill
            </button>

            <button
              type="button"
              onClick={() => openPanel("publish")}
              className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-3.5 py-2 text-xs font-semibold hover:bg-emerald-500"
            >
              <Rocket size={15} weight="fill" /> Publish
              {hasDrafts && (
                <span className="ml-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-white px-1 text-[10px] font-bold text-emerald-700">
                  {changes.length}
                </span>
              )}
            </button>

            <button type="button" onClick={logout} aria-label="Sign out" className="grid h-8 w-8 place-items-center rounded-lg bg-white/10 hover:bg-red-500/80">
              <SignOut size={16} />
            </button>
          </div>
        </motion.div>
      )}
    </>
  );
}