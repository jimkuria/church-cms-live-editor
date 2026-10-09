import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { PencilSimple } from "@phosphor-icons/react";
import {
  DEFAULT_CONTENT,
  LOCKOUT_SECONDS,
  MAX_ATTEMPTS,
  STAFF_ACCOUNTS,
  STORAGE,
} from "@/data";
import type { ActivityLog, ChurchContent, PastorBook, SiteIdentity, StaffUser } from "@/data";

function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function save(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage full or unavailable */
  }
}

export function diffLabels(a: ChurchContent, b: ChurchContent): string[] {
  const out: string[] = [];
  const cmp = (x: unknown, y: unknown) => JSON.stringify(x) !== JSON.stringify(y);
  if (cmp(a.identity, b.identity)) out.push("Site identity, contacts & M-Pesa settings");
  if (cmp(a.hero, b.hero)) out.push("Home hero & welcome content");
  if (cmp(a.ministries, b.ministries)) out.push("Ministries");
  if (cmp(a.sermons, b.sermons)) out.push("Sermons & teachings");
  if (cmp(a.announcements, b.announcements)) out.push("Announcements");
  if (cmp(a.books, b.books)) out.push("Pastor's Books catalog");
  if (cmp(a.givingTypes, b.givingTypes)) out.push("Giving options");
  return out;
}

export type PanelName = "login" | "hero" | "identity" | "books" | "publish" | null;

type ChurchContextValue = {
  content: ChurchContent;
  live: ChurchContent;
  draft: ChurchContent;
  session: StaffUser | null;
  isAuthed: boolean;
  isSuperAdmin: boolean;
  editMode: boolean;
  previewDraft: boolean;
  hasDrafts: boolean;
  changes: string[];
  lockedUntil: number | null;
  attemptsLeft: number;
  logs: ActivityLog[];
  panel: PanelName;
  openPanel: (p: PanelName) => void;
  closePanel: () => void;
  login: (email: string, password: string) => { ok: boolean; error?: string };
  logout: () => void;
  setPreviewDraft: (v: boolean) => void;
  updateHero: (patch: Partial<ChurchContent["hero"]>) => void;
  updateIdentity: (patch: Partial<SiteIdentity>) => void;
  updateMpesa: (patch: Partial<SiteIdentity["mpesa"]>) => void;
  updateSocials: (patch: Partial<SiteIdentity["socials"]>) => void;
  upsertBook: (book: PastorBook) => void;
  removeBook: (id: string) => void;
  discardDrafts: () => void;
  publish: () => void;
};

const ChurchContext = createContext<ChurchContextValue | null>(null);

