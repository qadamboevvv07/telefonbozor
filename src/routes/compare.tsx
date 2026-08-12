import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  Scale, Sparkles, Trophy, Loader2, Check, Minus, X as XIcon,
  Cpu, Camera, Battery, Monitor, HardDrive, MemoryStick, Smartphone,
  Wifi, Zap, CircleAlert,
} from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";

export interface CompareSpec {
  name: string;
  release?: string;
  image?: string;
  display?: string;
  processor?: string;
  gpu?: string;
  ram?: string;
  storage?: string;
  mainCamera?: string;
  frontCamera?: string;
  video?: string;
  battery?: string;
  charging?: string;
  os?: string;
  connectivity?: string;
  build?: string;
  extras?: string;
  advantages: string[];
}

export interface CompareCategory {
  name: string;
  winner: "A" | "B" | "Teng";
  note: string;
}

export interface CompareVerdict {
  winner: "A" | "B" | "Teng";
  summary: string;
}

export interface CompareResult {
  error?: "not_found";
  message?: string;
  phoneA?: CompareSpec;
  phoneB?: CompareSpec;
  categories?: CompareCategory[];
  verdict?: CompareVerdict;
}

export const Route = createFileRoute("/compare")({
  head: () => ({
    meta: [
      { title: "AI Telefon taqqoslash — Telefon Bozor" },
      { name: "description", content: "Har qanday ikkita telefon modelini sun'iy intellekt yordamida rasmiy spetsifikatsiyalar bo'yicha to'liq taqqoslang." },
    ],
  }),
  component: ComparePage,
});

const SUGGESTIONS = [
  ["iPhone 15 Pro Max", "Samsung Galaxy S24 Ultra"],
  ["iPhone 13", "Samsung Galaxy A55"],
  ["Xiaomi Redmi Note 13 Pro", "Samsung Galaxy A35"],
  ["iPhone 14 Pro", "iPhone 15"],
];

