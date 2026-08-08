import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import {
  ArrowRight,
  Smartphone,
  Headphones,
  Shield,
  Star,
  MapPin,
  Sparkles,
  BadgeCheck,
  CreditCard,
  Clock,
  ChevronLeft,
  ChevronRight,
  Zap,
  Megaphone,
} from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import { BRANCHES, SITE } from "@/lib/site-data";
import { useProducts, formatPrice } from "@/lib/products-store";
import { useLanguage } from "@/components/site/LanguageSelector";
import { useAnnouncements } from "@/lib/announcements-store";
import logoImg from "../../public/logo.jpg";

// Dinamik Banner slaydlar to'plami
const HERO_BANNERS = [
  {
    id: 1,
    badge: "Yangi kelgan to'plam",
    title: "iPhone 16 Pro Max",
    highlight: "Titanium Sifat",
    description: "A18 Pro chip, eng kuchli kamera va mutlaqo yangi dizayn. Rasmiy kafolat bilan xarid qiling.",
    price: "17,500,000 so'm",
    tag: "Top sotuvda",
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: 2,
    badge: "Flagman model",
    title: "Samsung Galaxy S24 Ultra",
    highlight: "Galaxy AI Imkoniyati",
    description: "S-Pen, 200MP kamera va sun'iy intellekt funksiyalari bilan ishingizni yengillashtiring.",
    price: "14,200,000 so'm",
    tag: "Super Narx",
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: 3,
    badge: "0% Boshlang'ich to'lov",
    title: "Muddatli To'lovga Xarid Qiling",
    highlight: "Faqat Pasport Evaziga",
    description: "Xorazm bo'ylab 4 ta filialimizda 3, 6 va 12 oyga ortiqcha hujjatlarsiz beriladi.",
    price: "Oyiga 450,000 so'mdan",
    tag: "Aksiya",
    image: "https://images.unsplash.com/photo-1556742049-0a670f4a4591?w=800&auto=format&fit=crop&q=80",
  },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Telefon Bozor — telefon va aksesuarlar" },
      { name: "description", content: "Xorazm bo'ylab 4 ta filial. iPhone, Samsung, Xiaomi, aksesuarlar. Muddatli to'lov va AI telefon taqqoslash." },
    ],
  }),
  component: Index,
});

