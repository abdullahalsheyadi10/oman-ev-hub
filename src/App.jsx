import React, { useState, useEffect, useMemo } from "react";
import {
  Zap, MapPin, Coffee, Gift, Leaf, User, Battery, Navigation2,
  ChevronLeft, ChevronRight, Plus, Minus, Check, X, Bell, Settings,
  Sun, Wifi, ParkingCircle, Sofa, Bath, Star, Car, Building2, Users,
  TrendingUp, DollarSign, ShieldCheck, Clock, Pause, Square, CreditCard,
  Wallet, Smartphone, Landmark, ArrowRight, Award, Sparkles, Trash2,
  AlertTriangle, Globe, LayoutDashboard, BatteryCharging, Cable,
  Megaphone, FileBarChart, LogOut, Home as HomeIcon
} from "lucide-react";
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, AreaChart, Area
} from "recharts";

/* ---------------------------------------------------------------
   DESIGN TOKENS
   bg      : #F7F9F8  (soft off-white, per Oman EV Hub brand theme)
   surface : #FFFFFF
   line    : #E5E7EB
   mint    : #2ECC71  (electric mint — EV/solar accent)
   amber   : #F1C40F  (desert amber — coffee/energy secondary)
   sand    : #2B2F2C  (primary text, warm off-white)
   dim     : #6B7280  (secondary text)
   danger  : #E74C3C
----------------------------------------------------------------- */

const T = {
  en: {
    dir: "ltr",
    nav: { home: "Home", charging: "Charging", coffee: "Coffee", rewards: "Rewards", eco: "Eco", profile: "Profile" },
    greeting: "Good morning",
    findCharger: "Find charger", startCharging: "Start charging", reserve: "Reserve", orderCoffee: "Order coffee",
    membership: "Membership", nearest: "Nearest hub", battery: "Battery", range: "Est. range", available: "Available",
  },
  ar: {
    dir: "rtl",
    nav: { home: "الرئيسية", charging: "الشحن", coffee: "القهوة", rewards: "المكافآت", eco: "الاستدامة", profile: "الملف" },
    greeting: "صباح الخير",
    findCharger: "ابحث عن شاحن", startCharging: "ابدأ الشحن", reserve: "احجز", orderCoffee: "اطلب قهوة",
    membership: "العضوية", nearest: "أقرب محطة", battery: "البطارية", range: "المدى المقدر", available: "متاح",
  },
};

const STATIONS = [
  { id: "muscat", name: "Muscat", nameAr: "مسقط", bays: 12, available: 5, power: [60,120,180,240], distance: "6.2 km", eta: "11 min", rating: 4.8, coffee: true, parking: true, solar: true, ads: true },
  { id: "sohar", name: "Sohar", nameAr: "صحار", bays: 10, available: 8, power: [60,120,180,240], distance: "2.1 km", eta: "4 min", rating: 4.9, coffee: true, parking: true, solar: true, ads: true },
  { id: "nizwa", name: "Nizwa", nameAr: "نزوى", bays: 8, available: 3, power: [60,120,180], distance: "112 km", eta: "68 min", rating: 4.6, coffee: true, parking: true, solar: true, ads: false },
  { id: "salalah", name: "Salalah", nameAr: "صلالة", bays: 10, available: 6, power: [60,120,180,240], distance: "1030 km", eta: "9h 40m", rating: 4.7, coffee: true, parking: true, solar: true, ads: true },
  { id: "duqm", name: "Duqm", nameAr: "الدقم", bays: 6, available: 0, power: [60,120], distance: "540 km", eta: "5h 10m", rating: 4.4, coffee: false, parking: true, solar: true, ads: false },
];

const CHARGERS_BY_STATION = {
  sohar: [
    { id: "01", power: 120, connector: "CCS2", status: "available" },
    { id: "02", power: 180, connector: "CCS2", status: "charging" },
    { id: "03", power: 60, connector: "GB/T", status: "available" },
    { id: "04", power: 240, connector: "CCS2", status: "reserved" },
    { id: "05", power: 120, connector: "CCS2", status: "offline" },
  ],
  muscat: [
    { id: "01", power: 240, connector: "CCS2", status: "available" },
    { id: "02", power: 120, connector: "CCS2", status: "available" },
    { id: "03", power: 60, connector: "GB/T", status: "charging" },
  ],
  nizwa: [
    { id: "01", power: 120, connector: "CCS2", status: "available" },
    { id: "02", power: 60, connector: "GB/T", status: "reserved" },
  ],
  salalah: [
    { id: "01", power: 180, connector: "CCS2", status: "available" },
    { id: "02", power: 240, connector: "CCS2", status: "available" },
  ],
  duqm: [
    { id: "01", power: 60, connector: "GB/T", status: "offline" },
  ],
};

const COFFEE_MENU = [
  { cat: "Coffee", items: [
    { id: "esp", name: "Espresso", price: 1.200 },
    { id: "cap", name: "Cappuccino", price: 1.800 },
    { id: "lat", name: "Iced Latte", price: 2.000 },
  ]},
  { cat: "Cold Drinks", items: [
    { id: "ice", name: "Iced Tea", price: 1.500 },
    { id: "lem", name: "Fresh Lemon Mint", price: 1.700 },
  ]},
  { cat: "Snacks & Food", items: [
    { id: "cro", name: "Croissant", price: 1.500 },
    { id: "sw", name: "Chicken Sandwich", price: 2.500 },
  ]},
  { cat: "Desserts", items: [
    { id: "cak", name: "Date Cake", price: 1.900 },
  ]},
];

const HISTORY = [
  { date: "Sep 9, 2026", station: "Oman EV Hub – Sohar", vehicle: "BYD Sealion 6", kwh: 45, time: "28 min", cost: "3.600", status: "Completed" },
  { date: "Sep 5, 2026", station: "Oman EV Hub – Muscat", vehicle: "BYD Sealion 6", kwh: 38, time: "24 min", cost: "3.040", status: "Completed" },
  { date: "Aug 29, 2026", station: "Oman EV Hub – Sohar", vehicle: "Tesla Model 3", kwh: 52, time: "31 min", cost: "4.160", status: "Completed" },
];

const SOLAR_MONTHLY = [
  { m: "Apr", kwh: 68000 }, { m: "May", kwh: 74000 }, { m: "Jun", kwh: 81000 },
  { m: "Jul", kwh: 86000 }, { m: "Aug", kwh: 92000 }, { m: "Sep", kwh: 79000 },
];
const ENERGY_MIX = [
  { name: "Solar", value: 62, color: "#2ECC71" },
  { name: "Grid (renewable-blend)", value: 28, color: "#F1C40F" },
  { name: "Grid (standard)", value: 10, color: "#CBD5E1" },
];
const REVENUE_TREND = [
  { m: "Apr", rev: 17200 }, { m: "May", rev: 18650 }, { m: "Jun", rev: 20100 },
  { m: "Jul", rev: 21870 }, { m: "Aug", rev: 23440 }, { m: "Sep", rev: 21980 },
];
const REVENUE_SPLIT = [
  { name: "Charging", value: 61, color: "#2ECC71" },
  { name: "Advertising", value: 22, color: "#F1C40F" },
  { name: "Coffee shop", value: 17, color: "#3498DB" },
];

