import { useState, useRef, useEffect } from "react";
import catEngineImg from "../assets/categories/engine.png";
import catTransmissionImg from "../assets/categories/transmission.png";
import catBrakesImg from "../assets/categories/brakes.png";
import catFiltersImg from "../assets/categories/filters.png";
import catTiresImg from "../assets/categories/tires.png";
import catSteeringImg from "../assets/categories/steering.png";
import catSuspensionImg from "../assets/categories/suspension.png";
import {
  Eye, EyeOff, Wrench, Store, ChevronRight, ArrowLeft,
  ChevronDown, Check, Home, MapPin, ShoppingCart, User,
  BookOpen, ClipboardList, ScanLine, Package, X, Navigation,
  List, Map, Phone, Clock, Star,
  Plus, Minus, Trash2, QrCode, Wallet, CreditCard, Banknote,
  Smartphone, Building2, ArrowDownToLine, CheckCircle2, XCircle,
  Gift, TrendingUp, ShieldCheck, Receipt, ChevronLeft,
  Globe, SunMoon, Headphones, HelpCircle, Info, ShoppingBag,
  BarChart2, UserCircle, Settings, LogOut,
  Search, Bell, MoreHorizontal, Copy, CheckCheck, MessageSquare, Send,
} from "lucide-react";

type AuthScreen = "login" | "mechanic-login-otp" | "mechanic-profile" | "forgot-phone" | "forgot-otp" | "forgot-newpass";
type Role = "mechanic";
type Lang = "en" | "ru" | "uz";
type MechanicTab = "main" | "shops" | "scan" | "bonus" | "profile";
type SellerTab = "main" | "catalog" | "scan" | "orders" | "profile";

const LANGUAGES: { code: Lang; label: string; native: string; flag: string }[] = [
  { code: "en", label: "English", native: "English", flag: "🇬🇧" },
  { code: "ru", label: "Russian", native: "Русский", flag: "🇷🇺" },
  { code: "uz", label: "Uzbek", native: "O'zbekcha", flag: "🇺🇿" },
];

// ─── LANGUAGE SELECTOR ────────────────────────────────────────────────────────
function LanguageSelector({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = LANGUAGES.find((l) => l.code === lang)!;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F4F5F7] border border-border hover:border-primary/40 transition-all text-[13px] font-medium text-foreground"
      >
        <span className="text-base leading-none">{current.flag}</span>
        <span className="text-[12px] font-semibold text-muted-foreground">{current.code.toUpperCase()}</span>
        <ChevronDown size={13} className={`text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-44 bg-card rounded-2xl shadow-xl border border-border overflow-hidden z-50"
          style={{ boxShadow: "0 8px 32px rgba(37,99,235,0.12), 0 2px 8px rgba(0,0,0,0.08)" }}>
          <div className="px-3 pt-2.5 pb-1">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Language</p>
          </div>
          {LANGUAGES.map((l) => (
            <button key={l.code} onClick={() => { setLang(l.code); setOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 transition-all hover:bg-primary/5 ${lang === l.code ? "bg-primary/5" : ""}`}>
              <span className="text-xl leading-none">{l.flag}</span>
              <div className="flex-1 text-left">
                <div className="text-[13px] font-semibold text-foreground leading-none">{l.native}</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">{l.label}</div>
              </div>
              {lang === l.code && <Check size={14} className="text-primary shrink-0" />}
            </button>
          ))}
          <div className="h-1.5" />
        </div>
      )}
    </div>
  );
}

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────
function LogoMark() {
  return (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shadow-md">
        <svg width="18" height="18" viewBox="0 0 22 22" fill="none">
          <path d="M11 2L4 6.5V15.5L11 20L18 15.5V6.5L11 2Z" fill="white" fillOpacity="0.2" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M11 7L8 9.5V14.5L11 17L14 14.5V9.5L11 7Z" fill="white" />
        </svg>
      </div>
      <div>
        <div className="text-[13px] font-bold text-foreground tracking-tight leading-none">AutoParts</div>
        <div className="text-[9px] font-medium text-muted-foreground tracking-widest uppercase leading-none mt-0.5">Pro Catalog</div>
      </div>
    </div>
  );
}

function TopBar({ onBack, lang, setLang, showBack = false }: {
  onBack?: () => void; lang: Lang; setLang: (l: Lang) => void; showBack?: boolean;
}) {
  return (
    <div className="flex items-center justify-between px-6 pt-2 pb-1 shrink-0">
      {showBack ? (
        <button onClick={onBack}
          className="w-9 h-9 rounded-xl bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all">
          <ArrowLeft size={17} />
        </button>
      ) : <div className="w-9" />}
      <LogoMark />
      <LanguageSelector lang={lang} setLang={setLang} />
    </div>
  );
}

