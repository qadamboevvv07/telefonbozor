import { Globe } from "lucide-react";
import { useState, useRef, useEffect, createContext, useContext, ReactNode } from "react";

export type LanguageCode = "uz" | "kaa" | "ru" | "en";

export interface Language {
  code: LanguageCode;
  name: string;
  flag: string;
}

export const LANGUAGES: Language[] = [
  { code: "uz", name: "O'zbekcha", flag: "🇺🇿" },
  { code: "kaa", name: "Qaraqalpaqsha", flag: "🇦🇱" },
  { code: "ru", name: "Русский", flag: "🇷🇺" },
  { code: "en", name: "English", flag: "🇬🇧" },
];

export const translations: Record<LanguageCode, Record<string, string>> = {
  uz: {
    home: "Bosh sahifa",
    products: "Mahsulotlar",
    compare: "Taqqoslash",
    installment: "Muddatli to'lov",
    customers: "Bizning mijozlar",
    branches: "Filiallar",
    contact: "Aloqa",
    aiAssistant: "Onlayn Yordamchi",
    heroBadge: "Xorazm bo'ylab 4 ta filial ochiq",
    heroTitleHighlight: "ishonchli tanlov",
    heroSubtitle: "iPhone, Samsung, Xiaomi va original aksesuarlar. Rasmiy kafolat, muddatli to'lov va AI telefon taqqoslash.",
    btnViewProducts: "Mahsulotlarni ko'rish",
    btnAiCompare: "AI taqqoslash",
    statBranches: "Filial",
    statProducts: "Mahsulot",
    statCustomers: "Mijoz",
    badgeGuarantee: "Rasmiy kafolat",
    badgeInstallment: "Muddatli to'lov",
    badgeReviews: "4.9 · 2,300+ sharh",
    secCatalog: "Katalog",
    secCategories: "Kategoriyalar",
    secCatSub: "Har turdagi qurilma va aksesuar",
    catPhones: "Telefonlar",
    catAccessories: "Aksesuarlar",
    catAccDesc: "Quloqchin, kabel, zaryadchi",
    catGuarantee: "Kafolat",
    catGuarDesc: "Rasmiy kafolat bilan",
    btnSeeMore: "Ko'rish",
    secTopSelection: "Top tanlov",
    secPopularProducts: "Mashhur mahsulotlar",
    secPopularSub: "Eng ko'p tanlanadigan qurilmalar",
    btnAll: "Barchasi",
    badgeNew: "Yangi",
    secChooseUs: "Bizni tanlang",
    secWhyChooseTitle: "Nega Telefon Bozor?",
    whyGuaranteeTitle: "Kafolat",
    whyGuaranteeDesc: "Har bir mahsulotga rasmiy kafolat beriladi.",
    whyInstallmentTitle: "Muddatli to'lov",
    whyInstallmentDesc: "3, 6 va 12 oyga bir passport evaziga.",
    whyQualityTitle: "Sifat",
    whyQualityDesc: "Faqat original va sinovdan o'tgan mahsulotlar.",
    whyHoursTitle: "Ish vaqti",
    whyHoursDesc: "Har kuni javob beriladi:",
    secLocations: "Manzillar",
    secOurBranches: "Filiallarimiz",
    btnMore: "Batafsil",
    labelWorkHours: "Ish vaqti",
  },
  kaa: {
    home: "Bas bet",
    products: "O'nimler",
    compare: "Salıstırıw",
    installment: "Bo'lip to'lew",
    customers: "Bizdin' klientler",
    branches: "Filiallar",
    contact: "Baylanıs",
    aiAssistant: "Onlayn Ko'mekshi",
    heroBadge: "Xorezm boyınsha 4 filial ashıq",
    heroTitleHighlight: "ishenishli tan'law",
    heroSubtitle: "iPhone, Samsung, Xiaomi ha'm original aksessuarlar. Rasmiy kepillik, bo'lip to'lew ha'm AI telefon salıstırıw.",
    btnViewProducts: "O'nimlerdi ko'riw",
    btnAiCompare: "AI salıstırıw",
    statBranches: "Filial",
    statProducts: "O'nim",
    statCustomers: "Klient",
    badgeGuarantee: "Rasmiy kepillik",
    badgeInstallment: "Bo'lip to'lew",
    badgeReviews: "4.9 · 2,300+ pikir",
    secCatalog: "Katalog",
    secCategories: "Kategoriyalar",
    secCatSub: "Ha'r tu'rli qurılma ha'm aksessuar",
    catPhones: "Telefonlar",
    catAccessories: "Aksessuarlar",
    catAccDesc: "Naushnik, kabel, zaryadchik",
    catGuarantee: "Kepillik",
    catGuarDesc: "Rasmiy kepillik penen",
    btnSeeMore: "Ko'riw",
    secTopSelection: "Top tan'law",
    secPopularProducts: "Belgili o'nimler",
    secPopularSub: "En' ko'p tan'lanatug'ın qurılmalar",
    btnAll: "Barlyg'ı",
    badgeNew: "Jan'a",
    secChooseUs: "Bizdi tan'lan'ız",
    secWhyChooseTitle: "Nega Telefon Bozor?",
    whyGuaranteeTitle: "Kepillik",
    whyGuaranteeDesc: "Ha'r bir o'nimge rasmiy kepillik beriledi.",
    whyInstallmentTitle: "Bo'lip to'lew",
    whyInstallmentDesc: "Pasport penen 3, 6 ha'm 12 ayg'a.",
    whyQualityTitle: "Sapa",
    whyQualityDesc: "Tek original ha'm sınawdan o'tken o'nimler.",
    whyHoursTitle: "Is waqtı",
    whyHoursDesc: "Ha'r ku'ni juwap beriledi:",
    secLocations: "Menziller",
    secOurBranches: "Filiallarımız",
    btnMore: "Tolıg'ıraq",
    labelWorkHours: "Is waqtı",
  },
  ru: {
    home: "Главная",
    products: "Продукты",
    compare: "Сравнение",
    installment: "Рассрочка",
    customers: "Наши клиенты",
    branches: "Филиалы",
    contact: "Контакты",
    aiAssistant: "Онлайн Помощник",
    heroBadge: "Открыто 4 филиала по Хорезму",
    heroTitleHighlight: "надежный выбор",
    heroSubtitle: "iPhone, Samsung, Xiaomi и оригинальные аксессуары. Официальная гарантия, рассрочка и AI сравнение телефонов.",
    btnViewProducts: "Посмотреть товары",
    btnAiCompare: "AI Сравнение",
    statBranches: "Филиала",
    statProducts: "Товаров",
    statCustomers: "Клиентов",
    badgeGuarantee: "Официальная гарантия",
    badgeInstallment: "Рассрочка",
    badgeReviews: "4.9 · 2,300+ отзывов",
    secCatalog: "Каталог",
    secCategories: "Категории",
    secCatSub: "Любые устройства и аксессуары",
    catPhones: "Телефоны",
    catAccessories: "Аксессуары",
    catAccDesc: "Наушники, кабели, зарядки",
    catGuarantee: "Гарантия",
    catGuarDesc: "С официальной гарантией",
    btnSeeMore: "Смотреть",
    secTopSelection: "Топ выбор",
    secPopularProducts: "Популярные товары",
    secPopularSub: "Самые покупаемые устройства",
    btnAll: "Все",
    badgeNew: "Новинка",
    secChooseUs: "Выберите нас",
    secWhyChooseTitle: "Почему Telefon Bozor?",
    whyGuaranteeTitle: "Гарантия",
    whyGuaranteeDesc: "Официальная гарантия на каждый товар.",
    whyInstallmentTitle: "Рассрочка",
    whyInstallmentDesc: "На 3, 6 и 12 месяцев по паспорту.",
    whyQualityTitle: "Качество",
    whyQualityDesc: "Только оригинальные проверенные товары.",
    whyHoursTitle: "Время работы",
    whyHoursDesc: "Ежедневно ответим:",
    secLocations: "Адреса",
    secOurBranches: "Наши филиалы",
    btnMore: "Подробнее",
    labelWorkHours: "Время работы",
  },
  en: {
    home: "Home",
    products: "Products",
    compare: "Compare",
    installment: "Installment",
    customers: "Our Customers",
    branches: "Branches",
    contact: "Contact",
    aiAssistant: "Online Assistant",
    heroBadge: "4 branches open across Khorezm",
    heroTitleHighlight: "reliable choice",
    heroSubtitle: "iPhone, Samsung, Xiaomi and original accessories. Official warranty, installment plans and AI phone comparison.",
    btnViewProducts: "View Products",
    btnAiCompare: "AI Comparison",
    statBranches: "Branches",
    statProducts: "Products",
    statCustomers: "Customers",
    badgeGuarantee: "Official Warranty",
    badgeInstallment: "Installment",
    badgeReviews: "4.9 · 2,300+ reviews",
    secCatalog: "Catalog",
    secCategories: "Categories",
    secCatSub: "All types of devices and accessories",
    catPhones: "Phones",
    catAccessories: "Accessories",
    catAccDesc: "Headphones, cables, chargers",
    catGuarantee: "Warranty",
    catGuarDesc: "With official warranty",
    btnSeeMore: "View",
    secTopSelection: "Top Selection",
    secPopularProducts: "Popular Products",
    secPopularSub: "Most chosen devices",
    btnAll: "All",
    badgeNew: "New",
    secChooseUs: "Why Choose Us",
    secWhyChooseTitle: "Why Telefon Bozor?",
    whyGuaranteeTitle: "Warranty",
    whyGuaranteeDesc: "Official warranty provided for every product.",
    whyInstallmentTitle: "Installment",
    whyInstallmentDesc: "For 3, 6, and 12 months with just a passport.",
    whyQualityTitle: "Quality",
    whyQualityDesc: "Only original and tested products.",
    whyHoursTitle: "Working Hours",
    whyHoursDesc: "Everyday responding:",
    secLocations: "Locations",
    secOurBranches: "Our Branches",
    btnMore: "More details",
    labelWorkHours: "Working hours",
  },
};