const STATUS_COLOR = { available: "#2ECC71", charging: "#3498DB", reserved: "#D4AC0D", offline: "#E74C3C" };
const STATUS_LABEL = { available: "Available", charging: "Charging", reserved: "Reserved", offline: "Offline" };

/* ---------------------------------------------------------------  UI atoms */

function Logo({ size = 38, wordmark = true }) {
  return (
    <div className="flex items-center gap-2.5">
      <div
        className="rounded-full flex items-center justify-center flex-shrink-0"
        style={{ width: size, height: size, backgroundColor: "#2ECC71" }}
      >
        <Zap size={size * 0.5} className="text-white" fill="#FFFFFF" strokeWidth={1.5} />
      </div>
      {wordmark && (
        <span className="font-bold tracking-tight text-[#2B2F2C]" style={{ fontSize: size * 0.42 }}>
          Oman EV Hub
        </span>
      )}
    </div>
  );
}

function Card({ children, className = "", onClick }) {
  return (
    <div
      onClick={onClick}
      className={`bg-[#FFFFFF] border border-[#E5E7EB] rounded-2xl shadow-sm ${onClick ? "active:scale-[0.98] cursor-pointer" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

function Pill({ children, tone = "default" }) {
  const tones = {
    default: "bg-[#F3F4F6] text-[#6B7280] border-[#E5E7EB]",
    mint: "bg-[#EAFAF1] text-[#2ECC71] border-[#A9DFBF]",
    amber: "bg-[#FEF9E7] text-[#F1C40F] border-[#F9E79F]",
    danger: "bg-[#FDEDEC] text-[#E74C3C] border-[#F5B7B1]",
  };
  return <span className={`text-xs px-2.5 py-1 rounded-full border ${tones[tone]}`}>{children}</span>;
}

function PrimaryButton({ children, onClick, icon: Icon, full = true, tone = "mint", disabled }) {
  const tones = {
    mint: "bg-[#2ECC71] text-[#FFFFFF]",
    amber: "bg-[#F1C40F] text-[#2B2F2C]",
    ghost: "bg-transparent text-[#2B2F2C] border border-[#D1D5DB]",
    danger: "bg-[#E74C3C] text-[#FFFFFF]",
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${full ? "w-full" : ""} ${tones[tone]} disabled:opacity-40 flex items-center justify-center gap-2 font-semibold rounded-xl py-3 px-4 active:scale-[0.98] transition-transform`}
    >
      {Icon && <Icon size={18} />}
      {children}
    </button>
  );
}

function TopBar({ title, onBack, lang = "en", setLang, right, showLang = false }) {
  return (
    <div className="flex items-center justify-between px-5 pt-5 pb-3 sticky top-0 bg-[#F7F9F8]/95 backdrop-blur z-10">
      <div className="flex items-center gap-3">
        {onBack && (
          <button onClick={onBack} className="w-9 h-9 rounded-full bg-[#FFFFFF] border border-[#E5E7EB] flex items-center justify-center">
            <ChevronLeft size={18} className="text-[#2B2F2C]" style={{ transform: lang === "ar" ? "scaleX(-1)" : "none" }} />
          </button>
        )}
        <h1 className="text-lg font-semibold text-[#2B2F2C] tracking-tight">{title}</h1>
      </div>
      <div className="flex items-center gap-2">
        {right}
        {showLang && (
          <button
            onClick={() => setLang(lang === "en" ? "ar" : "en")}
            className="w-9 h-9 rounded-full bg-[#FFFFFF] border border-[#E5E7EB] flex items-center justify-center"
          >
            <Globe size={16} className="text-[#6B7280]" />
          </button>
        )}
      </div>
    </div>
  );
}