function InputField({ placeholder, type = "text", value, onChange, rightElement }: {
  placeholder: string; type?: string; value: string;
  onChange: (v: string) => void; rightElement?: React.ReactNode;
}) {
  return (
    <div className="relative">
      <input type={type} placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full bg-[#F4F5F7] text-foreground placeholder-muted-foreground rounded-xl px-4 py-3.5 text-sm font-normal border border-transparent focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all pr-12" />
      {rightElement && <div className="absolute right-3.5 top-1/2 -translate-y-1/2">{rightElement}</div>}
    </div>
  );
}

function PrimaryButton({ label, onClick }: { label: string; onClick?: () => void }) {
  return (
    <button onClick={onClick}
      className="w-full bg-primary text-white rounded-xl py-4 text-[15px] font-semibold shadow-md hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
      {label}
      <ChevronRight size={18} />
    </button>
  );
}

function CopyAddressButton({ address, size = 15 }: { address: string; size?: number }) {
  const [copied, setCopied] = useState(false);
  function handleCopy(e: React.MouseEvent) {
    e.stopPropagation();
    navigator.clipboard.writeText(address).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  return (
    <button onClick={handleCopy}
      className={`shrink-0 transition-all ${copied ? "text-emerald-500" : "text-muted-foreground/50 hover:text-primary"}`}>
      {copied ? <CheckCheck size={size - 3} /> : <Copy size={size - 3} />}
    </button>
  );
}

// ─── SHARED HELPERS ───────────────────────────────────────────────────────────
const priceToNum = (s: string) => parseInt(s.replace(/\D/g, ""), 10) || 0;
const bonusUZS = (p: Product) => {
  if (p.bonusAmount) return p.bonusAmount;
  const pct = p.cashback ?? 5;
  return Math.round(priceToNum(p.price) * pct / 100 / 1000) * 1000;
};
const fmtBonus = (p: Product) => bonusUZS(p).toLocaleString("uz-UZ").replace(/,/g, " ") + " UZS";
const fmtUZS = (n: number) => n.toLocaleString("en-US").replace(/,/g, " ");

// Sub-page header used by full-screen pages (Cart, Wallet, Approval) that
// temporarily replace the tab content and hide the bottom nav.
function PageHeader({ title, subtitle, onBack, right }: {
  title: string; subtitle?: string; onBack?: () => void; right?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-card border-b border-border shrink-0">
      {onBack && (
        <button onClick={onBack}
          className="w-9 h-9 rounded-xl bg-[#F4F5F7] border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all shrink-0">
          <ChevronLeft size={18} />
        </button>
      )}
      <div className="flex-1 min-w-0">
        <h2 className="text-[16px] font-bold text-foreground leading-tight truncate">{title}</h2>
        {subtitle && <p className="text-[11px] text-muted-foreground leading-tight mt-0.5 truncate">{subtitle}</p>}
      </div>
      {right}
    </div>
  );
}

// Deterministic decorative QR — purely visual placeholder (no real encoding).
function QRCodePlaceholder({ seed = "PROGRESS", size = 200 }: { seed?: string; size?: number }) {
  const cells = 25;
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) { h ^= seed.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
  const rng = () => { h = (Math.imul(h, 1103515245) + 12345) >>> 0; return (h >>> 8) / 16777215; };
  const isFinder = (r: number, c: number) => {
    const inBox = (br: number, bc: number) => r >= br && r < br + 7 && c >= bc && c < bc + 7;
    return inBox(0, 0) || inBox(0, cells - 7) || inBox(cells - 7, 0);
  };
  const rects: React.ReactNode[] = [];
  const unit = size / cells;
  for (let r = 0; r < cells; r++) {
    for (let c = 0; c < cells; c++) {
      if (isFinder(r, c)) continue;
      if (rng() > 0.52) {
        rects.push(<rect key={`${r}-${c}`} x={c * unit} y={r * unit} width={unit} height={unit} rx={unit * 0.18} fill="#1A1A1A" />);
      }
    }
  }
  const Finder = ({ x, y }: { x: number; y: number }) => (
    <g transform={`translate(${x * unit} ${y * unit})`}>
      <rect width={7 * unit} height={7 * unit} rx={unit} fill="#1A1A1A" />
      <rect x={unit} y={unit} width={5 * unit} height={5 * unit} rx={unit * 0.7} fill="#FFFFFF" />
      <rect x={2 * unit} y={2 * unit} width={3 * unit} height={3 * unit} rx={unit * 0.5} fill="#2563EB" />
    </g>
  );
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rounded-xl">
      <rect width={size} height={size} fill="#FFFFFF" />
      {rects}
      <Finder x={0} y={0} />
      <Finder x={cells - 7} y={0} />
      <Finder x={0} y={cells - 7} />
    </svg>
  );
}

// Reusable wallet balance hero card used by both Mechanic & Seller wallets.
function WalletBalanceCard({ label, amount, sublabel, accent = "primary" }: {
  label: string; amount: number; sublabel: string; accent?: "primary" | "success";
}) {
  const grad = accent === "success"
    ? "linear-gradient(135deg, #10B981 0%, #059669 100%)"
    : "linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)";
  return (
    <div className="relative overflow-hidden rounded-3xl px-5 py-5 text-white shadow-md" style={{ background: grad }}>
      <div className="absolute -right-6 -top-8 w-32 h-32 rounded-full bg-white/10" />
      <div className="absolute -right-2 top-10 w-20 h-20 rounded-full bg-white/10" />
      <div className="relative">
        <div className="flex items-center gap-2 mb-2">
          <Wallet size={15} className="opacity-90" />
          <span className="text-[12px] font-semibold opacity-90">{label}</span>
        </div>
        <p className="text-[32px] font-bold leading-none">{fmtUZS(amount)} <span className="text-[15px] font-semibold opacity-80">UZS</span></p>
        <p className="text-[12px] opacity-80 mt-2">{sublabel}</p>
      </div>
    </div>
  );
}

// ─── AUTH SCREENS ─────────────────────────────────────────────────────────────
function LoginScreen({ onLogin, onNavigate, lang, setLang }: {
  onLogin: (role: Role) => void;
  onNavigate: (s: AuthScreen) => void;
  lang: Lang; setLang: (l: Lang) => void;
}) {
  const [phone, setPhone] = useState("");

  return (
    <div className="flex flex-col h-full">
      <TopBar lang={lang} setLang={setLang} />
      <div className="flex-1 overflow-y-auto px-6 pt-5">
        <div className="mb-6">
          <h1 className="text-[26px] font-bold text-foreground leading-tight tracking-tight">Sign In</h1>
          <p className="text-sm text-muted-foreground mt-1.5">Enter your phone number to sign in to your account</p>
        </div>

        <div>
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Phone Number</p>
          <div className="flex gap-2">
            <div className="flex items-center gap-1.5 px-3 py-3.5 bg-[#F4F5F7] rounded-xl text-sm font-semibold text-foreground whitespace-nowrap">🇺🇿 +998</div>
            <div className="flex-1"><InputField placeholder="90 123 45 67" type="tel" value={phone} onChange={setPhone} /></div>
          </div>
        </div>
      </div>
      <div className="px-6 pb-6 pt-3 shrink-0">
        <p className="text-[12px] text-muted-foreground text-center mb-3 leading-relaxed">
          By continuing, you agree to our <span className="text-primary font-medium">Terms</span> and <span className="text-primary font-medium">Privacy Policy</span>
        </p>
        <PrimaryButton label="Send Code" onClick={() => onNavigate("mechanic-login-otp")} />
      </div>
    </div>
  );
}

function MechanicProfileScreen({ onLogin, onBack, lang, setLang }: { onLogin: () => void; onBack: () => void; lang: Lang; setLang: (l: Lang) => void }) {
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [address, setAddress] = useState("");
  const [showMapSheet, setShowMapSheet] = useState(false);
  const [mapPin, setMapPin] = useState<{ x: number; y: number } | null>(null);
  const UZ_REGIONS = ["Tashkent", "Samarkand", "Bukhara", "Namangan", "Andijan", "Fergana", "Nukus", "Termez", "Jizzakh", "Guliston", "Navoi", "Urgench"];
  const [region, setRegion] = useState("");
  const [showRegionSheet, setShowRegionSheet] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setAvatarUrl(url);
  }

  function handleMapTap(e: React.MouseEvent<SVGSVGElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMapPin({ x, y });
    const streets = ["Amir Temur Ave", "Mustaqillik Ave", "Shota Rustaveli St", "Bodomzor Ave", "Mirzo Ulugbek St"];
    const districts = ["Yunusabad", "Chilanzar", "Mirzo Ulugbek", "Uchtepa", "Shaykhontohur"];
    setAddress(`${districts[Math.floor(y / 25)]}, ${streets[Math.floor(x / 25)]}`);
  }

  return (
    <div className="flex flex-col h-full relative">
      <TopBar showBack onBack={onBack} lang={lang} setLang={setLang} />
      <div className="flex-1 overflow-y-auto px-6 pt-5 pb-4">
        <div className="mb-6">
          <h1 className="text-[24px] font-bold text-foreground leading-tight tracking-tight">Complete Profile</h1>
          <p className="text-sm text-muted-foreground mt-1.5">Tell us a bit about yourself to get started.</p>
        </div>

        <div className="flex flex-col gap-4">
          {/* Avatar upload */}
          <div className="flex flex-col items-center gap-2 py-2">
            <button onClick={() => fileInputRef.current?.click()}
              className="relative w-20 h-20 rounded-3xl overflow-hidden bg-primary/10 flex items-center justify-center active:scale-95 transition-transform">
              {avatarUrl
                ? <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                : <UserCircle size={36} className="text-primary/50" />}
              <div className="absolute bottom-0 inset-x-0 h-7 bg-black/40 flex items-center justify-center">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
              </div>
            </button>
            <p className="text-[12px] text-muted-foreground">Tap to upload photo</p>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          </div>

          {/* Full name */}
          <div>
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Full Name</p>
            <InputField placeholder="e.g. Akmal Karimov" value={name} onChange={setName} />
          </div>

          {/* Date of birth */}
          <div>
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Date of Birth</p>
            <input
              type="text"
              inputMode="numeric"
              placeholder="DD.MM.YYYY"
              value={dob}
              onChange={e => {
                let v = e.target.value.replace(/[^\d]/g, "");
                if (v.length > 2) v = v.slice(0,2) + "." + v.slice(2);
                if (v.length > 5) v = v.slice(0,5) + "." + v.slice(5);
                if (v.length > 10) v = v.slice(0,10);
                setDob(v);
              }}
              className="w-full px-4 py-3.5 bg-[#F4F5F7] rounded-xl text-[14px] font-medium text-foreground border-2 border-transparent focus:outline-none focus:border-primary/30 transition-all"
            />
          </div>

          {/* Region */}
          <div>
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Region</p>
            <button onClick={() => setShowRegionSheet(true)}
              className="w-full flex items-center justify-between px-4 py-3.5 bg-[#F4F5F7] rounded-xl border-2 border-transparent focus:outline-none transition-all hover:border-primary/20">
              <span className={region ? "text-[14px] font-semibold text-foreground" : "text-[14px] text-muted-foreground"}>
                {region || "Select your region"}
              </span>
              <ChevronRight size={18} className="text-muted-foreground shrink-0" />
            </button>
          </div>

          {/* Address on map */}
          <div>
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Address</p>
            <button onClick={() => setShowMapSheet(true)}
              className="w-full flex items-center justify-between px-4 py-3.5 bg-[#F4F5F7] rounded-xl border-2 border-transparent focus:outline-none transition-all hover:border-primary/20">
              <div className="flex items-center gap-2 min-w-0">
                <MapPin size={16} className={address ? "text-primary shrink-0" : "text-muted-foreground shrink-0"} />
                <span className={`text-[14px] truncate ${address ? "font-semibold text-foreground" : "text-muted-foreground"}`}>
                  {address || "Select on map"}
                </span>
              </div>
              <ChevronRight size={18} className="text-muted-foreground shrink-0" />
            </button>
          </div>
        </div>
      </div>

      <div className="px-6 pb-6 pt-3 shrink-0">
        <PrimaryButton label="Get Started" onClick={onLogin} />
      </div>

      {/* Region bottom sheet */}
      {showRegionSheet && (
        <div className="absolute inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowRegionSheet(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-card rounded-t-3xl overflow-hidden" style={{ maxHeight: "70%" }}>
            <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-border">
              <span className="text-[16px] font-bold text-foreground">Select Region</span>
              <button onClick={() => setShowRegionSheet(false)} className="w-8 h-8 rounded-full bg-[#F4F5F7] flex items-center justify-center text-muted-foreground">
                <X size={16} />
              </button>
            </div>
            <div className="overflow-y-auto" style={{ maxHeight: "calc(70vh - 64px)" }}>
              {UZ_REGIONS.map(r => (
                <button key={r} onClick={() => { setRegion(r); setShowRegionSheet(false); }}
                  className="w-full flex items-center justify-between px-5 py-4 hover:bg-[#F4F5F7] transition-all text-left">
                  <span className="text-[14px] font-medium text-foreground">{r}</span>
                  {region === r && <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0">
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Map bottom sheet */}
      {showMapSheet && (
        <div className="absolute inset-0 z-50 flex flex-col">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowMapSheet(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-card rounded-t-3xl overflow-hidden flex flex-col" style={{ height: "75%" }}>
            <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-border shrink-0">
              <span className="text-[16px] font-bold text-foreground">Select Address</span>
              <button onClick={() => setShowMapSheet(false)} className="w-8 h-8 rounded-full bg-[#F4F5F7] flex items-center justify-center text-muted-foreground">
                <X size={16} />
              </button>
            </div>

            {/* Search bar */}
            <div className="px-4 py-3 shrink-0">
              <div className="flex items-center gap-2 px-3 py-2.5 bg-[#F4F5F7] rounded-xl">
                <Search size={15} className="text-muted-foreground shrink-0" />
                <span className="text-[13px] text-muted-foreground">Search address…</span>
              </div>
            </div>

            {/* Map */}
            <div className="flex-1 relative mx-4 mb-4 rounded-2xl overflow-hidden border border-border">
              <svg
                viewBox="0 0 100 100"
                className="w-full h-full cursor-crosshair"
                onClick={handleMapTap}
                style={{ background: "#e8f0e8" }}
              >
                {/* Road grid */}
                <rect x="0" y="0" width="100" height="100" fill="#e8f0e8" />
                {/* Blocks */}
                {[
                  [5,5,28,18],[35,5,28,18],[65,5,28,18],
                  [5,28,18,18],[25,28,38,18],[65,28,28,18],
                  [5,50,28,18],[35,50,18,18],[55,50,38,18],
                  [5,72,28,18],[35,72,28,18],[65,72,28,18],
                ].map(([x,y,w,h],i) => (
                  <rect key={i} x={x} y={y} width={w} height={h} rx="1.5" fill="#d4e4d4" />
                ))}
                {/* Roads */}
                <rect x="0" y="24" width="100" height="3" fill="#fff" opacity="0.9" />
                <rect x="0" y="46" width="100" height="3" fill="#fff" opacity="0.9" />
                <rect x="0" y="68" width="100" height="3" fill="#fff" opacity="0.9" />
                <rect x="22" y="0" width="3" height="100" fill="#fff" opacity="0.9" />
                <rect x="45" y="0" width="3" height="100" fill="#fff" opacity="0.9" />
                <rect x="63" y="0" width="3" height="100" fill="#fff" opacity="0.9" />
                <rect x="94" y="0" width="3" height="100" fill="#fff" opacity="0.9" />
                {/* Park */}
                <ellipse cx="50" cy="50" rx="6" ry="5" fill="#a8d5a2" />
                {/* Pin */}
                {mapPin && (
                  <g transform={`translate(${mapPin.x},${mapPin.y})`}>
                    <circle cx="0" cy="0" r="3.5" fill="#2563EB" opacity="0.2" />
                    <circle cx="0" cy="0" r="1.8" fill="#2563EB" />
                    <line x1="0" y1="1.8" x2="0" y2="6" stroke="#2563EB" strokeWidth="1" />
                  </g>
                )}
              </svg>
              {!mapPin && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="bg-black/60 text-white text-[11px] font-medium px-3 py-1.5 rounded-full">Tap to drop a pin</div>
                </div>
              )}
            </div>

            {/* Confirm bar */}
            {mapPin && (
              <div className="px-4 pb-4 shrink-0">
                <div className="flex items-center gap-3 p-3 bg-primary/8 rounded-xl mb-3">
                  <MapPin size={15} className="text-primary shrink-0" />
                  <p className="text-[13px] font-medium text-foreground flex-1 leading-tight">{address || "Tashkent, Uzbekistan"}</p>
                </div>
                <PrimaryButton label="Confirm Address" onClick={() => setShowMapSheet(false)} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function OtpScreen({ onNavigate, onBack, nextScreen, onVerify, title, subtitle, lang, setLang }: {
  onNavigate: (s: AuthScreen) => void; onBack: () => void; nextScreen: AuthScreen;
  onVerify?: () => void;
  title: string; subtitle: string; lang: Lang; setLang: (l: Lang) => void;
}) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const [seconds, setSeconds] = useState(59);
  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);
  function handleChange(val: string, idx: number) {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp]; next[idx] = val; setOtp(next);
    if (val && idx < 5) refs.current[idx + 1]?.focus();
  }
  function handleKey(e: React.KeyboardEvent, idx: number) {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) refs.current[idx - 1]?.focus();
  }
  return (
    <div className="flex flex-col h-full">
      <TopBar showBack onBack={onBack} lang={lang} setLang={setLang} />
      <div className="flex-1 overflow-y-auto px-6 pt-5">
        <div className="mb-7">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="5" width="18" height="14" rx="2" stroke="#2563EB" strokeWidth="1.6" />
              <path d="M3 9L12 14L21 9" stroke="#2563EB" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </div>
          <h1 className="text-[24px] font-bold text-foreground leading-tight tracking-tight">{title}</h1>
          <p className="text-sm text-muted-foreground mt-1.5">{subtitle}</p>
        </div>
        <div className="flex gap-2 justify-center mb-4">
          {otp.map((digit, i) => (
            <input key={i} ref={(el) => { refs.current[i] = el; }} type="text" inputMode="numeric" maxLength={1}
              value={digit} onChange={(e) => handleChange(e.target.value, i)} onKeyDown={(e) => handleKey(e, i)}
              className={`w-12 h-14 text-center text-[22px] font-bold rounded-xl border-2 bg-[#F4F5F7] outline-none transition-all ${digit ? "border-primary text-primary" : "border-border text-foreground"} focus:border-primary focus:ring-2 focus:ring-primary/20`} />
          ))}
        </div>
        <div className="flex justify-center">
          {seconds > 0 ? (
            <p className="text-[13px] text-muted-foreground">Resend code in <span className="text-primary font-semibold">0:{String(seconds).padStart(2, "0")}</span></p>
          ) : (
            <button onClick={() => setSeconds(59)} className="text-[13px] text-primary font-semibold hover:underline">Resend Code</button>
          )}
        </div>
      </div>
      <div className="px-6 pb-6 pt-3 shrink-0">
        <PrimaryButton label="Verify" onClick={() => { if (onVerify) { onVerify(); } else { onNavigate(nextScreen); } }} />
      </div>
    </div>
  );
}

function ForgotPhoneScreen({ onNavigate, lang, setLang }: { onNavigate: (s: AuthScreen) => void; lang: Lang; setLang: (l: Lang) => void }) {
  const [phone, setPhone] = useState("");
  return (
    <div className="flex flex-col h-full">
      <TopBar showBack onBack={() => onNavigate("login")} lang={lang} setLang={setLang} />
      <div className="flex-1 overflow-y-auto px-6 pt-5">
        <div className="mb-7">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M6.6 10.8C7.8 13.2 9.8 15.2 12.2 16.4L14.1 14.5C14.3 14.3 14.7 14.3 14.9 14.4C15.9 14.8 17 15 18 15C18.6 15 19 15.4 19 16V18.5C19 19.1 18.6 19.5 18 19.5C9.4 19.5 4.5 14.6 4.5 6C4.5 5.4 4.9 5 5.5 5H8C8.6 5 9 5.4 9 6C9 7 9.2 8.1 9.6 9.1C9.7 9.3 9.7 9.7 9.5 9.9L7.6 11.8L6.6 10.8Z" fill="#2563EB" />
            </svg>
          </div>
          <h1 className="text-[24px] font-bold text-foreground leading-tight tracking-tight">Reset Password</h1>
          <p className="text-sm text-muted-foreground mt-1.5">Enter your registered phone number to receive a verification code</p>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-1.5 px-3 py-3.5 bg-[#F4F5F7] rounded-xl text-sm font-semibold text-foreground whitespace-nowrap">🇺🇿 +998</div>
          <div className="flex-1"><InputField placeholder="90 123 45 67" type="tel" value={phone} onChange={setPhone} /></div>
        </div>
      </div>
      <div className="px-6 pb-6 pt-3 shrink-0">
        <PrimaryButton label="Send Code" onClick={() => onNavigate("forgot-otp")} />
      </div>
    </div>
  );
}

function ForgotNewPassScreen({ onNavigate, lang, setLang }: { onNavigate: (s: AuthScreen) => void; lang: Lang; setLang: (l: Lang) => void }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const passwordMatch = confirm.length > 0 && password === confirm;
  const passwordMismatch = confirm.length > 0 && password !== confirm;
  return (
    <div className="flex flex-col h-full">
      <TopBar showBack onBack={() => onNavigate("forgot-otp")} lang={lang} setLang={setLang} />
      <div className="flex-1 overflow-y-auto px-6 pt-5">
        <div className="mb-7">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <rect x="5" y="11" width="14" height="10" rx="2" stroke="#2563EB" strokeWidth="1.6" />
              <path d="M8 11V7C8 4.8 9.8 3 12 3C14.2 3 16 4.8 16 7V11" stroke="#2563EB" strokeWidth="1.6" strokeLinecap="round" />
              <circle cx="12" cy="16" r="1.5" fill="#2563EB" />
            </svg>
          </div>
          <h1 className="text-[24px] font-bold text-foreground leading-tight tracking-tight">New Password</h1>
          <p className="text-sm text-muted-foreground mt-1.5">Choose a strong password for your account</p>
        </div>
        <div className="flex flex-col gap-3">
          <InputField placeholder="New Password" type={showPass ? "text" : "password"} value={password} onChange={setPassword}
            rightElement={<button onClick={() => setShowPass((p) => !p)} className="text-muted-foreground hover:text-foreground p-0.5 transition-colors">{showPass ? <EyeOff size={17} /> : <Eye size={17} />}</button>} />
          <div>
            <InputField placeholder="Confirm New Password" type={showConfirm ? "text" : "password"} value={confirm} onChange={setConfirm}
              rightElement={<button onClick={() => setShowConfirm((p) => !p)} className="text-muted-foreground hover:text-foreground p-0.5 transition-colors">{showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}</button>} />
            {passwordMismatch && <p className="text-[12px] text-destructive mt-1.5 ml-1">Passwords do not match</p>}
            {passwordMatch && <p className="text-[12px] text-emerald-600 mt-1.5 ml-1">Passwords match ✓</p>}
          </div>
        </div>
      </div>
      <div className="px-6 pb-6 pt-3 shrink-0">
        <PrimaryButton label="Reset Password" onClick={() => onNavigate("login")} />
      </div>
    </div>
  );
}

// ─── APP HEADER ───────────────────────────────────────────────────────────────
function AppHeader({ role, onLogout }: { role: Role; onLogout: () => void }) {
  return (
    <div className="flex items-center justify-between px-5 py-3 bg-card border-b border-border shrink-0">
      <LogoMark />
      <div className="flex items-center gap-2.5">
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${role === "mechanic" ? "bg-blue-50" : "bg-emerald-50"}`}>
          <div className={`${role === "mechanic" ? "text-primary" : "text-emerald-600"}`}>
            {role === "mechanic" ? <Wrench size={13} /> : <Store size={13} />}
          </div>
          <span className={`text-[11px] font-bold tracking-wide ${role === "mechanic" ? "text-primary" : "text-emerald-600"}`}>
            {role === "mechanic" ? "Mechanic" : "Seller"}
          </span>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-50 hover:bg-red-100 transition-colors"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <polyline points="16 17 21 12 16 7" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <line x1="21" y1="12" x2="9" y2="12" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-[11px] font-bold text-red-500 tracking-wide">Log Out</span>
        </button>
      </div>
    </div>
  );
}

// ─── PLACEHOLDER PAGE ─────────────────────────────────────────────────────────
function PlaceholderPage({ label, icon }: { label: string; icon: React.ReactNode }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-3 px-8">
      <div className="w-16 h-16 rounded-2xl bg-primary/8 flex items-center justify-center text-primary">
        {icon}
      </div>
      <p className="text-[15px] font-semibold text-foreground">{label}</p>
      <p className="text-[13px] text-muted-foreground text-center leading-relaxed">This page is coming soon. Stay tuned!</p>
    </div>
  );
}

// ─── MECHANIC MAIN PAGE ───────────────────────────────────────────────────────
const CATEGORIES: { label: string; icon: string; img?: string }[] = [
  { label: "Engine",        icon: "Engine",       img: catEngineImg },
  { label: "Transmission",  icon: "Transmission", img: catTransmissionImg },
  { label: "Brakes",        icon: "Brakes",       img: catBrakesImg },
  { label: "Suspension",    icon: "Suspension",   img: catSuspensionImg },
  { label: "Steering",      icon: "Steering",     img: catSteeringImg },
  { label: "Filters",       icon: "Filters",      img: catFiltersImg },
  { label: "Tires & Wheels",icon: "Tires",        img: catTiresImg },
  { label: "Lighting",      icon: "Lighting" },
];

function CatIcon({ name, size = 22 }: { name: string; size?: number }) {
  const p = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.75, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (name) {
    case "Engine": return (
      <svg {...p}>
        <rect x="7" y="2" width="10" height="11" rx="1.5"/>
        <path d="M10 13v3M14 13v3M8 16h8"/>
        <path d="M3 5h4M17 5h4M3 9h4M17 9h4"/>
      </svg>
    );
    case "Transmission": return (
      <svg {...p}>
        <circle cx="12" cy="12" r="3"/>
        <path d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8"/>
        <circle cx="12" cy="12" r="7" strokeDasharray="3 3"/>
      </svg>
    );
    case "Brakes": return (
      <svg {...p}>
        <circle cx="12" cy="12" r="8.5"/>
        <circle cx="12" cy="12" r="3.5"/>
        <path d="M12 3.5v3M12 17.5v3M3.5 12h3M17.5 12h3"/>
        <rect x="1.5" y="9.5" width="3" height="5" rx="1"/>
      </svg>
    );
    case "Suspension": return (
      <svg {...p}>
        <path d="M12 2v1.5"/>
        <path d="M9 3.5C15 3.5 15 5.5 9 5.5C15 5.5 15 7.5 9 7.5C15 7.5 15 9.5 9 9.5C15 9.5 15 11.5 9 11.5C15 11.5 15 13.5 9 13.5C15 13.5 15 15.5 9 15.5"/>
        <path d="M12 15.5v1.5"/>
        <rect x="9" y="17" width="6" height="3" rx="1"/>
        <path d="M10 2h4"/>
        <path d="M11 20v2M13 20v2"/>
      </svg>
    );
    case "Steering": return (
      <svg {...p}>
        <circle cx="12" cy="12" r="9.5"/>
        <circle cx="12" cy="12" r="2.5"/>
        <path d="M12 2.5v7M5.5 5.5l4.8 4.8M18.5 5.5l-4.8 4.8"/>
      </svg>
    );
    case "Electrical": return (
      <svg {...p}>
        <path d="M13 2L5 13h7l-1 9 9-12h-7l1-8z"/>
      </svg>
    );
    case "Filters": return (
      <svg {...p}>
        <rect x="6" y="3" width="12" height="17" rx="2"/>
        <path d="M6 8h12M6 12h12M6 16h12"/>
        <path d="M9 3V1M15 3V1"/>
      </svg>
    );
    case "Oil": return (
      <svg {...p}>
        <path d="M12 2C9.5 5 6 9 6 13.5a6 6 0 0012 0C18 9 14.5 5 12 2z"/>
        <path d="M9.5 17.5c.8 1.8 3 2.5 4.5 1.5"/>
      </svg>
    );
    case "Tires": return (
      <svg {...p}>
        <circle cx="12" cy="12" r="9.5"/>
        <circle cx="12" cy="12" r="5.5"/>
        <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none"/>
        <path d="M12 6.5v3M12 14.5v3M6.5 12h3M14.5 12h3"/>
      </svg>
    );
    case "Exhaust": return (
      <svg {...p}>
        <path d="M2 13h8"/>
        <path d="M10 10v6"/>
        <path d="M10 11h6a3 3 0 010 6h-6"/>
        <path d="M16 11v6"/>
        <path d="M16 13h4"/>
        <path d="M16 15h4"/>
        <path d="M19 5c0 2.5-2 3-2 5"/>
        <path d="M21.5 4c0 3-2.5 3.5-2.5 6"/>
      </svg>
    );
    case "Cooling": return (
      <svg {...p}>
        <circle cx="12" cy="12" r="2.5"/>
        <path d="M12 2c-1.5 1.5-1.5 4 0 5.5"/>
        <path d="M22 12c-1.5-1.5-4-1.5-5.5 0"/>
        <path d="M12 22c1.5-1.5 1.5-4 0-5.5"/>
        <path d="M2 12c1.5 1.5 4 1.5 5.5 0"/>
        <path d="M5.6 5.6c.5 2 2.5 3 4 2"/>
        <path d="M18.4 5.6c-2 .5-3 2.5-2 4"/>
        <path d="M18.4 18.4c-.5-2-2.5-3-4-2"/>
        <path d="M5.6 18.4c2-.5 3-2.5 2-4"/>
      </svg>
    );
    case "Lighting": return (
      <svg {...p}>
        <path d="M7 5h5c3.3 0 6 2.7 6 6v2c0 3.3-2.7 6-6 6H7V5z"/>
        <path d="M7 5v14"/>
        <path d="M3 9l4 3-4 3"/>
        <path d="M13 9h3M13 12h4M13 15h3"/>
      </svg>
    );
    default: return <svg {...p}><circle cx="12" cy="12" r="9"/></svg>;
  }
}

interface Product {
  id: number; name: string; shop: string; price: string;
  img: string; category: string; sku: string; stock: number;
  brand: string; description: string;
  originalPrice?: string; discount?: number;
  cashback?: number; bonusAmount?: number;
}

const PRODUCTS: Product[] = [
  // ── Bosch Oil Filter Premium — 3 shops ──
  {
    id: 1, name: "Bosch Oil Filter Premium", shop: "AutoZone Tashkent",
    price: "45 000", originalPrice: "60 000", discount: 25,
    img: "https://images.unsplash.com/photo-1523559094051-53bac879eb80?w=600&h=600&fit=crop&auto=format",
    category: "Filters", sku: "BSH-OF-4722", stock: 38, brand: "Bosch",
    description: "High-performance oil filter with multi-layer filtration media. Removes up to 99% of contaminants, protecting your engine from wear. Compatible with most gasoline and diesel engines. Recommended replacement every 10,000 km.",
  },
  {
    id: 101, name: "Bosch Oil Filter Premium", shop: "CarParts Express",
    price: "47 000",
    img: "https://images.unsplash.com/photo-1523559094051-53bac879eb80?w=600&h=600&fit=crop&auto=format",
    category: "Filters", sku: "BSH-OF-4722", stock: 14, brand: "Bosch",
    description: "High-performance oil filter with multi-layer filtration media. Removes up to 99% of contaminants, protecting your engine from wear. Compatible with most gasoline and diesel engines. Recommended replacement every 10,000 km.",
  },
  {
    id: 102, name: "Bosch Oil Filter Premium", shop: "SparkMaster Pro",
    price: "43 500", originalPrice: "48 000", discount: 9,
    img: "https://images.unsplash.com/photo-1523559094051-53bac879eb80?w=600&h=600&fit=crop&auto=format",
    category: "Filters", sku: "BSH-OF-4722", stock: 6, brand: "Bosch",
    description: "High-performance oil filter with multi-layer filtration media. Removes up to 99% of contaminants, protecting your engine from wear. Compatible with most gasoline and diesel engines. Recommended replacement every 10,000 km.",
  },
  // ── Brembo Brake Disc Set — 2 shops ──
  {
    id: 2, name: "Brembo Brake Disc Set", shop: "CarParts Express",
    price: "320 000",
    img: "https://images.unsplash.com/photo-1613214150384-14921ff659b2?w=600&h=600&fit=crop&auto=format",
    category: "Brakes", sku: "BRM-BD-09A778", stock: 12, brand: "Brembo",
    description: "OEM-quality ventilated brake disc set for superior stopping power. UV-coated to prevent rust on the hat and edges. Pre-mounted hub reduces installation time. Fits most European and Asian models (check fitment guide).",
  },
  {
    id: 201, name: "Brembo Brake Disc Set", shop: "SuspensionKing",
    price: "295 000", originalPrice: "320 000", discount: 8,
    img: "https://images.unsplash.com/photo-1613214150384-14921ff659b2?w=600&h=600&fit=crop&auto=format",
    category: "Brakes", sku: "BRM-BD-09A778", stock: 5, brand: "Brembo",
    description: "OEM-quality ventilated brake disc set for superior stopping power. UV-coated to prevent rust on the hat and edges. Pre-mounted hub reduces installation time. Fits most European and Asian models (check fitment guide).",
  },
  // ── NGK Spark Plug x4 — 3 shops ──
  {
    id: 3, name: "NGK Spark Plug x4", shop: "SparkMaster Pro",
    price: "88 000", originalPrice: "110 000", discount: 20,
    img: "https://images.unsplash.com/photo-1552656967-7a0991a13906?w=600&h=600&fit=crop&auto=format",
    category: "Engine", sku: "NGK-BKR6E-4PK", stock: 74, brand: "NGK",
    description: "Set of 4 iridium-tipped spark plugs for improved ignition efficiency and fuel economy. Laser-welded fine-wire iridium centre electrode ensures consistent spark. Lifespan up to 100,000 km under normal driving conditions.",
  },
  {
    id: 301, name: "NGK Spark Plug x4", shop: "AutoZone Tashkent",
    price: "92 000",
    img: "https://images.unsplash.com/photo-1552656967-7a0991a13906?w=600&h=600&fit=crop&auto=format",
    category: "Engine", sku: "NGK-BKR6E-4PK", stock: 29, brand: "NGK",
    description: "Set of 4 iridium-tipped spark plugs for improved ignition efficiency and fuel economy. Laser-welded fine-wire iridium centre electrode ensures consistent spark. Lifespan up to 100,000 km under normal driving conditions.",
  },
  {
    id: 302, name: "NGK Spark Plug x4", shop: "TireHub Uzbekistan",
    price: "90 000", originalPrice: "95 000", discount: 5,
    img: "https://images.unsplash.com/photo-1552656967-7a0991a13906?w=600&h=600&fit=crop&auto=format",
    category: "Engine", sku: "NGK-BKR6E-4PK", stock: 11, brand: "NGK",
    description: "Set of 4 iridium-tipped spark plugs for improved ignition efficiency and fuel economy. Laser-welded fine-wire iridium centre electrode ensures consistent spark. Lifespan up to 100,000 km under normal driving conditions.",
  },
  // ── Continental Tire — 2 shops ──
  {
    id: 4, name: "Continental Tire 205/55R16", shop: "TireHub Uzbekistan",
    price: "780 000",
    img: "https://images.unsplash.com/photo-1656232976683-7b688560e427?w=600&h=600&fit=crop&auto=format",
    category: "Tires", sku: "CNT-205-55R16-91V", stock: 8, brand: "Continental",
    description: "All-season radial tire with optimised tread pattern for wet and dry grip. EcoPlus technology reduces rolling resistance for better fuel economy. Speed rating V (up to 240 km/h). Sold individually.",
  },
  {
    id: 401, name: "Continental Tire 205/55R16", shop: "SuspensionKing",
    price: "760 000", originalPrice: "780 000", discount: 3,
    img: "https://images.unsplash.com/photo-1656232976683-7b688560e427?w=600&h=600&fit=crop&auto=format",
    category: "Tires", sku: "CNT-205-55R16-91V", stock: 4, brand: "Continental",
    description: "All-season radial tire with optimised tread pattern for wet and dry grip. EcoPlus technology reduces rolling resistance for better fuel economy. Speed rating V (up to 240 km/h). Sold individually.",
  },
  // ── Denso Air Filter — 2 shops ──
  {
    id: 5, name: "Denso Air Filter", shop: "AutoZone Tashkent",
    price: "62 000",
    img: "https://images.unsplash.com/photo-1527383418406-f85a3b146499?w=600&h=600&fit=crop&auto=format",
    category: "Filters", sku: "DNS-AF-268", stock: 51, brand: "Denso",
    description: "OEM-grade paper air filter designed for maximum airflow and dust retention. Precision-moulded frame ensures a perfect seal. Direct replacement for Denso OE parts. Change every 15,000–20,000 km or annually.",
  },
  {
    id: 501, name: "Denso Air Filter", shop: "CarParts Express",
    price: "65 000",
    img: "https://images.unsplash.com/photo-1527383418406-f85a3b146499?w=600&h=600&fit=crop&auto=format",
    category: "Filters", sku: "DNS-AF-268", stock: 22, brand: "Denso",
    description: "OEM-grade paper air filter designed for maximum airflow and dust retention. Precision-moulded frame ensures a perfect seal. Direct replacement for Denso OE parts. Change every 15,000–20,000 km or annually.",
  },
  // ── Monroe Shock Absorber — 2 shops ──
  {
    id: 6, name: "Monroe Shock Absorber", shop: "SuspensionKing",
    price: "215 000", originalPrice: "258 000", discount: 17,
    img: "https://images.unsplash.com/photo-1429772011165-0c2e054367b8?w=600&h=600&fit=crop&auto=format",
    category: "Suspension", sku: "MNR-E1156", stock: 19, brand: "Monroe",
    description: "Gas-charged monotube shock absorber for responsive handling and a comfortable ride. All-weather fluid maintains consistent damping from -40°C to +120°C. Direct OE replacement. Sold individually — order 2 for an axle.",
  },
  {
    id: 601, name: "Monroe Shock Absorber", shop: "AutoZone Tashkent",
    price: "225 000",
    img: "https://images.unsplash.com/photo-1429772011165-0c2e054367b8?w=600&h=600&fit=crop&auto=format",
    category: "Suspension", sku: "MNR-E1156", stock: 7, brand: "Monroe",
    description: "Gas-charged monotube shock absorber for responsive handling and a comfortable ride. All-weather fluid maintains consistent damping from -40°C to +120°C. Direct OE replacement. Sold individually — order 2 for an axle.",
  },
];


// Unique product names for search suggestions
const UNIQUE_PRODUCTS = PRODUCTS.filter((p, _, arr) => arr.findIndex(x => x.name === p.name) === arr.indexOf(p));

const PRODUCT_EXTRA_IMGS: Record<string, string[]> = {
  "BSH-OF-4722": [
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&h=600&fit=crop&auto=format",
  ],
  "BRM-BD-09A778": [
    "https://images.unsplash.com/photo-1609152168127-b89b33eb6af5?w=600&h=600&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&h=600&fit=crop&auto=format",
  ],
  "NGK-BKR6E-4PK": [
    "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600&h=600&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1582639510494-c80b5de9f148?w=600&h=600&fit=crop&auto=format",
  ],
  "CNT-205-55R16-91V": [
    "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=600&h=600&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&h=600&fit=crop&auto=format",
  ],
  "DNS-AF-268": [
    "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=600&h=600&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?w=600&h=600&fit=crop&auto=format",
  ],
  "MNR-E1156": [
    "https://images.unsplash.com/photo-1615906655593-ad0386982a0f?w=600&h=600&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?w=600&h=600&fit=crop&auto=format",
  ],
};

interface ProductVariation { name: string; options: string[]; }
const PRODUCT_VARIATIONS: Record<string, ProductVariation[]> = {
  "BSH-OF-4722": [
    { name: "Engine Type", options: ["Petrol", "Diesel", "Hybrid"] },
    { name: "Pack Size",   options: ["1 unit", "2 units", "5 units"] },
  ],
  "BRM-BD-09A778": [
    { name: "Axle",     options: ["Front", "Rear"] },
    { name: "Material", options: ["Standard", "Drilled", "Slotted"] },
  ],
  "NGK-BKR6E-4PK": [
    { name: "Heat Range", options: ["5", "6", "7", "8"] },
    { name: "Gap",        options: ["0.8 mm", "1.0 mm", "1.1 mm"] },
  ],
  "CNT-205-55R16-91V": [
    { name: "Size",         options: ["205/55R16", "215/55R16", "225/55R16"] },
    { name: "Speed Rating", options: ["H · 210 km/h", "V · 240 km/h"] },
  ],
  "DNS-AF-268": [
    { name: "Type", options: ["Standard", "Performance", "Carbon Fibre"] },
  ],
  "MNR-E1156": [
    { name: "Position", options: ["Front Left", "Front Right", "Rear Left", "Rear Right"] },
    { name: "Type",     options: ["Standard", "Sport", "Heavy Duty"] },
  ],
};

// ─── SEARCH PAGE ──────────────────────────────────────────────────────────────
function SearchPage({ onSelect, onClose, onSelectCategory }: {
  onSelect: (p: Product) => void; onClose: () => void;
  onSelectCategory?: (cat: { label: string; icon: string }) => void;
}) {
  const [query, setQuery] = useState("");
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const q = query.toLowerCase().trim();

  const suggestions = q
    ? UNIQUE_PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      )
    : [];

  const listings = selectedName ? PRODUCTS.filter(p => p.name === selectedName) : [];

  // ── Shared top bar ──
  const TopBar = ({ onBack, title, subtitle }: { onBack: () => void; title?: string; subtitle?: string }) => (
    <div className="flex items-center gap-2 px-4 pt-4 pb-3 bg-card border-b border-border shrink-0">
      <button onClick={onBack} className="shrink-0 text-muted-foreground hover:text-foreground transition-colors">
        <ChevronLeft size={22} />
      </button>
      {title ? (
        <div className="flex-1 min-w-0">
          <p className="text-[15px] font-bold text-foreground leading-tight truncate">{title}</p>
          {subtitle && <p className="text-[11px] text-muted-foreground">{subtitle}</p>}
        </div>
      ) : (
        <div className="flex-1 relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" width="15" height="15" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
            <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <input ref={inputRef} type="text" placeholder="Search parts, brands, categories..."
            value={query} onChange={e => { setQuery(e.target.value); setSelectedName(null); }}
            className="w-full bg-[#F4F5F7] rounded-xl pl-9 pr-9 py-2.5 text-[13px] text-foreground placeholder-muted-foreground border border-transparent focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          />
          {query && (
            <button onClick={() => { setQuery(""); setSelectedName(null); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              <X size={15} />
            </button>
          )}
        </div>
      )}
    </div>
  );

  // ── Step 2: product grid for selected name ──
  const [showFilter, setShowFilter] = useState(false);
  const [sortBy, setSortBy] = useState<"default"|"bonus-high"|"bonus-low">("default");
  const allBonus = listings.map(p => bonusUZS(p));
  const absMin = allBonus.length ? Math.min(...allBonus) : 0;
  const absMax = allBonus.length ? Math.max(...allBonus) : 100000;
  const [sliderMin, setSliderMin] = useState(absMin);

  const bonusFiltered = sliderMin > absMin;

  const activeFilterCount = [
    sortBy !== "default",
    bonusFiltered,
  ].filter(Boolean).length;

  const filteredListings = listings
    .filter(p => bonusUZS(p) >= sliderMin)
    .sort((a, b) => {
      if (sortBy === "bonus-high") return bonusUZS(b) - bonusUZS(a);
      if (sortBy === "bonus-low")  return bonusUZS(a) - bonusUZS(b);
      return 0;
    });

  // Product card used in both the grid and filter-applied view
  const ListingCard = ({ p }: { p: Product }) => (
    <div className="bg-card rounded-2xl overflow-hidden border border-border flex flex-col" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
      <ProductCardImage images={[p.img, ...(PRODUCT_EXTRA_IMGS[p.sku] ?? [])]} onClick={() => { onSelect(p); onClose(); }} />
      <div className="p-2.5 flex flex-col flex-1">
        <button onClick={() => { onSelect(p); onClose(); }} className="text-left mb-0.5">
          <p className="text-[12px] font-semibold text-foreground leading-tight line-clamp-1">{p.name}</p>
        </button>
        <p className="text-[10px] text-muted-foreground font-medium">{p.shop}</p>
        <div className="mt-auto pt-1">
          <div className="flex items-center gap-1 bg-emerald-50 rounded-xl px-2 py-1.5">
            <Gift size={11} className="text-emerald-600 shrink-0" />
            <span className="text-[11px] font-semibold text-emerald-600">+{fmtBonus(p)}</span>
          </div>
        </div>
      </div>
    </div>
  );

  if (selectedName) {
    // ── Filter page ──
    if (showFilter) {
      const SORT_OPTS: { key: typeof sortBy; label: string }[] = [
        { key: "default",    label: "Default" },
        { key: "bonus-high", label: "Bonus: High → Low" },
        { key: "bonus-low",  label: "Bonus: Low → High" },
      ];
      return (
        <div className="flex flex-col h-full bg-background">
          <div className="flex items-center gap-3 px-4 pt-4 pb-3 bg-card border-b border-border shrink-0">
            <button onClick={() => setShowFilter(false)} className="shrink-0 text-muted-foreground hover:text-foreground transition-colors">
              <ChevronLeft size={22} />
            </button>
            <p className="flex-1 text-[16px] font-bold text-foreground">Filters</p>
            <button onClick={() => { setSortBy("default"); setSliderMin(absMin); }}
              className="text-[12px] font-semibold text-primary hover:text-blue-700 transition-colors">
              Reset all
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-6">
            {/* Sort by */}
            <div>
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">Sort by</p>
              <div className="flex flex-col gap-2">
                {SORT_OPTS.map(o => (
                  <button key={o.key} onClick={() => setSortBy(o.key)}
                    className={`flex items-center justify-between px-4 py-3 rounded-2xl border-2 transition-all ${sortBy === o.key ? "border-primary bg-primary/5" : "border-border bg-card"}`}>
                    <span className={`text-[13px] font-semibold ${sortBy === o.key ? "text-primary" : "text-foreground"}`}>{o.label}</span>
                    {sortBy === o.key && <Check size={16} className="text-primary" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Min bonus slider */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Min bonus</p>
                <span className={`text-[13px] font-bold ${bonusFiltered ? "text-emerald-600" : "text-muted-foreground"}`}>
                  {bonusFiltered ? `+${sliderMin.toLocaleString()} UZS` : "Any"}
                </span>
              </div>
              <div className="px-1">
                <input
                  type="range"
                  min={absMin}
                  max={absMax}
                  step={Math.max(500, Math.round((absMax - absMin) / 100))}
                  value={sliderMin}
                  onChange={e => setSliderMin(Number(e.target.value))}
                  className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #10B981 ${((sliderMin - absMin) / (absMax - absMin)) * 100}%, #E5E7EB ${((sliderMin - absMin) / (absMax - absMin)) * 100}%)`,
                    accentColor: "#10B981",
                  }}
                />
                <div className="flex justify-between mt-2">
                  <span className="text-[10px] text-muted-foreground">+{absMin.toLocaleString()} UZS</span>
                  <span className="text-[10px] text-muted-foreground">+{absMax.toLocaleString()} UZS</span>
                </div>
              </div>
            </div>

          </div>

          <div className="shrink-0 px-4 py-3 bg-card border-t border-border">
            <button onClick={() => setShowFilter(false)}
              className="w-full bg-primary text-white rounded-xl py-3.5 text-[14px] font-semibold shadow-md hover:bg-blue-700 active:scale-[0.98] transition-all">
              Show {filteredListings.length} result{filteredListings.length !== 1 ? "s" : ""}
            </button>
          </div>
        </div>
      );
    }

    // ── Listings grid ──
    return (
      <div className="flex flex-col h-full bg-background">
        {/* Search bar + filter button */}
        <div className="flex items-center gap-2 px-4 pt-4 pb-3 bg-card border-b border-border shrink-0">
          <button onClick={() => setSelectedName(null)} className="shrink-0 text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft size={22} />
          </button>
          <button className="flex-1 relative" onClick={() => setSelectedName(null)}>
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" width="15" height="15" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
              <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <div className="w-full bg-[#F4F5F7] rounded-xl pl-9 pr-4 py-2.5 text-[13px] text-foreground text-left border border-primary ring-2 ring-primary/20 truncate">
              {selectedName}
            </div>
          </button>
          {/* Filter icon button */}
          <button onClick={() => setShowFilter(true)}
            className="relative shrink-0 w-10 h-10 rounded-xl bg-[#F4F5F7] border border-border flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-all">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <line x1="4" y1="6" x2="20" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="7" y1="12" x2="17" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="10" y1="18" x2="14" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary text-white text-[9px] font-bold flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Results count */}
        <div className="px-4 pt-3 pb-1 shrink-0">
          <p className="text-[12px] text-muted-foreground">{filteredListings.length} shop{filteredListings.length !== 1 ? "s" : ""} selling this</p>
        </div>

        {/* Grid — extra bottom padding so FAB doesn't cover last row */}
        <div className="flex-1 overflow-y-auto px-4 pt-2 pb-24">
          {filteredListings.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {filteredListings.map(p => <ListingCard key={p.id} p={p} />)}
            </div>
          ) : (
            <div className="flex flex-col items-center py-10 gap-3">
              <EmptyIllustration />
              <p className="text-[14px] font-semibold text-foreground">No results match your filters</p>
              <button onClick={() => { setSortBy("default"); setSliderMin(absMin); }}
                className="text-[13px] font-semibold text-primary hover:underline">Clear filters</button>
            </div>
          )}
        </div>

        {/* Fixed cart FAB */}
      </div>
    );
  }

  // ── Step 1: search input + text suggestions ──
  return (
    <div className="flex flex-col h-full bg-background">
      <TopBar onBack={onClose} />
      <div className="flex-1 overflow-y-auto">
        {/* Typing: plain text autocomplete list */}
        {q && (
          <div className="px-4 pt-2 pb-4">
            {suggestions.length > 0 ? suggestions.map(p => (
              <button key={p.id} onClick={() => setSelectedName(p.name)}
                className="w-full flex items-center gap-3 px-3 py-3 border-b border-border last:border-0 text-left hover:bg-primary/5 transition-all">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" className="text-muted-foreground shrink-0">
                  <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                  <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <span className="flex-1 text-[14px] text-foreground font-medium truncate">{p.name}</span>
                <span className="text-[11px] text-muted-foreground shrink-0">{p.category}</span>
              </button>
            )) : (
              <div className="flex flex-col items-center py-10 gap-3">
                <EmptyIllustration />
                <p className="text-[14px] font-semibold text-foreground">No results found</p>
                <p className="text-[12px] text-muted-foreground">Try a different name or brand.</p>
              </div>
            )}
          </div>
        )}

        {/* Empty state: category list */}
        {!q && (
          <div className="px-4 pt-3 flex flex-col gap-1">
            {CATEGORIES.map(cat => (
              <button key={cat.label} onClick={() => onSelectCategory?.({ label: cat.label, icon: cat.icon })}
                className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-[#F4F5F7] transition-all text-left">
                <div className="w-9 h-9 rounded-xl bg-[#F4F5F7] flex items-center justify-center text-primary shrink-0"><CatIcon name={cat.icon} size={20} /></div>
                <span className="text-[14px] font-semibold text-foreground">{cat.label}</span>
                <ChevronRight size={16} className="ml-auto text-muted-foreground shrink-0" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ProductCardImage({ images, height = "h-32", onClick, initialLiked = false, showLike = true }: {
  images: string[]; height?: string; onClick: () => void; initialLiked?: boolean; showLike?: boolean;
}) {
  const [idx, setIdx] = useState(0);
  const [liked, setLiked] = useState(initialLiked);
  const gesture = useRef<{ x: number; moved: boolean }>({ x: 0, moved: false });

  return (
    <div
      className={`relative bg-muted ${height} overflow-hidden shrink-0 cursor-pointer`}
      onTouchStart={e => { gesture.current = { x: e.touches[0].clientX, moved: false }; }}
      onTouchMove={e => { if (Math.abs(e.touches[0].clientX - gesture.current.x) > 8) gesture.current.moved = true; }}
      onTouchEnd={e => {
        const dx = e.changedTouches[0].clientX - gesture.current.x;
        if (gesture.current.moved && Math.abs(dx) > 28)
          setIdx(i => dx < 0 ? (i + 1) % images.length : (i - 1 + images.length) % images.length);
      }}
      onClick={() => { if (!gesture.current.moved) onClick(); }}
    >
      <img src={images[idx]} alt="" className="w-full h-full object-cover" />
      {/* Like button */}
      {showLike && (
        <button
          onClick={e => { e.stopPropagation(); setLiked(l => !l); }}
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/85 backdrop-blur-sm flex items-center justify-center shadow-sm transition-all hover:scale-110"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill={liked ? "#ef4444" : "none"}>
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke={liked ? "#ef4444" : "#6b7280"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}
      {images.length > 1 && (
        <div className="absolute bottom-1.5 left-0 right-0 flex justify-center gap-1 pointer-events-none">
          {images.map((_, i) => (
            <div key={i} className={`rounded-full transition-all duration-150 ${i === idx ? "w-3 h-[5px] bg-white" : "w-[5px] h-[5px] bg-white/55"}`} />
          ))}
        </div>
      )}
    </div>
  );
}

function CategoryPage({ category, icon, onBack, onSelect }: {
  category: string; icon: string; onBack: () => void;
  onSelect: (p: Product) => void;
}) {
  const [search, setSearch] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [sortBy, setSortBy] = useState<"default"|"bonus-high"|"bonus-low">("default");
  const catProducts = PRODUCTS.filter(p => p.category === category);
  const allBonus = catProducts.map(p => bonusUZS(p));
  const absMin = allBonus.length ? Math.min(...allBonus) : 0;
  const absMax = allBonus.length ? Math.max(...allBonus) : 100000;
  const [sliderMin, setSliderMin] = useState(absMin);

  const bonusFiltered = sliderMin > absMin;
  const activeFilterCount = [sortBy !== "default", bonusFiltered].filter(Boolean).length;

  const filtered = catProducts
    .filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase()))
    .filter(p => bonusUZS(p) >= sliderMin)
    .sort((a, b) => {
      if (sortBy === "bonus-high") return bonusUZS(b) - bonusUZS(a);
      if (sortBy === "bonus-low")  return bonusUZS(a) - bonusUZS(b);
      return 0;
    });

  const SORT_OPTS: { key: typeof sortBy; label: string }[] = [
    { key: "default",    label: "Default" },
    { key: "bonus-high", label: "Bonus: High → Low" },
    { key: "bonus-low",  label: "Bonus: Low → High" },
  ];

  if (showFilter) {
    return (
      <div className="flex flex-col h-full bg-background">
        <div className="flex items-center gap-3 px-4 pt-4 pb-3 bg-card border-b border-border shrink-0">
          <button onClick={() => setShowFilter(false)} className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"><ChevronLeft size={22} /></button>
          <p className="flex-1 text-[16px] font-bold text-foreground">Filters</p>
          <button onClick={() => { setSortBy("default"); setOnlyDiscount(false); setOnlyInStock(false); setSliderMax(absMax); }}
            className="text-[12px] font-semibold text-primary hover:text-blue-700 transition-colors">Reset all</button>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-6">
          <div>
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">Sort by</p>
            <div className="flex flex-col gap-2">
              {SORT_OPTS.map(o => (
                <button key={o.key} onClick={() => setSortBy(o.key)}
                  className={`flex items-center justify-between px-4 py-3 rounded-2xl border-2 transition-all ${sortBy === o.key ? "border-primary bg-primary/5" : "border-border bg-card"}`}>
                  <span className={`text-[13px] font-semibold ${sortBy === o.key ? "text-primary" : "text-foreground"}`}>{o.label}</span>
                  {sortBy === o.key && <Check size={16} className="text-primary" />}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Min bonus</p>
              <span className={`text-[13px] font-bold ${bonusFiltered ? "text-emerald-600" : "text-muted-foreground"}`}>
                {bonusFiltered ? `+${sliderMin.toLocaleString()} UZS` : "Any"}
              </span>
            </div>
            <div className="px-1">
              <input type="range" min={absMin} max={absMax} step={Math.max(500, Math.round((absMax - absMin) / 100))}
                value={sliderMin} onChange={e => setSliderMin(Number(e.target.value))}
                className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                style={{ background: `linear-gradient(to right, #10B981 ${((sliderMin-absMin)/(absMax-absMin))*100}%, #E5E7EB ${((sliderMin-absMin)/(absMax-absMin))*100}%)`, accentColor: "#10B981" }}
              />
              <div className="flex justify-between mt-2">
                <span className="text-[10px] text-muted-foreground">+{absMin.toLocaleString()} UZS</span>
                <span className="text-[10px] text-muted-foreground">+{absMax.toLocaleString()} UZS</span>
              </div>
            </div>
          </div>
        </div>
        <div className="shrink-0 px-4 py-3 bg-card border-t border-border">
          <button onClick={() => setShowFilter(false)}
            className="w-full bg-primary text-white rounded-xl py-3.5 text-[14px] font-semibold shadow-md hover:bg-blue-700 active:scale-[0.98] transition-all">
            Show {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background relative">
      {/* Search + filter */}
      <div className="flex items-center gap-2 px-4 py-3 bg-card border-b border-border shrink-0">
        <button onClick={onBack} className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"><ChevronLeft size={22} /></button>
        <div className="flex-1 relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" width="14" height="14" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
            <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <input type="text" placeholder={`Search in ${category}...`}
            value={search} onChange={e => setSearch(e.target.value)}
            className="w-full bg-[#F4F5F7] rounded-xl pl-9 pr-9 py-2.5 text-[13px] text-foreground placeholder-muted-foreground border border-transparent focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"><X size={14} /></button>
          )}
        </div>
        <button onClick={() => setShowFilter(true)}
          className="relative shrink-0 w-10 h-10 rounded-xl bg-[#F4F5F7] border border-border flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-all">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <line x1="4" y1="6" x2="20" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="7" y1="12" x2="17" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="10" y1="18" x2="14" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          {activeFilterCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary text-white text-[9px] font-bold flex items-center justify-center">{activeFilterCount}</span>
          )}
        </button>
      </div>

      {/* Count */}
      <div className="px-4 pt-3 pb-1 shrink-0">
        <p className="text-[12px] text-muted-foreground">{filtered.length} product{filtered.length !== 1 ? "s" : ""}</p>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto px-4 pt-2 pb-24">
        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {filtered.map(p => (
              <div key={p.id} className="bg-card rounded-2xl overflow-hidden border border-border flex flex-col" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                <ProductCardImage images={[p.img, ...(PRODUCT_EXTRA_IMGS[p.sku] ?? [])]} onClick={() => onSelect(p)} />
                <div className="p-2.5 flex flex-col flex-1">
                  <button onClick={() => onSelect(p)} className="text-left mb-1">
                    <p className="text-[12px] font-semibold text-foreground leading-tight line-clamp-2">{p.name}</p>
                  </button>
                  <div className="mt-auto">
                    <div className="flex items-center gap-1 bg-emerald-50 rounded-xl px-2 py-1.5">
                      <Gift size={11} className="text-emerald-600 shrink-0" />
                      <span className="text-[11px] font-semibold text-emerald-600">+{fmtBonus(p)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center py-10 gap-3">
            <EmptyIllustration />
            <p className="text-[14px] font-semibold text-foreground">No products found</p>
            {(search || activeFilterCount > 0) && (
              <button onClick={() => { setSearch(""); setSortBy("default"); setOnlyDiscount(false); setOnlyInStock(false); setSliderMax(absMax); }}
                className="text-[13px] font-semibold text-primary hover:underline">Clear filters</button>
            )}
          </div>
        )}
      </div>

    </div>
  );
}

// ─── NOTIFICATIONS PAGE ───────────────────────────────────────────────────────
const NOTIF_DATA = [
  { id: 1, type: "order",  title: "Order Shipped",     body: "Your order #2041 is on its way to you",          time: "2 min ago",  read: false },
  { id: 2, type: "price",  title: "Price Drop",        body: "Bosch Oil Filter dropped to 45,000 UZS",         time: "1 hr ago",   read: false },
  { id: 3, type: "promo",  title: "Flash Sale",        body: "20% off all Brakes & Filters — today only",      time: "3 hr ago",   read: false },
  { id: 4, type: "order",  title: "Order Delivered",   body: "Order #2038 has been delivered successfully",    time: "Yesterday",  read: true  },
  { id: 5, type: "new",    title: "New Arrivals",      body: "10 new products added in Engine category",       time: "2 days ago", read: true  },
  { id: 6, type: "price",  title: "Price Drop",        body: "NGK Spark Plugs now 89,000 UZS",                 time: "3 days ago", read: true  },
  { id: 7, type: "promo",  title: "Tire Season",       body: "Get ready for summer — 15% off all tires",      time: "1 week ago", read: true  },
];

function NotificationsPage({ onBack }: { onBack: () => void }) {
  const [items, setItems] = useState(NOTIF_DATA);
  const unreadCount = items.filter(n => !n.read).length;

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-5 pb-3 bg-card border-b border-border shrink-0">
        <button onClick={onBack} className="shrink-0 text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft size={22} />
        </button>
        <span className="flex-1 text-[17px] font-bold text-foreground">Notifications</span>
        {unreadCount > 0 && (
          <button onClick={() => setItems(its => its.map(n => ({ ...n, read: true })))}
            className="text-muted-foreground hover:text-primary transition-colors p-1">
            {/* Double tick */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M2 12l5 5L17 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7 12l5 5L22 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 pb-16">
            <EmptyIllustration />
            <p className="text-[14px] font-semibold text-foreground">No notifications</p>
            <p className="text-[12px] text-muted-foreground">You're all caught up!</p>
          </div>
        ) : (
          <div className="px-4 py-2 flex flex-col gap-0.5">
            {items.map(n => (
              <button key={n.id} onClick={() => setItems(its => its.map(i => i.id === n.id ? { ...i, read: true } : i))}
                className={`flex items-start gap-3 px-3 py-3.5 rounded-2xl text-left transition-all ${n.read ? "bg-transparent" : "bg-primary/5"}`}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-[13px] font-bold text-foreground leading-tight">{n.title}</p>
                    {!n.read && <div className="w-2 h-2 rounded-full bg-primary shrink-0" />}
                  </div>
                  <p className="text-[12px] text-muted-foreground mt-0.5 leading-snug">{n.body}</p>
                  <p className="text-[11px] text-muted-foreground/70 mt-1">{n.time}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── LIKED ITEMS PAGE ────────────────────────────────────────────────────────
function LikedItemsPage({ likedIds, onSelect, onBack }: {
  likedIds: number[]; onSelect: (p: Product) => void; onBack: () => void;
}) {
  const liked = PRODUCTS.filter(p => likedIds.includes(p.id));
  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex items-center gap-3 px-4 pt-5 pb-3 bg-card border-b border-border shrink-0">
        <button onClick={onBack} className="shrink-0 text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft size={22} />
        </button>
        <span className="flex-1 text-[17px] font-bold text-foreground">Liked Items</span>
        {liked.length > 0 && (
          <span className="text-[12px] text-muted-foreground font-medium">{liked.length} item{liked.length !== 1 ? "s" : ""}</span>
        )}
      </div>

      {liked.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 gap-3 pb-16">
          <EmptyIllustration />
          <p className="text-[14px] font-semibold text-foreground">No liked items yet</p>
          <p className="text-[12px] text-muted-foreground">Tap the heart on any product to save it</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto px-4 pt-4 pb-4">
          <div className="grid grid-cols-2 gap-3">
            {liked.map(p => (
              <div key={p.id} className="bg-card rounded-2xl overflow-hidden border border-border flex flex-col" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                <ProductCardImage images={[p.img, ...(PRODUCT_EXTRA_IMGS[p.sku] ?? [])]} initialLiked={true} onClick={() => onSelect(p)} />
                <div className="p-2.5 flex flex-col flex-1">
                  <button onClick={() => onSelect(p)} className="text-left mb-0.5">
                    <p className="text-[12px] font-semibold text-foreground leading-tight line-clamp-2">{p.name}</p>
                  </button>
                  <p className="text-[10px] text-muted-foreground font-medium">{p.shop}</p>
                  <div className="mt-auto">
                    <div className="flex items-center gap-1 bg-emerald-50 rounded-xl px-2 py-1.5">
                      <Gift size={11} className="text-emerald-600 shrink-0" />
                      <span className="text-[11px] font-semibold text-emerald-600">+{fmtBonus(p)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MechanicMainPage({ onSelect, onSubPageChange }: {
  onSelect: (p: Product) => void;
  onSubPageChange: (active: boolean) => void;
}) {
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLiked, setShowLiked] = useState(false);
  const [feedbackModal, setFeedbackModal] = useState<FeedbackModalProps | null>(null);
  const [likedIds, setLikedIds] = useState<number[]>([PRODUCTS[0]?.id, PRODUCTS[2]?.id, PRODUCTS[4]?.id].filter(Boolean) as number[]);
  const [activeCatPage, setActiveCatPage] = useState<{ label: string; icon: string } | null>(null);

  if (showNotifications) return <NotificationsPage onBack={() => { setShowNotifications(false); onSubPageChange(false); }} />;
  if (showLiked) return <LikedItemsPage likedIds={likedIds} onBack={() => { setShowLiked(false); onSubPageChange(false); }}
    onSelect={p => { setShowLiked(false); onSubPageChange(false); onSelect(p); }} />;
  if (activeCatPage) {
    return <CategoryPage category={activeCatPage.label} icon={activeCatPage.icon}
      onBack={() => { setActiveCatPage(null); onSubPageChange(false); }} onSelect={onSelect} />;
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto" style={{ minHeight: 0 }}>
      {feedbackModal && <FeedbackModal {...feedbackModal} />}
      {/* Search page overlay */}
      {showSearch && (
        <div className="absolute inset-0 z-30 bg-background">
          <SearchPage
            onSelect={p => { onSelect(p); setShowSearch(false); }}
            onClose={() => setShowSearch(false)}
            onSelectCategory={cat => { setShowSearch(false); setActiveCatPage(cat); }}
          />
        </div>
      )}

      {/* Search bar (tap to open search page) + Notification */}
      <div className="px-4 pt-4 pb-3 flex items-center gap-2 shrink-0">
        <button className="flex-1 relative" onClick={() => setShowSearch(true)}>
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
            <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <div className="w-full bg-[#F4F5F7] rounded-xl pl-9 pr-4 py-2.5 text-[13px] text-muted-foreground text-left border border-transparent">
            Search parts, brands...
          </div>
        </button>
        <button onClick={() => { setShowNotifications(true); onSubPageChange(true); }} className="relative w-10 h-10 rounded-xl bg-[#F4F5F7] flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all shrink-0">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border border-white" />
        </button>
        <button onClick={() => { setShowLiked(true); onSubPageChange(true); }} className="w-10 h-10 rounded-xl bg-[#F4F5F7] flex items-center justify-center text-muted-foreground hover:text-red-400 hover:bg-red-50 transition-all shrink-0">
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Categories */}
      <div className="shrink-0 px-4 mb-1">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[13px] font-bold text-foreground">Categories</span>
          <button onClick={() => setShowSearch(true)} className="text-[11px] font-semibold text-primary">See all</button>
        </div>
        <div className="grid grid-cols-4 gap-y-3">
          {CATEGORIES.map((cat) => (
            <button key={cat.label} onClick={() => { setActiveCatPage({ label: cat.label, icon: cat.icon }); onSubPageChange(true); }}
              className="flex flex-col items-center gap-1.5">
              <div className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center transition-all border-2 border-transparent bg-[#F4F5F7] hover:border-primary hover:bg-primary/10 text-primary">
                {cat.img
                  ? <img src={cat.img} alt={cat.label} className="w-13 h-13 object-contain" />
                  : <CatIcon name={cat.icon} size={26} />}
              </div>
              <span className="text-[10px] font-semibold text-center leading-tight text-muted-foreground w-full px-1">
                {cat.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Dev: modal test strip */}
      <div className="px-4 mb-2">
        <p className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-widest mb-2">Preview modals</p>
        <div className="flex gap-2">
          <button onClick={() => setFeedbackModal({
              type: "success", title: "Order Placed!", body: "Your order has been confirmed and will be ready in 30 min.",
              primaryLabel: "Track Order", secondaryLabel: "Back to Home",
              onPrimary: () => setFeedbackModal(null), onClose: () => setFeedbackModal(null),
            })}
            className="flex-1 py-2.5 rounded-xl text-[12px] font-semibold bg-green-50 text-green-600 border border-green-200">
            Success modal
          </button>
          <button onClick={() => setFeedbackModal({
              type: "error", title: "Payment Failed", body: "We couldn't process your payment. Please check your card details and try again.",
              primaryLabel: "Try Again", secondaryLabel: "Cancel",
              onPrimary: () => setFeedbackModal(null), onClose: () => setFeedbackModal(null),
            })}
            className="flex-1 py-2.5 rounded-xl text-[12px] font-semibold bg-red-50 text-red-500 border border-red-200">
            Error modal
          </button>
        </div>
      </div>

      {/* Products */}
      <div className="px-4 pb-4">
        <p className="text-[13px] font-bold text-foreground mb-3">All Products</p>
        <div className="grid grid-cols-2 gap-3">
          {PRODUCTS.map(p => {
            return (
              <div key={p.id} className="bg-card rounded-2xl overflow-hidden border border-border flex flex-col" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                <ProductCardImage images={[p.img, ...(PRODUCT_EXTRA_IMGS[p.sku] ?? [])]} onClick={() => onSelect(p)} />
                <div className="p-2.5 flex flex-col flex-1">
                  <button onClick={() => onSelect(p)} className="text-left mb-0.5">
                    <p className="text-[12px] font-semibold text-foreground leading-tight line-clamp-2">{p.name}</p>
                  </button>
                  <p className="text-[10px] text-muted-foreground font-medium">{p.shop}</p>
                  {/* Cashback badge */}
                  <div className="mt-auto pt-1">
                    <div className="flex items-center gap-1 bg-emerald-50 rounded-xl px-2 py-1.5">
                      <Gift size={11} className="text-emerald-600 shrink-0" />
                      <span className="text-[11px] font-semibold text-emerald-600">+{fmtBonus(p)}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── EMPTY STATE ILLUSTRATION (shared across all empty pages) ────────────────
function EmptyIllustration() {
  return (
    <svg width="180" height="160" viewBox="0 0 180 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="ei-r" x1="55" y1="40" x2="110" y2="95" gradientUnits="userSpaceOnUse"><stop stopColor="#818CF8"/><stop offset="1" stopColor="#6366F1"/></linearGradient>
        <linearGradient id="ei-g" x1="60" y1="45" x2="105" y2="90" gradientUnits="userSpaceOnUse"><stop stopColor="#EEF2FF"/><stop offset="1" stopColor="#C7D2FE" stopOpacity="0.7"/></linearGradient>
        <linearGradient id="ei-p" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#FFFFFF"/><stop offset="1" stopColor="#E2E8F0"/></linearGradient>
        <radialGradient id="ei-sh" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(90 148) scale(50 8)"><stop stopColor="#312E81" stopOpacity="0.16"/><stop offset="1" stopColor="#312E81" stopOpacity="0"/></radialGradient>
      </defs>
      <ellipse cx="90" cy="148" rx="50" ry="8" fill="url(#ei-sh)"/>
      <g transform="rotate(-12 120 70)"><rect x="104" y="48" width="40" height="52" rx="6" fill="url(#ei-p)" stroke="#E2E8F0"/><rect x="112" y="60" width="24" height="4" rx="2" fill="#CBD5E1"/><rect x="112" y="70" width="20" height="4" rx="2" fill="#E2E8F0"/><rect x="112" y="80" width="24" height="4" rx="2" fill="#E2E8F0"/></g>
      <g transform="rotate(8 50 96)"><rect x="32" y="84" width="40" height="52" rx="6" fill="url(#ei-p)" stroke="#E2E8F0"/><rect x="40" y="96" width="24" height="4" rx="2" fill="#CBD5E1"/><rect x="40" y="106" width="18" height="4" rx="2" fill="#E2E8F0"/></g>
      <path d="M138 30l2 6 6 2-6 2-2 6-2-6-6-2 6-2Z" fill="#FBBF24"/>
      <circle cx="82" cy="68" r="32" fill="url(#ei-g)"/>
      <circle cx="82" cy="68" r="32" fill="#fff" fillOpacity="0.25"/>
      <circle cx="82" cy="68" r="32" stroke="url(#ei-r)" strokeWidth="9"/>
      <circle cx="73" cy="64" r="3" fill="#475569" fillOpacity="0.6"/><circle cx="91" cy="64" r="3" fill="#475569" fillOpacity="0.6"/>
      <path d="M73 80q9-6 18 0" stroke="#475569" strokeOpacity="0.6" strokeWidth="3" strokeLinecap="round" fill="none"/>
      <path d="M64 52q-8 8-6 22" stroke="#fff" strokeOpacity="0.7" strokeWidth="5" strokeLinecap="round" fill="none"/>
      <rect x="104" y="90" width="14" height="34" rx="7" transform="rotate(-45 104 90)" fill="url(#ei-r)"/>
    </svg>
  );
}

// ─── FEEDBACK MODAL ──────────────────────────────────────────────────────────
interface FeedbackModalProps {
  type: "success" | "error";
  title: string;
  body: string;
  onClose: () => void;
  // kept for call-site compat but unused in render
  primaryLabel?: string;
  secondaryLabel?: string;
  onPrimary?: () => void;
  onSecondary?: () => void;
}

function FeedbackModal({ type, title, body, onClose }: FeedbackModalProps) {
  const isSuccess = type === "success";
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}
      onClick={onClose}>
      <div className="w-90 bg-card rounded-3xl relative"
        style={{ boxShadow: "0 24px 60px rgba(0,0,0,0.2)" }}
        onClick={e => e.stopPropagation()}>

        {/* X button */}
        <button onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#F4F5F7] flex items-center justify-center text-muted-foreground hover:bg-[#E8E9EC] transition-all">
          <X size={16} />
        </button>

        {/* Content */}
        <div className="flex flex-col items-center px-6 pt-10 pb-8 gap-4 text-center">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center ${isSuccess ? "bg-green-100" : "bg-red-100"}`}>
            {isSuccess ? (
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                <path d="M20 6L9 17l-5-5" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : (
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <p className="text-[18px] font-bold text-foreground">{title}</p>
            <p className="text-[13px] text-muted-foreground leading-snug">{body}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PRODUCT DETAIL PAGE ──────────────────────────────────────────────────────
function ImageViewer({ images, startIndex, onClose }: {
  images: string[]; startIndex: number; onClose: () => void;
}) {
  const [current, setCurrent] = useState(startIndex);
  const prev = () => setCurrent(i => (i - 1 + images.length) % images.length);
  const next = () => setCurrent(i => (i + 1) % images.length);

  return (
    <div className="absolute inset-0 z-50 bg-black flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3 shrink-0">
        <div className="flex gap-1.5 items-center">
          {images.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)}
              className={`rounded-full transition-all duration-200 ${i === current ? "w-5 h-[7px] bg-white" : "w-[7px] h-[7px] bg-white/35"}`}
            />
          ))}
        </div>
        <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center text-white hover:bg-white/25 transition-all">
          <X size={17} />
        </button>
      </div>

      {/* Main image */}
      <div className="flex-1 relative flex items-center justify-center">
        <img src={images[current]} alt="" className="w-full h-full object-contain" />
        {images.length > 1 && (
          <>
            <button onClick={prev} className="absolute left-0 top-0 w-1/2 h-full" />
            <button onClick={next} className="absolute right-0 top-0 w-1/2 h-full" />
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="shrink-0 pb-8 pt-4 px-4">
          <div className="flex gap-2 justify-center">
            {images.map((img, i) => (
              <button key={i} onClick={() => setCurrent(i)}
                className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-200 ${i === current ? "border-white scale-105" : "border-transparent opacity-45"}`}>
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ProductDetailPage({ product, onBack }: { product: Product; onBack: () => void }) {
  const similar = PRODUCTS.filter(p => p.id !== product.id && p.category === product.category).slice(0, 6);
  const images = [product.img, ...(PRODUCT_EXTRA_IMGS[product.sku] ?? [])];
  const [imgIdx, setImgIdx] = useState(0);
  const [showViewer, setShowViewer] = useState(false);
  const lowStock = product.stock <= 15;
  const [liked, setLiked] = useState(false);
  const variations = PRODUCT_VARIATIONS[product.sku] ?? [];
  const [selVars, setSelVars] = useState<Record<string, string>>(() =>
    Object.fromEntries(variations.map(v => [v.name, v.options[0]]))
  );

  return (
    <div className="flex flex-col h-full relative">
      {showViewer && <ImageViewer images={images} startIndex={imgIdx} onClose={() => setShowViewer(false)} />}

      {/* Hero carousel */}
      <div className="relative shrink-0" style={{ height: 250 }}>
        <img src={images[imgIdx]} alt={product.name} className="w-full h-full object-cover cursor-pointer" onClick={() => setShowViewer(true)} />
        {/* Gradient overlay — top shadow for buttons + bottom fade into card */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.32) 0%, transparent 45%, rgba(255,255,255,0.18) 80%, rgba(255,255,255,0.55) 100%)" }} />
        {/* Left/right tap zones (prev/next) */}
        {images.length > 1 && (
          <>
            <button onClick={() => setImgIdx(i => (i - 1 + images.length) % images.length)} className="absolute left-0 top-10 bottom-10 w-1/4 z-10" />
            <button onClick={() => setImgIdx(i => (i + 1) % images.length)} className="absolute right-0 top-10 bottom-10 w-1/4 z-10" />
          </>
        )}
        {/* Back button */}
        <button onClick={onBack}
          className="absolute top-4 left-4 z-20 w-9 h-9 rounded-xl bg-white/90 backdrop-blur-sm flex items-center justify-center text-foreground shadow-md hover:bg-white transition-all">
          <ArrowLeft size={17} />
        </button>
        {/* Like + Share buttons */}
        <div className="absolute top-4 right-4 z-20 flex gap-2">
          <button onClick={() => setLiked(l => !l)} className="w-9 h-9 rounded-xl bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md hover:bg-white transition-all">
            <svg width="17" height="17" viewBox="0 0 24 24" fill={liked ? "#ef4444" : "none"}>
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke={liked ? "#ef4444" : "currentColor"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button className="w-9 h-9 rounded-xl bg-white/90 backdrop-blur-sm flex items-center justify-center text-foreground shadow-md hover:bg-white transition-all">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
              <circle cx="18" cy="5" r="3" stroke="currentColor" strokeWidth="1.8"/>
              <circle cx="6" cy="12" r="3" stroke="currentColor" strokeWidth="1.8"/>
              <circle cx="18" cy="19" r="3" stroke="currentColor" strokeWidth="1.8"/>
              <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        {/* Category badge + dots row */}
        <div className="absolute bottom-3 left-4 right-4 z-20 flex items-center justify-between">
          <span className="px-2.5 py-1 rounded-lg bg-primary text-white text-[11px] font-bold tracking-wide">{product.category}</span>
          {images.length > 1 && (
            <div className="flex gap-1.5 items-center pr-1">
              {images.map((_, i) => (
                <button key={i} onClick={() => setImgIdx(i)}
                  className={`rounded-full transition-all duration-200 ${i === imgIdx ? "w-4 h-[6px] bg-white" : "w-[6px] h-[6px] bg-white/55"}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto bg-background">
        <div className="bg-card rounded-t-[32px] -mt-7 relative px-5 pt-6 pb-4">

          {/* Name + Brand row */}
          <div className="flex items-start justify-between gap-2 mb-1 pt-5">
            <h2 className="text-[17px] font-bold text-foreground leading-snug flex-1">{product.name}</h2>
          </div>
          <p className="text-[12px] text-muted-foreground font-medium mb-3">by <span className="text-foreground font-semibold">{product.brand}</span> · SKU: {product.sku}</p>

          {/* Bonus value */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50">
              <Gift size={15} className="text-emerald-600 shrink-0" />
              <span className="text-[17px] font-bold text-emerald-600">+{fmtBonus(product)}</span>
            </div>
            <p className="text-[11px] text-muted-foreground">Bonus on purchase</p>
          </div>

          {/* Variations */}
          {variations.length > 0 && (
            <div className="mb-4">
              {variations.map(v => (
                <div key={v.name} className="mb-3">
                  <div className="flex items-center gap-1.5 mb-2">
                    <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{v.name}</p>
                    <span className="text-[11px] font-bold text-foreground">· {selVars[v.name]}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {v.options.map(opt => {
                      const active = selVars[v.name] === opt;
                      return (
                        <button key={opt}
                          onClick={() => setSelVars(s => ({ ...s, [v.name]: opt }))}
                          className={`px-3 py-1.5 rounded-xl border-2 text-[12px] font-semibold transition-all ${
                            active ? "border-primary bg-primary/8 text-primary" : "border-border bg-card text-foreground hover:border-primary/40"
                          }`}>
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Divider */}
          <div className="h-px bg-border mb-4" />

          {/* Description */}
          <div className="mb-5">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Description</p>
            <p className="text-[13px] text-foreground leading-relaxed">{product.description}</p>
          </div>

          {/* Specs grid */}
          <div className="mb-5">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Specs</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Brand",    value: product.brand },
                { label: "SKU",      value: product.sku },
                { label: "Category", value: product.category },
              ].map(s => (
                <div key={s.label} className="bg-[#F4F5F7] rounded-xl px-3 py-2.5">
                  <p className="text-[10px] text-muted-foreground font-medium">{s.label}</p>
                  <p className="text-[12px] font-semibold text-foreground mt-0.5 truncate">{s.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Similar Products */}
          {similar.length > 0 && (
            <div className="mb-2">
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2.5">Similar Products</p>
              <div className="grid grid-cols-2 gap-3">
                {similar.map(sp => (
                  <div key={sp.id} className="bg-card rounded-2xl border border-border overflow-hidden flex flex-col" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                    <ProductCardImage images={[sp.img, ...(PRODUCT_EXTRA_IMGS[sp.sku] ?? [])]} height="h-28" onClick={() => {}} />
                    <div className="p-2.5 flex flex-col flex-1">
                      <p className="text-[11px] font-semibold text-foreground leading-tight line-clamp-2 mb-0.5">{sp.name}</p>
                      <p className="text-[10px] text-muted-foreground mb-1">{sp.shop}</p>
                      <div className="mt-auto">
                        <div className="flex items-center gap-1 bg-primary/8 rounded-xl px-2 py-1.5">
                          <Gift size={10} className="text-emerald-600 shrink-0" />
                          <span className="text-[10px] font-semibold text-emerald-600">+{fmtBonus(sp)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

// ─── SHOPS PAGE ───────────────────────────────────────────────────────────────
interface Shop {
  id: number; name: string; address: string;
  distance: string; time: string; status: "open" | "closed";
  products: number; rating: number; phone: string;
  hours: string;
  x: number; y: number;
}

const SHOPS: Shop[] = [
  { id: 1, name: "AutoZone Tashkent",    address: "Chilonzor tumani, 14-mavze",      distance: "1.2 km", time: "8 min",  status: "open",   products: 142, rating: 4.8, phone: "+998 71 234 56 78", hours: "09:00 – 20:00", x: 42, y: 52 },
  { id: 2, name: "CarParts Express",      address: "Yunusobod tumani, Amir Temur ko", distance: "3.4 km", time: "18 min", status: "open",   products:  89, rating: 4.5, phone: "+998 71 345 67 89", hours: "08:00 – 19:00", x: 68, y: 28 },
  { id: 3, name: "SparkMaster Pro",       address: "Mirzo Ulug'bek tumani, 7-blok",  distance: "5.1 km", time: "26 min", status: "closed", products:  67, rating: 4.2, phone: "+998 71 456 78 90", hours: "09:00 – 18:00", x: 75, y: 62 },
  { id: 4, name: "TireHub Uzbekistan",    address: "Sergeli tumani, Nurafshon ko'ch", distance: "6.8 km", time: "32 min", status: "open",   products: 210, rating: 4.9, phone: "+998 71 567 89 01", hours: "08:00 – 21:00", x: 28, y: 72 },
  { id: 5, name: "SuspensionKing",        address: "Uchtepa tumani, Bunyodkor shoh",  distance: "2.7 km", time: "14 min", status: "open",   products:  54, rating: 4.3, phone: "+998 71 678 90 12", hours: "09:00 – 20:00", x: 55, y: 35 },
];

function MapBackground() {
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 390 520" preserveAspectRatio="xMidYMid slice">
      {/* Base */}
      <rect width="390" height="520" fill="#1a2332"/>
      {/* Blocks / districts */}
      <rect x="30"  y="40"  width="90"  height="70"  rx="4" fill="#1e2d42" opacity="0.8"/>
      <rect x="150" y="20"  width="120" height="55"  rx="4" fill="#1e2d42" opacity="0.8"/>
      <rect x="290" y="60"  width="80"  height="90"  rx="4" fill="#1e2d42" opacity="0.8"/>
      <rect x="40"  y="150" width="70"  height="100" rx="4" fill="#1e2d42" opacity="0.8"/>
      <rect x="200" y="130" width="100" height="80"  rx="4" fill="#1e2d42" opacity="0.7"/>
      <rect x="310" y="180" width="65"  height="110" rx="4" fill="#1e2d42" opacity="0.8"/>
      <rect x="60"  y="290" width="110" height="90"  rx="4" fill="#1e2d42" opacity="0.8"/>
      <rect x="200" y="260" width="85"  height="120" rx="4" fill="#1e2d42" opacity="0.7"/>
      <rect x="300" y="320" width="75"  height="80"  rx="4" fill="#1e2d42" opacity="0.8"/>
      <rect x="30"  y="410" width="130" height="80"  rx="4" fill="#1e2d42" opacity="0.7"/>
      <rect x="210" y="400" width="90"  height="95"  rx="4" fill="#1e2d42" opacity="0.8"/>
      {/* Park / green area */}
      <ellipse cx="155" cy="190" rx="35" ry="25" fill="#1a3020" opacity="0.9"/>
      <ellipse cx="330" cy="420" rx="28" ry="20" fill="#1a3020" opacity="0.8"/>
      {/* Major roads */}
      <line x1="0"   y1="130" x2="390" y2="130" stroke="#2a3d55" strokeWidth="9"/>
      <line x1="0"   y1="270" x2="390" y2="270" stroke="#2a3d55" strokeWidth="9"/>
      <line x1="0"   y1="400" x2="390" y2="400" stroke="#2a3d55" strokeWidth="7"/>
      <line x1="130" y1="0"   x2="130" y2="520" stroke="#2a3d55" strokeWidth="9"/>
      <line x1="270" y1="0"   x2="270" y2="520" stroke="#2a3d55" strokeWidth="9"/>
      <line x1="60"  y1="0"   x2="60"  y2="520" stroke="#2a3d55" strokeWidth="6"/>
      {/* Secondary roads */}
      <line x1="0"   y1="200" x2="390" y2="200" stroke="#233044" strokeWidth="5"/>
      <line x1="0"   y1="340" x2="390" y2="340" stroke="#233044" strokeWidth="5"/>
      <line x1="195" y1="0"   x2="195" y2="520" stroke="#233044" strokeWidth="5"/>
      <line x1="330" y1="0"   x2="330" y2="520" stroke="#233044" strokeWidth="4"/>
      {/* Tertiary roads */}
      <line x1="0"   y1="80"  x2="390" y2="80"  stroke="#1e2b3d" strokeWidth="3"/>
      <line x1="0"   y1="460" x2="390" y2="460" stroke="#1e2b3d" strokeWidth="3"/>
      <line x1="95"  y1="0"   x2="95"  y2="520" stroke="#1e2b3d" strokeWidth="3"/>
      {/* Road labels */}
      <text x="135" y="125" fill="#3a5270" fontSize="7" fontFamily="sans-serif">Amir Temur ko'chasi</text>
      <text x="135" y="265" fill="#3a5270" fontSize="7" fontFamily="sans-serif">Bunyodkor shoh ko'chasi</text>
      <text x="10"  y="195" fill="#3a5270" fontSize="6" fontFamily="sans-serif" transform="rotate(-90,10,195)">Chilonzor</text>
    </svg>
  );
}

function ShopPin({ shop, selected, onClick }: { shop: Shop; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="absolute flex flex-col items-center transition-all duration-200"
      style={{ left: `${shop.x}%`, top: `${shop.y}%`, transform: "translate(-50%, -100%)", zIndex: selected ? 20 : 10 }}
    >
      <div className={`flex items-center justify-center rounded-full shadow-lg transition-all duration-200 ${
        shop.status === "open"
          ? selected ? "w-12 h-12 bg-primary ring-4 ring-primary/30" : "w-9 h-9 bg-primary/90 hover:bg-primary"
          : selected ? "w-12 h-12 bg-red-500 ring-4 ring-red-400/30" : "w-9 h-9 bg-red-500/90 hover:bg-red-600"
      }`}>
        <Store size={selected ? 22 : 16} className="text-white" />
      </div>
      {selected && (
        <div className={`mt-1 px-2 py-0.5 text-white text-[10px] font-bold rounded-full shadow-md whitespace-nowrap ${shop.status === "open" ? "bg-primary" : "bg-red-500"}`}>
          {shop.name.split(" ")[0]}
        </div>
      )}
      {!selected && (
        <div className={`w-1.5 h-1.5 rounded-full mt-0.5 shadow ${shop.status === "open" ? "bg-primary" : "bg-red-500"}`} />
      )}
    </button>
  );
}

function DirectionsSheet({ shop, onClose }: { shop: Shop; onClose: () => void }) {
  const maps = [
    { name: "Apple Maps",  icon: "🗺️",  color: "#34C759" },
    { name: "Google Maps", icon: "📍",  color: "#4285F4" },
    { name: "Yandex Maps", icon: "🚖",  color: "#FF3333" },
  ];
  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end" style={{ background: "rgba(0,0,0,0.5)" }} onClick={onClose}>
      <div
        className="bg-card rounded-t-3xl px-5 pt-2 pb-6"
        onClick={e => e.stopPropagation()}
      >
        <div className="w-10 h-1 bg-border rounded-full mx-auto mb-4" />
        <div className="flex items-center justify-between mb-5">
          <p className="text-[15px] font-bold text-foreground">Open with app</p>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
            <X size={15} />
          </button>
        </div>
        <div className="flex justify-around">
          {maps.map(m => (
            <button key={m.name} className="flex flex-col items-center gap-2 group">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-md border border-border bg-card group-hover:scale-105 transition-transform">
                {m.icon}
              </div>
              <span className="text-[11px] font-semibold text-foreground">{m.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ShopsPage() {
  const [viewMode, setViewMode] = useState<"map" | "list">("map");
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [showDirections, setShowDirections] = useState(false);
  const [search, setSearch] = useState("");

  const filteredShops = SHOPS.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      {/* Tabs */}
      <div className="flex items-center px-4 pt-3 pb-2 gap-2 shrink-0 bg-card border-b border-border">
        {(["map", "list"] as const).map(mode => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] font-semibold transition-all ${
              viewMode === mode ? "bg-primary text-white shadow-sm" : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {mode === "map" ? <Map size={14} /> : <List size={14} />}
            {mode === "map" ? "Map" : "List"}
          </button>
        ))}
        <div className="flex-1 relative">
          <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" width="13" height="13" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
            <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <input
            type="text"
            placeholder="Search shops..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-muted rounded-xl pl-8 pr-3 py-2 text-[12px] text-foreground placeholder-muted-foreground border border-transparent focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
          />
        </div>
      </div>

      {/* MAP VIEW */}
      {viewMode === "map" && (
        <div className="flex-1 relative overflow-hidden">
          <MapBackground />

          {/* +/- zoom buttons */}
          <div className="absolute right-3 bottom-56 flex flex-col gap-1 z-10">
            {["+", "−"].map(s => (
              <button key={s} className="w-9 h-9 rounded-xl bg-card/90 backdrop-blur-sm border border-border flex items-center justify-center text-foreground font-bold text-lg shadow-md hover:bg-card transition-all">
                {s}
              </button>
            ))}
          </div>

          {/* Current location button */}
          <button className="absolute right-3 bottom-44 w-9 h-9 rounded-xl bg-card/90 backdrop-blur-sm border border-border flex items-center justify-center shadow-md z-10 hover:bg-card transition-all">
            <Navigation size={16} className="text-primary" />
          </button>

          {/* Shop pins */}
          {filteredShops.map(shop => (
            <ShopPin
              key={shop.id}
              shop={shop}
              selected={selectedShop?.id === shop.id}
              onClick={() => setSelectedShop(selectedShop?.id === shop.id ? null : shop)}
            />
          ))}

          {/* Deselect tap zone */}
          {selectedShop && (
            <div className="absolute inset-0 z-0" onClick={() => setSelectedShop(null)} />
          )}

          {/* Selected shop card — slides up from bottom */}
          {selectedShop && (
            <div className="absolute bottom-[25px] left-0 right-0 z-30 px-3">
              <div className="bg-card rounded-3xl shadow-2xl px-5 pt-4 pb-5"
                style={{ boxShadow: "0 -4px 32px rgba(0,0,0,0.15)" }}>
                {/* Drag handle */}
                <div className="w-10 h-1 bg-border rounded-full mx-auto mb-3" />

                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 pr-2">
                    <h3 className="text-[16px] font-bold text-foreground leading-tight">{selectedShop.name}</h3>
                    <span className="flex items-center gap-1 mt-0.5">
                      <span className="text-[12px] text-muted-foreground leading-tight">{selectedShop.address}</span>
                      <CopyAddressButton address={selectedShop.address} />
                    </span>
                  </div>
                  <div className={`shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-lg ${selectedShop.status === "open" ? "bg-emerald-50" : "bg-red-50"}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${selectedShop.status === "open" ? "bg-emerald-500" : "bg-red-400"}`} />
                    <span className={`text-[11px] font-bold ${selectedShop.status === "open" ? "text-emerald-600" : "text-red-500"}`}>
                      {selectedShop.status === "open" ? "Open" : "Closed"}
                    </span>
                  </div>
                </div>

                {/* Phone row */}
                <div className="flex items-center gap-1 text-muted-foreground mb-3">
                  <Phone size={11} />
                  <span className="text-[11px]">{selectedShop.phone}</span>
                </div>

                {/* Stats row */}
                <div className="flex gap-2 mb-4">
                  <div className="flex-1 bg-muted rounded-2xl px-3 py-2.5">
                    <div className="flex items-center gap-1 mb-0.5">
                      <Clock size={11} className="text-primary" />
                      <p className="text-[15px] font-bold text-foreground leading-none">{selectedShop.hours}</p>
                    </div>
                    <p className="text-[10px] text-muted-foreground font-medium">Today's hours</p>
                  </div>
                  <div className="flex-1 bg-muted rounded-2xl px-3 py-2.5">
                    <div className="flex items-center gap-1">
                      <MapPin size={11} className="text-primary" />
                      <p className="text-[15px] font-bold text-foreground leading-none">{selectedShop.time}</p>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-0.5 font-medium">{selectedShop.distance} away</p>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowDirections(true)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-primary hover:bg-blue-700 text-white text-[13px] font-semibold transition-all shadow-sm"
                  >
                    <Navigation size={15} />
                    {selectedShop.distance} · Directions
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Directions sheet */}
          {showDirections && selectedShop && (
            <DirectionsSheet shop={selectedShop} onClose={() => setShowDirections(false)} />
          )}
        </div>
      )}

      {/* LIST VIEW */}
      {viewMode === "list" && (
        <div className="flex-1 overflow-y-auto px-4 pt-3 pb-4">
          {filteredShops.length === 0 ? (
            <div className="flex flex-col items-center py-16 gap-2">
              <span className="text-3xl">🏪</span>
              <p className="text-[13px] text-muted-foreground">No shops found</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {filteredShops.map(shop => (
                <div
                  key={shop.id}
                  className="w-full bg-card rounded-2xl border border-border p-4 text-left"
                  style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Store size={20} className="text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <p className="text-[14px] font-bold text-foreground truncate">{shop.name}</p>
                        <div className={`shrink-0 flex items-center gap-1 px-2 py-0.5 rounded-lg ${shop.status === "open" ? "bg-emerald-50" : "bg-red-50"}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${shop.status === "open" ? "bg-emerald-500" : "bg-red-400"}`} />
                          <span className={`text-[10px] font-bold ${shop.status === "open" ? "text-emerald-600" : "text-red-500"}`}>
                            {shop.status === "open" ? "Open" : "Closed"}
                          </span>
                        </div>
                      </div>
                      <span className="flex items-center gap-1 mb-2">
                        <span className="text-[11px] text-muted-foreground">{shop.address}</span>
                        <CopyAddressButton address={shop.address} size={13} />
                      </span>
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin size={11} />
                          <span className="text-[11px]">{shop.distance}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock size={11} />
                          <span className="text-[11px]">{shop.hours}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── SCAN OVERLAY ─────────────────────────────────────────────────────────────
// Shared QR/barcode scanner overlay. For the Mechanic it just closes; for the
// Seller, `onScanComplete` advances to the Transaction Approval page.
function ScanOverlay({ onClose, onScanComplete, title = "Scan Barcode / QR", hint = "Point your camera at a barcode" }: {
  onClose: () => void; onScanComplete?: () => void; title?: string; hint?: string;
}) {
  return (
    <div className="absolute inset-0 bg-black/90 z-40 flex flex-col items-center justify-center gap-6">
      <button onClick={onClose} className="absolute top-14 right-6 w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all">
        <X size={18} />
      </button>
      <div className="text-white text-[15px] font-semibold">{title}</div>
      {/* Viewfinder */}
      <div className="relative w-56 h-56">
        <div className="absolute inset-0 border-2 border-white/20 rounded-2xl" />
        {/* Corner marks */}
        {[["top-0 left-0", "border-t-2 border-l-2"], ["top-0 right-0", "border-t-2 border-r-2"],
          ["bottom-0 left-0", "border-b-2 border-l-2"], ["bottom-0 right-0", "border-b-2 border-r-2"]].map(([pos, border], i) => (
          <div key={i} className={`absolute ${pos} w-8 h-8 border-primary ${border} rounded-sm`} />
        ))}
        {/* Scan line animation */}
        <div className="absolute left-2 right-2 h-0.5 bg-primary/80 rounded-full animate-bounce" style={{ top: "50%" }} />
        <div className="absolute inset-0 flex items-center justify-center">
          <ScanLine size={48} className="text-white/20" />
        </div>
      </div>
      <p className="text-white/50 text-[13px]">{hint}</p>
      {/* Seller: simulate detecting a mechanic's purchase QR (placeholder for camera) */}
      {onScanComplete && (
        <button onClick={onScanComplete}
          className="mt-2 px-5 py-3 rounded-xl bg-primary text-white text-[13px] font-semibold shadow-md hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center gap-2">
          <QrCode size={16} /> Simulate scan
        </button>
      )}
    </div>
  );
}

// ─── MECHANIC: CART ───────────────────────────────────────────────────────────
function CartPage({ cartIds, setCartIds, cartQty, setCartQty }: {
  cartIds: number[];
  setCartIds: React.Dispatch<React.SetStateAction<number[]>>;
  cartQty: Record<number, number>;
  setCartQty: React.Dispatch<React.SetStateAction<Record<number, number>>>;
}) {
  const items = PRODUCTS.filter(p => cartIds.includes(p.id));
  const [showQR, setShowQR] = useState(false);

  const getQ = (id: number) => cartQty[id] ?? 1;
  const setQ = (id: number, n: number) => {
    if (n < 1) {
      setCartIds(ids => ids.filter(i => i !== id));
      setCartQty(q => { const next = { ...q }; delete next[id]; return next; });
    } else {
      setCartQty(q => ({ ...q, [id]: n }));
    }
  };

  const total = items.reduce((sum, p) => sum + priceToNum(p.price) * getQ(p.id), 0);
  const totalUnits = items.reduce((sum, p) => sum + getQ(p.id), 0);
  const bonus = Math.round(total * 0.03);

  // ── Empty state ──
  if (items.length === 0) {
    return (
      <div className="flex flex-col h-full bg-background">
        <div className="px-5 pt-5 pb-4 shrink-0">
          <p className="text-[22px] font-bold text-foreground">My Cart</p>
          <p className="text-[13px] text-muted-foreground mt-0.5">0 items</p>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center gap-4 px-8 pb-12">
          <EmptyIllustration />
          <div className="text-center">
            <p className="text-[16px] font-bold text-foreground">Your cart is empty</p>
            <p className="text-[13px] text-muted-foreground mt-1.5 leading-relaxed">Browse the catalog and add parts to generate a purchase QR.</p>
          </div>
        </div>
      </div>
    );
  }

  // ── QR full-screen view ──
  if (showQR) {
    return (
      <div className="flex flex-col h-full bg-background">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 pt-4 pb-3 bg-card border-b border-border shrink-0">
          <button onClick={() => setShowQR(false)} className="w-9 h-9 rounded-xl bg-[#F4F5F7] flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft size={20} />
          </button>
          <div className="flex-1">
            <p className="text-[17px] font-bold text-foreground leading-tight">Purchase QR</p>
            <p className="text-[12px] text-muted-foreground">Show to seller to confirm order</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto flex flex-col items-center px-6 py-6 gap-5">
          {/* QR code */}
          <div className="bg-white rounded-3xl p-5 border border-border w-full flex justify-center" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.07)" }}>
            <QRCodePlaceholder seed={`CART-${cartIds.join("-")}-${total}`} size={220} />
          </div>

          {/* Amount */}
          <div className="w-full bg-card rounded-2xl border border-border p-4" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">Order summary</p>
              <span className="text-[11px] text-muted-foreground">{items.length} product{items.length > 1 ? "s" : ""}</span>
            </div>
            <div className="flex items-center justify-between text-[13px] mb-2">
              <span className="text-muted-foreground">Total units</span>
              <span className="font-semibold text-foreground">{totalUnits}</span>
            </div>
            <div className="flex items-center justify-between text-[13px] mb-2">
              <span className="text-muted-foreground">Amount</span>
              <span className="font-semibold text-foreground">{fmtUZS(total)} UZS</span>
            </div>
            <div className="h-px bg-border my-2.5" />
            <div className="flex items-center justify-between">
              <span className="text-[15px] font-bold text-foreground">Total</span>
              <span className="text-[20px] font-bold text-primary">{fmtUZS(total)} <span className="text-[11px] font-normal text-muted-foreground">UZS</span></span>
            </div>
          </div>

          {/* Bonus pill */}
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-2xl px-4 py-3 w-full">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
              <Gift size={16} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-[12px] font-semibold text-emerald-700">You'll earn <span className="text-emerald-600">+{fmtUZS(bonus)} UZS</span> bonus</p>
              <p className="text-[11px] text-emerald-500 mt-0.5">3% loyalty reward · added after seller confirms</p>
            </div>
          </div>

          {/* Items recap */}
          <div className="w-full">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Items in this order</p>
            <div className="flex flex-col gap-2">
              {items.map(p => (
                <div key={p.id} className="flex items-center gap-3 bg-card rounded-xl border border-border px-3 py-2.5">
                  <div className="w-9 h-9 rounded-lg bg-muted overflow-hidden shrink-0">
                    <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-semibold text-foreground line-clamp-1">{p.name}</p>
                    <p className="text-[10px] text-muted-foreground">{p.shop}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[12px] font-bold text-primary">{fmtUZS(priceToNum(p.price) * getQ(p.id))}</p>
                    <p className="text-[10px] text-muted-foreground">×{getQ(p.id)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Cart list ──
  return (
    <div className="flex flex-col h-full bg-background">
      {/* Title */}
      <div className="px-5 pt-5 pb-3 shrink-0">
        <p className="text-[22px] font-bold text-foreground">My Cart</p>
        <p className="text-[13px] text-muted-foreground mt-0.5">{items.length} item{items.length > 1 ? "s" : ""} · {totalUnits} unit{totalUnits > 1 ? "s" : ""}</p>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="flex flex-col gap-3">

        {/* Item rows */}
        {items.map(p => (
          <div key={p.id} className="bg-card rounded-2xl border border-border overflow-hidden" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
            <div className="flex gap-3 p-3">
              {/* Thumbnail */}
              <div className="w-[72px] h-[72px] rounded-xl bg-muted overflow-hidden shrink-0">
                <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold text-foreground leading-snug line-clamp-2">{p.name}</p>
                    <p className="text-[10px] font-mono text-muted-foreground/70 mt-0.5">{p.sku}</p>
                    <p className="text-[11px] text-muted-foreground">{p.shop}</p>
                  </div>
                  <button onClick={() => setCartIds(ids => ids.filter(i => i !== p.id))}
                    className="shrink-0 w-7 h-7 rounded-lg bg-red-50 text-red-400 flex items-center justify-center hover:bg-red-100 hover:text-red-600 transition-colors mt-0.5">
                    <Trash2 size={13} />
                  </button>
                </div>

                {/* Price + stepper */}
                <div className="flex items-center justify-between mt-2">
                  <div>
                    {p.originalPrice && <p className="text-[10px] text-muted-foreground line-through leading-none">{p.originalPrice} UZS</p>}
                    <p className="text-[15px] font-bold text-primary leading-tight">
                      {fmtUZS(priceToNum(p.price) * getQ(p.id))} <span className="text-[10px] font-normal text-muted-foreground">UZS</span>
                    </p>
                  </div>
                  <div className="flex items-center bg-[#F4F5F7] rounded-xl overflow-hidden border border-border">
                    <button onClick={() => setQ(p.id, getQ(p.id) - 1)}
                      className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors">
                      <Minus size={13} />
                    </button>
                    <span className="text-[13px] font-bold text-foreground px-2">{getQ(p.id)}</span>
                    <button onClick={() => setQ(p.id, getQ(p.id) + 1)}
                      className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors">
                      <Plus size={13} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Per-unit price footer */}
            <div className="border-t border-border px-3 py-1.5 bg-[#FAFAFA]">
              <p className="text-[11px] text-muted-foreground">{p.price} UZS per unit</p>
            </div>
          </div>
        ))}

        {/* Order summary card */}
        <div className="bg-card rounded-2xl border border-border p-4 mt-1" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <p className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">Order summary</p>

          <div className="flex items-center justify-between text-[13px] mb-2">
            <span className="text-muted-foreground">Products</span>
            <span className="font-medium text-foreground">{items.length}</span>
          </div>
          <div className="flex items-center justify-between text-[13px] mb-2">
            <span className="text-muted-foreground">Total units</span>
            <span className="font-medium text-foreground">{totalUnits}</span>
          </div>
          <div className="flex items-center justify-between text-[13px] mb-2">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-semibold text-foreground">{fmtUZS(total)} UZS</span>
          </div>

          <div className="h-px bg-border my-3" />

          {/* Bonus row */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <Gift size={13} className="text-emerald-500" />
              <span className="text-[13px] text-emerald-600 font-medium">Loyalty bonus</span>
              <span className="text-[10px] bg-emerald-50 text-emerald-500 px-1.5 py-0.5 rounded-md font-semibold">3%</span>
            </div>
            <span className="text-[13px] font-bold text-emerald-600">+{fmtUZS(bonus)} UZS</span>
          </div>

          {/* Total */}
          <div className="flex items-center justify-between bg-primary/5 rounded-xl px-3 py-2.5">
            <span className="text-[14px] font-bold text-foreground">Total to pay</span>
            <span className="text-[20px] font-bold text-primary">{fmtUZS(total)} <span className="text-[11px] font-normal text-muted-foreground">UZS</span></span>
          </div>
        </div>
        </div>{/* end inner flex-col */}
      </div>{/* end scroll */}

      {/* Generate QR button */}
      <div className="shrink-0 bg-card border-t border-border px-4 py-3">
        <button onClick={() => setShowQR(true)}
          className="w-full bg-primary text-white rounded-2xl py-4 text-[15px] font-bold flex items-center justify-center gap-2.5 hover:bg-blue-700 active:scale-[0.98] transition-all"
          style={{ boxShadow: "0 4px 20px rgba(37,99,235,0.35)" }}>
          <QrCode size={20} />
          Generate Purchase QR
        </button>
      </div>
    </div>
  );
}

// ─── PROFILE / WALLET (multi-page, shared by both roles) ─────────────────────

interface WalletTxn { id: number; label: string; date: string; amount: number; kind: "earn" | "withdraw"; orderRef?: string; productName?: string; productImg?: string; productId?: number; }

type WithdrawStatus = "pending" | "processing" | "out_for_delivery" | "delivered" | "failed";
interface WithdrawRequest {
  id: number; method: "cash"; amount: number; requestedAt: string;
  status: WithdrawStatus; destination: string;
}

const MOCK_WITHDRAW_REQUESTS: WithdrawRequest[] = [
  { id: 1, method: "cash", amount: 120000, requestedAt: "Jun 21, 2026 · 09:14", status: "out_for_delivery", destination: "Tashkent, Yunusabad, Bog'ishamol St. 12" },
];

type WithdrawFlow = "cash" | null;

// Sub-page: Wallet balance + withdraw
function WalletPage({ role, balance, name, phone, onBack }: { role: Role; balance: number; name: string; phone: string; onBack: () => void }) {
  const [flow, setFlow] = useState<WithdrawFlow>(null);

  const accentBtnShadow = "0 4px 16px rgba(37,99,235,0.35)";
  const accentBg = "bg-primary hover:bg-blue-700";

  if (flow === "cash") {
    return <WithdrawCashPage balance={balance} defaultName={name} defaultPhone={phone} accent={accentBg} accentShadow={accentBtnShadow} accentText="text-primary" onBack={() => setFlow(null)} />;
  }

  return (
    <div className="flex flex-col h-full bg-background relative">
      <div className="flex items-center gap-3 px-4 pt-4 pb-3 bg-card border-b border-border shrink-0">
        <button onClick={onBack} className="w-9 h-9 rounded-xl bg-[#F4F5F7] flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft size={20} />
        </button>
        <p className="flex-1 text-[17px] font-bold text-foreground">Bonus Wallet</p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="rounded-2xl p-5 bg-primary" style={{ boxShadow: "0 4px 20px rgba(37,99,235,0.35)" }}>
          <p className="text-white/70 text-[12px] font-medium mb-1">Available bonus balance</p>
          <p className="text-white text-[32px] font-bold leading-tight">{fmtUZS(balance)} <span className="text-[16px] font-normal opacity-80">UZS</span></p>
          <p className="text-white/60 text-[11px] mt-2">Scan product QR codes to earn bonuses</p>
        </div>
      </div>

      <div className="shrink-0 px-4 pb-6 pt-3 bg-background border-t border-border">
        <button onClick={() => setFlow("cash")}
          className={`w-full rounded-2xl py-3.5 text-[14px] font-semibold text-white flex items-center justify-center gap-2 active:scale-[0.98] transition-all ${accentBg}`}
          style={{ boxShadow: accentBtnShadow }}>
          <ArrowDownToLine size={16} /> Request Cash Withdrawal
        </button>
      </div>
    </div>
  );
}

function WithdrawCashPage({ balance, defaultName, defaultPhone, accent, accentShadow, accentText, onBack }: {
  balance: number; defaultName: string; defaultPhone: string; accent: string; accentShadow: string; accentText: string; onBack: () => void;
}) {
  const [name, setName] = useState(defaultName);
  const [phone, setPhone] = useState(defaultPhone);
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState(String(balance));
  const [showMap, setShowMap] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="flex flex-col h-full bg-background items-center justify-center px-8 gap-4">
        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
          <CheckCircle2 size={32} className="text-emerald-500" />
        </div>
        <p className="text-[18px] font-bold text-foreground text-center">Request Submitted</p>
        <p className="text-[13px] text-muted-foreground text-center">Cash will be delivered to your address within 1–2 business days.</p>
        <button onClick={onBack} className={`mt-4 w-full rounded-2xl py-3.5 text-[14px] font-semibold text-white flex items-center justify-center gap-2 ${accent}`} style={{ boxShadow: accentShadow }}>
          Back to Wallet
        </button>
      </div>
    );
  }

  if (showMap) {
    return (
      <div className="flex flex-col h-full bg-background">
        <div className="flex items-center gap-3 px-4 pt-4 pb-3 bg-card border-b border-border shrink-0">
          <button onClick={() => setShowMap(false)} className="w-9 h-9 rounded-xl bg-[#F4F5F7] flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft size={20} />
          </button>
          <p className="flex-1 text-[17px] font-bold text-foreground">Select on Map</p>
        </div>
        {/* Map placeholder */}
        <div className="flex-1 relative bg-[#E8EEF4] flex flex-col items-center justify-center gap-3">
          <div className="absolute inset-0" style={{
            backgroundImage: "linear-gradient(rgba(148,163,184,0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.25) 1px, transparent 1px)",
            backgroundSize: "40px 40px"
          }} />
          <div className="relative z-10 flex flex-col items-center gap-2">
            <MapPin size={40} className="text-primary drop-shadow-lg" />
            <div className="bg-card rounded-2xl px-5 py-3 shadow-lg text-center">
              <p className="text-[13px] font-semibold text-foreground">Tap to pin your location</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Map integration coming soon</p>
            </div>
          </div>
          {/* Confirm button */}
          <div className="absolute bottom-6 left-4 right-4">
            <button
              onClick={() => { setAddress("Tashkent, Yunusabad district, Bog'ishamol St. 12"); setShowMap(false); }}
              className={`w-full rounded-2xl py-3.5 text-[14px] font-semibold text-white flex items-center justify-center gap-2 ${accent}`}
              style={{ boxShadow: accentShadow }}>
              <MapPin size={16} /> Use This Location
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex items-center gap-3 px-4 pt-4 pb-3 bg-card border-b border-border shrink-0">
        <button onClick={onBack} className="w-9 h-9 rounded-xl bg-[#F4F5F7] flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft size={20} />
        </button>
        <p className="flex-1 text-[17px] font-bold text-foreground">Cash Delivery</p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Full name</p>
            <div className="flex items-center gap-3 bg-card border border-border rounded-2xl px-4 py-3.5">
              <User size={18} className={accentText} />
              <input type="text" value={name} onChange={e => setName(e.target.value)}
                className="flex-1 bg-transparent text-[14px] text-foreground outline-none" />
            </div>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Phone number</p>
            <div className="flex items-center gap-3 bg-card border border-border rounded-2xl px-4 py-3.5">
              <Phone size={18} className={accentText} />
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                className="flex-1 bg-transparent text-[14px] text-foreground outline-none" />
            </div>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Delivery address</p>
            <button onClick={() => setShowMap(true)}
              className="w-full flex items-center gap-3 bg-card border border-border rounded-2xl px-4 py-3.5 text-left active:scale-[0.98] transition-all">
              <MapPin size={18} className={`${accentText} shrink-0`} />
              <span className={`flex-1 text-[14px] ${address ? "text-foreground" : "text-muted-foreground"}`}>
                {address || "Tap to select on map"}
              </span>
              <Navigation size={15} className={accentText} />
            </button>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Amount (UZS)</p>
            <div className="flex items-center gap-3 bg-card border border-border rounded-2xl px-4 py-3.5">
              <Wallet size={18} className={accentText} />
              <input type="number" inputMode="numeric" placeholder="0"
                value={amount} onChange={e => setAmount(e.target.value)}
                className="flex-1 bg-transparent text-[14px] text-foreground placeholder:text-muted-foreground outline-none" />
            </div>
            <p className="text-[11px] text-muted-foreground mt-1.5 px-1">Available: {fmtUZS(balance)} UZS</p>
          </div>
        </div>
      </div>

      <div className="shrink-0 px-4 pb-6 pt-3 bg-background border-t border-border">
        <button
          disabled={!name || !phone || !address || !amount}
          onClick={() => setSubmitted(true)}
          className={`w-full rounded-2xl py-3.5 text-[14px] font-semibold text-white flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-40 ${accent}`}
          style={{ boxShadow: accentShadow }}>
          Request Cash Delivery
        </button>
      </div>
    </div>
  );
}

// Sub-page: Transaction history grouped by month
const WHEEL_ITEM_H = 40;
const WHEEL_MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function WheelCol({ items, selected, onSelect, fmt = (x: string) => x }: {
  items: (string|number)[]; selected: number|string; onSelect: (v: any) => void; fmt?: (x: string) => string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const idx = items.indexOf(selected as any);
    if (ref.current && idx >= 0) ref.current.scrollTop = idx * WHEEL_ITEM_H;
  }, [selected]);
  return (
    <div ref={ref} className="flex-1 overflow-y-auto snap-y snap-mandatory" style={{ height: 200, scrollbarWidth: "none" }}
      onScroll={e => {
        const idx = Math.round(e.currentTarget.scrollTop / WHEEL_ITEM_H);
        if (items[idx] !== undefined) onSelect(items[idx]);
      }}>
      <div style={{ paddingTop: 80, paddingBottom: 80 }}>
        {items.map((item, i) => {
          const isActive = item === selected;
          return (
            <div key={i} className="snap-center flex items-center justify-center cursor-pointer" style={{ height: WHEEL_ITEM_H }}
              onClick={() => onSelect(item)}>
              <span className={`transition-all ${isActive ? "font-bold text-foreground text-[17px]" : "text-[15px] text-muted-foreground font-medium"}`}>
                {fmt(String(item))}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DatePickerWheel({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const now = new Date();
  const selYear  = value ? parseInt(value.split("-")[0]) : now.getFullYear();
  const selMonth = value ? parseInt(value.split("-")[1]) : now.getMonth() + 1;
  const selDay   = value ? parseInt(value.split("-")[2]) : now.getDate();

  const years = Array.from({ length: 6 }, (_, i) => now.getFullYear() - 2 + i);
  const days  = Array.from({ length: 31 }, (_, i) => i + 1);

  const commit = (y: number, m: number, d: number) => {
    const clamped = Math.min(d, new Date(y, m, 0).getDate());
    onChange(`${y}-${String(m).padStart(2,"0")}-${String(clamped).padStart(2,"0")}`);
  };

  return (
    <div className="relative">
      <div className="absolute left-0 right-0 pointer-events-none rounded-xl bg-[#F4F5F7]"
        style={{ top: "calc(50% - 20px)", height: 40 }} />
      <div className="absolute inset-x-0 top-0 h-16 pointer-events-none z-10"
        style={{ background: "linear-gradient(to bottom, var(--card), transparent)" }} />
      <div className="absolute inset-x-0 bottom-0 h-16 pointer-events-none z-10"
        style={{ background: "linear-gradient(to top, var(--card), transparent)" }} />
      <div className="flex gap-1" style={{ height: 200 }}>
        <WheelCol items={WHEEL_MONTHS} selected={WHEEL_MONTHS[selMonth - 1]} onSelect={(m: string) => commit(selYear, WHEEL_MONTHS.indexOf(m) + 1, selDay)} />
        <WheelCol items={days} selected={selDay} onSelect={(d: number) => commit(selYear, selMonth, d)} fmt={v => String(v).padStart(2,"0")} />
        <WheelCol items={years} selected={selYear} onSelect={(y: number) => commit(y, selMonth, selDay)} />
      </div>
    </div>
  );
}

function TransactionHistoryPage({ role, transactions, requests, onBack, onProductTap, showBack = true }: {
  role: Role; transactions: WalletTxn[]; requests: WithdrawRequest[]; onBack: () => void; onProductTap?: (product: Product) => void; showBack?: boolean;
}) {

  const [activeTab, setActiveTab] = useState<"history"|"requests">("history");
  const [showFilter, setShowFilter] = useState(false);
  const [filterStep, setFilterStep] = useState<"main"|"from"|"to">("main");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate]     = useState("");
  const [appliedFrom, setAppliedFrom] = useState("");
  const [appliedTo, setAppliedTo]     = useState("");

  const isFiltered = appliedFrom || appliedTo;
  const parseDate  = (s: string) => s ? new Date(s).getTime() : null;

  const filtered = transactions.filter(t => {
    const ts = new Date(t.date).getTime();
    const from = parseDate(appliedFrom);
    const to   = parseDate(appliedTo);
    if (from && ts < from) return false;
    if (to   && ts > to + 86399999) return false;
    return true;
  });

  const groups: { month: string; items: WalletTxn[]; total: number }[] = [];
  filtered.forEach(t => {
    const parts = t.date.split(" ");
    const monthKey = parts.length >= 3 ? `${parts[0]} ${parts[2]}` : t.date;
    let g = groups.find(g => g.month === monthKey);
    if (!g) { g = { month: monthKey, items: [], total: 0 }; groups.push(g); }
    g.items.push(t);
    g.total += t.kind === "earn" ? t.amount : -t.amount;
  });

  const fmtLabel = (iso: string) => {
    if (!iso) return "Select date";
    const [y, m, d] = iso.split("-");
    return `${WHEEL_MONTHS[parseInt(m)-1]} ${parseInt(d)}, ${y}`;
  };

  const applyFilter = () => { setAppliedFrom(fromDate); setAppliedTo(toDate); setShowFilter(false); };
  const clearFilter = () => { setFromDate(""); setToDate(""); setAppliedFrom(""); setAppliedTo(""); setShowFilter(false); };

  // Status config for withdrawal requests
  const statusConfig: Record<WithdrawStatus, { label: string; color: string; bg: string }> = {
    pending:           { label: "Pending",          color: "text-amber-600",   bg: "bg-amber-50" },
    processing:        { label: "Processing",        color: "text-blue-600",    bg: "bg-blue-50" },
    out_for_delivery:  { label: "Out for Delivery",  color: "text-violet-600",  bg: "bg-violet-50" },
    delivered:         { label: "Delivered",         color: "text-emerald-600", bg: "bg-emerald-50" },
    failed:            { label: "Failed",            color: "text-red-500",     bg: "bg-red-50" },
  };


  const cashSteps:  WithdrawStatus[] = ["pending", "processing", "out_for_delivery", "delivered"];

  const pendingRequests = requests.filter(r => r.status !== "delivered" && r.status !== "failed");
  const hasRequests = pendingRequests.length > 0;

  return (
    <div className="flex flex-col h-full bg-background relative">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-4 pb-3 bg-card border-b border-border shrink-0">
        {showBack && (
          <button onClick={onBack} className="w-9 h-9 rounded-xl bg-[#F4F5F7] flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft size={20} />
          </button>
        )}
        <p className={`flex-1 font-bold text-foreground ${showBack ? "text-[17px]" : "text-[20px]"}`}>Bonus History</p>
        {activeTab === "history" && (
          <button onClick={() => { setShowFilter(true); setFilterStep("main"); }}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors relative ${isFiltered ? "bg-primary text-white" : "bg-[#F4F5F7] text-muted-foreground hover:text-foreground"}`}>
            <List size={18} />
            {isFiltered && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-card" />}
          </button>
        )}
      </div>

      {/* Tabs — underline style */}
      <div className="flex border-b border-border shrink-0 px-4">
        {([["history", "History"], ["requests", "Requests"]] as const).map(([key, label]) => (
          <button key={key} onClick={() => setActiveTab(key)}
            className={`flex-1 py-3 text-[13px] font-semibold transition-all relative ${activeTab === key ? "text-primary" : "text-muted-foreground"}`}>
            <span className="flex items-center justify-center gap-1.5">
              {label}
              {key === "requests" && hasRequests && (
                <span className="w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
                  {pendingRequests.length}
                </span>
              )}
            </span>
            {activeTab === key && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
            )}
          </button>
        ))}
      </div>

      {activeTab === "history" ? (
        <>
          {/* Applied filter chip */}
          {isFiltered && (
            <div className="px-4 pt-3 shrink-0 flex items-center gap-2">
              <div className="flex items-center gap-1.5 bg-primary/10 text-primary text-[11px] font-semibold rounded-full px-3 py-1">
                <Clock size={11} />
                {appliedFrom && appliedTo ? `${fmtLabel(appliedFrom)} → ${fmtLabel(appliedTo)}` : appliedFrom ? `From ${fmtLabel(appliedFrom)}` : `Until ${fmtLabel(appliedTo)}`}
              </div>
              <button onClick={clearFilter} className="text-[11px] text-muted-foreground font-medium underline">Clear</button>
            </div>
          )}

          <div className="flex-1 overflow-y-auto px-4 py-4">
            {groups.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 gap-2">
                <Receipt size={32} className="text-muted-foreground opacity-40" />
                <p className="text-[13px] text-muted-foreground">No transactions in this range</p>
              </div>
            ) : groups.map(g => (
              <div key={g.month} className="mb-5">
                <div className="flex items-center justify-between mb-2.5">
                  <p className="text-[12px] font-semibold text-muted-foreground">{g.month}</p>
                  <p className={`text-[12px] font-bold ${g.total >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                    {g.total >= 0 ? "+" : ""}{fmtUZS(g.total)} UZS
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  {g.items.map(t => {
                    const product = t.kind === "earn" && t.productId ? PRODUCTS.find(p => p.id === t.productId) : null;
                    const tappable = !!product && !!onProductTap;
                    return (
                    <div key={t.id}
                      onClick={tappable ? () => onProductTap!(product!) : undefined}
                      className={`flex items-center gap-3 bg-card rounded-2xl border border-border p-3.5 ${tappable ? "cursor-pointer active:scale-[0.98] transition-transform" : ""}`}
                      style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                      {/* Icon / product thumbnail */}
                      {t.kind === "earn" && t.productImg ? (
                        <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 bg-muted">
                          <img src={t.productImg} alt={t.productName} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${t.kind === "earn" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"}`}>
                          {t.kind === "earn" ? <Gift size={17} /> : <ArrowDownToLine size={17} />}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold text-foreground leading-tight line-clamp-1">
                          {t.kind === "earn" && t.productName ? t.productName : t.label}
                        </p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">{t.date}</p>
                      </div>
                      <span className={`text-[14px] font-bold shrink-0 ${t.kind === "earn" ? "text-emerald-600" : "text-red-500"}`}>
                        {t.kind === "earn" ? "+" : "−"}{fmtUZS(t.amount)} <span className="text-[10px] font-normal">UZS</span>
                      </span>
                      {tappable && <ChevronRight size={15} className="text-muted-foreground shrink-0 ml-1" />}
                    </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {requests.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 gap-2">
              <ArrowDownToLine size={32} className="text-muted-foreground opacity-40" />
              <p className="text-[13px] text-muted-foreground">No withdrawal requests yet</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {requests.map(req => {
                const steps = cashSteps;
                const curIdx = steps.indexOf(req.status);
                const cfg = statusConfig[req.status];
                return (
                  <div key={req.id} className="bg-card rounded-2xl border border-border p-4" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                    {/* Top row */}
                    <div className="flex items-start gap-3 mb-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${"bg-emerald-50 text-emerald-600"}`}>
                        {<Banknote size={18} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-bold text-foreground">{"Cash Delivery"}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5 truncate">{req.destination}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">{req.requestedAt}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span className="text-[14px] font-bold text-foreground">−{fmtUZS(req.amount)}</span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${cfg.color} ${cfg.bg}`}>{cfg.label}</span>
                      </div>
                    </div>

                    {/* Status stepper */}
                    <div className="flex items-center">
                      {steps.map((step, i) => {
                        const done = i <= curIdx;
                        const isLast = i === steps.length - 1;
                        const sCfg = statusConfig[step];
                        return (
                          <div key={step} className="contents">
                            <div className="flex flex-col items-center gap-1">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${done ? "border-primary bg-primary" : "border-border bg-background"}`}>
                                {done && <Check size={12} className="text-white" strokeWidth={3} />}
                              </div>
                              <p className={`text-[9px] font-semibold text-center leading-tight max-w-[48px] ${done ? "text-primary" : "text-muted-foreground"}`}>
                                {sCfg.label}
                              </p>
                            </div>
                            {!isLast && (
                              <div className={`flex-1 h-0.5 mb-4 mx-1 ${i < curIdx ? "bg-primary" : "bg-border"}`} />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Filter bottom sheet — step 1: From / To cards */}
      {showFilter && filterStep === "main" && (
        <div className="absolute inset-0 z-40 flex flex-col justify-end" style={{ background: "rgba(0,0,0,0.45)" }}
          onClick={() => setShowFilter(false)}>
          <div className="bg-card rounded-t-3xl px-4 pt-3 pb-8" onClick={e => e.stopPropagation()}>
            <div className="w-10 h-1 rounded-full bg-border mx-auto mb-4" />
            <p className="text-[16px] font-bold text-foreground mb-4">Filter by Date</p>

            <div className="flex gap-3 mb-6">
              {(["from","to"] as const).map(side => (
                <button key={side} onClick={() => setFilterStep(side)}
                  className="flex-1 rounded-2xl px-3 py-3.5 text-left border border-border bg-background active:scale-[0.98] transition-all"
                  style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                  <p className="text-[10px] font-semibold uppercase tracking-wider mb-1 text-muted-foreground">
                    {side === "from" ? "From" : "To"}
                  </p>
                  <p className={`text-[14px] font-semibold ${(side === "from" ? fromDate : toDate) ? "text-foreground" : "text-muted-foreground"}`}>
                    {fmtLabel(side === "from" ? fromDate : toDate)}
                  </p>
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button onClick={clearFilter}
                className="flex-1 rounded-2xl py-3.5 text-[14px] font-semibold text-muted-foreground bg-[#F4F5F7] active:scale-[0.98] transition-all">
                Clear
              </button>
              <button onClick={applyFilter}
                className="flex-1 rounded-2xl py-3.5 text-[14px] font-semibold text-white bg-primary active:scale-[0.98] transition-all"
                style={{ boxShadow: "0 4px 16px rgba(37,99,235,0.35)" }}>
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter bottom sheet — step 2: drum-roll picker */}
      {showFilter && (filterStep === "from" || filterStep === "to") && (
        <div className="absolute inset-0 z-40 flex flex-col justify-end" style={{ background: "rgba(0,0,0,0.45)" }}
          onClick={() => setFilterStep("main")}>
          <div className="bg-card rounded-t-3xl px-4 pt-3 pb-8" onClick={e => e.stopPropagation()}>
            <div className="w-10 h-1 rounded-full bg-border mx-auto mb-2" />
            <div className="flex items-center gap-2 mb-4">
              <button onClick={() => setFilterStep("main")} className="w-8 h-8 flex items-center justify-center text-muted-foreground">
                <ChevronLeft size={20} />
              </button>
              <p className="text-[16px] font-bold text-foreground">{filterStep === "from" ? "From date" : "To date"}</p>
            </div>

            <DatePickerWheel
              value={filterStep === "from" ? fromDate : toDate}
              onChange={v => filterStep === "from" ? setFromDate(v) : setToDate(v)}
            />

            <button
              onClick={() => setFilterStep("main")}
              className="w-full mt-5 rounded-2xl py-3.5 text-[14px] font-semibold text-white bg-primary active:scale-[0.98] transition-all"
              style={{ boxShadow: "0 4px 16px rgba(37,99,235,0.35)" }}>
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Sub-page: My Info
function MyInfoPage({ name: initName, phone: initPhone, onBack }: { name: string; phone: string; onBack: () => void }) {
  const [editName, setEditName] = useState(initName);
  const [editPhone, setEditPhone] = useState(initPhone);
  const [editRegion, setEditRegion] = useState("Tashkent");
  const [saved, setSaved] = useState(false);

  const REGIONS = ["Tashkent", "Samarkand", "Bukhara", "Namangan", "Andijan", "Fergana", "Nukus", "Termez", "Qarshi", "Jizzakh"];

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-4 pb-3 bg-card border-b border-border shrink-0">
        <button onClick={onBack} className="w-9 h-9 rounded-xl bg-[#F4F5F7] flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft size={20} />
        </button>
        <p className="flex-1 text-[17px] font-bold text-foreground">My Information</p>
        <button onClick={handleSave}
          className={`text-[13px] font-semibold px-3 py-1.5 rounded-xl transition-all ${saved ? "bg-emerald-50 text-emerald-600" : "bg-primary/8 text-primary hover:bg-primary/15"}`}>
          {saved ? "Saved ✓" : "Save"}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-5">
        {/* Avatar */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-3xl flex items-center justify-center text-white text-[36px] font-bold bg-primary"
              style={{ boxShadow: "0 4px 20px rgba(37,99,235,0.3)" }}>
              {editName.charAt(0)}
            </div>
            <button className="absolute -bottom-1.5 -right-1.5 w-8 h-8 rounded-xl bg-foreground text-background flex items-center justify-center shadow-md hover:opacity-80 transition-opacity">
              <UserCircle size={15} />
            </button>
          </div>
          <p className="text-[12px] text-muted-foreground mt-3">Tap the icon to change photo</p>
        </div>

        {/* Editable fields */}
        <div className="flex flex-col gap-3">
          {/* Full name */}
          <div className="bg-card rounded-2xl border border-border px-4 py-3.5" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
            <p className="text-[11px] text-muted-foreground font-medium mb-1.5">Full name</p>
            <input
              type="text"
              value={editName}
              onChange={e => setEditName(e.target.value)}
              className="w-full text-[15px] font-semibold text-foreground bg-transparent outline-none placeholder:text-muted-foreground"
              placeholder="Enter your name"
            />
          </div>

          {/* Phone */}
          <div className="bg-card rounded-2xl border border-border px-4 py-3.5" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
            <p className="text-[11px] text-muted-foreground font-medium mb-1.5">Phone number</p>
            <input
              type="tel"
              value={editPhone}
              onChange={e => setEditPhone(e.target.value)}
              className="w-full text-[15px] font-semibold text-foreground bg-transparent outline-none placeholder:text-muted-foreground"
              placeholder="+998 XX XXX XX XX"
            />
          </div>

          {/* Region */}
          <div className="bg-card rounded-2xl border border-border px-4 py-3.5" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
            <p className="text-[11px] text-muted-foreground font-medium mb-1.5">Region</p>
            <select
              value={editRegion}
              onChange={e => setEditRegion(e.target.value)}
              className="w-full text-[15px] font-semibold text-foreground bg-transparent outline-none appearance-none cursor-pointer">
              {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main profile hub
// ─── ORDER HISTORY DATA ───────────────────────────────────────────────────────

// ─── FAQ PAGE ─────────────────────────────────────────────────────────────────
const FAQ_ITEMS = [
  {
    q: "How do I earn bonus points?",
    a: "You earn 3% bonus on every completed purchase. Bonuses are credited to your wallet automatically once the seller confirms the transaction.",
  },
  {
    q: "How long does cash delivery take?",
    a: "Cash delivery requests are processed within 1–2 business days. You can track the status of your request in Bonus History → Requests tab.",
  },
  {
    q: "Can I cancel a withdrawal request?",
    a: "Withdrawal requests can be cancelled while they are still in Pending status. Once processing has started, cancellation is no longer available.",
  },
  {
    q: "What cards are supported for transfer?",
    a: "We support UzCard and Humo cards issued by Uzbekistan banks. International cards are not currently supported.",
  },
  {
    q: "How do I find a specific auto part?",
    a: "Use the search bar on the main page to search by part name, model, or category. You can also filter by price range to narrow down results.",
  },
  {
    q: "What happens if an item is out of stock?",
    a: "Out-of-stock items are marked in the catalog. You can still view product details but cannot add them to your cart.",
  },
  {
    q: "How do I contact support?",
    a: "For any issues not covered here, please reach out through the Help section or call our support line at +998 71 000 00 00 (Mon–Sat, 9:00–18:00).",
  },
];

function SupportPage({ onBack, name, phone }: { onBack: () => void; name: string; phone: string }) {
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const MAX = 500;

  function handleSend() {
    if (!message.trim()) return;
    setSent(true);
  }

  if (sent) {
    return (
      <div className="flex flex-col h-full bg-background">
        <div className="flex items-center gap-3 px-4 pt-4 pb-3 bg-card border-b border-border shrink-0">
          <button onClick={onBack} className="w-9 h-9 rounded-xl bg-[#F4F5F7] flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft size={20} />
          </button>
          <p className="flex-1 text-[17px] font-bold text-foreground">Support</p>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center gap-4 px-8 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center">
            <CheckCircle2 size={32} className="text-emerald-500" />
          </div>
          <p className="text-[18px] font-bold text-foreground">Message sent!</p>
          <p className="text-[13px] text-muted-foreground leading-relaxed">Our support team will get back to you shortly. Thank you for reaching out.</p>
          <button onClick={onBack}
            className="mt-4 px-8 py-3 rounded-2xl bg-primary text-white text-[15px] font-semibold">
            Back to Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-4 pb-3 bg-card border-b border-border shrink-0">
        <button onClick={onBack} className="w-9 h-9 rounded-xl bg-[#F4F5F7] flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft size={20} />
        </button>
        <p className="flex-1 text-[17px] font-bold text-foreground">Support</p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-5">
        {/* Name — read only */}
        <div>
          <p className="text-[13px] font-semibold text-foreground mb-1.5">Name</p>
          <div className="bg-card border border-border rounded-2xl px-4 py-3.5">
            <p className="text-[15px] font-semibold text-foreground">{name}</p>
          </div>
        </div>

        {/* Phone — read only */}
        <div>
          <p className="text-[13px] font-semibold text-foreground mb-1.5">Phone number</p>
          <div className="bg-card border border-border rounded-2xl px-4 py-3.5">
            <p className="text-[15px] font-semibold text-foreground">{phone}</p>
          </div>
        </div>

        {/* Message */}
        <div className="flex flex-col flex-1">
          <p className="text-[13px] font-semibold text-foreground mb-1.5">What's the issue?</p>
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value.slice(0, MAX))}
            placeholder="Describe your problem here…"
            rows={7}
            className="flex-1 w-full bg-card border border-border rounded-2xl px-4 py-3.5 text-[15px] text-foreground placeholder:text-muted-foreground/60 resize-none outline-none focus:border-primary/40 transition-colors"
          />
          <p className="text-[11px] text-muted-foreground text-right mt-1.5">{message.length}/{MAX}</p>
        </div>
      </div>

      {/* Send button */}
      <div className="shrink-0 px-4 pb-6 pt-2 bg-background">
        <button
          onClick={handleSend}
          disabled={!message.trim()}
          className={`w-full py-4 rounded-2xl text-[16px] font-bold transition-all flex items-center justify-center gap-2 ${message.trim() ? "bg-primary text-white shadow-md" : "bg-[#F4F5F7] text-muted-foreground"}`}>
          <Send size={17} />
          Send
        </button>
      </div>
    </div>
  );
}

function FAQPage({ onBack }: { onBack: () => void }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex items-center gap-3 px-4 pt-4 pb-3 bg-card border-b border-border shrink-0">
        <button onClick={onBack} className="w-9 h-9 rounded-xl bg-[#F4F5F7] flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft size={20} />
        </button>
        <p className="flex-1 text-[17px] font-bold text-foreground">FAQ</p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        {/* Header banner */}
        <div className="rounded-2xl bg-primary p-5 mb-5 flex items-center gap-4" style={{ boxShadow: "0 4px 20px rgba(37,99,235,0.25)" }}>
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
            <HelpCircle size={24} className="text-white" />
          </div>
          <div>
            <p className="text-white text-[15px] font-bold leading-tight">Got questions?</p>
            <p className="text-white/70 text-[12px] mt-0.5">Find answers to the most common ones below.</p>
          </div>
        </div>

        {/* Accordion */}
        <div className="flex flex-col gap-2">
          {FAQ_ITEMS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={i} className="bg-card rounded-2xl border border-border overflow-hidden" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center gap-3 px-4 py-4 text-left">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-colors ${isOpen ? "bg-primary text-white" : "bg-[#F4F5F7] text-muted-foreground"}`}>
                    <span className="text-[11px] font-bold">{i + 1}</span>
                  </div>
                  <p className={`flex-1 text-[13px] font-semibold leading-snug ${isOpen ? "text-primary" : "text-foreground"}`}>{item.q}</p>
                  <ChevronDown size={16} className={`shrink-0 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-0">
                    <div className="ml-10 border-l-2 border-primary/20 pl-3">
                      <p className="text-[13px] text-muted-foreground leading-relaxed">{item.a}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

type ProfileSubPage = "wallet" | "history" | "info" | "faq" | "support" | null;

const LANGS = [
  { code: "en", label: "English",  native: "English",    flag: "🇬🇧" },
  { code: "ru", label: "Russian",  native: "Русский",    flag: "🇷🇺" },
  { code: "uz", label: "Uzbek",    native: "O'zbek",     flag: "🇺🇿" },
] as const;
type LangCode = typeof LANGS[number]["code"];

function WalletScreen({ name, phone, balance, transactions, onLogout, onSubPageChange }: {
  name: string; phone: string; balance: number; transactions: WalletTxn[]; onLogout?: () => void; onSubPageChange?: (active: boolean) => void;
}) {
  const [sub, setSub] = useState<ProfileSubPage>(null);
  const [showLangSheet, setShowLangSheet] = useState(false);
  const [showAboutSheet, setShowAboutSheet] = useState(false);
  const [activeLang, setActiveLang] = useState<LangCode>("en");
  const goSub = (s: ProfileSubPage) => { setSub(s); onSubPageChange?.(s !== null); };
  const goBack = () => { setSub(null); onSubPageChange?.(false); };
  const currentLang = LANGS.find(l => l.code === activeLang)!;

  if (sub === "wallet")  return <WalletPage role="mechanic" balance={balance} name={name} phone={phone} onBack={goBack} />;
  if (sub === "history") return <TransactionHistoryPage role="mechanic" transactions={transactions} requests={MOCK_WITHDRAW_REQUESTS} onBack={goBack} />;
  if (sub === "info")    return <MyInfoPage name={name} phone={phone} onBack={goBack} />;
  if (sub === "support") return <SupportPage name={name} phone={phone} onBack={goBack} />;
  if (sub === "faq")     return <FAQPage onBack={goBack} />;

  // ── Profile hub ──
  const menuSections = [
    {
      title: "General",
      items: [
        { label: "My information", icon: <UserCircle size={18} />, color: "bg-blue-500",    action: () => goSub("info") },
        { label: "Bonus wallet",   icon: <Wallet size={18} />,     color: "bg-emerald-500", action: () => goSub("wallet") },
        { label: "Bonus history",  icon: <BarChart2 size={18} />,  color: "bg-violet-500",  action: () => goSub("history") },
      ],
    },
    {
      title: "Settings",
      items: [
        { label: "Language", icon: <Globe size={18} />,   color: "bg-sky-500",   action: () => setShowLangSheet(true) },
      ],
    },
    {
      title: "Support",
      items: [
        { label: "Support",   icon: <MessageSquare size={18} />, color: "bg-sky-500",    action: () => goSub("support") },
        { label: "FAQ",       icon: <HelpCircle size={18} />,    color: "bg-indigo-500", action: () => goSub("faq") },
        { label: "About app", icon: <Info size={18} />,       color: "bg-slate-500",  action: () => setShowAboutSheet(true) },
      ],
    },
  ];

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex-1 overflow-y-auto">
        {/* Hero: avatar + name + phone + verified */}
        <div className="flex flex-col items-center pt-8 pb-5 px-4 bg-card border-b border-border">
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center text-white mb-3 bg-primary"
            style={{ boxShadow: "0 4px 20px rgba(37,99,235,0.35)" }}>
            <span className="text-[32px] font-bold">{name.charAt(0)}</span>
          </div>
          <p className="text-[20px] font-bold text-foreground">{name}</p>
          <p className="text-[13px] text-muted-foreground mt-0.5">{phone}</p>
        </div>

        {/* Bonus wallet quick-access card */}
        <div className="px-4 pt-4 pb-2">
          <button onClick={() => goSub("wallet")}
            className="w-full rounded-2xl p-4 text-left active:scale-[0.97] transition-all bg-primary"
            style={{ boxShadow: "0 4px 16px rgba(37,99,235,0.3)" }}>
            <p className="text-white/70 text-[11px] font-medium">Bonus wallet</p>
            <p className="text-white text-[22px] font-bold mt-1 leading-tight">{fmtUZS(balance)} <span className="text-[13px] font-normal opacity-70">UZS</span></p>
            <p className="text-white/60 text-[10px] mt-0.5">Tap to manage</p>
          </button>
        </div>

        {/* Menu sections */}
        <div className="px-4 pt-2 pb-4 flex flex-col gap-4">
          {menuSections.map(section => (
            <div key={section.title}>
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">{section.title}</p>
              <div className="bg-card rounded-2xl border border-border overflow-hidden" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                {section.items.map((item, i) => (
                  <button key={item.label} onClick={item.action}
                    className={`w-full flex items-center gap-3.5 px-4 py-3.5 text-left hover:bg-[#F9FAFB] transition-colors ${i > 0 ? "border-t border-border" : ""}`}>
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-white ${item.color}`}>
                      {item.icon}
                    </div>
                    <p className="flex-1 text-[14px] font-semibold text-foreground">{item.label}</p>
                    {"right" in item && item.right}
                    <ChevronRight size={16} className="text-muted-foreground shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Logout */}
          {onLogout && (
            <button onClick={onLogout}
              className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl border-2 border-red-100 bg-red-50 text-red-500 font-semibold text-[14px] hover:bg-red-100 transition-colors active:scale-[0.98]">
              <LogOut size={16} /> Log out
            </button>
          )}
        </div>
      </div>

      {/* About app bottom sheet */}
      {showAboutSheet && (
        <div className="absolute inset-0 z-50 flex flex-col justify-end" style={{ background: "rgba(0,0,0,0.5)" }}
          onClick={() => setShowAboutSheet(false)}>
          <div className="bg-card rounded-t-3xl px-4 pt-3 pb-12 flex flex-col items-center" onClick={e => e.stopPropagation()}>
            <div className="w-10 h-1 rounded-full bg-border mx-auto mb-8" />
            {/* App logo */}
            <div className="w-20 h-20 rounded-3xl bg-primary flex items-center justify-center mb-4"
              style={{ boxShadow: "0 8px 32px rgba(37,99,235,0.35)" }}>
              <span className="text-white text-[36px] font-black leading-none">P</span>
            </div>
            <p className="text-[20px] font-black text-foreground tracking-tight">Progress</p>
            <p className="text-[13px] text-muted-foreground mt-1">Auto Parts Marketplace</p>
            <div className="mt-5 px-4 py-2 rounded-full bg-[#F4F5F7]">
              <p className="text-[12px] font-semibold text-muted-foreground">Version 1.0.0</p>
            </div>
          </div>
        </div>
      )}

      {/* Language selector bottom sheet */}
      {showLangSheet && (
        <div className="absolute inset-0 z-50 flex flex-col justify-end" style={{ background: "rgba(0,0,0,0.5)" }}
          onClick={() => setShowLangSheet(false)}>
          <div className="bg-card rounded-t-3xl px-4 pt-3 pb-10" onClick={e => e.stopPropagation()}>
            <div className="w-10 h-1 rounded-full bg-border mx-auto mb-6" />
            <p className="text-[18px] font-bold text-foreground mb-1">Select Language</p>
            <p className="text-[13px] text-muted-foreground mb-6">Choose your preferred language</p>

            <div className="flex flex-col gap-3">
              {LANGS.map(lang => {
                const isActive = activeLang === lang.code;
                return (
                  <button key={lang.code}
                    onClick={() => { setActiveLang(lang.code); setShowLangSheet(false); }}
                    className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl border-2 transition-all active:scale-[0.98] ${isActive ? "border-primary bg-primary/5" : "border-border bg-background"}`}
                    style={{ boxShadow: isActive ? "0 4px 16px rgba(37,99,235,0.12)" : "0 2px 8px rgba(0,0,0,0.04)" }}>
                    {/* Flag */}
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-[24px] shrink-0 ${isActive ? "bg-primary/10" : "bg-[#F4F5F7]"}`}>
                      {lang.flag}
                    </div>
                    {/* Label */}
                    <div className="flex-1 text-left">
                      <p className={`text-[15px] font-bold ${isActive ? "text-primary" : "text-foreground"}`}>{lang.native}</p>
                    </div>
                    {/* Active check */}
                    {isActive && (
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shrink-0">
                        <Check size={13} className="text-white" strokeWidth={3} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── MECHANIC APP ─────────────────────────────────────────────────────────────
function MechanicApp({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<MechanicTab>("main");
  const [scanning, setScanning] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [profileSubActive, setProfileSubActive] = useState(false);
  const [mainSubActive, setMainSubActive] = useState(false);

  const tabs: { key: MechanicTab; label: string; icon: (active: boolean) => React.ReactNode }[] = [
    { key: "main",    label: "Main",    icon: (a) => <Home         size={22} strokeWidth={a ? 2.5 : 1.8} /> },
    { key: "shops",   label: "Shops",   icon: (a) => <MapPin       size={22} strokeWidth={a ? 2.5 : 1.8} /> },
    { key: "scan",    label: "Scan",    icon: (_) => <ScanLine     size={24} strokeWidth={2} /> },
    { key: "bonus",   label: "Bonus",   icon: (a) => <Gift size={22} strokeWidth={a ? 2.5 : 1.8} /> },
    { key: "profile", label: "Profile", icon: (a) => <User         size={22} strokeWidth={a ? 2.5 : 1.8} /> },
  ];

  return (
    <div className="flex flex-col flex-1 min-h-0 relative">
      {scanning && <ScanOverlay onClose={() => setScanning(false)} />}


      <div className="flex-1 min-h-0 overflow-hidden">
        {selectedProduct
          ? <ProductDetailPage product={selectedProduct} onBack={() => setSelectedProduct(null)} />
          : tab === "main"
            ? <MechanicMainPage onSelect={setSelectedProduct} onSubPageChange={setMainSubActive} />
            : tab === "shops"
              ? <ShopsPage />
              : tab === "bonus"
                ? <TransactionHistoryPage role="mechanic" showBack={false} onBack={() => {}} requests={MOCK_WITHDRAW_REQUESTS}
                    onProductTap={setSelectedProduct}
                    transactions={[
                      { id: 1, label: "Bosch Oil Filter Premium",   date: "Jun 22, 2026", amount: 2000,   kind: "earn",    productId: 1,   productName: "Bosch Oil Filter Premium",   productImg: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&q=80" },
                      { id: 2, label: "NGK Spark Plug",             date: "Jun 22, 2026", amount: 4000,   kind: "earn",    productId: 5,   productName: "NGK Spark Plug",             productImg: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=200&q=80" },
                      { id: 3, label: "Withdraw to UzCard",         date: "Jun 20, 2026", amount: 100000, kind: "withdraw" },
                      { id: 4, label: "Continental Tire 205/55R16", date: "Jun 18, 2026", amount: 16000,  kind: "earn",    productId: 9,   productName: "Continental Tire 205/55R16", productImg: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&q=80" },
                      { id: 5, label: "Denso Air Filter",           date: "Jun 09, 2026", amount: 3000,   kind: "earn",    productId: 13,  productName: "Denso Air Filter",           productImg: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=200&q=80" },
                      { id: 6, label: "Monroe Shock Absorber",      date: "Jun 02, 2026", amount: 7000,   kind: "earn",    productId: 17,  productName: "Monroe Shock Absorber",      productImg: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&q=80" },
                    ]} />
                : tab === "profile"
                  ? <WalletScreen name="Akmal Karimov" phone="+998 90 123 45 67" balance={184000} onLogout={onLogout}
                      onSubPageChange={setProfileSubActive}
                      transactions={[
                        { id: 1, label: "Bosch Oil Filter Premium",   date: "Jun 22, 2026", amount: 2000,  kind: "earn",    productName: "Bosch Oil Filter Premium",   productImg: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&q=80" },
                        { id: 2, label: "NGK Spark Plug",             date: "Jun 22, 2026", amount: 4000,  kind: "earn",    productName: "NGK Spark Plug",             productImg: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=200&q=80" },
                        { id: 3, label: "Withdraw to UzCard",         date: "Jun 20, 2026", amount: 100000, kind: "withdraw" },
                        { id: 4, label: "Continental Tire 205/55R16", date: "Jun 18, 2026", amount: 16000, kind: "earn",    productName: "Continental Tire 205/55R16", productImg: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&q=80" },
                        { id: 5, label: "Denso Air Filter",           date: "Jun 09, 2026", amount: 3000,  kind: "earn",    productName: "Denso Air Filter",           productImg: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=200&q=80" },
                        { id: 6, label: "Monroe Shock Absorber",      date: "Jun 02, 2026", amount: 7000,  kind: "earn",    productName: "Monroe Shock Absorber",      productImg: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&q=80" },
                      ]} />
                  : null}
      </div>

      {!selectedProduct && !profileSubActive && !mainSubActive && (
        <div className="shrink-0 bg-card border-t border-border relative" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
          <div className="flex items-end justify-around px-2 pt-2 pb-2">
            {tabs.map((t) => {
              const isScan = t.key === "scan";
              const isActive = tab === t.key && !isScan;

              if (isScan) {
                return (
                  <button key={t.key} onClick={() => setScanning(true)}
                    className="flex flex-col items-center -mt-7 relative"
                    style={{ minWidth: 56 }}>
                    <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-white shadow-lg"
                      style={{ boxShadow: "0 4px 20px rgba(37,99,235,0.45)" }}>
                      {t.icon(true)}
                    </div>
                    <span className="text-[10px] font-semibold text-primary mt-1.5">Scan</span>
                  </button>
                );
              }

              return (
                <button key={t.key} onClick={() => setTab(t.key)}
                  className="flex flex-col items-center gap-1 flex-1 py-1 transition-all"
                  style={{ minWidth: 48 }}>
                  <div className={`relative transition-colors ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                    {t.icon(isActive)}
                  </div>
                  <span className={`text-[10px] font-semibold transition-colors ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                    {t.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── AUTH FLOW ────────────────────────────────────────────────────────────────
const AUTH_SCREENS: AuthScreen[] = ["login", "mechanic-login-otp", "mechanic-profile", "forgot-phone", "forgot-otp", "forgot-newpass"];

function AuthFlow({ onLogin }: { onLogin: (role: Role) => void }) {
  const [screen, setScreen] = useState<AuthScreen>("login");
  const [lang, setLang] = useState<Lang>("en");
  const idx = AUTH_SCREENS.indexOf(screen);

  return (
    <div className="flex-1 overflow-hidden relative">
      <div className="absolute inset-0 flex transition-transform duration-300 ease-in-out"
        style={{ transform: `translateX(${-idx * (100 / AUTH_SCREENS.length)}%)`, width: `${AUTH_SCREENS.length * 100}%` }}>
        {AUTH_SCREENS.map((s) => (
          <div key={s} style={{ width: `${100 / AUTH_SCREENS.length}%` }} className="h-full overflow-hidden shrink-0">
            {s === "login"              && <LoginScreen onLogin={onLogin} onNavigate={setScreen} lang={lang} setLang={setLang} />}
            {s === "mechanic-login-otp" && <OtpScreen onNavigate={setScreen} onBack={() => setScreen("login")} nextScreen="mechanic-profile" title="Verify your number" subtitle="Enter the 6-digit code sent to your phone" lang={lang} setLang={setLang} />}
            {s === "mechanic-profile"   && <MechanicProfileScreen onLogin={() => onLogin("mechanic")} onBack={() => setScreen("mechanic-login-otp")} lang={lang} setLang={setLang} />}
            {s === "forgot-phone"       && <ForgotPhoneScreen onNavigate={setScreen} lang={lang} setLang={setLang} />}
            {s === "forgot-otp"         && <OtpScreen onNavigate={setScreen} onBack={() => setScreen("forgot-phone")} nextScreen="forgot-newpass" title="Verify it's you" subtitle="Enter the 6-digit code sent to your registered number" lang={lang} setLang={setLang} />}
            {s === "forgot-newpass"     && <ForgotNewPassScreen onNavigate={setScreen} lang={lang} setLang={setLang} />}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [loggedInAs, setLoggedInAs] = useState<Role | null>(null);

  return (
    <div className="min-h-screen flex items-center justify-center"
      style={{ background: "linear-gradient(135deg, #e0e7ff 0%, #dbeafe 50%, #e0f2fe 100%)" }}>
      {/* Phone shell */}
      <div className="relative bg-card flex flex-col overflow-hidden"
        style={{ width: 390, height: 780, borderRadius: 44, boxShadow: "0 40px 100px rgba(37,99,235,0.18), 0 0 0 10px #1a1a1a, 0 0 0 11px #333" }}>

        {/* Status bar */}
        <div className="flex items-center justify-between px-8 pt-4 pb-1 shrink-0">
          <span className="text-[12px] font-semibold text-foreground">9:41</span>
          <div className="w-28 h-6 bg-foreground/5 rounded-full" />
          <div className="flex items-center gap-1.5">
            <div className="flex gap-0.5 items-end h-3">
              {[3, 5, 7, 9].map((h, i) => <div key={i} style={{ height: h }} className="w-1 bg-foreground/70 rounded-sm" />)}
            </div>
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
              <rect x="0.5" y="0.5" width="13" height="11" rx="2.5" stroke="#1A1A1A" strokeOpacity="0.7" />
              <rect x="14.5" y="3.5" width="1" height="5" rx="0.5" fill="#1A1A1A" fillOpacity="0.7" />
              <rect x="1.5" y="1.5" width="10" height="9" rx="1.5" fill="#1A1A1A" fillOpacity="0.7" />
            </svg>
          </div>
        </div>

        {/* Content */}
        {loggedInAs === null
          ? <AuthFlow onLogin={(role) => setLoggedInAs(role)} />
          : <MechanicApp onLogout={() => setLoggedInAs(null)} />
        }

        {/* Home indicator */}
        <div className="flex justify-center pb-2 pt-1 shrink-0">
          <div className="w-32 h-1 bg-foreground/20 rounded-full" />
        </div>
      </div>
    </div>
  );
}