interface LanguageContextType {
  currentLang: Language;
  langCode: LanguageCode;
  setLanguage: (code: LanguageCode) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  currentLang: LANGUAGES[0],
  langCode: "uz",
  setLanguage: () => {},
  t: (key: string) => translations.uz[key] || key,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [langCode, setLangCode] = useState<LanguageCode>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("tb_lang") as LanguageCode) || "uz";
    }
    return "uz";
  });

  const setLanguage = (code: LanguageCode) => {
    setLangCode(code);
    if (typeof window !== "undefined") {
      localStorage.setItem("tb_lang", code);
    }
  };

  const currentLang = LANGUAGES.find((l) => l.code === langCode) || LANGUAGES[0];

  const t = (key: string): string => {
    return translations[langCode]?.[key] || translations["uz"]?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ currentLang, langCode, setLanguage, t }}>
      <div>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);

export function LanguageSelector() {
  const { currentLang, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        className="flex items-center gap-1.5 rounded-full border border-border/80 bg-card/60 px-3 py-1.5 text-xs font-semibold hover:bg-secondary transition-all text-foreground"
      >
        <Globe className="h-4 w-4 text-brand" />
        <span>{currentLang.flag} {currentLang.name}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 z-50 min-w-[160px] overflow-hidden rounded-xl border border-border bg-card/95 p-1.5 shadow-xl backdrop-blur-md animate-in fade-in slide-in-from-top-2">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => {
                setLanguage(lang.code);
                setIsOpen(false);
              }}
              className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                currentLang.code === lang.code
                  ? "bg-brand/20 text-brand font-bold"
                  : "hover:bg-secondary text-foreground"
              }`}
            >
              <span className="text-base">{lang.flag}</span>
              <span>{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}