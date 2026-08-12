import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CreditCard, CheckCircle2, XCircle, Calendar, User, FileText, Phone, Calculator, Sparkles } from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import { SITE } from "@/lib/site-data";

export const Route = createFileRoute("/installment")({
  head: () => ({
    meta: [
      { title: "Muddatli to'lov shartlari va Kalkulyator — Telefon Bozor" },
      { name: "description", content: "Bir passport evaziga 3, 6, 12 oyga muddatli to'lov hisoblagichi va shartlari." },
    ],
  }),
  component: InstallmentPage,
});

function InstallmentPage() {
  // Kalkulyator holati
  const [priceInput, setPriceInput] = useState<string>("7700000");
  const [months, setMonths] = useState<number>(3);

  // Faqat raqamlarni ajratib olish
  const rawPrice = parseFloat(priceInput.replace(/\D/g, "")) || 0;

  // Hisoblash mantig'i:
  // 1. Narx + 1.01%
  const step1Price = rawPrice * 1.0101;

  // 2. Ko'paytiruvchi koeffitsiyentlar
  const multipliers: Record<number, number> = {
    3: 1.16,
    6: 1.40,
    12: 1.50,
  };

  const multiplier = multipliers[months] || 1.16;
  const totalPrice = step1Price * multiplier;
  const monthlyPayment = months > 0 ? totalPrice / months : 0;

  // Pul miqdorini formatlash
  const formatMoney = (val: number) => {
    return Math.round(val).toLocaleString("uz-UZ") + " so'm";
  };

  return (
    <SiteShell>
      <section className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="flex items-start gap-4">
          <div className="hidden sm:flex h-14 w-14 items-center justify-center rounded-2xl bg-brand text-brand-foreground shadow-[var(--shadow-glow)]">
            <CreditCard className="h-7 w-7" />
          </div>
          <div>
            <h1 className="font-display text-4xl md:text-5xl font-bold">Muddatli to'lov shartlari</h1>
            <p className="mt-2 text-muted-foreground max-w-2xl">
              Bir passport evaziga 3, 6 yoki 12 oyga muddatli to'lov orqali istagan telefoningizni sotib olishingiz mumkin.
            </p>
          </div>
        </div>

        {/* ----------------- 🧮 KALKULYATOR BO'LIMI ----------------- */}
        <div className="mt-10 rounded-3xl border border-brand/30 bg-gradient-to-br from-card via-card to-brand/5 p-6 md:p-8 shadow-xl">
          <div className="flex items-center gap-3 text-brand font-bold text-xl">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/15">
              <Calculator className="h-6 w-6" />
            </div>
            <h2>Muddatli to'lov kalkulyatori</h2>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Telefon narxini kiriting va oylik to'lov miqdorini tezkor hisoblab oling.
          </p>

          <div className="mt-8 grid gap-8 md:grid-cols-2 items-center">
            {/* Input va tugmalar */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2 text-foreground">
                  Telefon narxi (so'mda)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={priceInput ? Number(priceInput.replace(/\D/g, "")).toLocaleString("uz-UZ") : ""}
                    onChange={(e) => setPriceInput(e.target.value.replace(/\D/g, ""))}
                    placeholder="Masalan: 7 700 000"
                    className="w-full rounded-2xl border border-border bg-background/80 px-4 py-3.5 text-lg font-bold focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all"
                  />
                  <span className="absolute right-4 top-4 text-sm font-semibold text-muted-foreground">
                    SO'M
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-foreground">
                  To'lov muddatini tanlang:
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[3, 6, 12].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMonths(m)}
                      className={`rounded-xl py-3 text-sm font-bold border transition-all ${
                        months === m
                          ? "border-brand bg-brand text-brand-foreground shadow-md"
                          : "border-border bg-background hover:border-brand/50 text-foreground"
                      }`}
                    >
                      {m} Oy
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Natija oynasi */}
            <div className="rounded-2xl border border-border bg-card/80 backdrop-blur p-6 space-y-5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <Sparkles className="h-4 w-4 text-brand" /> Hisoblangan natija
              </div>

              <div className="space-y-1 border-b border-border/60 pb-4">
                <div className="text-sm text-muted-foreground">Oylik to'lov:</div>
                <div className="font-display text-3xl sm:text-4xl font-extrabold text-brand text-glow">
                  {rawPrice > 0 ? formatMoney(monthlyPayment) : "0 so'm"}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm pt-1">
                <div>
                  <div className="text-muted-foreground text-xs">Jami to'lov:</div>
                  <div className="font-semibold mt-0.5 text-foreground">
                    {rawPrice > 0 ? formatMoney(totalPrice) : "0 so'm"}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground text-xs">Tanlangan muddat:</div>
                  <div className="font-semibold mt-0.5 text-foreground">{months} oy</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ----------------- TALAB VA RAD ETILISH SHARTLARI ----------------- */}
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {/* Talab qilinadi */}
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-6">
            <div className="flex items-center gap-2 text-emerald-500 text-sm font-semibold">
              <CheckCircle2 className="h-4 w-4" /> Talab qilinadi
            </div>
            <ul className="mt-4 space-y-4">
              {[
                { icon: User, t: "18 yoshdan katta bo'lgan O'zbekiston Respublikasi fuqarosi" },
                { icon: FileText, t: "MIB (Majburiy ijro byurosi)dan qarzdorlik bo'lmasligi kerak" },
                { icon: FileText, t: "Amaldagi ID karta yoki passport" },
                { icon: Calendar, t: "Bir passport evaziga 3, 6 yoki 12 oyga to'lov muddati" },
              ].map((r) => (
                <li key={r.t} className="flex gap-3">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-500">
                    <r.icon className="h-4 w-4" />
                  </div>
                  <span className="text-sm leading-relaxed pt-1.5">{r.t}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Rad etilishi mumkin */}
          <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6">
            <div className="flex items-center gap-2 text-destructive text-sm font-semibold">
              <XCircle className="h-4 w-4" /> Rad etilishi mumkin
            </div>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li>• 18 yoshga to'lmagan shaxslar</li>
              <li>• MIB bazasida qarzdorligi mavjud fuqarolar</li>
              <li>• Passport yaroqsiz yoki muddati o'tgan bo'lsa</li>
              <li>• Chet el fuqarolari (holatiga qarab, alohida ko'rib chiqiladi)</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            { m: "3 oy", d: "Eng qisqa muddat, kam ustama" },
            { m: "6 oy", d: "Balansli variant" },
            { m: "12 oy", d: "Eng past oylik to'lov" },
          ].map((p) => (
            <div key={p.m} className="rounded-2xl border border-brand/30 bg-brand/5 p-6 text-center">
              <div className="font-display text-3xl font-bold text-brand text-glow">{p.m}</div>
              <div className="mt-1 text-sm text-muted-foreground">{p.d}</div>
            </div>
          ))}
        </div>

        {/* Aloqa bloki */}
        <div className="mt-10 rounded-2xl border border-border bg-card p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="font-semibold">Muddatli to'lov haqida savol bormi?</div>
            <div className="text-sm text-muted-foreground">Filialimizga qo'ng'iroq qiling — {SITE.hours}</div>
          </div>
          <div className="flex gap-2">
            <a href={SITE.phoneHref} className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-brand-foreground">
              <Phone className="h-4 w-4" /> {SITE.phone}
            </a>
            <Link to="/customers" className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-semibold hover:border-brand">
              Xabar qoldirish
            </Link>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}