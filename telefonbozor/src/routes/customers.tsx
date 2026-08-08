import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Send, MessageCircle, Users, ShieldCheck, Loader2 } from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import { useInquiries } from "@/lib/inquiries-store";
import { SITE } from "@/lib/site-data";
import { sendInquiryToTelegram } from "@/lib/inquiries.functions";
import { supabase } from "@/lib/supabase"; // <-- Supabase ulanishi qo'shildi

export const Route = createFileRoute("/customers")({
  head: () => ({
    meta: [
      { title: "Bizning mijozlar — Telefon Bozor" },
      { name: "description", content: "Sizni qiziqtirgan telefon yoki savol bo'yicha xabar qoldiring. Biz sizga tez orada qo'ng'iroq qilamiz." },
    ],
  }),
  component: CustomersPage,
});

function CustomersPage() {
  const { add } = useInquiries();
  const sendTg = useServerFn(sendInquiryToTelegram);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setSent(false);
    if (name.trim().length < 2) return setErr("Ismingizni to'liq kiriting");
    if (!/^[+\d\s()-]{9,}$/.test(phone)) return setErr("Telefon raqamini to'g'ri kiriting");
    if (message.trim().length < 5) return setErr("Xabar juda qisqa");

    const payload = {
      name: name.trim(),
      phone: phone.trim(),
      message: message.trim()
    };

    add(payload);
    setLoading(true);

    try {
      // 1. Telegramga yuborish
      await sendTg({ data: payload });

      // 2. Supabase bazasidagi "messages" jadvaliga qo'shish (Barcha adminlar ko'rishi uchun)
      const { error: dbError } = await supabase
        .from("messages")
        .insert([
          {
            user_name: `${payload.name} (${payload.phone})`,
            message: payload.message,
            created_at: new Date().toISOString()
          }
        ]);

      if (dbError) {
        console.error("Bazaga yozishda xatolik:", dbError.message);
      }

    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }

    setSent(true);
    setName(""); setPhone(""); setMessage("");
  }

  return (
    <SiteShell>
      <section className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid gap-10 lg:grid-cols-2 items-start">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-brand/40 bg-brand/10 px-3 py-1 text-xs font-medium text-brand">
              <Users className="h-3.5 w-3.5" /> 100 000+ mijoz bizga ishonadi
            </span>
            <h1 className="mt-6 font-display text-4xl md:text-5xl font-bold">Bizning mijozlar</h1>
            <p className="mt-3 text-muted-foreground">
              Sizni qiziqtirayotgan telefon yoki xizmat haqida savolingiz bo'lsa —
              raqamingizni qoldiring, biz ko'rib chiqib qo'ng'iroq qilamiz.
            </p>

            <div className="mt-6 space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-brand mt-0.5" />
                <span>Shaxsiy ma'lumotlaringiz faqat sizga qo'ng'iroq qilish uchun ishlatiladi.</span>
              </div>
              <div className="flex items-start gap-3">
                <MessageCircle className="h-5 w-5 text-brand mt-0.5" />
                <span>Sizga <b>{SITE.hours}</b> orasida javob beriladi.</span>
              </div>
            </div>
          </div>

          <form onSubmit={submit} className="rounded-2xl border border-border bg-card p-6 md:p-8 space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Ism</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ismingiz"
                className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-brand"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Telefon raqam</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+998 __ ___ __ __"
                className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-brand"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Sizni qiziqtiradigan narsa</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                placeholder="Masalan: iPhone 15 Pro Max narxi va muddatli to'lov shartlari"
                className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-brand resize-none"
              />
            </div>

            {err && <div className="text-sm text-destructive">{err}</div>}
            {sent && <div className="text-sm text-emerald-400">Rahmat! Xabaringiz qabul qilindi, tez orada bog'lanamiz.</div>}

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-brand-foreground shadow-[var(--shadow-glow)] hover:scale-[1.02] transition-transform disabled:opacity-60 disabled:hover:scale-100"
            >
              {loading ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Yuborilmoqda...</>
              ) : (
                <><Send className="h-4 w-4" /> Xabar yuborish</>
              )}
            </button>
          </form>
        </div>
      </section>
    </SiteShell>
  );
}