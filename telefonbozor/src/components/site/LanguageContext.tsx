import { createContext, useContext, useState, ReactNode } from "react";

export type LanguageCode = "uz" | "ru" | "en" | "kk" | "kaa" | "tk" | "tr" | "ar" | "ky";

export interface Language {
  code: LanguageCode;
  name: string;
  flag: string;
}

export const LANGUAGES: Language[] = [
  { code: "uz", name: "O'zbekcha", flag: "🇺🇿" },
  { code: "ru", name: "Русский", flag: "🇷🇺" },
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "kk", name: "Қазақша", flag: "🇰🇿" },
  { code: "kaa", name: "Qaraqalpaqsha", flag: "🇦🇱" }, // Qoraqalpoq
  { code: "tk", name: "Türkmençe", flag: "🇹🇲" },
  { code: "tr", name: "Türkçe", flag: "🇹🇷" },
  { code: "ar", name: "العربية", flag: "🇸🇦" },
  { code: "ky", name: "Кыргызча", flag: "🇰🇬" },
];

interface LanguageContextType {
  currentLang: Language;
  setLanguage: (code: LanguageCode) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [langCode, setLangCode] = useState<LanguageCode>(() => {
    return (localStorage.getItem("tb_lang") as LanguageCode) || "uz";
  });

  const setLanguage = (code: LanguageCode) => {
    setLangCode(code);
    localStorage.setItem("tb_lang", code);
  };

  const currentLang = LANGUAGES.find((l) => l.code === langCode) || LANGUAGES[0];

  return (
    <LanguageContext.Provider value={{ currentLang, setLanguage }}>
      <div dir={currentLang.code === "ar" ? "rtl" : "ltr"}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
};