// Wikimedia yoki Unsplash orqali rasm olish (zaxira bilan)
async function fetchPhoneImage(phoneName: string): Promise<string> {
  const fallbackImage = `https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=600&auto=format&fit=crop`;
  try {
    const searchUrl = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gnamespace=6&gsrsearch=${encodeURIComponent(
      phoneName + " smartphone"
    )}&gsrlimit=1&prop=imageinfo&iiprop=url&format=json&origin=*`;

    const res = await fetch(searchUrl);
    const data = await res.json();
    if (data?.query?.pages) {
      const pageId = Object.keys(data.query.pages)[0];
      const imageUrl = data.query.pages[pageId]?.imageinfo?.[0]?.url;
      if (imageUrl) return imageUrl;
    }
  } catch (e) {
    console.error("Rasm yuklashda xatolik:", e);
  }
  return fallbackImage;
}

async function comparePhonesWithGroq(phoneA: string, phoneB: string): Promise<CompareResult> {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;

  const prompt = `
Sening vazifang — "${phoneA}" va "${phoneB}" telefonlarini rasmiy xarakteristikalari bo'yicha batafsil solishtirish va FAQAT valid JSON formatida javob berish.

MUHIM QO'SHIMCHA SHART:
Agar kiritilgan nomlardan biri real mavjud bo'lmagan, uydirma yoki noaniq telefon bo'lsa (masalan "iPhone 167", "Galaxy Z99", "asdasd" va h.k.), darhol quyidagi JSON xatolikni qaytar:
{
  "error": "not_found",
  "message": "Kiritilgan telefon modellaridan biri haqiqatda mavjud emas yoki topilmadi. Iltimos, to'g'ri model nomini kiriting!"
}

Aks holda, real telefonlar bo'lsa javob formati:
{
  "phoneA": {
    "name": "${phoneA}",
    "release": "Chiqarilgan yili",
    "display": "Ekran xarakteristikasi",
    "processor": "Protsessor modeli",
    "gpu": "GPU",
    "ram": "RAM xotira",
    "storage": "Ichki xotira",
    "mainCamera": "Asosiy kamera",
    "frontCamera": "Old kamera",
    "video": "Video sifati",
    "battery": "Batareya hajmi (mAh)",
    "charging": "Zaryadlash tezligi (W)",
    "os": "Operatsion sistema",
    "connectivity": "Aloqa va tarmoqlar",
    "build": "Korpus materiallari",
    "extras": "Dinamik va qo'shimchalar",
    "advantages": ["Ustunlik 1", "Ustunlik 2", "Ustunlik 3"]
  },
  "phoneB": {
    "name": "${phoneB}",
    "release": "Chiqarilgan yili",
    "display": "Ekran xarakteristikasi",
    "processor": "Protsessor modeli",
    "gpu": "GPU",
    "ram": "RAM xotira",
    "storage": "Ichki xotira",
    "mainCamera": "Asosiy kamera",
    "frontCamera": "Old kamera",
    "video": "Video sifati",
    "battery": "Batareya hajmi (mAh)",
    "charging": "Zaryadlash tezligi (W)",
    "os": "Operatsion sistema",
    "connectivity": "Aloqa va tarmoqlar",
    "build": "Korpus materiallari",
    "extras": "Dinamik va qo'shimchalar",
    "advantages": ["Ustunlik 1", "Ustunlik 2", "Ustunlik 3"]
  },
  "categories": [
    { "name": "Ekran va Displey", "winner": "A", "note": "Kategoriya izohi" },
    { "name": "Protsessor va Unumdorlik", "winner": "B", "note": "Kategoriya izohi" },
    { "name": "Kamera imkoniyatlari", "winner": "A", "note": "Kategoriya izohi" },
    { "name": "Batareya va Zaryadlash", "winner": "Teng", "note": "Kategoriya izohi" }
  ],
  "verdict": {
    "winner": "A",
    "summary": "AI xulosasi."
  }
}
G'oliblar qiymatlari FAQAT "A", "B" yoki "Teng" bo'lishi kerak.
`;

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    throw new Error("AI serveriga ulanishda xatolik yuz berdi.");
  }

  const data = await response.json();
  const rawText = data.choices[0].message.content;
  const parsed = JSON.parse(rawText) as CompareResult;

  if (parsed.error || !parsed.phoneA || !parsed.phoneB) {
    return parsed;
  }

  const [imgA, imgB] = await Promise.all([
    fetchPhoneImage(parsed.phoneA.name),
    fetchPhoneImage(parsed.phoneB.name),
  ]);

  parsed.phoneA.image = imgA;
  parsed.phoneB.image = imgB;

  return parsed;
}

function ComparePage() {
  const [a, setA] = useState("");
  const [b, setB] = useState("");

  const mutation = useMutation({
    mutationFn: (input: { phoneA: string; phoneB: string }) => comparePhonesWithGroq(input.phoneA, input.phoneB),
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (a.trim().length < 2 || b.trim().length < 2) return;
    mutation.mutate({ phoneA: a.trim(), phoneB: b.trim() });
  }

  const result = mutation.data;
  const isNotFound = result?.error === "not_found";

  return (
    <SiteShell>
      <section className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand/40 bg-brand/10 px-3 py-1 text-xs font-medium text-brand">
            <Sparkles className="h-3.5 w-3.5" /> AI yordamida
          </span>
          <h1 className="mt-6 font-display text-4xl md:text-6xl font-bold leading-[1.05]">
            Telefonlarni <span className="text-brand text-glow">taqqoslash</span>
          </h1>
          <p className="mt-4 text-muted-foreground">
            Ikkita telefon modelini kiriting — sun'iy intellekt ularni rasmiy spetsifikatsiyalar
            bo'yicha har bir detalgacha solishtirib, qaysi biri yaxshiroq ekanligini aytadi.
          </p>
        </div>

        <form onSubmit={submit} className="mt-10 rounded-3xl border border-border bg-card/70 p-6 md:p-8 backdrop-blur-sm">
          <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr]">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Telefon A</label>
              <input
                value={a}
                onChange={(e) => setA(e.target.value)}
                placeholder="Masalan: iPhone 15 Pro Max"
                className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-3.5 text-sm outline-none focus:border-brand"
              />
            </div>
            <div className="hidden md:flex items-end justify-center pb-3.5">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand/15 text-brand">
                <Scale className="h-5 w-5" />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Telefon B</label>
              <input
                value={b}
                onChange={(e) => setB(e.target.value)}
                placeholder="Masalan: Samsung Galaxy S24 Ultra"
                className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-3.5 text-sm outline-none focus:border-brand"
              />
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <span className="text-xs text-muted-foreground py-1.5">Tez tanlash:</span>
            {SUGGESTIONS.map(([x, y]) => (
              <button
                type="button"
                key={x + y}
                onClick={() => { setA(x); setB(y); }}
                className="rounded-full border border-border bg-background px-3 py-1.5 text-xs text-muted-foreground hover:border-brand hover:text-foreground"
              >
                {x} <span className="text-brand">vs</span> {y}
              </button>
            ))}
          </div>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="mt-6 w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-brand px-8 py-3.5 text-sm font-semibold text-brand-foreground shadow-[var(--shadow-glow)] hover:scale-[1.02] transition-transform disabled:opacity-60 disabled:hover:scale-100"
          >
            {mutation.isPending ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> AI tahlil qilmoqda...</>
            ) : (
              <><Sparkles className="h-4 w-4" /> Taqqoslashni boshlash</>
            )}
          </button>

          {mutation.isError && (
            <div className="mt-4 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {(mutation.error as Error).message}
            </div>
          )}
          {isNotFound && (
            <div className="mt-4 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-400 inline-flex items-center gap-2">
              <CircleAlert className="h-4 w-4" /> {result.message}
            </div>
          )}
        </form>

        {result && !isNotFound && result.phoneA && result.phoneB && (
          <div className="mt-12 space-y-10">
            <div className="grid gap-6 md:grid-cols-2">
              <PhoneColumn spec={result.phoneA} label="A" accent />
              <PhoneColumn spec={result.phoneB} label="B" />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <AdvantagesCard title="Model ustunligi" phoneName={result.phoneA.name} items={result.phoneA.advantages} accent />
              <AdvantagesCard title="Model ustunligi" phoneName={result.phoneB.name} items={result.phoneB.advantages} />
            </div>

            <div className="rounded-2xl border border-border bg-card overflow-hidden">
              <div className="px-6 py-4 border-b border-border">
                <h2 className="font-display text-xl font-bold">Kategoriya bo'yicha g'oliblar</h2>
              </div>
              <div className="divide-y divide-border">
                {result.categories?.map((c) => (
                  <div key={c.name} className="grid grid-cols-[1fr_auto] md:grid-cols-[220px_1fr_auto] gap-4 px-6 py-4 items-center">
                    <div className="font-semibold">{c.name}</div>
                    <div className="text-sm text-muted-foreground col-span-2 md:col-span-1 order-3 md:order-none">{c.note}</div>
                    <WinnerBadge winner={c.winner} nameA={result.phoneA!.name} nameB={result.phoneB!.name} />
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border-2 border-brand/50 bg-gradient-to-br from-brand/10 via-card to-card p-6 md:p-8 shadow-[var(--shadow-glow)]">
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand text-brand-foreground">
                  <Trophy className="h-7 w-7" />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-brand">AI xulosasi</div>
                  <div className="font-display text-2xl md:text-3xl font-bold">
                    {result.verdict?.winner === "Teng"
                      ? "Ikkalasi ham munosib"
                      : `G'olib: ${result.verdict?.winner === "A" ? result.phoneA.name : result.phoneB.name}`}
                  </div>
                </div>
              </div>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">{result.verdict?.summary}</p>
            </div>
          </div>
        )}
      </section>
    </SiteShell>
  );
}

