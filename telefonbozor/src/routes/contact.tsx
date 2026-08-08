import { createFileRoute } from "@tanstack/react-router";
import { Phone, Instagram, Send, MapPin, UserCheck } from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import { SITE, BRANCHES } from "@/lib/site-data";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Aloqa — Telefon Bozor" },
      { name: "description", content: "Telefon Bozor bilan bog'lanish. Telefon, Instagram va Telegram orqali." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <SiteShell>
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <h1 className="font-display text-4xl md:text-5xl font-bold">Biz bilan bog'laning</h1>
        <p className="mt-2 text-muted-foreground">Savol yoki buyurtma uchun quyidagi kanallar orqali murojaat qiling.</p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Telefon */}
          <a href={SITE.phoneHref} className="group rounded-2xl border border-border bg-card p-6 hover:border-brand transition-colors">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand text-brand-foreground group-hover:shadow-[var(--shadow-glow)]">
              <Phone className="h-6 w-6" />
            </div>
            <div className="mt-4 text-xs uppercase tracking-wider text-muted-foreground">Telefon</div>
            <div className="mt-1 font-semibold text-sm">{SITE.phone}</div>
          </a>

          {/* Instagram */}
          <a href={SITE.instagramUrl} target="_blank" rel="noreferrer" className="group rounded-2xl border border-border bg-card p-6 hover:border-brand transition-colors">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand text-brand-foreground group-hover:shadow-[var(--shadow-glow)]">
              <Instagram className="h-6 w-6" />
            </div>
            <div className="mt-4 text-xs uppercase tracking-wider text-muted-foreground">Instagram</div>
            <div className="mt-1 font-semibold text-sm">@{SITE.instagram}</div>
          </a>

          {/* Telegram Kanal */}
          <a href={SITE.telegramChannelUrl} target="_blank" rel="noreferrer" className="group rounded-2xl border border-border bg-card p-6 hover:border-brand transition-colors">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand text-brand-foreground group-hover:shadow-[var(--shadow-glow)]">
              <Send className="h-6 w-6" />
            </div>
            <div className="mt-4 text-xs uppercase tracking-wider text-muted-foreground">Telegram Kanal</div>
            <div className="mt-1 font-semibold text-sm">@{SITE.telegramChannel}</div>
          </a>

          {/* Telegram Admin */}
          <a href={SITE.telegramAdminUrl} target="_blank" rel="noreferrer" className="group rounded-2xl border border-border bg-card p-6 hover:border-brand transition-colors">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand text-brand-foreground group-hover:shadow-[var(--shadow-glow)]">
              <UserCheck className="h-6 w-6" />
            </div>
            <div className="mt-4 text-xs uppercase tracking-wider text-muted-foreground">Telegram Admin</div>
            <div className="mt-1 font-semibold text-sm">@{SITE.telegramAdmin}</div>
          </a>
        </div>

        <div className="mt-12">
          <h2 className="font-display text-2xl font-bold">Manzillar</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {BRANCHES.map((b) => (
              <div key={b.id} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
                <MapPin className="h-5 w-5 text-brand mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-sm font-semibold">{b.name}</div>
                  <div className="text-sm text-muted-foreground">{b.address}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}