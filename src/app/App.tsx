import { useState, useRef, useEffect } from "react";
import {
  Eye, EyeOff, Wrench, Store, ChevronRight, ArrowLeft,
  ChevronDown, Check, Home, MapPin, ShoppingCart, User,
  BookOpen, ClipboardList, ScanLine, Package, X, Navigation,
  List, Map, Phone, Clock, Star,
  Plus, Minus, Trash2, QrCode, Wallet, CreditCard, Banknote,
  Smartphone, Building2, ArrowDownToLine, CheckCircle2, XCircle,
  Gift, TrendingUp, ShieldCheck, Receipt, ChevronLeft,
} from "lucide-react";

type AuthScreen = "login" | "signup-phone" | "signup-otp" | "signup-details" | "forgot-otp" | "forgot-newpass";
type Role = "mechanic" | "seller";
type Lang = "en" | "ru" | "uz";
type MechanicTab = "main" | "shops" | "scan" | "cart" | "profile";
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

// ─── SHARED HELPERS ───────────────────────────────────────────────────────────
const priceToNum = (s: string) => parseInt(s.replace(/\D/g, ""), 10) || 0;
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
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<Role>("mechanic");

  return (
    <div className="flex flex-col h-full">
      <TopBar lang={lang} setLang={setLang} />
      <div className="flex-1 overflow-y-auto px-6 pt-5">
        <div className="mb-6">
          <h1 className="text-[26px] font-bold text-foreground leading-tight tracking-tight">Welcome Back</h1>
          <p className="text-sm text-muted-foreground mt-1.5">Sign in to your catalog & loyalty account</p>
        </div>

        {/* Role selector */}
        <div className="mb-5">
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2.5">I am a...</p>
          <div className="grid grid-cols-2 gap-2.5">
            {([
              { key: "mechanic" as Role, label: "Mechanic", sub: "Repair & service", icon: <Wrench size={18} /> },
              { key: "seller" as Role, label: "Seller", sub: "Parts & supply", icon: <Store size={18} /> },
            ] as const).map((r) => {
              const selected = role === r.key;
              return (
                <button key={r.key} onClick={() => setRole(r.key)}
                  className={`flex items-center gap-3 px-3 py-3 rounded-2xl border-2 transition-all ${selected ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/30"}`}>
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all ${selected ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>
                    {r.icon}
                  </div>
                  <div className="text-left">
                    <div className={`text-[13px] font-semibold leading-tight ${selected ? "text-primary" : "text-foreground"}`}>{r.label}</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">{r.sub}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-3.5">
          <InputField placeholder="Username or Phone Number" value={username} onChange={setUsername} />
          <div>
            <InputField placeholder="Password" type={showPassword ? "text" : "password"} value={password} onChange={setPassword}
              rightElement={
                <button onClick={() => setShowPassword((p) => !p)} className="text-muted-foreground hover:text-foreground transition-colors p-0.5">
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              } />
            <div className="flex justify-end mt-2">
              <button onClick={() => onNavigate("forgot-otp")} className="text-[13px] font-medium text-primary hover:text-blue-700 transition-colors">
                Forgot Password?
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-[13px] text-muted-foreground mt-6">
          Don&apos;t have an account?{" "}
          <button onClick={() => onNavigate("signup-phone")} className="text-primary font-semibold hover:underline">Sign Up</button>
        </p>
      </div>
      <div className="px-6 pb-6 pt-3 shrink-0">
        <PrimaryButton label="Login" onClick={() => onLogin(role)} />
      </div>
    </div>
  );
}

function SignupPhoneScreen({ onNavigate, lang, setLang }: { onNavigate: (s: AuthScreen) => void; lang: Lang; setLang: (l: Lang) => void }) {
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
          <h1 className="text-[24px] font-bold text-foreground leading-tight tracking-tight">Enter your number</h1>
          <p className="text-sm text-muted-foreground mt-1.5">We&apos;ll send a verification code via SMS</p>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-1.5 px-3 py-3.5 bg-[#F4F5F7] rounded-xl text-sm font-semibold text-foreground whitespace-nowrap">🇺🇿 +998</div>
          <div className="flex-1"><InputField placeholder="90 123 45 67" type="tel" value={phone} onChange={setPhone} /></div>
        </div>
        <p className="text-center text-[13px] text-muted-foreground mt-6">
          Already have an account?{" "}
          <button onClick={() => onNavigate("login")} className="text-primary font-semibold hover:underline">Log In</button>
        </p>
      </div>
      <div className="px-6 pb-6 pt-3 shrink-0">
        <p className="text-[12px] text-muted-foreground text-center mb-3 leading-relaxed">
          By continuing, you agree to our <span className="text-primary font-medium">Terms</span> and <span className="text-primary font-medium">Privacy Policy</span>
        </p>
        <PrimaryButton label="Send Code" onClick={() => onNavigate("signup-otp")} />
      </div>
    </div>
  );
}

function OtpScreen({ onNavigate, onBack, nextScreen, title, subtitle, lang, setLang }: {
  onNavigate: (s: AuthScreen) => void; onBack: () => void; nextScreen: AuthScreen;
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
        <PrimaryButton label="Verify" onClick={() => onNavigate(nextScreen)} />
      </div>
    </div>
  );
}

function SignupDetailsScreen({ onNavigate, lang, setLang }: { onNavigate: (s: AuthScreen) => void; lang: Lang; setLang: (l: Lang) => void }) {
  const [role, setRole] = useState<Role>("mechanic");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const passwordMatch = confirm.length > 0 && password === confirm;
  const passwordMismatch = confirm.length > 0 && password !== confirm;
  return (
    <div className="flex flex-col h-full">
      <TopBar showBack onBack={() => onNavigate("signup-otp")} lang={lang} setLang={setLang} />
      <div className="flex-1 overflow-y-auto px-6 pt-5">
        <div className="mb-5">
          <h1 className="text-[24px] font-bold text-foreground leading-tight tracking-tight">Set up your profile</h1>
          <p className="text-sm text-muted-foreground mt-1">Choose your role and create your login</p>
        </div>
        <div className="mb-4">
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2.5">I am a...</p>
          <div className="grid grid-cols-2 gap-3">
            {([
              { key: "mechanic" as Role, label: "Mechanic", sub: "Repair & service", icon: <Wrench size={20} /> },
              { key: "seller" as Role, label: "Seller", sub: "Parts & supply", icon: <Store size={20} /> },
            ] as const).map((r) => {
              const sel = role === r.key;
              return (
                <button key={r.key} onClick={() => setRole(r.key)}
                  className={`flex flex-col items-center justify-center gap-2 py-4 px-3 rounded-2xl border-2 transition-all ${sel ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/30"}`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${sel ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>{r.icon}</div>
                  <div className="text-center">
                    <div className={`text-[13px] font-semibold leading-tight ${sel ? "text-primary" : "text-foreground"}`}>{r.label}</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">{r.sub}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <InputField placeholder="Username" value={username} onChange={setUsername} />
          <InputField placeholder="Password" type={showPass ? "text" : "password"} value={password} onChange={setPassword}
            rightElement={<button onClick={() => setShowPass((p) => !p)} className="text-muted-foreground hover:text-foreground p-0.5 transition-colors">{showPass ? <EyeOff size={17} /> : <Eye size={17} />}</button>} />
          <div>
            <InputField placeholder="Confirm Password" type={showConfirm ? "text" : "password"} value={confirm} onChange={setConfirm}
              rightElement={<button onClick={() => setShowConfirm((p) => !p)} className="text-muted-foreground hover:text-foreground p-0.5 transition-colors">{showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}</button>} />
            {passwordMismatch && <p className="text-[12px] text-destructive mt-1.5 ml-1">Passwords do not match</p>}
            {passwordMatch && <p className="text-[12px] text-emerald-600 mt-1.5 ml-1">Passwords match ✓</p>}
          </div>
        </div>
      </div>
      <div className="px-6 pb-6 pt-3 shrink-0">
        <PrimaryButton label="Create Account" onClick={() => onNavigate("login")} />
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
const CATEGORIES = [
  { label: "Engine",      emoji: "⚙️" },
  { label: "Brakes",      emoji: "🔴" },
  { label: "Filters",     emoji: "🔧" },
  { label: "Tires",       emoji: "🛞" },
  { label: "Electrical",  emoji: "⚡" },
  { label: "Body Parts",  emoji: "🚗" },
  { label: "Oil & Fluids",emoji: "🛢️" },
  { label: "Suspension",  emoji: "🔩" },
  { label: "Exhaust",     emoji: "💨" },
  { label: "Accessories", emoji: "🪛" },
  { label: "Lighting",    emoji: "💡" },
  { label: "Cooling",     emoji: "❄️" },
];

interface Product {
  id: number; name: string; shop: string; price: string;
  img: string; category: string; sku: string; stock: number;
  brand: string; description: string;
  originalPrice?: string; discount?: number;
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

// ─── SEARCH PAGE ──────────────────────────────────────────────────────────────
function SearchPage({ onSelect, onClose, onGoToCart, cartIds, setCartIds, cartQty, setCartQty }: {
  onSelect: (p: Product) => void; onClose: () => void; onGoToCart?: () => void;
  cartIds: number[]; setCartIds: React.Dispatch<React.SetStateAction<number[]>>;
  cartQty: Record<number, number>; setCartQty: React.Dispatch<React.SetStateAction<Record<number, number>>>;
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

  const getQ = (id: number) => cartQty[id] ?? 1;
  const changeQ = (id: number, delta: number) => {
    const next = getQ(id) + delta;
    if (next < 1) {
      setCartIds(ids => ids.filter(i => i !== id));
      setCartQty(q => { const n = { ...q }; delete n[id]; return n; });
    } else {
      setCartQty(q => ({ ...q, [id]: next }));
    }
  };

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
  const [sortBy, setSortBy] = useState<"default"|"low"|"high"|"discount">("default");
  const [onlyDiscount, setOnlyDiscount] = useState(false);
  const [onlyInStock, setOnlyInStock] = useState(false);

  const allPrices = listings.map(p => priceToNum(p.price));
  const absMin = allPrices.length ? Math.min(...allPrices) : 0;
  const absMax = allPrices.length ? Math.max(...allPrices) : 1000000;
  const [sliderMax, setSliderMax] = useState(absMax);

  const priceFiltered = sliderMax < absMax;

  const activeFilterCount = [
    sortBy !== "default",
    onlyDiscount,
    onlyInStock,
    priceFiltered,
  ].filter(Boolean).length;

  const filteredListings = listings
    .filter(p => !onlyDiscount || !!p.discount)
    .filter(p => !onlyInStock || p.stock > 0)
    .filter(p => priceToNum(p.price) <= sliderMax)
    .sort((a, b) => {
      if (sortBy === "low")  return priceToNum(a.price) - priceToNum(b.price);
      if (sortBy === "high") return priceToNum(b.price) - priceToNum(a.price);
      if (sortBy === "discount") return (b.discount ?? 0) - (a.discount ?? 0);
      return 0;
    });

  // Product card used in both the grid and filter-applied view
  const ListingCard = ({ p }: { p: Product }) => {
    const inCart = cartIds.includes(p.id);
    return (
      <div className="bg-card rounded-2xl overflow-hidden border border-border flex flex-col" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
        <button className="relative bg-muted h-32 overflow-hidden shrink-0" onClick={() => { onSelect(p); onClose(); }}>
          <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
          {p.discount && <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded-md bg-red-500 text-white text-[10px] font-bold leading-none">-{p.discount}%</span>}
        </button>
        <div className="p-2.5 flex flex-col flex-1">
          <button onClick={() => { onSelect(p); onClose(); }} className="text-left mb-0.5">
            <p className="text-[12px] font-semibold text-foreground leading-tight line-clamp-1">{p.shop}</p>
          </button>
          <p className="text-[10px] text-muted-foreground font-medium">{p.stock} in stock</p>
          <div className="mt-0.5 mb-2">
            {p.originalPrice && <p className="text-[10px] text-muted-foreground line-through leading-none">{p.originalPrice} UZS</p>}
            <p className="text-[13px] font-bold text-primary leading-tight">{p.price} <span className="text-[10px] font-normal text-muted-foreground">UZS</span></p>
          </div>
          <div className="mt-auto">
            {inCart ? (
              <div className="flex items-center justify-between bg-primary/8 rounded-xl px-2 py-1.5">
                <button onClick={() => changeQ(p.id, -1)} className="w-7 h-7 rounded-lg bg-white border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-all"><Minus size={12} /></button>
                <span className="text-[13px] font-bold text-primary">{getQ(p.id)}</span>
                <button onClick={() => changeQ(p.id, 1)} className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-white hover:bg-blue-700 transition-all"><Plus size={12} /></button>
              </div>
            ) : (
              <button onClick={() => { setCartIds(ids => [...ids, p.id]); setCartQty(q => ({ ...q, [p.id]: 1 })); }}
                className="w-full py-2 rounded-xl text-[11px] font-semibold bg-primary text-white hover:bg-blue-700 transition-all">
                + Add to Cart
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (selectedName) {
    // ── Filter page ──
    if (showFilter) {
      const SORT_OPTS: { key: typeof sortBy; label: string }[] = [
        { key: "default",  label: "Default" },
        { key: "low",      label: "Price: Low → High" },
        { key: "high",     label: "Price: High → Low" },
        { key: "discount", label: "Biggest Discount" },
      ];
      return (
        <div className="flex flex-col h-full bg-background">
          <div className="flex items-center gap-3 px-4 pt-4 pb-3 bg-card border-b border-border shrink-0">
            <button onClick={() => setShowFilter(false)} className="shrink-0 text-muted-foreground hover:text-foreground transition-colors">
              <ChevronLeft size={22} />
            </button>
            <p className="flex-1 text-[16px] font-bold text-foreground">Filters</p>
            <button onClick={() => { setSortBy("default"); setOnlyDiscount(false); setOnlyInStock(false); setSliderMax(absMax); }}
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

            {/* Max price slider */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Max price</p>
                <span className={`text-[13px] font-bold ${priceFiltered ? "text-primary" : "text-muted-foreground"}`}>
                  {priceFiltered ? `${sliderMax.toLocaleString()} UZS` : "Any"}
                </span>
              </div>
              <div className="px-1">
                <input
                  type="range"
                  min={absMin}
                  max={absMax}
                  step={Math.max(1000, Math.round((absMax - absMin) / 100))}
                  value={sliderMax}
                  onChange={e => setSliderMax(Number(e.target.value))}
                  className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #2563EB ${((sliderMax - absMin) / (absMax - absMin)) * 100}%, #E5E7EB ${((sliderMax - absMin) / (absMax - absMin)) * 100}%)`,
                    accentColor: "#2563EB",
                  }}
                />
                <div className="flex justify-between mt-2">
                  <span className="text-[10px] text-muted-foreground">{absMin.toLocaleString()} UZS</span>
                  <span className="text-[10px] text-muted-foreground">{absMax.toLocaleString()} UZS</span>
                </div>
              </div>
            </div>

            {/* Toggles */}
            <div>
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">Show only</p>
              <div className="flex flex-col gap-2">
                {[
                  { label: "Has discount", sub: "Products with active price cuts", val: onlyDiscount, set: setOnlyDiscount },
                  { label: "In stock", sub: "Available for immediate purchase", val: onlyInStock, set: setOnlyInStock },
                ].map(t => (
                  <button key={t.label} onClick={() => t.set(!t.val)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl border-2 transition-all ${t.val ? "border-primary bg-primary/5" : "border-border bg-card"}`}>
                    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${t.val ? "bg-primary border-primary" : "border-border"}`}>
                      {t.val && <Check size={12} className="text-white" />}
                    </div>
                    <div className="text-left">
                      <p className={`text-[13px] font-semibold leading-tight ${t.val ? "text-primary" : "text-foreground"}`}>{t.label}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{t.sub}</p>
                    </div>
                  </button>
                ))}
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
            <div className="flex flex-col items-center py-16 gap-3">
              <p className="text-[14px] font-semibold text-foreground">No results match your filters</p>
              <button onClick={() => { setSortBy("default"); setOnlyDiscount(false); setOnlyInStock(false); setSliderMax(absMax); }}
                className="text-[13px] font-semibold text-primary hover:underline">Clear filters</button>
            </div>
          )}
        </div>

        {/* Fixed cart FAB */}
        {cartIds.length > 0 && onGoToCart && (
          <div className="absolute bottom-5 left-0 right-0 flex justify-center pointer-events-none">
            <button
              onClick={onGoToCart}
              className="pointer-events-auto flex items-center gap-3 bg-primary text-white pl-5 pr-4 py-3.5 rounded-2xl shadow-lg active:scale-95 transition-all"
              style={{ boxShadow: "0 4px 20px rgba(37,99,235,0.45)" }}
            >
              <ShoppingCart size={18} />
              <span className="text-[14px] font-semibold">View Cart</span>
              <span className="bg-white text-primary text-[12px] font-bold rounded-xl px-2 py-0.5 min-w-[24px] text-center">
                {cartIds.length}
              </span>
            </button>
          </div>
        )}
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
              <div className="flex flex-col items-center py-16 gap-3">
                <p className="text-[14px] font-semibold text-foreground">No results found</p>
                <p className="text-[12px] text-muted-foreground">Try a different name or brand.</p>
              </div>
            )}
          </div>
        )}

        {/* Empty: popular chips */}
        {!q && (
          <div className="px-4 pt-4">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">Popular searches</p>
            <div className="flex flex-wrap gap-2">
              {["Bosch", "Filters", "Brakes", "Engine", "NGK", "Tires"].map(tag => (
                <button key={tag} onClick={() => setQuery(tag)}
                  className="px-3 py-1.5 rounded-xl bg-[#F4F5F7] text-[12px] font-semibold text-foreground hover:bg-primary/10 hover:text-primary transition-all">
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function MechanicMainPage({ onSelect, onGoToCart, cartIds, setCartIds, cartQty, setCartQty }: {
  onSelect: (p: Product) => void;
  onGoToCart: () => void;
  cartIds: number[];
  setCartIds: React.Dispatch<React.SetStateAction<number[]>>;
  cartQty: Record<number, number>;
  setCartQty: React.Dispatch<React.SetStateAction<Record<number, number>>>;
}) {
  const [showSearch, setShowSearch] = useState(false);
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const getQ = (id: number) => cartQty[id] ?? 1;
  const changeQ = (id: number, delta: number) => {
    const next = getQ(id) + delta;
    if (next < 1) {
      setCartIds(ids => ids.filter(i => i !== id));
      setCartQty(q => { const n = { ...q }; delete n[id]; return n; });
    } else {
      setCartQty(q => ({ ...q, [id]: next }));
    }
  };

  const filtered = PRODUCTS.filter(p => !activeCat || p.category === activeCat);

  const row1 = CATEGORIES.slice(0, Math.ceil(CATEGORIES.length / 2));
  const row2 = CATEGORIES.slice(Math.ceil(CATEGORIES.length / 2));

  return (
    <div className="flex flex-col h-full overflow-y-auto" style={{ minHeight: 0 }}>
      {/* Search page overlay */}
      {showSearch && (
        <div className="absolute inset-0 z-30 bg-background">
          <SearchPage
            onSelect={p => { onSelect(p); setShowSearch(false); }}
            onClose={() => setShowSearch(false)}
            onGoToCart={() => { setShowSearch(false); onGoToCart(); }}
            cartIds={cartIds} setCartIds={setCartIds}
            cartQty={cartQty} setCartQty={setCartQty}
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
        <button className="relative w-10 h-10 rounded-xl bg-[#F4F5F7] flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all shrink-0">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {/* Badge */}
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border border-white" />
        </button>
      </div>

      {/* Categories */}
      <div className="shrink-0 px-4 mb-1">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[13px] font-bold text-foreground">Categories</span>
          <button className="text-[11px] font-semibold text-primary">See all</button>
        </div>
        <div className="overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          <div className="flex flex-col gap-2.5" style={{ width: "max-content" }}>
            {[row1, row2].map((row, ri) => (
              <div key={ri} className="flex gap-2.5">
                {row.map((cat) => {
                  const active = activeCat === cat.label;
                  return (
                    <button key={cat.label} onClick={() => setActiveCat(active ? null : cat.label)}
                      className="flex flex-col items-center gap-1.5" style={{ width: 58 }}>
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all border-2 ${active ? "border-primary bg-primary/10" : "border-transparent bg-[#F4F5F7]"}`}>
                        {cat.emoji}
                      </div>
                      <span className={`text-[10px] font-semibold text-center leading-tight ${active ? "text-primary" : "text-muted-foreground"}`} style={{ width: 58 }}>
                        {cat.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="px-4 pb-4">
        <p className="text-[13px] font-bold text-foreground mb-3">
          {activeCat ? activeCat : "All Products"}
        </p>
        <div className="grid grid-cols-2 gap-3">
          {filtered.map(p => {
            const inCart = cartIds.includes(p.id);
            return (
              <div key={p.id} className="bg-card rounded-2xl overflow-hidden border border-border flex flex-col" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                {/* Image + discount badge */}
                <button className="relative bg-muted h-32 overflow-hidden shrink-0" onClick={() => onSelect(p)}>
                  <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
                  {p.discount && (
                    <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded-md bg-red-500 text-white text-[10px] font-bold leading-none">
                      -{p.discount}%
                    </span>
                  )}
                </button>
                <div className="p-2.5 flex flex-col flex-1">
                  <button onClick={() => onSelect(p)} className="text-left mb-0.5">
                    <p className="text-[12px] font-semibold text-foreground leading-tight line-clamp-2">{p.name}</p>
                  </button>
                  <p className="text-[10px] text-muted-foreground font-medium">{p.shop}</p>
                  {/* Price block */}
                  <div className="mt-0.5 mb-2">
                    {p.originalPrice && (
                      <p className="text-[10px] text-muted-foreground line-through leading-none">{p.originalPrice} UZS</p>
                    )}
                    <p className="text-[13px] font-bold text-primary leading-tight">{p.price} <span className="text-[10px] font-normal text-muted-foreground">UZS</span></p>
                  </div>
                  {/* Always-bottom CTA */}
                  <div className="mt-auto">
                    {inCart ? (
                      <div className="flex items-center justify-between bg-primary/8 rounded-xl px-2 py-1.5">
                        <button onClick={() => changeQ(p.id, -1)}
                          className="w-7 h-7 rounded-lg bg-white border border-border flex items-center justify-center text-foreground hover:border-primary hover:text-primary transition-all">
                          <Minus size={12} />
                        </button>
                        <span className="text-[13px] font-bold text-primary">{getQ(p.id)}</span>
                        <button onClick={() => changeQ(p.id, 1)}
                          className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-white hover:bg-blue-700 transition-all">
                          <Plus size={12} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => { setCartIds(ids => [...ids, p.id]); setCartQty(q => ({ ...q, [p.id]: 1 })); }}
                        className="w-full py-2 rounded-xl text-[11px] font-semibold bg-primary text-white hover:bg-blue-700 transition-all">
                        + Add to Cart
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {filtered.length === 0 && (
          <div className="flex flex-col items-center py-10 gap-2">
            <span className="text-3xl">🔍</span>
            <p className="text-[13px] text-muted-foreground">No products found</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── PRODUCT DETAIL PAGE ──────────────────────────────────────────────────────
function ProductDetailPage({ product, onBack, cartIds, setCartIds }: {
  product: Product;
  onBack: () => void;
  cartIds: number[];
  setCartIds: React.Dispatch<React.SetStateAction<number[]>>;
}) {
  const inCart = cartIds.includes(product.id);
  const similar = PRODUCTS.filter(p => p.id !== product.id && p.category === product.category).slice(0, 4);
  const lowStock = product.stock <= 15;

  return (
    <div className="flex flex-col h-full">
      {/* Hero image with back button overlay */}
      <div className="relative shrink-0" style={{ height: 220 }}>
        <img src={product.img} alt={product.name} className="w-full h-full object-cover" />
        {/* Gradient overlay */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, transparent 60%)" }} />
        {/* Back button */}
        <button onClick={onBack}
          className="absolute top-4 left-4 w-9 h-9 rounded-xl bg-white/90 backdrop-blur-sm flex items-center justify-center text-foreground shadow-md hover:bg-white transition-all">
          <ArrowLeft size={17} />
        </button>
        {/* Share button */}
        <button className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-white/90 backdrop-blur-sm flex items-center justify-center text-foreground shadow-md hover:bg-white transition-all">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
            <circle cx="18" cy="5" r="3" stroke="currentColor" strokeWidth="1.8"/>
            <circle cx="6" cy="12" r="3" stroke="currentColor" strokeWidth="1.8"/>
            <circle cx="18" cy="19" r="3" stroke="currentColor" strokeWidth="1.8"/>
            <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </button>
        {/* Category badge */}
        <div className="absolute bottom-3 left-4">
          <span className="px-2.5 py-1 rounded-lg bg-primary text-white text-[11px] font-bold tracking-wide">{product.category}</span>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto bg-background">
        <div className="bg-card rounded-t-3xl -mt-4 relative px-5 pt-5 pb-4">

          {/* Name + Brand row */}
          <div className="flex items-start justify-between gap-2 mb-1">
            <h2 className="text-[17px] font-bold text-foreground leading-snug flex-1">{product.name}</h2>
          </div>
          <p className="text-[12px] text-muted-foreground font-medium mb-3">by <span className="text-foreground font-semibold">{product.brand}</span> · SKU: {product.sku}</p>

          {/* Price + Stock */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[22px] font-bold text-primary leading-none">{product.price}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">UZS / per unit</p>
            </div>
            <div className={`flex items-center gap-1.5 px-3 py-2 rounded-xl ${lowStock ? "bg-orange-50" : "bg-emerald-50"}`}>
              <div className={`w-2 h-2 rounded-full ${lowStock ? "bg-orange-400" : "bg-emerald-500"}`} />
              <div>
                <p className={`text-[13px] font-bold leading-none ${lowStock ? "text-orange-600" : "text-emerald-600"}`}>{product.stock} units</p>
                <p className={`text-[10px] mt-0.5 font-medium ${lowStock ? "text-orange-400" : "text-emerald-400"}`}>{lowStock ? "Low stock" : "In stock"}</p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-border mb-4" />

          {/* Shop */}
          <div className="mb-4">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Sold by</p>
            <button className="w-full flex items-center gap-3 p-3 rounded-2xl border border-border bg-card hover:border-primary hover:bg-primary/3 transition-all">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Store size={18} className="text-primary" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-[13px] font-bold text-foreground">{product.shop}</p>
                <p className="text-[11px] text-muted-foreground">Tap to view shop & all products</p>
              </div>
              <ChevronRight size={16} className="text-muted-foreground shrink-0" />
            </button>
          </div>

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
                { label: "Stock",    value: `${product.stock} units` },
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
              <div className="flex gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
                {similar.map(sp => (
                  <div key={sp.id} className="shrink-0 w-32 bg-card rounded-2xl border border-border overflow-hidden" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                    <div className="h-24 bg-muted overflow-hidden">
                      <img src={sp.img} alt={sp.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-2">
                      <p className="text-[11px] font-semibold text-foreground leading-tight line-clamp-2">{sp.name}</p>
                      <p className="text-[12px] font-bold text-primary mt-1">{sp.price} <span className="text-[9px] font-normal text-muted-foreground">UZS</span></p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="shrink-0 bg-card border-t border-border px-5 py-3 flex gap-3">
        <button className="w-11 h-11 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-all shrink-0">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <button
          onClick={() => setCartIds(ids => inCart ? ids.filter(i => i !== product.id) : [...ids, product.id])}
          className={`flex-1 py-3 rounded-xl text-[14px] font-semibold transition-all flex items-center justify-center gap-2 ${inCart ? "bg-primary/10 text-primary" : "bg-primary text-white hover:bg-blue-700 shadow-md"}`}>
          <ShoppingCart size={16} />
          {inCart ? "Added to Cart" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}

// ─── SHOPS PAGE ───────────────────────────────────────────────────────────────
interface Shop {
  id: number; name: string; address: string;
  distance: string; time: string; status: "open" | "closed";
  products: number; rating: number; phone: string;
  x: number; y: number; // % position on fake map
}

const SHOPS: Shop[] = [
  { id: 1, name: "AutoZone Tashkent",    address: "Chilonzor tumani, 14-mavze",      distance: "1.2 km", time: "8 min",  status: "open",   products: 142, rating: 4.8, phone: "+998 71 234 56 78", x: 42, y: 52 },
  { id: 2, name: "CarParts Express",      address: "Yunusobod tumani, Amir Temur ko", distance: "3.4 km", time: "18 min", status: "open",   products:  89, rating: 4.5, phone: "+998 71 345 67 89", x: 68, y: 28 },
  { id: 3, name: "SparkMaster Pro",       address: "Mirzo Ulug'bek tumani, 7-blok",  distance: "5.1 km", time: "26 min", status: "closed", products:  67, rating: 4.2, phone: "+998 71 456 78 90", x: 75, y: 62 },
  { id: 4, name: "TireHub Uzbekistan",    address: "Sergeli tumani, Nurafshon ko'ch", distance: "6.8 km", time: "32 min", status: "open",   products: 210, rating: 4.9, phone: "+998 71 567 89 01", x: 28, y: 72 },
  { id: 5, name: "SuspensionKing",        address: "Uchtepa tumani, Bunyodkor shoh",  distance: "2.7 km", time: "14 min", status: "open",   products:  54, rating: 4.3, phone: "+998 71 678 90 12", x: 55, y: 35 },
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
        selected
          ? "w-12 h-12 bg-primary ring-4 ring-primary/30"
          : shop.status === "open"
            ? "w-9 h-9 bg-primary/90 hover:bg-primary"
            : "w-9 h-9 bg-gray-500/90"
      }`}>
        <Store size={selected ? 22 : 16} className="text-white" />
      </div>
      {selected && (
        <div className="mt-1 px-2 py-0.5 bg-primary text-white text-[10px] font-bold rounded-full shadow-md whitespace-nowrap">
          {shop.name.split(" ")[0]}
        </div>
      )}
      {!selected && (
        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-0.5 shadow" />
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
            <div className="absolute bottom-0 left-0 right-0 z-30">
              <div className="bg-card rounded-t-3xl shadow-2xl px-5 pt-4 pb-5"
                style={{ boxShadow: "0 -8px 40px rgba(0,0,0,0.18)" }}>
                {/* Drag handle */}
                <div className="w-10 h-1 bg-border rounded-full mx-auto mb-3" />

                {/* Header */}
                <div className="flex items-start justify-between mb-1">
                  <div className="flex-1 pr-2">
                    <h3 className="text-[16px] font-bold text-foreground leading-tight">{selectedShop.name}</h3>
                    <p className="text-[12px] text-muted-foreground mt-0.5 leading-tight">{selectedShop.address}</p>
                  </div>
                  <div className={`shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-lg ${selectedShop.status === "open" ? "bg-emerald-50" : "bg-red-50"}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${selectedShop.status === "open" ? "bg-emerald-500" : "bg-red-400"}`} />
                    <span className={`text-[11px] font-bold ${selectedShop.status === "open" ? "text-emerald-600" : "text-red-500"}`}>
                      {selectedShop.status === "open" ? "Open" : "Closed"}
                    </span>
                  </div>
                </div>

                {/* Rating + phone */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center gap-1">
                    <Star size={12} className="text-amber-400 fill-amber-400" />
                    <span className="text-[12px] font-semibold text-foreground">{selectedShop.rating}</span>
                  </div>
                  <div className="w-1 h-1 rounded-full bg-border" />
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Phone size={11} />
                    <span className="text-[11px]">{selectedShop.phone}</span>
                  </div>
                </div>

                {/* Stats row */}
                <div className="flex gap-2 mb-4">
                  <div className="flex-1 bg-muted rounded-2xl px-3 py-2.5">
                    <p className="text-[18px] font-bold text-foreground leading-none">{selectedShop.products}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5 font-medium">Products listed</p>
                  </div>
                  <div className="flex-1 bg-muted rounded-2xl px-3 py-2.5">
                    <div className="flex items-center gap-1">
                      <Clock size={12} className="text-primary" />
                      <p className="text-[18px] font-bold text-foreground leading-none">{selectedShop.time}</p>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-0.5 font-medium">{selectedShop.distance} away</p>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowDirections(true)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-[13px] font-semibold transition-all shadow-sm"
                  >
                    <Navigation size={15} />
                    {selectedShop.distance} · Directions
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-primary hover:bg-blue-700 text-white text-[13px] font-semibold transition-all shadow-sm">
                    <Store size={15} />
                    Visit Shop
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
                <button
                  key={shop.id}
                  className="w-full bg-card rounded-2xl border border-border p-4 text-left hover:border-primary/40 transition-all"
                  style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
                >
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Store size={20} className="text-primary" />
                    </div>
                    {/* Info */}
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
                      <p className="text-[11px] text-muted-foreground mb-2 truncate">{shop.address}</p>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Star size={11} className="text-amber-400 fill-amber-400" />
                          <span className="text-[11px] font-semibold text-foreground">{shop.rating}</span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <MapPin size={11} />
                          <span className="text-[11px]">{shop.distance}</span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Package size={11} />
                          <span className="text-[11px]">{shop.products} products</span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-muted-foreground shrink-0 mt-1" />
                  </div>
                </button>
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
  const bonus = Math.round(total * 0.03); // 3% loyalty bonus

  if (items.length === 0) {
    return (
      <div className="flex flex-col h-full">
        <PageHeader title="My Cart" subtitle="0 items" />
        <div className="flex-1 flex flex-col items-center justify-center gap-3 px-8">
          <div className="w-16 h-16 rounded-2xl bg-primary/8 flex items-center justify-center text-primary">
            <ShoppingCart size={32} />
          </div>
          <p className="text-[15px] font-semibold text-foreground">Your cart is empty</p>
          <p className="text-[13px] text-muted-foreground text-center leading-relaxed">Browse the catalog and add parts to generate a purchase QR.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <PageHeader title="My Cart" subtitle={`${items.length} item${items.length > 1 ? "s" : ""} · ${totalUnits} units`} />

      {/* Items */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        <div className="flex flex-col gap-3">
          {items.map(p => (
            <div key={p.id} className="bg-card rounded-2xl border border-border p-3 flex gap-3" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
              <div className="w-16 h-16 rounded-xl bg-muted overflow-hidden shrink-0">
                <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[13px] font-semibold text-foreground leading-tight line-clamp-2">{p.name}</p>
                  <button onClick={() => setCartIds(ids => ids.filter(i => i !== p.id))}
                    className="shrink-0 w-7 h-7 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
                <p className="text-[10px] text-muted-foreground font-medium mt-0.5">{p.shop}</p>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-[14px] font-bold text-primary">{fmtUZS(priceToNum(p.price) * getQ(p.id))} <span className="text-[10px] font-normal text-muted-foreground">UZS</span></p>
                  {/* Quantity stepper */}
                  <div className="flex items-center gap-2">
                    <button onClick={() => setQ(p.id, getQ(p.id) - 1)}
                      className="w-7 h-7 rounded-lg bg-[#F4F5F7] border border-border flex items-center justify-center text-foreground hover:border-primary hover:text-primary transition-all">
                      <Minus size={13} />
                    </button>
                    <span className="text-[13px] font-bold text-foreground w-5 text-center">{getQ(p.id)}</span>
                    <button onClick={() => setQ(p.id, getQ(p.id) + 1)}
                      className="w-7 h-7 rounded-lg bg-[#F4F5F7] border border-border flex items-center justify-center text-foreground hover:border-primary hover:text-primary transition-all">
                      <Plus size={13} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-card rounded-2xl border border-border p-4 mt-3" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
          <div className="flex items-center justify-between text-[13px] text-muted-foreground">
            <span>Subtotal ({totalUnits} units)</span>
            <span className="font-semibold text-foreground">{fmtUZS(total)} UZS</span>
          </div>
          <div className="flex items-center justify-between text-[13px] text-muted-foreground mt-2">
            <span className="flex items-center gap-1.5"><Gift size={13} className="text-emerald-500" /> Loyalty bonus (3%)</span>
            <span className="font-semibold text-emerald-600">+{fmtUZS(bonus)} UZS</span>
          </div>
          <div className="h-px bg-border my-3" />
          <div className="flex items-center justify-between">
            <span className="text-[14px] font-bold text-foreground">Total</span>
            <span className="text-[18px] font-bold text-primary">{fmtUZS(total)} <span className="text-[11px] font-normal text-muted-foreground">UZS</span></span>
          </div>
        </div>
      </div>

      {/* Generate QR CTA */}
      <div className="shrink-0 bg-card border-t border-border px-5 py-3">
        <button onClick={() => setShowQR(true)}
          className="w-full bg-primary text-white rounded-xl py-4 text-[15px] font-semibold shadow-md hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
          <QrCode size={18} /> Generate Purchase QR
        </button>
      </div>

      {/* QR modal */}
      {showQR && (
        <div className="absolute inset-0 z-50 flex flex-col justify-end" style={{ background: "rgba(0,0,0,0.5)" }} onClick={() => setShowQR(false)}>
          <div className="bg-card rounded-t-3xl px-5 pt-2 pb-6" onClick={e => e.stopPropagation()} style={{ boxShadow: "0 -8px 40px rgba(0,0,0,0.18)" }}>
            <div className="w-10 h-1 bg-border rounded-full mx-auto mb-4" />
            <div className="flex items-center justify-between mb-1">
              <p className="text-[16px] font-bold text-foreground">Purchase QR</p>
              <button onClick={() => setShowQR(false)} className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                <X size={15} />
              </button>
            </div>
            <p className="text-[12px] text-muted-foreground mb-4">Show this code to the seller to confirm your purchase.</p>
            <div className="flex flex-col items-center">
              <div className="p-4 rounded-2xl border border-border bg-white" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                <QRCodePlaceholder seed={`CART-${cartIds.join("-")}-${total}`} size={208} />
              </div>
              <p className="text-[12px] text-muted-foreground mt-3">{totalUnits} units · {items.length} products</p>
              <p className="text-[22px] font-bold text-primary mt-1">{fmtUZS(total)} <span className="text-[12px] font-normal text-muted-foreground">UZS</span></p>
              <div className="flex items-center gap-1.5 mt-2 px-3 py-1.5 rounded-lg bg-emerald-50">
                <Gift size={13} className="text-emerald-500" />
                <span className="text-[12px] font-semibold text-emerald-600">+{fmtUZS(bonus)} UZS bonus on confirmation</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── WALLET / WITHDRAW (shared by both roles) ─────────────────────────────────
const WITHDRAW_METHODS = [
  { key: "card", label: "Bank Card", sub: "UzCard · Humo", icon: <CreditCard size={18} /> },
  { key: "click", label: "Click / Payme", sub: "Instant transfer", icon: <Smartphone size={18} /> },
  { key: "bank", label: "Bank Account", sub: "1–2 business days", icon: <Building2 size={18} /> },
  { key: "cash", label: "Cash Pickup", sub: "At partner shops", icon: <Banknote size={18} /> },
];

interface WalletTxn { id: number; label: string; date: string; amount: number; kind: "earn" | "withdraw"; }

function WalletScreen({ role, name, phone, balance, transactions }: {
  role: Role; name: string; phone: string; balance: number; transactions: WalletTxn[];
}) {
  const isSeller = role === "seller";
  const accent: "primary" | "success" = isSeller ? "success" : "primary";
  const earnedTotal = transactions.filter(t => t.kind === "earn").reduce((s, t) => s + t.amount, 0);

  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Wallet & Profile" subtitle={isSeller ? "Seller bonuses" : "Loyalty bonuses"} />
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {/* Profile row */}
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shrink-0 ${isSeller ? "bg-emerald-500" : "bg-primary"}`}>
            <span className="text-[20px] font-bold">{name.charAt(0)}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[16px] font-bold text-foreground leading-tight">{name}</p>
            <p className="text-[12px] text-muted-foreground">{phone}</p>
          </div>
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${isSeller ? "bg-emerald-50" : "bg-blue-50"}`}>
            {isSeller ? <Store size={13} className="text-emerald-600" /> : <Wrench size={13} className="text-primary" />}
            <span className={`text-[11px] font-bold ${isSeller ? "text-emerald-600" : "text-primary"}`}>{isSeller ? "Seller" : "Mechanic"}</span>
          </div>
        </div>

        {/* Balance card */}
        <WalletBalanceCard
          label={isSeller ? "Available seller bonus" : "Available bonus balance"}
          amount={balance}
          sublabel={isSeller ? "Earn 2% on every confirmed sale" : "Earn 3% bonus on every purchase"}
          accent={accent}
        />

        {/* Quick stats */}
        <div className="flex gap-2 mt-3">
          <div className="flex-1 bg-card rounded-2xl border border-border px-3 py-3" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
            <div className="flex items-center gap-1.5 text-muted-foreground"><TrendingUp size={13} /><span className="text-[10px] font-medium">Total earned</span></div>
            <p className="text-[16px] font-bold text-foreground mt-1">{fmtUZS(earnedTotal)} <span className="text-[10px] font-normal text-muted-foreground">UZS</span></p>
          </div>
          <div className="flex-1 bg-card rounded-2xl border border-border px-3 py-3" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
            <div className="flex items-center gap-1.5 text-muted-foreground"><Receipt size={13} /><span className="text-[10px] font-medium">Transactions</span></div>
            <p className="text-[16px] font-bold text-foreground mt-1">{transactions.length}</p>
          </div>
        </div>

        {/* Withdraw */}
        <button className={`w-full mt-3 rounded-xl py-3.5 text-[14px] font-semibold text-white shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2 ${isSeller ? "bg-emerald-500 hover:bg-emerald-600" : "bg-primary hover:bg-blue-700"}`}>
          <ArrowDownToLine size={16} /> Withdraw bonus
        </button>

        {/* Withdrawal methods */}
        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mt-5 mb-2.5">Withdrawal methods</p>
        <div className="grid grid-cols-2 gap-2.5">
          {WITHDRAW_METHODS.map(m => (
            <button key={m.key}
              className="flex items-center gap-2.5 p-3 rounded-2xl border border-border bg-card text-left hover:border-primary/40 transition-all" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isSeller ? "bg-emerald-50 text-emerald-600" : "bg-primary/10 text-primary"}`}>{m.icon}</div>
              <div className="min-w-0">
                <p className="text-[12px] font-semibold text-foreground leading-tight truncate">{m.label}</p>
                <p className="text-[10px] text-muted-foreground truncate">{m.sub}</p>
              </div>
            </button>
          ))}
        </div>

        {/* History */}
        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mt-5 mb-2.5">Recent activity</p>
        <div className="flex flex-col gap-2 pb-2">
          {transactions.map(t => (
            <div key={t.id} className="flex items-center gap-3 bg-card rounded-2xl border border-border p-3" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${t.kind === "earn" ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-primary"}`}>
                {t.kind === "earn" ? <Gift size={16} /> : <ArrowDownToLine size={16} />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-foreground leading-tight truncate">{t.label}</p>
                <p className="text-[11px] text-muted-foreground">{t.date}</p>
              </div>
              <span className={`text-[13px] font-bold shrink-0 ${t.kind === "earn" ? "text-emerald-600" : "text-foreground"}`}>
                {t.kind === "earn" ? "+" : "−"}{fmtUZS(t.amount)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── SELLER: TRANSACTION APPROVAL ─────────────────────────────────────────────
interface RequestedItem { id: number; name: string; price: string; qty: number; }

const INCOMING_REQUEST = {
  mechanic: "Akmal Karimov",
  mechanicPhone: "+998 90 123 45 67",
  ref: "TXN-2206-A47",
  items: [
    { id: 1, name: "Bosch Oil Filter Premium", price: "45 000", qty: 2 },
    { id: 3, name: "NGK Spark Plug x4", price: "88 000", qty: 1 },
    { id: 5, name: "Denso Air Filter", price: "62 000", qty: 1 },
  ] as RequestedItem[],
};

function TransactionApprovalPage({ onResolve }: { onResolve: () => void }) {
  const [status, setStatus] = useState<"pending" | "approved" | "rejected">("pending");
  const { mechanic, mechanicPhone, ref, items } = INCOMING_REQUEST;
  const total = items.reduce((s, i) => s + priceToNum(i.price) * i.qty, 0);
  const totalUnits = items.reduce((s, i) => s + i.qty, 0);
  const sellerBonus = Math.round(total * 0.02);

  if (status !== "pending") {
    const approved = status === "approved";
    return (
      <div className="flex flex-col h-full">
        <PageHeader title="Transaction" subtitle={ref} />
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center ${approved ? "bg-emerald-50 text-emerald-500" : "bg-red-50 text-red-500"}`}>
            {approved ? <CheckCircle2 size={44} /> : <XCircle size={44} />}
          </div>
          <p className="text-[18px] font-bold text-foreground mt-4">{approved ? "Sale confirmed" : "Request rejected"}</p>
          <p className="text-[13px] text-muted-foreground mt-1.5 leading-relaxed">
            {approved
              ? `You confirmed ${totalUnits} units for ${mechanic}. ${fmtUZS(sellerBonus)} UZS bonus added to your wallet.`
              : `The purchase request from ${mechanic} was rejected. No bonus was applied.`}
          </p>
        </div>
        <div className="shrink-0 px-5 py-3 bg-card border-t border-border">
          <button onClick={onResolve} className="w-full bg-primary text-white rounded-xl py-3.5 text-[14px] font-semibold shadow-md hover:bg-blue-700 active:scale-[0.98] transition-all">Done</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Approve Purchase" subtitle={`Ref ${ref}`} right={
        <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-orange-50 text-orange-600 text-[11px] font-bold"><Clock size={12} /> Pending</span>
      } />
      <div className="flex-1 overflow-y-auto px-4 py-3">
        {/* Mechanic card */}
        <div className="flex items-center gap-3 bg-card rounded-2xl border border-border p-3 mb-3" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
          <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0"><Wrench size={20} /></div>
          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-bold text-foreground leading-tight">{mechanic}</p>
            <p className="text-[11px] text-muted-foreground">{mechanicPhone}</p>
          </div>
          <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-50 text-emerald-600 text-[10px] font-bold"><ShieldCheck size={12} /> Verified</span>
        </div>

        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Requested items</p>
        <div className="flex flex-col gap-2">
          {items.map(it => (
            <div key={it.id} className="flex items-center gap-3 bg-card rounded-2xl border border-border p-3" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
              <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center shrink-0 text-[12px] font-bold text-foreground">×{it.qty}</div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-foreground leading-tight truncate">{it.name}</p>
                <p className="text-[11px] text-muted-foreground">{fmtUZS(priceToNum(it.price))} UZS / unit</p>
              </div>
              <span className="text-[13px] font-bold text-primary shrink-0">{fmtUZS(priceToNum(it.price) * it.qty)}</span>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="bg-card rounded-2xl border border-border p-4 mt-3" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
          <div className="flex items-center justify-between text-[13px] text-muted-foreground">
            <span>{totalUnits} units</span><span className="font-semibold text-foreground">{fmtUZS(total)} UZS</span>
          </div>
          <div className="flex items-center justify-between text-[13px] text-muted-foreground mt-2">
            <span className="flex items-center gap-1.5"><Gift size={13} className="text-emerald-500" /> Your bonus (2%)</span>
            <span className="font-semibold text-emerald-600">+{fmtUZS(sellerBonus)} UZS</span>
          </div>
          <div className="h-px bg-border my-3" />
          <div className="flex items-center justify-between">
            <span className="text-[14px] font-bold text-foreground">Total</span>
            <span className="text-[18px] font-bold text-primary">{fmtUZS(total)} <span className="text-[11px] font-normal text-muted-foreground">UZS</span></span>
          </div>
        </div>
      </div>

      {/* Approve / Reject */}
      <div className="shrink-0 bg-card border-t border-border px-5 py-3 flex gap-3">
        <button onClick={() => setStatus("rejected")}
          className="flex-1 py-3.5 rounded-xl border-2 border-red-200 text-red-500 text-[14px] font-semibold hover:bg-red-50 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
          <XCircle size={17} /> Reject
        </button>
        <button onClick={() => setStatus("approved")}
          className="flex-1 py-3.5 rounded-xl bg-emerald-500 text-white text-[14px] font-semibold shadow-md hover:bg-emerald-600 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
          <CheckCircle2 size={17} /> Approve
        </button>
      </div>
    </div>
  );
}

// ─── SELLER: ORDERS ───────────────────────────────────────────────────────────
const SELLER_ORDERS = [
  { id: 1, mechanic: "Akmal Karimov", ref: "TXN-2206-A47", units: 4, amount: 240000, status: "pending" as const },
  { id: 2, mechanic: "Dilshod Rasulov", ref: "TXN-2205-B12", units: 2, amount: 410000, status: "approved" as const },
  { id: 3, mechanic: "Sardor Yusupov", ref: "TXN-2205-A08", units: 1, amount: 88000, status: "approved" as const },
  { id: 4, mechanic: "Jasur Toirov", ref: "TXN-2204-C33", units: 3, amount: 156000, status: "rejected" as const },
];

function SellerOrdersPage() {
  const badge = {
    pending: { cls: "bg-orange-50 text-orange-600", label: "Pending" },
    approved: { cls: "bg-emerald-50 text-emerald-600", label: "Approved" },
    rejected: { cls: "bg-red-50 text-red-500", label: "Rejected" },
  };
  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Sales & Orders" subtitle={`${SELLER_ORDERS.length} recent`} />
      <div className="flex-1 overflow-y-auto px-4 py-3">
        <div className="flex flex-col gap-3">
          {SELLER_ORDERS.map(o => (
            <div key={o.id} className="bg-card rounded-2xl border border-border p-4" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-[14px] font-bold text-foreground">{o.mechanic}</p>
                <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${badge[o.status].cls}`}>{badge[o.status].label}</span>
              </div>
              <div className="flex items-center justify-between text-[12px] text-muted-foreground">
                <span className="flex items-center gap-1.5"><Receipt size={12} /> {o.ref} · {o.units} units</span>
                <span className="text-[14px] font-bold text-primary">{fmtUZS(o.amount)} UZS</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── MECHANIC APP ─────────────────────────────────────────────────────────────
function MechanicApp({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<MechanicTab>("main");
  const [scanning, setScanning] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartIds, setCartIds] = useState<number[]>([]);
  const [cartQty, setCartQty] = useState<Record<number, number>>({});

  const tabs: { key: MechanicTab; label: string; icon: (active: boolean) => React.ReactNode }[] = [
    { key: "main",    label: "Main",    icon: (a) => <Home    size={22} strokeWidth={a ? 2.5 : 1.8} /> },
    { key: "shops",   label: "Shops",   icon: (a) => <MapPin  size={22} strokeWidth={a ? 2.5 : 1.8} /> },
    { key: "scan",    label: "Scan",    icon: (_) => <ScanLine size={24} strokeWidth={2} /> },
    { key: "cart",    label: "Cart",    icon: (a) => <ShoppingCart size={22} strokeWidth={a ? 2.5 : 1.8} /> },
    { key: "profile", label: "Profile", icon: (a) => <User    size={22} strokeWidth={a ? 2.5 : 1.8} /> },
  ];

  const pageIcon: Record<MechanicTab, React.ReactNode> = {
    main:    <Package size={32} />,
    shops:   <MapPin size={32} />,
    scan:    <ScanLine size={32} />,
    cart:    <ShoppingCart size={32} />,
    profile: <User size={32} />,
  };
  const pageLabel: Record<MechanicTab, string> = {
    main: "Product Catalog", shops: "Nearby Shops", scan: "Scan", cart: "My Cart", profile: "Profile",
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 relative">
      {scanning && <ScanOverlay onClose={() => setScanning(false)} />}

      {/* Header — hide when viewing product detail (it has its own back btn) */}
      {!selectedProduct && <AppHeader role="mechanic" onLogout={onLogout} />}

      {/* Page content */}
      <div className="flex-1 min-h-0 overflow-hidden">
        {selectedProduct
          ? <ProductDetailPage product={selectedProduct} onBack={() => setSelectedProduct(null)} cartIds={cartIds} setCartIds={setCartIds} />
          : tab === "main"
            ? <MechanicMainPage onSelect={setSelectedProduct} onGoToCart={() => setTab("cart")} cartIds={cartIds} setCartIds={setCartIds} cartQty={cartQty} setCartQty={setCartQty} />
            : tab === "shops"
              ? <ShopsPage />
              : tab === "cart"
                ? <CartPage cartIds={cartIds} setCartIds={setCartIds} cartQty={cartQty} setCartQty={setCartQty} />
                : tab === "profile"
                  ? <WalletScreen role="mechanic" name="Akmal Karimov" phone="+998 90 123 45 67" balance={184000}
                      transactions={[
                        { id: 1, label: "Purchase bonus · AutoZone", date: "Jun 18, 2026", amount: 13500, kind: "earn" },
                        { id: 2, label: "Withdraw to UzCard", date: "Jun 12, 2026", amount: 100000, kind: "withdraw" },
                        { id: 3, label: "Purchase bonus · TireHub", date: "Jun 09, 2026", amount: 23400, kind: "earn" },
                        { id: 4, label: "Purchase bonus · SparkMaster", date: "Jun 02, 2026", amount: 2640, kind: "earn" },
                      ]} />
                  : <PlaceholderPage label={pageLabel[tab]} icon={pageIcon[tab]} />}
      </div>

      {/* Bottom nav — hide on detail page */}
      {!selectedProduct && (
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
                  <div className={`transition-colors ${isActive ? "text-primary" : "text-muted-foreground"}`}>
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

// ─── SELLER APP ───────────────────────────────────────────────────────────────
function SellerApp({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<SellerTab>("main");
  const [scanning, setScanning] = useState(false);
  const [showApproval, setShowApproval] = useState(false);

  const tabs: { key: SellerTab; label: string; icon: (active: boolean) => React.ReactNode }[] = [
    { key: "main",    label: "Main",    icon: (a) => <Home        size={22} strokeWidth={a ? 2.5 : 1.8} /> },
    { key: "catalog", label: "Catalog", icon: (a) => <BookOpen    size={22} strokeWidth={a ? 2.5 : 1.8} /> },
    { key: "scan",    label: "Scan",    icon: (_) => <ScanLine    size={24} strokeWidth={2} /> },
    { key: "orders",  label: "Orders",  icon: (a) => <ClipboardList size={22} strokeWidth={a ? 2.5 : 1.8} /> },
    { key: "profile", label: "Profile", icon: (a) => <User        size={22} strokeWidth={a ? 2.5 : 1.8} /> },
  ];

  const pageIcon: Record<SellerTab, React.ReactNode> = {
    main:    <Home size={32} />,
    catalog: <BookOpen size={32} />,
    scan:    <ScanLine size={32} />,
    orders:  <ClipboardList size={32} />,
    profile: <User size={32} />,
  };
  const pageLabel: Record<SellerTab, string> = {
    main: "Dashboard", catalog: "My Catalog", scan: "Scan", orders: "Sales & Orders", profile: "Profile",
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 relative">
      {scanning && (
        <ScanOverlay
          title="Scan Mechanic QR"
          hint="Align the mechanic's purchase QR in the frame"
          onClose={() => setScanning(false)}
          onScanComplete={() => { setScanning(false); setShowApproval(true); }}
        />
      )}

      {/* Header — hidden during the full-screen approval flow */}
      {!showApproval && <AppHeader role="seller" onLogout={onLogout} />}

      <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
        {showApproval
          ? <TransactionApprovalPage onResolve={() => { setShowApproval(false); setTab("orders"); }} />
          : tab === "orders"
            ? <SellerOrdersPage />
            : tab === "profile"
              ? <WalletScreen role="seller" name="Bekzod Saidov" phone="+998 91 555 22 11" balance={326500}
                  transactions={[
                    { id: 1, label: "Sale bonus · Akmal K.", date: "Jun 18, 2026", amount: 4800, kind: "earn" },
                    { id: 2, label: "Withdraw to Click", date: "Jun 14, 2026", amount: 150000, kind: "withdraw" },
                    { id: 3, label: "Sale bonus · Dilshod R.", date: "Jun 10, 2026", amount: 8200, kind: "earn" },
                    { id: 4, label: "Sale bonus · Sardor Y.", date: "Jun 05, 2026", amount: 1760, kind: "earn" },
                  ]} />
              : <PlaceholderPage label={pageLabel[tab]} icon={pageIcon[tab]} />}
      </div>

      {/* Bottom nav — hidden during the full-screen approval flow */}
      {!showApproval && (
      <div className="shrink-0 bg-card border-t border-border relative">
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
                <div className={`transition-colors ${isActive ? "text-primary" : "text-muted-foreground"}`}>
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
const AUTH_SCREENS: AuthScreen[] = ["login", "signup-phone", "signup-otp", "signup-details", "forgot-otp", "forgot-newpass"];

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
            {s === "login"           && <LoginScreen onLogin={onLogin} onNavigate={setScreen} lang={lang} setLang={setLang} />}
            {s === "signup-phone"    && <SignupPhoneScreen onNavigate={setScreen} lang={lang} setLang={setLang} />}
            {s === "signup-otp"      && <OtpScreen onNavigate={setScreen} onBack={() => setScreen("signup-phone")} nextScreen="signup-details" title="Verify your number" subtitle="Enter the 6-digit code sent to your phone" lang={lang} setLang={setLang} />}
            {s === "signup-details"  && <SignupDetailsScreen onNavigate={setScreen} lang={lang} setLang={setLang} />}
            {s === "forgot-otp"      && <OtpScreen onNavigate={setScreen} onBack={() => setScreen("login")} nextScreen="forgot-newpass" title="Verify it's you" subtitle="Enter the 6-digit code sent to your registered number" lang={lang} setLang={setLang} />}
            {s === "forgot-newpass"  && <ForgotNewPassScreen onNavigate={setScreen} lang={lang} setLang={setLang} />}
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
          : loggedInAs === "mechanic"
            ? <MechanicApp onLogout={() => setLoggedInAs(null)} />
            : <SellerApp onLogout={() => setLoggedInAs(null)} />
        }

        {/* Home indicator */}
        <div className="flex justify-center pb-2 pt-1 shrink-0">
          <div className="w-32 h-1 bg-foreground/20 rounded-full" />
        </div>
      </div>
    </div>
  );
}
