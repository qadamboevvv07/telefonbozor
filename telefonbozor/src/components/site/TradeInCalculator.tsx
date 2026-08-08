import { useState } from "react";
import {
  Calculator,
  ArrowRight,
  Upload,
  Loader2,
  Sparkles,
  ShieldAlert,
  ArrowLeft,
  Smartphone,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { evaluatePhoneWithAI } from "@/lib/tradein-ai";

export function TradeInCalculator() {
  const [model, setModel] = useState("iPhone 13 Pro");
  const [storage, setStorage] = useState("128 GB");
  const [conditionDetails, setConditionDetails] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    estimatedPriceUSD: number;
    estimatedPriceUZS: number;
    reasoning: string;
  } | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleEvaluate = async () => {
    if (!conditionDetails.trim()) return;

    setLoading(true);
    setResult(null);

    const aiResult = await evaluatePhoneWithAI({
      model,
      storage,
      conditionDetails,
    });

    if (aiResult) {
      setResult(aiResult);
    } else {
      alert("Xatolik yuz berdi. Qayta urinib ko'ring!");
    }
    setLoading(false);
  };

  // Karusel va yon kartochkalar uchun singan/ishlatilgan telefon namunalari
  const brokenPhoneExamples = [
    {
      title: "iPhone 11 (Ekrani yorilgan)",
      img: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&auto=format&fit=crop&q=60",
      desc: "Ekran shishasi singan, sensor ishlaydi.",
      price: "~ 1 800 000 so'm",
      tag: "Ekrani singan",
      color: "border-red-500/40 text-red-400 bg-red-500/10",
    },
    {
      title: "iPhone 13 Pro (Orqasi yorilgan)",
      img: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&auto=format&fit=crop&q=60",
      desc: "Orqa shishasi zarba yegan, korpus qirilgan.",
      price: "~ 5 400 000 so'm",
      tag: "Orqasi darz ketgan",
      color: "border-amber-500/40 text-amber-400 bg-amber-500/10",
    },
    {
      title: "Samsung S22 (Platasi va ekrani nuqsonli)",
      img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&auto=format&fit=crop&q=60",
      desc: "Ekranda chiziqlar bor, batareya almashgan.",
      price: "~ 3 100 000 so'm",
      tag: "Displey nuqsonli",
      color: "border-orange-500/40 text-orange-400 bg-orange-500/10",
    },
    {
      title: "Redmi Note 12 (Kamera oynasi singan)",
      img: "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=400&auto=format&fit=crop&q=60",
      desc: "Kamera shishasi darz ketgan, korpus ideal.",
      price: "~ 1 200 000 so'm",
      tag: "Kamera shikastlangan",
      color: "border-yellow-500/40 text-yellow-400 bg-yellow-500/10",
    },
  ];

  return (
    <div className="relative w-full max-w-6xl mx-auto px-4 py-4 space-y-8">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary hover:bg-brand hover:text-black text-foreground font-semibold text-xs sm:text-sm transition-all border border-border"
        >
          <ArrowLeft className="h-4 w-4" /> Bosh sahifaga qaytish
        </Link>
        <span className="text-xs text-muted-foreground hidden sm:inline-block">
          Telefon Bozor — Trade-In AI Baholash
        </span>
      </div>

      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand/10 border border-brand/30 text-brand text-xs font-bold uppercase tracking-wider">
          <Sparkles className="h-4 w-4" /> Real-vaqt AI Baholash Tizimi
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
          Eski yoki Singan Telefoningizni <span className="text-brand">Onlayn Narxlang</span>
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Ekrani singan, orqasi yorilgan yoki ishlatilgan telefoningiz holatini boricha yozing. AI do'konimiz sotib olish narxini hisoblab beradi!
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* Chap taraf: Singan telefon kartochkasi */}
        <div className="hidden lg:block lg:col-span-3 space-y-4 sticky top-24">
          <div className="p-4 rounded-2xl border border-red-500/30 bg-card/80 backdrop-blur-md space-y-3">
            <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/30">
              Ekrani singan namuna
            </span>
            <div className="h-36 rounded-xl overflow-hidden relative border border-border">
              <img
                src={brokenPhoneExamples[0].img}
                alt="Singan telefon"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-2">
                <span className="text-xs font-bold text-white">{brokenPhoneExamples[0].title}</span>
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground">{brokenPhoneExamples[0].desc}</p>
            <div className="text-xs font-extrabold text-brand pt-1 border-t border-border/50">
              Sotib olish narxi: {brokenPhoneExamples[0].price}
            </div>
          </div>
        </div>

        {/* Markaz: AI Kalkulyator */}
        <div className="lg:col-span-6 relative rounded-3xl border border-brand/40 bg-gradient-to-b from-card via-card/95 to-background p-5 sm:p-8 shadow-[0_0_50px_rgba(234,179,8,0.12)] backdrop-blur-xl">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/60">
            <div className="p-3 rounded-2xl bg-brand text-black font-extrabold">
              <Calculator className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">AI Smart Trade-In</h2>
              <p className="text-xs text-muted-foreground">Holat va nuqsonlarni kiriting</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block mb-1 font-bold text-[11px] uppercase tracking-wider text-muted-foreground">
                  Model Nomi:
                </label>
                <input
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="iPhone 13, Galaxy S22..."
                  className="w-full p-3 rounded-xl border border-border bg-secondary/60 text-foreground outline-none focus:border-brand font-semibold text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block mb-1 font-bold text-[11px] uppercase tracking-wider text-muted-foreground">
                  Xotira Hajmi:
                </label>
                <select
                  value={storage}
                  onChange={(e) => setStorage(e.target.value)}
                  className="w-full p-3 rounded-xl border border-border bg-secondary/60 text-foreground outline-none focus:border-brand font-semibold text-xs sm:text-sm"
                >
                  <option value="64 GB">64 GB</option>
                  <option value="128 GB">128 GB</option>
                  <option value="256 GB">256 GB</option>
                  <option value="512 GB">512 GB</option>
                  <option value="1 TB">1 TB</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block mb-1 font-bold text-[11px] uppercase tracking-wider text-muted-foreground">
                Nuqsonlar va Holati (Ochiq yozing):
              </label>
              <textarea
                rows={4}
                value={conditionDetails}
                onChange={(e) => setConditionDetails(e.target.value)}
                placeholder="Masalan: Ekran ustki shishasi yorilgan, sensor va face id ishlaydi, orqasida chiziqlar bor, batareya 82%..."
                className="w-full p-3.5 rounded-xl border border-border bg-secondary/60 text-foreground outline-none focus:border-brand text-xs sm:text-sm resize-none leading-relaxed"
              />
            </div>

            <div>
              <label className="block mb-1 font-bold text-[11px] uppercase tracking-wider text-muted-foreground">
                Telefon Rasmi (Ixtiyoriy):
              </label>
              <div className="flex items-center gap-3">
                <label className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-brand/40 hover:border-brand bg-secondary/30 cursor-pointer transition-all text-xs text-muted-foreground hover:text-foreground">
                  <Upload className="h-4 w-4 text-brand shrink-0" />
                  <span className="truncate">{imagePreview ? "Rasm almashtirish" : "Rasm yuklash"}</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
                {imagePreview && (
                  <div className="h-10 w-10 rounded-xl overflow-hidden border border-brand shrink-0">
                    <img src={imagePreview} alt="Phone preview" className="h-full w-full object-cover" />
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={handleEvaluate}
              disabled={loading || !conditionDetails.trim()}
              className="w-full py-3.5 rounded-xl bg-brand text-black font-extrabold text-sm flex items-center justify-center gap-2 hover:bg-brand/90 transition-all shadow-lg shadow-brand/20 disabled:opacity-50 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>AI Hisoblamoqda...</span>
                </>
              ) : (
                <>
                  <span>AI orqali baholash</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>

            {/* AI Natijasi va Qizil Ogohlantirish */}
            {result && (
              <div className="mt-6 pt-6 border-t border-border/80 space-y-4 animate-in fade-in">
                <div className="p-4 rounded-xl bg-brand/10 border border-brand/50 text-center space-y-1">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase">
                    Sotib olish taklifimiz:
                  </span>
                  <div className="text-2xl sm:text-4xl font-black text-brand tracking-tight">
                    ~ {result.estimatedPriceUZS.toLocaleString("uz-UZ")} so'm
                    <span className="text-xs text-muted-foreground font-normal ml-1">
                      (${result.estimatedPriceUSD})
                    </span>
                  </div>
                  <p className="text-xs text-foreground/80 pt-1 leading-relaxed">
                    <strong>💡 AI Tahlili:</strong> {result.reasoning}
                  </p>
                </div>

                {/* 🔴 SIZ SO'RAGAN KATTA QIZIL OGOHLANTIRISH BLOKI */}
                <div className="p-4 rounded-xl bg-red-950/50 border-2 border-red-500 text-red-100 space-y-2 shadow-lg shadow-red-950/40">
                  <div className="flex items-center gap-2 font-black text-red-400 text-xs sm:text-sm uppercase tracking-wide">
                    <ShieldAlert className="h-5 w-5 text-red-500 shrink-0" />
                    <span>MUHIM ESLATMA / DIQQAT qiling:</span>
                  </div>
                  <p className="text-xs sm:text-sm leading-relaxed font-medium">
                    Ushbu ko'rsatilgan narx <strong>onlayn taxminiy baholash</strong> hisoblanadi. Telefoningizni usta ko'rmasdan va diagnostika qilmasdan turib aniq baholay olmaymiz! Shuning uchun do'konimizga kelganingizda va usta tekshiruvidan so'ng haqiqiy narxlar ushbu ko'rsatilgan summadan <strong>$100 - $150 farq qilishi</strong> (kamayishi yoki ko'payishi) mumkin.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* O'ng taraf: Orqasi singan telefon kartochkasi */}
        <div className="hidden lg:block lg:col-span-3 space-y-4 sticky top-24">
          <div className="p-4 rounded-2xl border border-amber-500/30 bg-card/80 backdrop-blur-md space-y-3">
            <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
              Orqasi darz ketgan
            </span>
            <div className="h-36 rounded-xl overflow-hidden relative border border-border">
              <img
                src={brokenPhoneExamples[1].img}
                alt="Orqasi singan telefon"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-2">
                <span className="text-xs font-bold text-white">{brokenPhoneExamples[1].title}</span>
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground">{brokenPhoneExamples[1].desc}</p>
            <div className="text-xs font-extrabold text-brand pt-1 border-t border-border/50">
              Sotib olish narxi: {brokenPhoneExamples[1].price}
            </div>
          </div>
        </div>

      </div>

      {/* Pastdagi Namunalar Kartochkasi */}
      <div className="space-y-4 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-foreground">Biz Baholagan Real Telefonlar</h3>
            <p className="text-xs text-muted-foreground">Ekrani, korpusi va xotirasiga qarab AI bergan narxlar</p>
          </div>
          <span className="text-xs text-brand font-semibold">Har xil holatlar &rarr;</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {brokenPhoneExamples.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl border border-border bg-card/60 backdrop-blur-md space-y-3 hover:border-brand/50 transition-all flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="h-28 rounded-xl overflow-hidden relative border border-border/50">
                  <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
                  <span className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-[9px] font-bold border ${item.color}`}>
                    {item.tag}
                  </span>
                </div>
                <h4 className="font-bold text-xs text-foreground">{item.title}</h4>
                <p className="text-[11px] text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>

              <div className="pt-2 border-t border-border/40 flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground">AI Narxi:</span>
                <span className="text-xs font-black text-brand">{item.price}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}