// 🕒 Toshkent vaqti (Asia/Tashkent UTC+5) bo'yicha sana va vaqtni formatlash funksiyasi
function formatTashkentDateTime(dateStr?: string) {
  if (!dateStr) return "";
  const dateObj = new Date(dateStr);

  if (isNaN(dateObj.getTime())) {
    return dateStr;
  }

  const formatter = new Intl.DateTimeFormat("ru-RU", {
    timeZone: "Asia/Tashkent",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const formatted = formatter.format(dateObj);
  const [datePart, timePart] = formatted.split(", ");
  if (!timePart) return datePart;

  const [day, month, year] = datePart.split(".");
  return `${year}-${month}-${day} • ${timePart}`;
}

function Index() {
  const { products } = useProducts();
  const { announcements } = useAnnouncements();
  const { t } = useLanguage();
  const featured = products.slice(0, 4);

  // Faqat faol e'lonlarni saralab olish
  const activeAnnouncements = announcements.filter((a) => a.isActive);

  // E'lonlar slider scroll integratsiyasi
  const announcementsScrollRef = useRef<HTMLDivElement>(null);

  const scrollAnnouncements = (direction: "left" | "right") => {
    if (announcementsScrollRef.current) {
      const scrollAmount = direction === "left" ? -350 : 350;
      announcementsScrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  // Dinamik Banner uchun State va Effekt
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_BANNERS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % HERO_BANNERS.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + HERO_BANNERS.length) % HERO_BANNERS.length);

  const banner = HERO_BANNERS[currentSlide];

  return (
    <SiteShell>
      <section className="relative overflow-hidden">
        <div className="relative mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-16 md:py-24 grid gap-12 lg:grid-cols-2 items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-brand/40 bg-brand/10 px-3 py-1 text-xs font-medium text-brand backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-brand opacity-75 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-brand" />
              </span>
              {t("heroBadge")}
            </span>
            <h1 className="mt-6 font-display text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.05]">
              Telefon Bozor —{" "}
              <span className="text-brand text-glow">{t("heroTitleHighlight")}</span>
            </h1>
            <p className="mt-5 max-w-xl text-base md:text-lg text-muted-foreground">
              {t("heroSubtitle")}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/installment"
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-brand px-6 py-3 text-sm font-semibold text-brand-foreground shadow-[var(--shadow-glow)] transition-transform hover:scale-105"
              >
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                <span className="relative">Muddatli to'lov</span>
                <ArrowRight className="relative h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/compare"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-6 py-3 text-sm font-semibold backdrop-blur-sm hover:border-brand hover:bg-card"
              >
                <Sparkles className="h-4 w-4 text-brand" /> {t("btnAiCompare")}
              </Link>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-4 max-w-md">
              {[
                { k: "4", v: t("statBranches") },
                { k: "500+", v: t("statProducts") },
                { k: "100k+", v: t("statCustomers") },
              ].map((s, i) => (
                <div
                  key={s.v}
                  className={i > 0 ? "pl-4 border-l border-border/60" : ""}
                >
                  <div className="font-display text-2xl md:text-3xl font-bold text-brand text-glow">
                    {s.k}
                  </div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">
                    {s.v}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-10 rounded-[3rem] bg-brand/20 blur-3xl animate-aurora" />
            <div className="absolute -inset-2 rounded-[2rem] bg-gradient-to-br from-brand/60 via-transparent to-brand/20 blur-md opacity-70" />
            <div className="relative overflow-hidden rounded-3xl border border-brand/30 bg-black p-3 backdrop-blur-sm shadow-[var(--shadow-card)]">
              <div className="aspect-square w-full overflow-hidden rounded-2xl bg-black flex items-center justify-center p-4">
                <img
                  src={logoImg}
                  alt="Telefon Bozor Logo"
                  className="h-full w-full object-contain rounded-xl transition-transform duration-500 hover:scale-105"
                />
              </div>

              <div className="absolute left-4 top-8 hidden md:flex items-center gap-2 rounded-2xl border border-border bg-card/90 px-3 py-2 text-xs shadow-[var(--shadow-card)] backdrop-blur-md">
                <BadgeCheck className="h-4 w-4 text-brand" />
                <span>{t("badgeGuarantee")}</span>
              </div>
              <div className="absolute right-4 bottom-10 hidden md:flex items-center gap-2 rounded-2xl border border-border bg-card/90 px-3 py-2 text-xs shadow-[var(--shadow-card)] backdrop-blur-md">
                <CreditCard className="h-4 w-4 text-brand" />
                <span>{t("badgeInstallment")}</span>
              </div>
              <div className="absolute left-4 -bottom-4 hidden md:flex items-center gap-1 rounded-full border border-brand/40 bg-background/90 px-3 py-1.5 text-xs shadow-[var(--shadow-glow)] backdrop-blur-md">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} className="h-3 w-3 fill-brand text-brand" />
                ))}
                <span className="ml-1 font-semibold">{t("badgeReviews")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* --- DINAMIK BANNER --- */}
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-4">
          <div className="relative rounded-3xl border border-brand/30 bg-card/40 backdrop-blur-xl p-6 md:p-10 shadow-2xl overflow-hidden">
            <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-brand/15 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-brand/10 blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-5 z-10">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-brand/40 bg-brand/10 px-3 py-1 text-xs font-semibold text-brand animate-pulse">
                    <Zap className="h-3.5 w-3.5 text-brand" />
                    {banner.badge}
                  </span>
                  <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-foreground">
                    {banner.tag}
                  </span>
                </div>

                <div className="space-y-2">
                  <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
                    {banner.title} — <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand via-amber-300 to-yellow-500">
                      {banner.highlight}
                    </span>
                  </h2>
                  <p className="text-muted-foreground text-sm max-w-xl">
                    {banner.description}
                  </p>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Narxi / To'lov:</p>
                    <p className="text-2xl font-bold text-brand">{banner.price}</p>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <Link
                      to="/installment"
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-2.5 text-sm font-bold text-black transition-all hover:bg-brand/90 hover:scale-105 shadow-lg shadow-brand/20"
                    >
                      <span>Muddatli to'lov</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>

                    <Link
                      to="/compare"
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-secondary/60 px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-secondary transition-all"
                    >
                      <Sparkles className="h-4 w-4 text-brand" />
                      <span>AI Taqqoslash</span>
                    </Link>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 relative flex items-center justify-center">
                <div className="relative group w-full max-w-sm aspect-[4/3] rounded-2xl overflow-hidden border border-brand/30 bg-black/60 shadow-2xl">
                  <img
                    src={banner.image}
                    alt={banner.title}
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between p-2.5 rounded-xl bg-black/80 backdrop-blur-md border border-white/10">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-brand" />
                      <span className="text-xs font-semibold text-white">Rasmiy Kafolat Bilan</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-border/30 pt-4">
              <div className="flex items-center gap-2">
                {HERO_BANNERS.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`h-2.5 rounded-full transition-all ${
                      currentSlide === index ? "w-8 bg-brand" : "w-2.5 bg-muted hover:bg-muted-foreground"
                    }`}
                    aria-label={`Slide ${index + 1}`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={prevSlide}
                  className="p-2 rounded-full border border-border bg-secondary/80 text-foreground hover:bg-brand hover:text-black transition-all"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={nextSlide}
                  className="p-2 rounded-full border border-border bg-secondary/80 text-foreground hover:bg-brand hover:text-black transition-all"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- 📢 E'LONLAR VA YANGILIKLAR BO'LIMI --- */}
      {activeAnnouncements.length > 0 && (
        <section className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 text-brand">
                <Megaphone className="h-5 w-5 animate-bounce" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-brand/80">— Rasmiy e'lonlar</div>
                <h2 className="font-display text-2xl md:text-3xl font-bold">So'nggi yangilik va vakansiyalar</h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => scrollAnnouncements("left")}
                className="p-2.5 rounded-xl border border-border bg-card/80 text-foreground hover:bg-brand hover:text-black transition-all shadow-sm"
                title="Orqaga"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => scrollAnnouncements("right")}
                className="p-2.5 rounded-xl border border-border bg-card/80 text-foreground hover:bg-brand hover:text-black transition-all shadow-sm"
                title="Keyingi"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Slayder ro'yxati */}
          <div
            ref={announcementsScrollRef}
            className="flex gap-4 overflow-x-auto scrollbar-none scroll-smooth pb-2"
          >
            {activeAnnouncements.map((item) => (
              <div
                key={item.id}
                className="min-w-[300px] md:min-w-[380px] group relative overflow-hidden rounded-2xl border border-brand/30 bg-card/60 backdrop-blur-sm p-6 transition-all hover:-translate-y-1 hover:border-brand hover:shadow-[var(--shadow-card)] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4 pb-2 border-b border-border/40">
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-semibold ${
                        item.type === "job"
                          ? "bg-blue-500/10 text-blue-400 border border-blue-500/30"
                          : item.type === "promo"
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                          : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                      }`}
                    >
                      {item.type === "job"
                        ? "💼 Bo'sh ish o'rni"
                        : item.type === "promo"
                        ? "🔥 Aksiya"
                        : "ℹ️ Ma'lumot"}
                    </span>

                    {/* 🕒 Toshkent vaqti va sanasi — YAQQL SARIQ NURLI BLOK */}
                    <div className="flex items-center gap-1.5 text-xs font-bold font-mono bg-brand/20 text-brand px-3 py-1.5 rounded-xl border border-brand/40 shadow-[0_0_12px_rgba(234,179,8,0.25)]">
                      <Clock className="h-3.5 w-3.5 text-brand animate-pulse" />
                      <span>{formatTashkentDateTime(item.date)}</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-brand transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                    {item.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* --- KATEGORIYALAR BO'LIMI --- */}
      <section className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-brand/80">— {t("secCatalog")}</div>
            <h2 className="mt-2 font-display text-3xl md:text-4xl font-bold">{t("secCategories")}</h2>
            <p className="mt-2 text-muted-foreground">{t("secCatSub")}</p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: Smartphone, label: t("catPhones"), desc: "iPhone, Samsung, Xiaomi", count: "180+" },
            { icon: Headphones, label: t("catAccessories"), desc: t("catAccDesc"), count: "220+" },
            { icon: Shield, label: t("catGuarantee"), desc: t("catGuarDesc"), count: "100%" },
          ].map((c) => (
            <div
              key={c.label}
              className="group gradient-border relative overflow-hidden rounded-2xl border border-border bg-card/60 backdrop-blur-sm p-6 transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-card)]"
            >
              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-brand/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10 text-brand group-hover:bg-brand group-hover:text-brand-foreground transition-colors">
                <c.icon className="h-6 w-6" />
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <h3 className="font-semibold">{c.label}</h3>
                <span className="text-xs font-mono text-brand">{c.count}</span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{c.desc}</p>
              <div className="mt-4 inline-flex items-center gap-1 text-xs text-brand opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0">
                {t("btnSeeMore")} <ArrowRight className="h-3 w-3" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- OMMABOP MAHSULOTLAR BO'LIMI --- */}
      <section className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-brand/80">— {t("secTopSelection")}</div>
            <h2 className="mt-2 font-display text-3xl md:text-4xl font-bold">{t("secPopularProducts")}</h2>
            <p className="mt-2 text-muted-foreground">{t("secPopularSub")}</p>
          </div>
          <Link to="/products" className="hidden sm:inline-flex items-center gap-2 text-sm text-brand hover:underline">
            {t("btnAll")} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p) => (
            <div
              key={p.id}
              className="group gradient-border relative overflow-hidden rounded-2xl border border-border bg-card/70 backdrop-blur-sm transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-card)]"
            >
              <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-secondary to-background">
                <div className="absolute left-3 top-3 z-10 rounded-full border border-brand/40 bg-background/80 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand backdrop-blur">
                  {t("badgeNew")}
                </div>
                <img
                  src={p.image}
                  alt={p.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-card to-transparent" />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="text-xs uppercase tracking-wider text-brand">{p.category}</div>
                  <div className="flex items-center gap-0.5 text-xs text-muted-foreground">
                    <Star className="h-3 w-3 fill-brand text-brand" /> 4.9
                  </div>
                </div>
                <div className="mt-1 font-medium line-clamp-1">{p.name}</div>
                <div className="mt-3 flex items-end justify-between">
                  <div className="font-display font-bold text-brand text-lg">{formatPrice(p.price)}</div>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand/10 text-brand group-hover:bg-brand group-hover:text-brand-foreground transition-colors">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- AFZALLIKLAR BO'LIMI --- */}
      <section className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-16">
        <div className="relative gradient-border overflow-hidden rounded-3xl border border-border bg-card/60 p-8 md:p-12 backdrop-blur-sm">
          <div className="absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-brand/20 blur-3xl" />
          <div className="relative">
            <div className="text-center text-xs uppercase tracking-[0.25em] text-brand/80">— {t("secChooseUs")}</div>
            <h2 className="mt-2 font-display text-3xl md:text-4xl font-bold text-center">{t("secWhyChooseTitle")}</h2>
            <div className="mt-10 grid gap-8 sm:grid-cols-2 md:grid-cols-4">
              {[
                { icon: Shield, t: t("whyGuaranteeTitle"), d: t("whyGuaranteeDesc") },
                { icon: CreditCard, t: t("whyInstallmentTitle"), d: t("whyInstallmentDesc") },
                { icon: Star, t: t("whyQualityTitle"), d: t("whyQualityDesc") },
                { icon: Clock, t: t("whyHoursTitle"), d: `${t("whyHoursDesc")} ${SITE.hours}` },
              ].map((f) => (
                <div key={f.t} className="group text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand text-brand-foreground shadow-[var(--shadow-glow)] transition-transform group-hover:scale-110 group-hover:rotate-6">
                    <f.icon className="h-7 w-7" />
                  </div>
                  <h3 className="mt-4 font-semibold text-lg">{f.t}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{f.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- FILIALLAR BO'LIMI --- */}
      <section className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-brand/80">— {t("secLocations")}</div>
            <h2 className="mt-2 font-display text-3xl md:text-4xl font-bold">{t("secOurBranches")}</h2>
          </div>
          <Link to="/branches" className="text-sm text-brand hover:underline">{t("btnMore")}</Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {BRANCHES.map((b, i) => (
            <div
              key={b.id}
              className="group gradient-border relative overflow-hidden rounded-2xl border border-border bg-card/60 backdrop-blur-sm p-5 transition-all hover:-translate-y-1"
            >
              <div className="absolute right-3 top-3 font-mono text-4xl font-bold text-brand/10 group-hover:text-brand/30 transition-colors">
                0{i + 1}
              </div>
              <div className="relative flex items-center gap-2 text-brand">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/10">
                  <MapPin className="h-4 w-4" />
                </div>
                <span className="text-sm font-semibold">{b.name}</span>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{b.address}</p>
              <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground border-t border-border/60 pt-3">
                <Clock className="h-3 w-3 text-brand" />
                <span>{t("labelWorkHours")}: <span className="text-foreground">{b.hours}</span></span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}