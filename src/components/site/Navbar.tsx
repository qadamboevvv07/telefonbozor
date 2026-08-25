import { Link, useNavigate } from "@tanstack/react-router";
import {
  PhoneCall,
  Sparkles,
  Menu,
  X,
  Search,
  Home,
  Smartphone,
  Calculator,
  GitCompare,
  CreditCard,
  Users,
  MapPin,
  Phone
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { SITE } from "@/lib/site-data";
import { useProducts, formatPrice } from "@/lib/products-store";
import { LanguageSelector, useLanguage } from "./LanguageSelector";

export function Navbar({ onOpenAi }: { onOpenAi?: () => void } = {}) {
  void onOpenAi;
  const { t } = useLanguage();
  const { products } = useProducts();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false); // Mobile drawer state
  const [isSearchOpen, setIsSearchOpen] = useState(false); // Search Modal state
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Search Modal ochilganda inputga avto-fokus berish
  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    } else {
      setSearchQuery("");
    }
  }, [isSearchOpen]);

  // Escape tugmasi bosilganda qidiruv modalni yopish
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsSearchOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Real-time qidiruv filtri
  const filteredProducts = searchQuery.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  // Menyudagi havolalar (Ikonkalar va yorqin uslub bilan)
  const navLinks = [
    { to: "/", label: t("home"), icon: Home },
    { to: "/products", label: t("products"), icon: Smartphone },
    { to: "/trade-in", label: "Telefonni Baholash", icon: Calculator },
    { to: "/compare", label: t("compare"), icon: GitCompare },
    { to: "/installment", label: t("installment"), icon: CreditCard },
    { to: "/customers", label: t("customers"), icon: Users },
    { to: "/branches", label: t("branches"), icon: MapPin },
    { to: "/contact", label: t("contact"), icon: Phone },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between px-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-black font-extrabold text-lg shadow-lg shadow-brand/20">
              tb
            </div>
            <span className="font-heading text-lg font-bold tracking-tight text-foreground">
              Telefon <span className="text-brand">Bozor</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 bg-secondary/50 p-1.5 rounded-full border border-border/50">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                activeProps={{ className: "bg-brand text-black font-bold shadow-sm" }}
                inactiveProps={{ className: "text-muted-foreground hover:text-foreground hover:bg-secondary/80" }}
                className="px-3 py-1.5 rounded-full text-xs transition-all whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side controls (Desktop) */}
          <div className="hidden lg:flex items-center gap-2.5">
            {/* Tezkor Qidiruv Tugmasi */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 rounded-full border border-border/80 bg-card/60 px-3.5 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
            >
              <Search className="h-3.5 w-3.5 text-brand" />
              <span>Qidiruv...</span>
            </button>

            {/* AI Assistant button */}
            <Link
              to="/"
              hash="ai-assistant"
              className="flex items-center gap-1.5 bg-brand/10 border border-brand/30 hover:bg-brand/20 text-brand px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>{t("aiAssistant")}</span>
            </Link>

            {/* Language Selector */}
            <LanguageSelector />

            {/* Contact phone */}
            <a
              href={`tel:${SITE.phone}`}
              className="flex items-center gap-1.5 bg-brand text-black hover:bg-brand/90 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shadow-md shadow-brand/10"
            >
              <PhoneCall className="h-3.5 w-3.5" />
              <span>{SITE.phone}</span>
            </a>
          </div>

          {/* 🔥 MOBILE - DIQQATNI TORTADIGAN SEZILARLI MENYU TUGMASI 🔥 */}
          <div className="flex items-center gap-2 md:hidden">
            {/* Qidiruv */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 rounded-xl bg-secondary border border-border text-foreground hover:text-brand transition-colors"
              aria-label="Qidiruv"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Tilni tanlash */}
            <LanguageSelector />

            {/* KATTIQ SEZILADIGAN MENYU TUGMASI */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand text-black font-extrabold text-xs shadow-lg shadow-brand/20 active:scale-95 transition-all"
            >
              {isOpen ? (
                <>
                  <X className="h-4 w-4" />
                  <span>YOPISH</span>
                </>
              ) : (
                <>
                  <Menu className="h-4 w-4" />
                  <span>MENYU</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 🔥 MOBILE MENU DRAWER (TO'LIQ VA CHIROYLI EKRAN) 🔥 */}
        {isOpen && (
          <div className="md:hidden border-b border-border bg-background/95 backdrop-blur-xl p-4 space-y-4 shadow-2xl animate-in slide-in-from-top-2 duration-200">
            {/* Navigatsiya havolalari */}
            <div className="grid grid-cols-1 gap-1.5">
              {navLinks.map((link) => {
                const IconComponent = link.icon;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setIsOpen(false)}
                    activeProps={{ className: "bg-brand text-black font-bold shadow-md shadow-brand/20" }}
                    inactiveProps={{ className: "text-foreground hover:bg-secondary/80 bg-secondary/30" }}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all border border-border/40"
                  >
                    <IconComponent className="h-4 w-4 text-brand group-hover:scale-110 transition-transform" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Tezkor harakatlar tugmalari */}
            <div className="pt-2 border-t border-border/60 flex flex-col gap-2">
              <Link
                to="/"
                hash="ai-assistant"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 bg-brand/10 border border-brand/40 text-brand py-3 rounded-xl text-sm font-bold shadow-sm"
              >
                <Sparkles className="h-4 w-4" />
                <span>{t("aiAssistant")}</span>
              </Link>

              <a
                href={`tel:${SITE.phone}`}
                className="flex items-center justify-center gap-2 bg-brand text-black py-3 rounded-xl text-sm font-extrabold shadow-lg shadow-brand/20"
              >
                <PhoneCall className="h-4 w-4" />
                <span>{SITE.phone}</span>
              </a>
            </div>
          </div>
        )}
      </header>

      {/* --- LIVE SEARCH MODAL (POPUP) --- */}
      {isSearchOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/80 backdrop-blur-md animate-in fade-in"
          onClick={() => setIsSearchOpen(false)}
        >
          <div
            className="w-full max-w-2xl rounded-2xl border border-brand/30 bg-card/95 p-4 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Input qismi */}
            <div className="relative flex items-center border-b border-border/60 pb-3">
              <Search className="h-5 w-5 text-brand ml-2" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Model nomini yozing (masalan: iPhone 16 Pro, S24 Ultra...)"
                className="w-full bg-transparent px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-xs text-muted-foreground hover:text-foreground mr-2"
                >
                  Tozalash
                </button>
              )}
              <button
                onClick={() => setIsSearchOpen(false)}
                className="p-1 rounded-lg bg-secondary text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Qidiruv natijalari */}
            <div className="mt-3 max-h-96 overflow-y-auto space-y-2 pr-1">
              {!searchQuery.trim() ? (
                <div className="py-8 text-center text-xs text-muted-foreground">
                  Qidirish uchun qurilma nomini kiriting...
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  Afsuski, "<span className="text-brand">{searchQuery}</span>" bo'yicha hech narsa topilmadi.
                </div>
              ) : (
                filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => {
                      setIsSearchOpen(false);
                      navigate({ to: "/products" });
                    }}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-border/40 bg-secondary/30 hover:bg-secondary hover:border-brand/40 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-lg bg-black/40 overflow-hidden shrink-0 border border-border">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-cover group-hover:scale-110 transition-transform"
                        />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-foreground group-hover:text-brand transition-colors">
                          {product.name}
                        </h4>
                        <span className="text-xs text-muted-foreground">
                          {product.category}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-bold text-brand">
                        {formatPrice(product.price)}
                      </div>
                      <span className="text-[10px] text-muted-foreground">
                        Batafsil &rarr;
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}