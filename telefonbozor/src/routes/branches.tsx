import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Clock, Phone } from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import { BRANCHES } from "@/lib/site-data";

export const Route = createFileRoute("/branches")({
  head: () => ({
    meta: [
      { title: "Filiallar — Telefon Bozor" },
      { name: "description", content: "Telefon Bozor do'konlarining Urganch shahridagi filiallari va manzil ma'lumotlari." },
    ],
  }),
  component: BranchesPage,
});

function BranchesPage() {
  return (
    <SiteShell>
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <h1 className="font-display text-4xl md:text-5xl font-bold">Filiallarimiz</h1>
        <p className="mt-2 text-muted-foreground">
          Urganch shahri bo'ylab {BRANCHES.length} ta filial sizga xizmatda.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {BRANCHES.map((b, index) => (
            <div
              key={b.id}
              className="relative rounded-2xl border border-border bg-card p-6 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-brand">
                    Filial #{index + 1}
                  </span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 text-brand">
                    <MapPin className="h-5 w-5" />
                  </div>
                </div>

                <h3 className="font-display text-xl font-bold">{b.name}</h3>

                <div className="space-y-2 text-sm text-muted-foreground pt-2">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="h-4 w-4 text-brand shrink-0 mt-0.5" />
                    <span>{b.address}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Clock className="h-4 w-4 text-brand shrink-0" />
                    <span>{b.hours}</span>
                  </div>
                  {b.phone && (
                    <div className="flex items-center gap-2.5">
                      <Phone className="h-4 w-4 text-brand shrink-0" />
                      <span>{b.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}