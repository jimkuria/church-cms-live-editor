export type StaffRole = "super_admin" | "admin";

export type StaffUser = {
  id: string;
  email: string;
  password: string;
  name: string;
  role: StaffRole;
  title: string;
  active?: boolean;
};

export type ServiceTime = { id: string; label: string; day: string; time: string };

export type SiteIdentity = {
  name: string;
  shortName: string;
  tagline: string;
  mission: string;
  address: string;
  phonePrimary: string;
  phoneSecondary: string;
  email: string;
  socials: { youtube: string; facebook: string; instagram: string; twitter: string };
  mpesa: { paybill: string; accountName: string; accountNo: string };
  serviceTimes: ServiceTime[];
};

export type Ministry = { id: string; title: string; description: string };

export type Sermon = { id: string; title: string; speaker: string; date: string; description: string; youtubeId: string };

export type Announcement = { id: string; text: string };

export type PastorBook = {
  id: string;
  title: string;
  subtitle: string;
  author: string;
  priceKes: number;
  priceUsd: number;
  cover: string;
  summary: string;
  excerpt: string;
  formats: string[];
  featured: boolean;
  inStock: boolean;
};

export type GivingType = { id: string; label: string; description: string };

export type ChurchContent = {
  identity: SiteIdentity;
  hero: { eyebrow: string; headline: string; subtext: string; primaryCta: string; secondaryCta: string; verse: string; verseRef: string };
  ministries: Ministry[];
  sermons: Sermon[];
  announcements: Announcement[];
  books: PastorBook[];
  givingTypes: GivingType[];
};

export type ActivityLog = { id: string; actor: string; action: string; at: string };

export const STORAGE = {
  live: "church_live_content_v1",
  draft: "church_draft_content_v1",
  session: "church_staff_session_v1",
  attempts: "church_login_attempts_v1",
} as const;

export const MAX_ATTEMPTS = 5;
export const LOCKOUT_SECONDS = 30;

export const STAFF_ACCOUNTS: StaffUser[] = [
  {
    id: "staff-super",
    email: "superadmin@gracechurch.org",
    password: "Grace@2024",
    name: "Pastor Samuel Kamau",
    role: "super_admin",
    title: "Super Admin - Senior Pastor",
  },
  {
    id: "staff-admin1",
    email: "admin1@gracechurch.org",
    password: "Admin1@2024",
    name: "Mercy Wanjiru",
    role: "admin",
    title: "Admin - Pastorate & Content",
  },
  {
    id: "staff-admin2",
    email: "admin2@gracechurch.org",
    password: "Admin2@2024",
    name: "Daniel Otieno",
    role: "admin",
    title: "Admin - Operations & Media",
  },
];