function PhoneColumn({ spec, label, accent }: { spec: CompareSpec; label: "A" | "B"; accent?: boolean }) {
  const rows: Array<{ icon: React.ComponentType<{ className?: string }>; k: string; v?: string }> = [
    { icon: Monitor, k: "Ekran", v: spec.display },
    { icon: Cpu, k: "Protsessor", v: spec.processor },
    { icon: Cpu, k: "GPU", v: spec.gpu },
    { icon: MemoryStick, k: "Operativ xotira", v: spec.ram },
    { icon: HardDrive, k: "Ichki xotira", v: spec.storage },
    { icon: Camera, k: "Asosiy kamera", v: spec.mainCamera },
    { icon: Camera, k: "Old kamera", v: spec.frontCamera },
    { icon: Camera, k: "Video", v: spec.video },
    { icon: Battery, k: "Batareya", v: spec.battery },
    { icon: Zap, k: "Zaryadlash", v: spec.charging },
    { icon: Smartphone, k: "OS", v: spec.os },
    { icon: Wifi, k: "Aloqa", v: spec.connectivity },
    { icon: Smartphone, k: "Korpus", v: spec.build },
  ];
  return (
    <div className={`rounded-3xl border ${accent ? "border-brand/50" : "border-border"} bg-card overflow-hidden`}>
      <div className={`px-6 py-4 border-b border-border flex items-center gap-3 ${accent ? "bg-brand/5" : ""}`}>
        <span className={`inline-flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold ${accent ? "bg-brand text-brand-foreground" : "bg-secondary text-foreground"}`}>
          {label}
        </span>
        <div className="min-w-0">
          <h3 className="font-display text-lg md:text-xl font-bold truncate">{spec.name}</h3>
          <div className="text-xs text-muted-foreground">Chiqarilgan: {spec.release || "—"}</div>
        </div>
      </div>

      <div className="p-6">
        <div className="aspect-[4/5] w-full max-w-[280px] mx-auto rounded-2xl border border-border bg-gradient-to-b from-secondary/60 to-background flex items-center justify-center overflow-hidden relative">
          <img
            src={spec.image || "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=600&auto=format&fit=crop"}
            alt={spec.name}
            className="h-full w-full object-contain p-4 transition-transform duration-300 hover:scale-105"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=600&auto=format&fit=crop";
            }}
          />
        </div>

        <div className="mt-6 space-y-2.5">
          {rows.filter((r) => r.v).map((r) => (
            <div key={r.k} className="flex items-start gap-3 text-sm">
              <r.icon className="h-4 w-4 text-brand mt-0.5 flex-shrink-0" />
              <span className="text-muted-foreground w-32 flex-shrink-0">{r.k}</span>
              <span className="flex-1">{r.v}</span>
            </div>
          ))}
          {spec.extras && (
            <div className="flex items-start gap-3 text-sm pt-3 border-t border-border">
              <Sparkles className="h-4 w-4 text-brand mt-0.5 flex-shrink-0" />
              <span className="text-muted-foreground w-32 flex-shrink-0">Qo'shimcha</span>
              <span className="flex-1">{spec.extras}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AdvantagesCard({ title, phoneName, items, accent }: { title: string; phoneName: string; items: string[]; accent?: boolean }) {
  return (
    <div className={`rounded-2xl border ${accent ? "border-brand/50 bg-brand/5" : "border-border bg-card"} p-6`}>
      <div className="flex items-center gap-2">
        <Trophy className={`h-4 w-4 ${accent ? "text-brand" : "text-muted-foreground"}`} />
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</span>
      </div>
      <h4 className="mt-1 font-display text-lg font-bold">{phoneName}</h4>
      <ul className="mt-4 space-y-2">
        {items?.map((p, i) => (
          <li key={i} className="flex items-start gap-2 text-sm">
            <Check className={`h-4 w-4 mt-0.5 flex-shrink-0 ${accent ? "text-brand" : "text-emerald-400"}`} />
            <span>{p}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function WinnerBadge({ winner, nameA, nameB }: { winner: "A" | "B" | "Teng"; nameA: string; nameB: string }) {
  if (winner === "Teng") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-semibold text-muted-foreground">
        <Minus className="h-3.5 w-3.5" /> Teng
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-brand/40 bg-brand/15 px-3 py-1.5 text-xs font-semibold text-brand whitespace-nowrap max-w-[200px] truncate">
      <Check className="h-3.5 w-3.5 flex-shrink-0" /> {winner === "A" ? nameA : nameB}
    </span>
  );
}

export type { CompareSpec };
void XIcon;