function BottomNav({ view, setView, t }) {
  const items = [
    { key: "home", icon: HomeIcon, label: t.nav.home },
    { key: "charging", icon: Zap, label: t.nav.charging },
    { key: "coffee", icon: Coffee, label: t.nav.coffee },
    { key: "rewards", icon: Gift, label: t.nav.rewards },
    { key: "eco", icon: Leaf, label: t.nav.eco },
    { key: "profile", icon: User, label: t.nav.profile },
  ];
  return (
    <div className="fixed bottom-0 inset-x-0 max-w-md mx-auto bg-[#FFFFFF]/97 backdrop-blur border-t border-[#E5E7EB] flex justify-around py-2 px-1 z-20">
      {items.map((it) => {
        const active = view === it.key;
        return (
          <button key={it.key} onClick={() => setView(it.key)} className="flex flex-col items-center gap-1 px-2 py-1 min-w-[52px]">
            <it.icon size={20} className={active ? "text-[#2ECC71]" : "text-[#9CA3AF]"} />
            <span className={`text-[10px] ${active ? "text-[#2ECC71]" : "text-[#9CA3AF]"}`}>{it.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function BatteryRing({ pct, size = 180, label, sub, colorStart = "#2ECC71", colorEnd = "#58D68D" }) {
  const r = (size - 18) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <defs>
          <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colorStart} />
            <stop offset="100%" stopColor={colorEnd} />
          </linearGradient>
        </defs>
        <circle cx={size/2} cy={size/2} r={r} stroke="#E5E7EB" strokeWidth="12" fill="none" />
        <circle
          cx={size/2} cy={size/2} r={r} stroke="url(#ringGrad)" strokeWidth="12" fill="none"
          strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
          transform={`rotate(-90 ${size/2} ${size/2})`}
          style={{ transition: "stroke-dashoffset 1s ease" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-4xl font-mono font-bold text-[#2B2F2C]">{Math.round(pct)}%</span>
        {label && <span className="text-xs text-[#6B7280] mt-1">{label}</span>}
        {sub && <span className="text-[11px] text-[#9CA3AF]">{sub}</span>}
      </div>
    </div>
  );
}

function Toast({ msg }) {
  if (!msg) return null;
  return (
    <div className="fixed top-4 inset-x-0 flex justify-center z-50">
      <div className="bg-[#EAFAF1] border border-[#A9DFBF] text-[#2ECC71] text-sm px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
        <Check size={14} /> {msg}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------  Screens */

function HomeScreen({ t, lang, user, setView, chargeFlow, quickStart }) {
  return (
    <div className="pb-24">
      <div className="px-5 pt-6 pb-2">
        <p className="text-[#6B7280] text-sm">{t.greeting},</p>
        <h1 className="text-2xl font-semibold text-[#2B2F2C]">{user.name}</h1>
        <div className="flex items-center gap-2 mt-2 text-sm text-[#6B7280]">
          <MapPin size={14} className="text-[#2ECC71]" /> {user.city} · {user.vehicle}
        </div>
      </div>

      <div className="px-5 mt-3">
        <Card className="p-4 flex items-center gap-4">
          <BatteryRing pct={user.battery} size={92} />
          <div className="flex-1">
            <div className="flex items-center gap-2 text-[#2B2F2C] font-medium"><Battery size={16} className="text-[#2ECC71]"/> {t.battery}</div>
            <div className="text-sm text-[#6B7280] mt-1">{t.range}: <span className="text-[#2B2F2C] font-mono">{user.range} km</span></div>
            <div className="text-sm text-[#6B7280]">{t.nearest}: <span className="text-[#2B2F2C]">Oman EV Hub – Sohar</span></div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-3 px-5 mt-4">
        {[
          { icon: Battery, label: t.battery, value: `${user.battery}%` },
          { icon: Navigation2, label: t.range, value: `${user.range} km` },
          { icon: Zap, label: t.nearest, value: "Sohar" },
          { icon: Car, label: t.available, value: "8" },
        ].map((c, i) => (
          <Card key={i} className="p-3">
            <c.icon size={16} className="text-[#F1C40F]" />
            <div className="text-lg font-mono font-semibold text-[#2B2F2C] mt-1">{c.value}</div>
            <div className="text-xs text-[#6B7280]">{c.label}</div>
          </Card>
        ))}
      </div>

      <div className="px-5 mt-5">
        <h2 className="text-sm font-medium text-[#6B7280] mb-2">Quick actions</h2>
        <div className="grid grid-cols-2 gap-3">
          <PrimaryButton icon={MapPin} tone="ghost" onClick={() => setView("charging")}>{t.findCharger}</PrimaryButton>
          <PrimaryButton icon={Zap} onClick={quickStart}>{t.startCharging}</PrimaryButton>
          <PrimaryButton icon={Clock} tone="ghost" onClick={() => setView("charging")}>{t.reserve}</PrimaryButton>
          <PrimaryButton icon={Coffee} tone="amber" onClick={() => setView("coffee")}>{t.orderCoffee}</PrimaryButton>
        </div>
      </div>

      <div className="px-5 mt-5">
        <Card className="p-4 flex items-center justify-between" onClick={() => setView("rewards")}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FEF9E7] flex items-center justify-center"><Award size={18} className="text-[#F1C40F]"/></div>
            <div>
              <div className="text-sm text-[#2B2F2C] font-medium">Gold Member</div>
              <div className="text-xs text-[#6B7280]">2,340 points</div>
            </div>
          </div>
          <ChevronRight size={18} className="text-[#9CA3AF]" />
        </Card>
      </div>
    </div>
  );
}

function MapScreen({ t, lang, onSelectStation }) {
  return (
    <div className="pb-24">
      <TopBarless title="Charging map" />
      <div className="px-5 mt-2 mb-4">
        <div className="relative rounded-2xl overflow-hidden h-40 bg-gradient-to-br from-[#FFFFFF] to-[#F3F4F6] border border-[#E5E7EB] flex items-center justify-center">
          <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 20% 30%, #2ECC71 0, transparent 35%), radial-gradient(circle at 70% 60%, #F1C40F 0, transparent 30%)" }} />
          <span className="text-[#9CA3AF] text-xs relative z-10">Sultanate of Oman · live station map</span>
        </div>
      </div>
      <div className="px-5 space-y-3">
        {STATIONS.map((s) => (
          <Card key={s.id} className="p-4" onClick={() => onSelectStation(s)}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[#2B2F2C] font-medium">{lang === "ar" ? s.nameAr : s.name}</div>
                <div className="text-xs text-[#6B7280] mt-0.5 flex items-center gap-1"><Star size={11} className="text-[#F1C40F]" fill="#F1C40F"/> {s.rating} · {s.distance} · {s.eta}</div>
              </div>
              <Pill tone={s.available > 0 ? "mint" : "danger"}>{s.available}/{s.bays} {t.available}</Pill>
            </div>
            <div className="flex items-center gap-3 mt-3 text-[#9CA3AF]">
              {s.coffee && <Coffee size={14} />}
              {s.parking && <ParkingCircle size={14} />}
              {s.solar && <Sun size={14} />}
              {s.ads && <Megaphone size={14} />}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function TopBarless({ title }) {
  return <div className="px-5 pt-5"><h1 className="text-lg font-semibold text-[#2B2F2C]">{title}</h1></div>;
}

function StationScreen({ station, onBack, onStartCharging, onReserve, toast }) {
  return (
    <div className="pb-24">
      <TopBar title={`Oman EV Hub – ${station.name}`} onBack={onBack} lang="en" setLang={()=>{}} />
      <div className="px-5 space-y-4">
        <Card className="p-4">
          <div className="flex items-center gap-2 text-[#2B2F2C] font-medium"><MapPin size={16} className="text-[#2ECC71]"/> {station.name}, Sultanate of Oman</div>
          <div className="grid grid-cols-3 gap-3 mt-4">
            <div><div className="text-xs text-[#6B7280]">Bays</div><div className="font-mono text-[#2B2F2C]">{station.bays}</div></div>
            <div><div className="text-xs text-[#6B7280]">Available</div><div className="font-mono text-[#2ECC71]">{station.available}</div></div>
            <div><div className="text-xs text-[#6B7280]">Rating</div><div className="font-mono text-[#2B2F2C]">{station.rating}</div></div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="text-sm text-[#6B7280] mb-2">Charging power</div>
          <div className="flex flex-wrap gap-2">
            {station.power.map((p) => <Pill key={p} tone="mint">{p} kW</Pill>)}
          </div>
        </Card>

        <Card className="p-4">
          <div className="text-sm text-[#6B7280] mb-3">Facilities</div>
          <div className="grid grid-cols-3 gap-3 text-[#2B2F2C] text-xs">
            {station.coffee && <div className="flex flex-col items-center gap-1"><Coffee size={18} className="text-[#F1C40F]"/>Coffee shop</div>}
            <div className="flex flex-col items-center gap-1"><Sofa size={18} className="text-[#F1C40F]"/>Lounge</div>
            <div className="flex flex-col items-center gap-1"><Wifi size={18} className="text-[#F1C40F]"/>Free Wi-Fi</div>
            <div className="flex flex-col items-center gap-1"><Bath size={18} className="text-[#F1C40F]"/>Restrooms</div>
            {station.parking && <div className="flex flex-col items-center gap-1"><ParkingCircle size={18} className="text-[#F1C40F]"/>Parking</div>}
            {station.solar && <div className="flex flex-col items-center gap-1"><Sun size={18} className="text-[#F1C40F]"/>Solar power</div>}
          </div>
        </Card>

        <div className="flex gap-3 pt-2">
          <PrimaryButton tone="ghost" icon={Clock} onClick={onReserve}>Reserve</PrimaryButton>
          <PrimaryButton icon={Zap} onClick={onStartCharging} disabled={station.available === 0}>Start charging</PrimaryButton>
        </div>
      </div>
    </div>
  );
}

function ChargerSelectScreen({ station, onBack, onPick, mode }) {
  const chargers = CHARGERS_BY_STATION[station.id] || [];
  return (
    <div className="pb-24">
      <TopBar title="Select a charger" onBack={onBack} lang="en" setLang={()=>{}} />
      <div className="px-5 space-y-3">
        {chargers.map((c) => (
          <Card key={c.id} className="p-4 flex items-center justify-between">
            <div>
              <div className="text-[#2B2F2C] font-medium">Charger {c.id}</div>
              <div className="text-xs text-[#6B7280] mt-0.5">{c.power} kW · {c.connector}</div>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-xs" style={{ color: STATUS_COLOR[c.status] }}>
                <span className="w-2 h-2 rounded-full" style={{ background: STATUS_COLOR[c.status] }} /> {STATUS_LABEL[c.status]}
              </span>
              {c.status === "available" && (
                <button onClick={() => onPick(c)} className="text-xs font-semibold bg-[#2ECC71] text-[#FFFFFF] px-3 py-1.5 rounded-lg">
                  {mode === "reserve" ? "Reserve" : "Start"}
                </button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function LiveChargingScreen({ station, charger, onStop, elapsed, battery }) {
  const power = charger?.power || 120;
  const kwh = ((elapsed / 60) * (power / 60)).toFixed(1);
  const cost = (kwh * 0.08).toFixed(3);
  const solarShare = 35;
  const co2 = (kwh * 0.113).toFixed(1);
  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;
  const remaining = Math.max(0, 24 - mins);
  return (
    <div className="pb-24">
      <TopBarless title={`Charging at ${station.name}`} />
      <div className="flex flex-col items-center mt-4">
        <BatteryRing pct={battery} size={200} label="Battery" sub={`Charger ${charger?.id} · ${power} kW`} />
      </div>
      <div className="grid grid-cols-2 gap-3 px-5 mt-6">
        <Card className="p-3"><div className="text-xs text-[#6B7280]">Energy delivered</div><div className="font-mono text-lg text-[#2B2F2C]">{kwh} kWh</div></Card>
        <Card className="p-3"><div className="text-xs text-[#6B7280]">Charging time</div><div className="font-mono text-lg text-[#2B2F2C]">{mins}:{String(secs).padStart(2,"0")}</div></Card>
        <Card className="p-3"><div className="text-xs text-[#6B7280]">Est. completion</div><div className="font-mono text-lg text-[#2B2F2C]">{remaining} min</div></Card>
        <Card className="p-3"><div className="text-xs text-[#6B7280]">Current cost</div><div className="font-mono text-lg text-[#2B2F2C]">OMR {cost}</div></Card>
        <Card className="p-3"><div className="text-xs text-[#6B7280] flex items-center gap-1"><Sun size={12} className="text-[#F1C40F]"/>Solar share</div><div className="font-mono text-lg text-[#F1C40F]">{solarShare}%</div></Card>
        <Card className="p-3"><div className="text-xs text-[#6B7280] flex items-center gap-1"><Leaf size={12} className="text-[#2ECC71]"/>CO₂ saved</div><div className="font-mono text-lg text-[#2ECC71]">{co2} kg</div></Card>
      </div>
      <div className="px-5 mt-6 flex gap-3">
        <PrimaryButton tone="ghost" icon={Pause}>Pause</PrimaryButton>
        <PrimaryButton tone="danger" icon={Square} onClick={() => onStop({ kwh, cost })}>Stop charging</PrimaryButton>
      </div>
    </div>
  );
}

function PaymentScreen({ amount, label, onBack, onPay }) {
  const [method, setMethod] = useState("wallet");
  const methods = [
    { id: "wallet", label: "Oman EV Hub Wallet", icon: Wallet, sub: "Balance: OMR 24.500" },
    { id: "card", label: "Credit / Debit Card", icon: CreditCard, sub: "•••• 4417" },
    { id: "apple", label: "Apple Pay", icon: Smartphone, sub: "" },
    { id: "bank", label: "Oman payment options", icon: Landmark, sub: "" },
  ];
  return (
    <div className="pb-24">
      <TopBar title="Payment" onBack={onBack} lang="en" setLang={()=>{}} />
      <div className="px-5">
        <Card className="p-4">
          <div className="flex justify-between text-sm text-[#6B7280]"><span>{label}</span><span className="font-mono text-[#2B2F2C]">OMR {amount}</span></div>
          <div className="flex justify-between text-sm text-[#6B7280] mt-1"><span>Membership discount</span><span className="font-mono text-[#2ECC71]">- OMR 0.200</span></div>
          <div className="border-t border-[#E5E7EB] mt-3 pt-3 flex justify-between font-semibold"><span className="text-[#2B2F2C]">Total</span><span className="font-mono text-[#2B2F2C]">OMR {(parseFloat(amount) - 0.2).toFixed(3)}</span></div>
        </Card>
        <div className="mt-4 space-y-2">
          {methods.map((m) => (
            <Card key={m.id} className={`p-3 flex items-center justify-between ${method===m.id ? "border-[#2ECC71]" : ""}`} onClick={() => setMethod(m.id)}>
              <div className="flex items-center gap-3">
                <m.icon size={18} className="text-[#F1C40F]" />
                <div><div className="text-sm text-[#2B2F2C]">{m.label}</div>{m.sub && <div className="text-xs text-[#9CA3AF]">{m.sub}</div>}</div>
              </div>
              <div className={`w-4 h-4 rounded-full border ${method===m.id ? "bg-[#2ECC71] border-[#2ECC71]" : "border-[#CBD5E1]"}`} />
            </Card>
          ))}
        </div>
        <div className="mt-6"><PrimaryButton icon={ShieldCheck} onClick={() => onPay(method)}>Pay now</PrimaryButton></div>
      </div>
    </div>
  );
}

function ReceiptScreen({ receipt, onDone }) {
  return (
    <div className="pb-24 flex flex-col items-center justify-center pt-24 px-8 text-center">
      <div className="w-16 h-16 rounded-full bg-[#EAFAF1] border border-[#A9DFBF] flex items-center justify-center mb-4">
        <Check size={28} className="text-[#2ECC71]" />
      </div>
      <h1 className="text-xl font-semibold text-[#2B2F2C]">Payment complete</h1>
      <p className="text-sm text-[#6B7280] mt-2">{receipt?.label}</p>
      <p className="font-mono text-2xl text-[#2B2F2C] mt-3">OMR {receipt?.amount}</p>
      <p className="text-xs text-[#9CA3AF] mt-1">+45 Oman EV Points earned</p>
      <div className="mt-8 w-full"><PrimaryButton onClick={onDone}>Back to home</PrimaryButton></div>
    </div>
  );
}

function CoffeeScreen({ t, cart, setCart, onCheckout }) {
  const add = (item) => setCart((c) => {
    const found = c.find((x) => x.id === item.id);
    if (found) return c.map((x) => x.id === item.id ? { ...x, qty: x.qty + 1 } : x);
    return [...c, { ...item, qty: 1 }];
  });
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  return (
    <div className="pb-32">
      <TopBarless title="Oman EV Coffee" />
      <p className="px-5 text-sm text-[#6B7280] -mt-1 mb-3">While you charge, we brew.</p>
      {COFFEE_MENU.map((section) => (
        <div key={section.cat} className="px-5 mt-4">
          <h2 className="text-sm font-medium text-[#6B7280] mb-2">{section.cat}</h2>
          <div className="space-y-2">
            {section.items.map((item) => (
              <Card key={item.id} className="p-3 flex items-center justify-between">
                <div>
                  <div className="text-sm text-[#2B2F2C]">{item.name}</div>
                  <div className="text-xs font-mono text-[#6B7280]">OMR {item.price.toFixed(3)}</div>
                </div>
                <button onClick={() => add(item)} className="w-8 h-8 rounded-full bg-[#FEF9E7] flex items-center justify-center">
                  <Plus size={16} className="text-[#F1C40F]" />
                </button>
              </Card>
            ))}
          </div>
        </div>
      ))}
      {cart.length > 0 && (
        <div className="fixed bottom-16 inset-x-0 max-w-md mx-auto px-5">
          <button onClick={onCheckout} className="w-full bg-[#F1C40F] text-[#2B2F2C] font-semibold rounded-xl py-3 flex items-center justify-between px-4">
            <span>{cart.reduce((s,i)=>s+i.qty,0)} items · OMR {total.toFixed(3)}</span>
            <span className="flex items-center gap-1">View cart <ArrowRight size={16} /></span>
          </button>
        </div>
      )}
    </div>
  );
}

function CartScreen({ cart, setCart, onBack, onPay }) {
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const change = (id, d) => setCart((c) => c.map((x) => x.id === id ? { ...x, qty: Math.max(1, x.qty + d) } : x));
  const remove = (id) => setCart((c) => c.filter((x) => x.id !== id));
  return (
    <div className="pb-24">
      <TopBar title="Your cart" onBack={onBack} lang="en" setLang={()=>{}} />
      <div className="px-5 space-y-2">
        {cart.map((item) => (
          <Card key={item.id} className="p-3 flex items-center justify-between">
            <div>
              <div className="text-sm text-[#2B2F2C]">{item.name}</div>
              <div className="text-xs font-mono text-[#6B7280]">OMR {(item.price*item.qty).toFixed(3)}</div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => change(item.id,-1)} className="w-7 h-7 rounded-full bg-[#F3F4F6] flex items-center justify-center"><Minus size={13} className="text-[#2B2F2C]"/></button>
              <span className="font-mono text-[#2B2F2C] w-4 text-center">{item.qty}</span>
              <button onClick={() => change(item.id,1)} className="w-7 h-7 rounded-full bg-[#F3F4F6] flex items-center justify-center"><Plus size={13} className="text-[#2B2F2C]"/></button>
              <button onClick={() => remove(item.id)} className="w-7 h-7 rounded-full bg-[#FDEDEC] flex items-center justify-center ml-1"><Trash2 size={13} className="text-[#E74C3C]"/></button>
            </div>
          </Card>
        ))}
        {cart.length === 0 && <p className="text-center text-sm text-[#9CA3AF] pt-10">Your cart is empty.</p>}
      </div>
      {cart.length > 0 && (
        <div className="px-5 mt-6">
          <Card className="p-4 flex justify-between font-semibold"><span className="text-[#2B2F2C]">Total</span><span className="font-mono text-[#2B2F2C]">OMR {total.toFixed(3)}</span></Card>
          <div className="mt-4"><PrimaryButton tone="amber" onClick={onPay}>Pay & schedule pickup</PrimaryButton></div>
        </div>
      )}
    </div>
  );
}

function CoffeeTrackScreen({ onDone }) {
  const [ready, setReady] = useState(false);
  useEffect(() => { const timer = setTimeout(() => setReady(true), 6000); return () => clearTimeout(timer); }, []);
  return (
    <div className="pb-24 px-5 pt-8 text-center">
      <Card className="p-6">
        <Coffee size={36} className="mx-auto text-[#F1C40F]" />
        <h1 className="text-lg font-semibold text-[#2B2F2C] mt-3">{ready ? "Order ready!" : "Your EV is charging"}</h1>
        <p className="text-sm text-[#6B7280] mt-1">{ready ? "Pick up your order at the counter." : "Your coffee will be ready in 5 minutes."}</p>
        <div className="w-full h-2 bg-[#F3F4F6] rounded-full mt-5 overflow-hidden">
          <div className={`h-full bg-[#F1C40F] transition-all duration-[6000ms] ${ready ? "w-full" : "w-0"}`} style={{ width: ready ? "100%" : "90%" }} />
        </div>
      </Card>
      <div className="mt-6"><PrimaryButton onClick={onDone}>Back to home</PrimaryButton></div>
    </div>
  );
}

function RewardsScreen({ points }) {
  const tiers = [
    { name: "Green", icon: Leaf, color: "#2ECC71", perks: ["Standard charging access"] },
    { name: "Silver", icon: Award, color: "#B9C4BF", perks: ["Charging discounts", "Coffee discounts", "Loyalty points"] },
    { name: "Gold", icon: Award, color: "#F1C40F", perks: ["Priority charging", "Higher discounts", "VIP offers"] },
    { name: "Platinum", icon: Sparkles, color: "#58D68D", perks: ["VIP charging", "Priority parking", "Premium lounge", "Exclusive offers"] },
  ];
  return (
    <div className="pb-24">
      <TopBarless title="Oman EV Club" />
      <div className="px-5 mt-3">
        <Card className="p-4 bg-gradient-to-br from-[#F3F4F6] to-[#FFFFFF]">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-[#6B7280]">Oman EV Points</div>
              <div className="font-mono text-2xl text-[#2B2F2C]">{points.toLocaleString()}</div>
            </div>
            <Pill tone="amber">Gold Member</Pill>
          </div>
        </Card>
      </div>
      <div className="px-5 mt-5 space-y-3">
        {tiers.map((tier) => (
          <Card key={tier.name} className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: tier.color + "22" }}>
                <tier.icon size={16} style={{ color: tier.color }} />
              </div>
              <div className="text-[#2B2F2C] font-medium">{tier.name}</div>
            </div>
            <ul className="mt-2 ml-12 text-xs text-[#6B7280] list-disc space-y-0.5">
              {tier.perks.map((p) => <li key={p}>{p}</li>)}
            </ul>
          </Card>
        ))}
      </div>
      <div className="px-5 mt-4">
        <h2 className="text-sm font-medium text-[#6B7280] mb-2">Redeem points</h2>
        <div className="grid grid-cols-2 gap-3">
          {["Charging discount", "Free coffee", "Premium membership", "Partner offers"].map((r) => (
            <Card key={r} className="p-3 text-xs text-[#2B2F2C]">{r}</Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function SustainabilityScreen() {
  return (
    <div className="pb-24">
      <TopBarless title="Sustainability" />
      <div className="grid grid-cols-2 gap-3 px-5 mt-3">
        <Card className="p-3"><Sun size={16} className="text-[#F1C40F]" /><div className="font-mono text-lg text-[#2B2F2C] mt-1">500,000</div><div className="text-xs text-[#6B7280]">kWh solar generated</div></Card>
        <Card className="p-3"><Zap size={16} className="text-[#2ECC71]" /><div className="font-mono text-lg text-[#2B2F2C] mt-1">320,000</div><div className="text-xs text-[#6B7280]">kWh clean energy used</div></Card>
        <Card className="p-3"><Leaf size={16} className="text-[#2ECC71]" /><div className="font-mono text-lg text-[#2B2F2C] mt-1">185</div><div className="text-xs text-[#6B7280]">tons CO₂ saved</div></Card>
        <Card className="p-3"><Sparkles size={16} className="text-[#F1C40F]" /><div className="font-mono text-lg text-[#2B2F2C] mt-1">8,500</div><div className="text-xs text-[#6B7280]">equivalent trees</div></Card>
      </div>
      <div className="px-5 mt-5">
        <Card className="p-4">
          <div className="text-sm text-[#6B7280] mb-3">Solar generation (monthly kWh)</div>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={SOLAR_MONTHLY}>
              <defs>
                <linearGradient id="solarFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F1C40F" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#F1C40F" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="m" stroke="#9CA3AF" fontSize={11} />
              <YAxis stroke="#9CA3AF" fontSize={11} width={36} />
              <Tooltip contentStyle={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="kwh" stroke="#F1C40F" fill="url(#solarFill)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>
      <div className="px-5 mt-4">
        <Card className="p-4">
          <div className="text-sm text-[#6B7280] mb-3">Energy mix</div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={ENERGY_MIX} dataKey="value" nameKey="name" innerRadius={45} outerRadius={70} paddingAngle={2}>
                {ENERGY_MIX.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11, color: "#6B7280" }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}

function ProfileScreen({ user, points, onEnterAdmin }) {
  return (
    <div className="pb-24">
      <TopBarless title="Profile" />
      <div className="px-5 mt-3">
        <Card className="p-4 flex items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-[#EAFAF1] flex items-center justify-center text-[#2ECC71] font-semibold text-lg">{user.name[0]}</div>
          <div>
            <div className="text-[#2B2F2C] font-medium">{user.name}</div>
            <div className="text-xs text-[#6B7280]">{user.city}, Sultanate of Oman</div>
          </div>
        </Card>
      </div>
      <div className="px-5 mt-4">
        <h2 className="text-sm font-medium text-[#6B7280] mb-2">My vehicles</h2>
        <div className="space-y-2">
          {["BYD Sealion 6", "Tesla Model 3", "MG4"].map((v, i) => (
            <Card key={v} className="p-3 flex items-center justify-between">
              <div className="flex items-center gap-3"><Car size={16} className="text-[#2ECC71]" /><span className="text-sm text-[#2B2F2C]">{v}</span></div>
              {i === 0 && <Pill tone="mint">Active</Pill>}
            </Card>
          ))}
        </div>
      </div>
      <div className="px-5 mt-4">
        <h2 className="text-sm font-medium text-[#6B7280] mb-2">Charging history</h2>
        <div className="space-y-2">
          {HISTORY.map((h, i) => (
            <Card key={i} className="p-3">
              <div className="flex justify-between text-sm text-[#2B2F2C]"><span>{h.station}</span><span className="font-mono">OMR {h.cost}</span></div>
              <div className="flex justify-between text-xs text-[#6B7280] mt-1"><span>{h.date} · {h.vehicle}</span><span>{h.kwh} kWh · {h.time}</span></div>
            </Card>
          ))}
        </div>
      </div>
      <div className="px-5 mt-4 grid grid-cols-2 gap-3">
        <Card className="p-3 flex items-center gap-2"><Bell size={15} className="text-[#F1C40F]"/><span className="text-sm text-[#2B2F2C]">Notifications</span></Card>
        <Card className="p-3 flex items-center gap-2"><Settings size={15} className="text-[#6B7280]"/><span className="text-sm text-[#2B2F2C]">Settings</span></Card>
      </div>
      <div className="px-5 mt-6">
        <button onClick={onEnterAdmin} className="w-full text-xs text-[#9CA3AF] border border-[#E5E7EB] rounded-xl py-3 flex items-center justify-center gap-2">
          <Building2 size={14} /> Business & admin portal
        </button>
      </div>
    </div>
  );
}

/* -----------------------------------------------------  Admin portal */

function AdminNav({ tab, setTab, onExit }) {
  const items = [
    { key: "overview", icon: LayoutDashboard, label: "Overview" },
    { key: "stations", icon: MapPin, label: "Stations" },
    { key: "chargers", icon: Cable, label: "Chargers" },
    { key: "coffee", icon: Coffee, label: "Coffee shop" },
    { key: "ads", icon: Megaphone, label: "Advertising" },
    { key: "finance", icon: DollarSign, label: "Financial" },
    { key: "analytics", icon: FileBarChart, label: "Analytics" },
  ];
  return (
    <div className="flex gap-2 overflow-x-auto px-5 pb-3 no-scrollbar">
      {items.map((it) => (
        <button
          key={it.key}
          onClick={() => setTab(it.key)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs whitespace-nowrap border ${tab === it.key ? "bg-[#EAFAF1] border-[#A9DFBF] text-[#2ECC71]" : "border-[#E5E7EB] text-[#6B7280]"}`}
        >
          <it.icon size={13} /> {it.label}
        </button>
      ))}
    </div>
  );
}

function AdminOverview() {
  const stats = [
    { label: "Total revenue", value: "OMR 257,000", icon: DollarSign },
    { label: "Today's revenue", value: "OMR 842", icon: TrendingUp },
    { label: "Charging sessions", value: "1,248", icon: Zap },
    { label: "Active users", value: "3,910", icon: Users },
    { label: "Available chargers", value: "22 / 46", icon: Cable },
    { label: "Solar generated", value: "500,000 kWh", icon: Sun },
    { label: "Coffee sales", value: "OMR 14,320", icon: Coffee },
    { label: "Advertising revenue", value: "OMR 32,600", icon: Megaphone },
  ];
  return (
    <div className="grid grid-cols-2 gap-3 px-5">
      {stats.map((s) => (
        <Card key={s.label} className="p-3">
          <s.icon size={15} className="text-[#2ECC71]" />
          <div className="font-mono text-base text-[#2B2F2C] mt-1">{s.value}</div>
          <div className="text-[11px] text-[#6B7280]">{s.label}</div>
        </Card>
      ))}
    </div>
  );
}

function AdminStations({ toastFn }) {
  return (
    <div className="px-5 space-y-2">
      {STATIONS.map((s) => (
        <Card key={s.id} className="p-3 flex items-center justify-between">
          <div>
            <div className="text-sm text-[#2B2F2C]">{s.name}</div>
            <div className="text-xs text-[#6B7280]">{s.available}/{s.bays} available · {s.rating}★</div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => toastFn("Station updated")} className="text-xs px-2 py-1 rounded-md bg-[#F3F4F6] text-[#2B2F2C]">Edit</button>
            <button onClick={() => toastFn("Station removed")} className="text-xs px-2 py-1 rounded-md bg-[#FDEDEC] text-[#E74C3C]">Delete</button>
          </div>
        </Card>
      ))}
      <button onClick={() => toastFn("New station drafted")} className="w-full text-xs text-[#2ECC71] border border-[#A9DFBF] rounded-xl py-2.5 flex items-center justify-center gap-1"><Plus size={13}/> Add station</button>
    </div>
  );
}

function AdminChargers({ toastFn }) {
  const all = Object.entries(CHARGERS_BY_STATION).flatMap(([sid, list]) => list.map((c) => ({ ...c, station: sid })));
  return (
    <div className="px-5 space-y-2">
      {all.map((c, i) => (
        <Card key={i} className="p-3 flex items-center justify-between">
          <div>
            <div className="text-sm text-[#2B2F2C]">{c.station.toUpperCase()} · Charger {c.id}</div>
            <div className="text-xs text-[#6B7280]">{c.power} kW · {c.connector}</div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs" style={{ color: STATUS_COLOR[c.status] }}>{STATUS_LABEL[c.status]}</span>
            <button onClick={() => toastFn(`Charger ${c.id} restarted`)} className="text-xs px-2 py-1 rounded-md bg-[#F3F4F6] text-[#2B2F2C]">Restart</button>
          </div>
        </Card>
      ))}
    </div>
  );
}

function AdminCoffee({ toastFn }) {
  return (
    <div className="px-5 space-y-2">
      {COFFEE_MENU.flatMap((s) => s.items).map((item) => (
        <Card key={item.id} className="p-3 flex items-center justify-between">
          <div className="text-sm text-[#2B2F2C]">{item.name}</div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[#6B7280]">OMR {item.price.toFixed(3)}</span>
            <button onClick={() => toastFn("Product updated")} className="text-xs px-2 py-1 rounded-md bg-[#F3F4F6] text-[#2B2F2C]">Edit</button>
          </div>
        </Card>
      ))}
      <button onClick={() => toastFn("Product added")} className="w-full text-xs text-[#F1C40F] border border-[#F9E79F] rounded-xl py-2.5 flex items-center justify-center gap-1"><Plus size={13}/> Add product</button>
    </div>
  );
}

function AdminAds({ toastFn }) {
  const campaigns = [
    { name: "Muscat Motors – 3D Screen", loc: "Muscat", impressions: "128,400", revenue: "OMR 4,200", status: "Live" },
    { name: "Green Bank – LED Billboard", loc: "Sohar", impressions: "94,120", revenue: "OMR 2,850", status: "Live" },
    { name: "Nizwa Mall – App Ad", loc: "Nizwa", impressions: "21,600", revenue: "OMR 640", status: "Pending" },
  ];
  return (
    <div className="px-5 space-y-2">
      {campaigns.map((c) => (
        <Card key={c.name} className="p-3">
          <div className="flex justify-between text-sm text-[#2B2F2C]"><span>{c.name}</span><Pill tone={c.status === "Live" ? "mint" : "amber"}>{c.status}</Pill></div>
          <div className="flex justify-between text-xs text-[#6B7280] mt-1"><span>{c.loc} · {c.impressions} impressions</span><span className="font-mono">{c.revenue}</span></div>
        </Card>
      ))}
      <button onClick={() => toastFn("Campaign submitted for approval")} className="w-full text-xs text-[#F1C40F] border border-[#F9E79F] rounded-xl py-2.5 flex items-center justify-center gap-1"><Plus size={13}/> New campaign</button>
    </div>
  );
}

function AdminFinance() {
  const rows = [
    { label: "Total investment", value: "OMR 650,000" },
    { label: "Annual revenue", value: "OMR 257,000" },
    { label: "Operating cost", value: "OMR 171,000" },
    { label: "Estimated profit", value: "OMR 86,000" },
    { label: "ROI", value: "13.2%" },
    { label: "Estimated payback", value: "7.5 years" },
  ];
  return (
    <div className="px-5 space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {rows.map((r) => (
          <Card key={r.label} className="p-3">
            <div className="text-[11px] text-[#6B7280]">{r.label}</div>
            <div className="font-mono text-base text-[#2B2F2C] mt-1">{r.value}</div>
          </Card>
        ))}
      </div>
      <Card className="p-4">
        <div className="text-sm text-[#6B7280] mb-3">Revenue trend (OMR / month)</div>
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={REVENUE_TREND}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="m" stroke="#9CA3AF" fontSize={11} />
            <YAxis stroke="#9CA3AF" fontSize={11} width={40} />
            <Tooltip contentStyle={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, fontSize: 12 }} />
            <Line type="monotone" dataKey="rev" stroke="#2ECC71" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}

function AdminAnalytics() {
  return (
    <div className="px-5 space-y-4">
      <Card className="p-4">
        <div className="text-sm text-[#6B7280] mb-3">Revenue by source</div>
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie data={REVENUE_SPLIT} dataKey="value" nameKey="name" innerRadius={40} outerRadius={68} paddingAngle={2}>
              {REVENUE_SPLIT.map((e, i) => <Cell key={i} fill={e.color} />)}
            </Pie>
            <Tooltip contentStyle={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, fontSize: 12 }} />
            <Legend wrapperStyle={{ fontSize: 11, color: "#6B7280" }} />
          </PieChart>
        </ResponsiveContainer>
      </Card>
      <Card className="p-4">
        <div className="text-sm text-[#6B7280] mb-3">Charging sessions (monthly)</div>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={[{m:"Apr",s:920},{m:"May",s:1010},{m:"Jun",s:1105},{m:"Jul",s:1190},{m:"Aug",s:1260},{m:"Sep",s:1248}]}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="m" stroke="#9CA3AF" fontSize={11} />
            <YAxis stroke="#9CA3AF" fontSize={11} width={36} />
            <Tooltip contentStyle={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, fontSize: 12 }} />
            <Bar dataKey="s" fill="#3498DB" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}

function AdminPortal({ onExit, toastFn }) {
  const [tab, setTab] = useState("overview");
  return (
    <div className="min-h-screen bg-[#F7F9F8]">
      <div className="flex items-center justify-between px-5 pt-6 pb-2">
        <div>
          <Logo size={30} wordmark={false} />
          <h1 className="text-lg font-semibold text-[#2B2F2C] mt-2">Admin portal</h1>
        </div>
        <button onClick={onExit} className="flex items-center gap-1.5 text-xs text-[#6B7280] border border-[#E5E7EB] rounded-lg px-3 py-2"><LogOut size={13}/> Exit</button>
      </div>
      <AdminNav tab={tab} setTab={setTab} onExit={onExit} />
      <div className="pb-10">
        {tab === "overview" && <AdminOverview />}
        {tab === "stations" && <AdminStations toastFn={toastFn} />}
        {tab === "chargers" && <AdminChargers toastFn={toastFn} />}
        {tab === "coffee" && <AdminCoffee toastFn={toastFn} />}
        {tab === "ads" && <AdminAds toastFn={toastFn} />}
        {tab === "finance" && <AdminFinance />}
        {tab === "analytics" && <AdminAnalytics />}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------  App root */

export default function OmanEVHub() {
  const [lang, setLang] = useState("en");
  const t = T[lang];
  const [view, setView] = useState("home");
  const [mode, setMode] = useState("app"); // app | admin
  const [toast, setToast] = useState(null);
  const [points, setPoints] = useState(2340);
  const [cart, setCart] = useState([]);

  const [charge, setCharge] = useState({ step: null, station: null, charger: null, mode: "charge" });
  const [liveBattery, setLiveBattery] = useState(78);
  const [elapsed, setElapsed] = useState(0);
  const [receipt, setReceipt] = useState(null);

  const user = { name: "Abdullah", city: "Sohar", vehicle: "BYD Sealion 6", battery: 78, range: 320 };

  useEffect(() => {
    if (charge.step !== "live") return;
    const id = setInterval(() => {
      setElapsed((e) => e + 1);
      setLiveBattery((b) => Math.min(100, b + 0.15));
    }, 300);
    return () => clearInterval(id);
  }, [charge.step]);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2200); };

  function quickStart() {
    const station = STATIONS.find((s) => s.id === "sohar");
    const charger = CHARGERS_BY_STATION.sohar.find((c) => c.status === "available");
    setElapsed(0); setLiveBattery(78);
    setCharge({ step: "live", station, charger, mode: "charge" });
  }

  function goPayAfterCharge({ kwh, cost }) {
    setReceipt({ label: `Charging – ${charge.station.name} · ${kwh} kWh`, amount: cost });
    setCharge((c) => ({ ...c, step: "payment" }));
  }

  function finishChargePayment() {
    setPoints((p) => p + 45);
    setCharge({ step: null, station: null, charger: null, mode: "charge" });
    setView("home");
    showToast("Charging session complete");
  }

  function finishCoffeePayment() {
    const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
    setReceipt({ label: "Oman EV Coffee order", amount: total.toFixed(3) });
    setCart([]);
    setPoints((p) => p + 10);
    setCharge((c) => ({ ...c, step: "coffee-track" }));
  }

  // ---- Admin mode ----
  if (mode === "admin") {
    return (
      <div dir={t.dir} className="max-w-md mx-auto min-h-screen bg-[#F7F9F8]" style={{ fontFamily: "'Montserrat', sans-serif" }}>
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <Toast msg={toast} />
        <AdminPortal onExit={() => setMode("app")} toastFn={showToast} />
      </div>
    );
  }

  // ---- Charging flow overlay ----
  if (charge.step) {
    let screen = null;
    if (charge.step === "map") screen = <MapScreen t={t} lang={lang} onSelectStation={(s) => setCharge((c) => ({ ...c, step: "station", station: s }))} />;
    if (charge.step === "station") screen = (
      <StationScreen
        station={charge.station}
        onBack={() => setCharge({ step: null, station: null, charger: null, mode: "charge" })}
        onStartCharging={() => setCharge((c) => ({ ...c, step: "chargers", mode: "charge" }))}
        onReserve={() => setCharge((c) => ({ ...c, step: "chargers", mode: "reserve" }))}
      />
    );
    if (charge.step === "chargers") screen = (
      <ChargerSelectScreen
        station={charge.station}
        mode={charge.mode}
        onBack={() => setCharge((c) => ({ ...c, step: "station" }))}
        onPick={(c) => {
          if (charge.mode === "reserve") {
            showToast(`Charger ${c.id} reserved`);
            setCharge({ step: null, station: null, charger: null, mode: "charge" });
          } else {
            setElapsed(0); setLiveBattery(78);
            setCharge((prev) => ({ ...prev, step: "live", charger: c }));
          }
        }}
      />
    );
    if (charge.step === "live") screen = (
      <LiveChargingScreen station={charge.station} charger={charge.charger} elapsed={elapsed} battery={liveBattery} onStop={goPayAfterCharge} />
    );
    if (charge.step === "payment") screen = (
      <PaymentScreen amount={receipt.amount} label={receipt.label} onBack={() => setCharge((c)=>({...c, step:"live"}))} onPay={finishChargePayment} />
    );
    return <div dir={t.dir} className="max-w-md mx-auto min-h-screen bg-[#F7F9F8] relative" style={{ fontFamily: "'Montserrat', sans-serif" }}><link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet" /><Toast msg={toast} />{screen}</div>;
  }

  return (
    <CoffeeAwareRoot
      t={t} lang={lang} setLang={setLang} view={view} setView={setView}
      user={user} points={points} cart={cart} setCart={setCart}
      toast={toast} showToast={showToast}
      onQuickStart={quickStart}
      onFindCharger={() => setCharge({ step: "map", station: null, charger: null, mode: "charge" })}
      onEnterAdmin={() => setMode("admin")}
      onCoffeePay={finishCoffeePayment}
      receipt={receipt}
    />
  );
}

/* Separate component to own the coffee-flow sub-state cleanly */
function CoffeeAwareRoot(props) {
  const { t, lang, setLang, view, setView, user, points, cart, setCart, toast, onQuickStart, onFindCharger, onEnterAdmin, onCoffeePay, receipt } = props;
  const [coffeeStep, setCoffeeStep] = useState("menu"); // menu | cart | track | done

  useEffect(() => { if (view !== "coffee") setCoffeeStep("menu"); }, [view]);

  // Intercept bottom-nav taps on "charging" — that tab launches the find-charger flow
  // rather than rendering its own screen, so the map/station/live-charging overlay
  // (owned by the parent) takes over.
  const handleSetView = (v) => (v === "charging" ? onFindCharger() : setView(v));

  return (
    <div dir={t.dir} className="max-w-md mx-auto min-h-screen bg-[#F7F9F8] relative" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <Toast msg={toast} />
      {view !== "coffee" && view !== "home" && (
        <TopBar
          title={{ rewards: t.nav.rewards, eco: t.nav.eco, profile: t.nav.profile }[view]}
          lang={lang} setLang={setLang} showLang
        />
      )}
      {view === "home" && (
        <>
          <div className="flex items-center justify-between px-5 pt-5">
            <Logo size={34} />
            <button onClick={() => setLang(lang === "en" ? "ar" : "en")} className="w-9 h-9 rounded-full bg-[#FFFFFF] border border-[#E5E7EB] flex items-center justify-center"><Globe size={16} className="text-[#6B7280]" /></button>
          </div>
          <div>
            <HomeScreen t={t} lang={lang} user={user} setView={handleSetView} quickStart={onQuickStart} />
          </div>
        </>
      )}
      {view === "coffee" && coffeeStep === "menu" && (
        <CoffeeScreen t={t} cart={cart} setCart={setCart} onCheckout={() => setCoffeeStep("cart")} />
      )}
      {view === "coffee" && coffeeStep === "cart" && (
        <CartScreen cart={cart} setCart={setCart} onBack={() => setCoffeeStep("menu")} onPay={() => { onCoffeePay(); setCoffeeStep("track"); }} />
      )}
      {view === "coffee" && coffeeStep === "track" && (
        <CoffeeTrackScreen onDone={() => { setCoffeeStep("menu"); setView("home"); }} />
      )}
      {view === "rewards" && <RewardsScreen points={points} />}
      {view === "eco" && <SustainabilityScreen />}
      {view === "profile" && <ProfileScreen user={user} points={points} onEnterAdmin={onEnterAdmin} />}
      <BottomNav view={view} setView={handleSetView} t={t} />
    </div>
  );
}