export const DEFAULT_CONTENT: ChurchContent = {
  identity: {
    name: "Grace Sanctuary International",
    shortName: "Grace Sanctuary",
    tagline: "A house of worship, a family of faith, a light to the city.",
    mission:
      "We exist to lead people into a growing relationship with Jesus Christ, to nurture families, and to serve our community with compassion and excellence.",
    address: "Westlands Sanctuary, Ring Road, Nairobi, Kenya",
    phonePrimary: "+254 712 345 678",
    phoneSecondary: "+254 733 987 654",
    email: "hello@gracechurch.org",
    socials: {
      youtube: "https://youtube.com/@gracesanctuary",
      facebook: "https://facebook.com/gracesanctuary",
      instagram: "https://instagram.com/gracesanctuary",
      twitter: "https://x.com/gracesanctuary",
    },
    mpesa: { paybill: "247247", accountName: "Grace Sanctuary", accountNo: "GRACE-TITHE" },
    serviceTimes: [
      { id: "st1", label: "First Service", day: "Sunday", time: "8:00 AM" },
      { id: "st2", label: "Main Celebration", day: "Sunday", time: "10:30 AM" },
      { id: "st3", label: "Bible Study", day: "Wednesday", time: "6:00 PM" },
      { id: "st4", label: "Prayer & Fasting", day: "Friday", time: "7:00 PM" },
    ],
  },
  hero: {
    eyebrow: "Welcome Home",
    headline: "Find belonging, purpose, and living hope",
    subtext: "Join a warm family of faith in the heart of Nairobi where every person is known and every story matters.",
    primaryCta: "Plan Your Visit",
    secondaryCta: "Watch Live",
    verse: "Come to me, all you who are weary and burdened, and I will give you rest.",
    verseRef: "Matthew 11:28",
  },
  ministries: [
    { id: "m1", title: "Worship & Music", description: "Choirs, live bands, and sound teams leading our congregation into presence every week." },
    { id: "m2", title: "Children & Youth", description: "Safe, joyful discipleship for kids and teens with mentors who truly care." },
    { id: "m3", title: "Community Outreach", description: "Feeding programs, medical camps, and school support across Nairobi estates." },
    { id: "m4", title: "Care & Counselling", description: "Marriage, family, and grief support grounded in scripture and dignity." },
  ],
  sermons: [
    {
      id: "s1",
      title: "Walking in Divine Purpose",
      speaker: "Pastor Samuel Kamau",
      date: "Sun, 2 Feb 2025",
      description: "Discover the calling woven into your life before you were born.",
      youtubeId: "dQw4w9WgXcQ",
    },
    {
      id: "s2",
      title: "The Power of Persistent Prayer",
      speaker: "Pastor Samuel Kamau",
      date: "Sun, 26 Jan 2025",
      description: "How unbroken prayer reshapes families, cities, and generations.",
      youtubeId: "dQw4w9WgXcQ",
    },
    {
      id: "s3",
      title: "Kingdom Stewardship",
      speaker: "Minister Mercy Wanjiru",
      date: "Sun, 19 Jan 2025",
      description: "Faithful management of every resource God places in your hands.",
      youtubeId: "dQw4w9WgXcQ",
    },
  ],
  announcements: [
    { id: "a1", text: "Annual Harvest Convention begins 14 March - register at the welcome desk." },
    { id: "a2", text: "Youth camp early-bird discount closes at the end of this month." },
    { id: "a3", text: "New members class runs every second Saturday at the courtyard hall." },
  ],
  books: [
    {
      id: "b1",
      title: "Walking in Divine Purpose",
      subtitle: "Discovering the calling on your life",
      author: "Pastor Samuel Kamau",
      priceKes: 1200,
      priceUsd: 9.99,
      cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80",
      summary: "A practical, scripture-rooted guide to recognising and walking in the assignment God has placed on your life.",
      excerpt:
        "Purpose is not hidden from you; it is revealed to you. Every prayer, every season, every closed door is a thread in the tapestry God is weaving. Begin today by surrendering the pen to the Author.",
      formats: ["Paperback", "E-Book", "Audio"],
      featured: true,
      inStock: true,
    },
    {
      id: "b2",
      title: "The Power of Persistent Prayer",
      subtitle: "Standing until the answer comes",
      author: "Pastor Samuel Kamau",
      priceKes: 1050,
      priceUsd: 8.5,
      cover: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=600&q=80",
      summary: "Ninety days of guided prayer devotions that will transform how you approach the throne of grace.",
      excerpt:
        "Prayer is not a vending machine; it is a relationship. And relationships grow in the waiting. Keep knocking, keep seeking, keep asking. Heaven is never annoyed by your persistence.",
      formats: ["Paperback", "E-Book"],
      featured: false,
      inStock: true,
    },
    {
      id: "b3",
      title: "Kingdom Wealth & Stewardship",
      subtitle: "God's blueprint for finances and generosity",
      author: "Pastor Samuel Kamau",
      priceKes: 1350,
      priceUsd: 11.5,
      cover: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=600&q=80",
      summary: "A biblical framework for earning, saving, giving, and leaving a legacy that outlives you.",
      excerpt:
        "Money is a servant, never a master. The question is never how much you have but who commands it. When the kingdom holds the reins, generosity stops being a duty and becomes a delight.",
      formats: ["Paperback", "Audio"],
      featured: false,
      inStock: false,
    },
  ],
  givingTypes: [
    { id: "g1", label: "Tithe", description: "Return the first tenth as an act of worship and obedience." },
    { id: "g2", label: "General Offering", description: "Support weekly ministry, worship, and facilities." },
    { id: "g3", label: "Building Project", description: "Help us complete the new sanctuary wing." },
    { id: "g4", label: "Missions", description: "Send and sustain outreach across the region." },
    { id: "g5", label: "Pastor's Love Offering", description: "Honour and bless the pastoral family." },
  ],
};