export function ChurchProvider({ children }: { children: ReactNode }) {
  const [live, setLive] = useState<ChurchContent>(() => loadJSON(STORAGE.live, DEFAULT_CONTENT));
  const [draft, setDraft] = useState<ChurchContent>(() => loadJSON(STORAGE.draft, DEFAULT_CONTENT));
  const [session, setSession] = useState<StaffUser | null>(() => {
    const s = loadJSON<StaffUser | null>(STORAGE.session, null);
    return s && STAFF_ACCOUNTS.some((a) => a.id === s.id) ? s : null;
  });
  const [previewDraft, setPreviewDraftState] = useState(false);
  const [panel, setPanel] = useState<PanelName>(null);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [attemptState, setAttemptState] = useState<{ count: number; lockedUntil: number | null }>(() =>
    loadJSON(STORAGE.attempts, { count: 0, lockedUntil: null }),
  );
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => save(STORAGE.live, live), [live]);
  useEffect(() => save(STORAGE.draft, draft), [draft]);
  useEffect(() => save(STORAGE.attempts, attemptState), [attemptState]);
  useEffect(() => {
    if (session) save(STORAGE.session, session);
    else localStorage.removeItem(STORAGE.session);
  }, [session]);

  const lockedUntil = attemptState.lockedUntil && attemptState.lockedUntil > now ? attemptState.lockedUntil : null;

  useEffect(() => {
    if (!attemptState.lockedUntil) return;
    const t = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, [attemptState.lockedUntil]);

  useEffect(() => {
    if (attemptState.lockedUntil && attemptState.lockedUntil <= now) {
      setAttemptState({ count: 0, lockedUntil: null });
    }
  }, [now, attemptState.lockedUntil]);

  const isAuthed = Boolean(session);
  const isSuperAdmin = session?.role === "super_admin";
  const changes = useMemo(() => diffLabels(live, draft), [live, draft]);
  const hasDrafts = changes.length > 0;

  const pushLog = useCallback((actor: string, action: string) => {
    setLogs((prev) =>
      [{ id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, actor, action, at: new Date().toLocaleString() }, ...prev].slice(0, 12),
    );
  }, []);

  const login = useCallback(
    (email: string, password: string) => {
      if (lockedUntil) {
        return { ok: false, error: "Too many failed attempts. Please wait for the lockout to clear." };
      }
      const account = STAFF_ACCOUNTS.find((a) => a.email.toLowerCase() === email.trim().toLowerCase());
      if (account && account.password === password) {
        setSession(account);
        setAttemptState({ count: 0, lockedUntil: null });
        pushLog(account.name, "Signed in to the Staff Portal");
        return { ok: true };
      }
      const count = attemptState.count + 1;
      if (count >= MAX_ATTEMPTS) {
        setAttemptState({ count, lockedUntil: Date.now() + LOCKOUT_SECONDS * 1000 });
        return { ok: false, error: `Account locked for ${LOCKOUT_SECONDS} seconds after ${MAX_ATTEMPTS} failed attempts.` };
      }
      setAttemptState({ count, lockedUntil: null });
      return { ok: false, error: `Invalid credentials. ${MAX_ATTEMPTS - count} attempt(s) remaining.` };
    },
    [attemptState.count, lockedUntil, pushLog],
  );

  const logout = useCallback(() => {
    if (session) pushLog(session.name, "Signed out of the Staff Portal");
    setSession(null);
    setPreviewDraftState(false);
    setPanel(null);
  }, [session, pushLog]);

  const setPreviewDraft = useCallback(
    (v: boolean) => {
      if (!isAuthed) return;
      setPreviewDraftState(v);
      if (session) pushLog(session.name, v ? "Enabled live edit preview" : "Returned to published view");
    },
    [isAuthed, session, pushLog],
  );

  const openPanel = useCallback((p: PanelName) => setPanel(p), []);
  const closePanel = useCallback(() => setPanel(null), []);

  const updateHero = useCallback((patch: Partial<ChurchContent["hero"]>) => {
    setDraft((d) => ({ ...d, hero: { ...d.hero, ...patch } }));
  }, []);

  const updateIdentity = useCallback((patch: Partial<SiteIdentity>) => {
    setDraft((d) => ({ ...d, identity: { ...d.identity, ...patch } }));
  }, []);

  const updateMpesa = useCallback((patch: Partial<SiteIdentity["mpesa"]>) => {
    setDraft((d) => ({ ...d, identity: { ...d.identity, mpesa: { ...d.identity.mpesa, ...patch } } }));
  }, []);

  const updateSocials = useCallback((patch: Partial<SiteIdentity["socials"]>) => {
    setDraft((d) => ({ ...d, identity: { ...d.identity, socials: { ...d.identity.socials, ...patch } } }));
  }, []);

  const upsertBook = useCallback((book: PastorBook) => {
    setDraft((d) => {
      const exists = d.books.some((b) => b.id === book.id);
      return { ...d, books: exists ? d.books.map((b) => (b.id === book.id ? book : b)) : [...d.books, book] };
    });
  }, []);

  const removeBook = useCallback((id: string) => {
    setDraft((d) => ({ ...d, books: d.books.filter((b) => b.id !== id) }));
  }, []);

  const discardDrafts = useCallback(() => {
    setDraft(live);
    if (session) pushLog(session.name, "Discarded all unpublished draft changes");
  }, [live, session, pushLog]);

  const publish = useCallback(() => {
    setLive(draft);
    if (session) pushLog(session.name, `Published ${changes.length} change group(s) to the live site`);
  }, [draft, session, changes.length, pushLog]);

  const value: ChurchContextValue = {
    content: isAuthed && previewDraft ? draft : live,
    live,
    draft,
    session,
    isAuthed,
    isSuperAdmin,
    editMode: isAuthed && previewDraft,
    previewDraft,
    hasDrafts,
    changes,
    lockedUntil,
    attemptsLeft: Math.max(0, MAX_ATTEMPTS - attemptState.count),
    logs,
    panel,
    openPanel,
    closePanel,
    login,
    logout,
    setPreviewDraft,
    updateHero,
    updateIdentity,
    updateMpesa,
    updateSocials,
    upsertBook,
    removeBook,
    discardDrafts,
    publish,
  };

  return <ChurchContext.Provider value={value}>{children}</ChurchContext.Provider>;
}

export function useChurch() {
  const ctx = useContext(ChurchContext);
  if (!ctx) throw new Error("useChurch must be used inside ChurchProvider");
  return ctx;
}

export function EditBadge({ label, panel }: { label: string; panel: PanelName }) {
  const { editMode, openPanel } = useChurch();
  if (!editMode) return null;
  return (
    <button
      type="button"
      onClick={() => openPanel(panel)}
      className="absolute -top-3 right-3 z-20 inline-flex items-center gap-1 rounded-full bg-emerald-700 px-2.5 py-1 text-[11px] font-medium text-white shadow-lg ring-1 ring-white/40 transition hover:bg-emerald-800 active:scale-[0.97]"
    >
      <PencilSimple size={12} weight="bold" />
      {label}
    </button>
  );
}