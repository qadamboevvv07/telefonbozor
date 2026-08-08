import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import { useProducts, formatPrice, type Product } from "@/lib/products-store";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "Mahsulotlar — Telefon Bozor" },
      { name: "description", content: "Telefonlar, aksesuarlar va gadjetlar katalogi. Sifatli mahsulotlar arzon narxda." },
    ],
  }),
  component: ProductsPage,
});

const cats: (Product["category"] | "Barchasi")[] = ["Barchasi", "Telefon", "Aksesuar", "Boshqa"];

function ProductsPage() {
  const { products } = useProducts();
  const [cat, setCat] = useState<(typeof cats)[number]>("Barchasi");
  const [q, setQ] = useState("");

  const filtered = useMemo(
    () =>
      products.filter(
        (p) =>
          (cat === "Barchasi" || p.category === cat) &&
          p.name.toLowerCase().includes(q.toLowerCase()),
      ),
    [products, cat, q],
  );

  return (
    <SiteShell>
      <section className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <h1 className="font-display text-4xl md:text-5xl font-bold">Mahsulotlar</h1>
            <p className="mt-2 text-muted-foreground">Telefonlar, aksesuarlar va boshqa texnika.</p>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Qidirish..."
              className="w-full rounded-full border border-border bg-card pl-9 pr-4 py-2.5 text-sm outline-none focus:border-brand"
            />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {cats.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                cat === c
                  ? "border-brand bg-brand text-brand-foreground"
                  : "border-border bg-card text-muted-foreground hover:text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((p) => (
            <div key={p.id} className="group overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-brand hover:-translate-y-1">
              <div className="aspect-square overflow-hidden bg-secondary">
                <img src={p.image} alt={p.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-brand">{p.category}</span>
                  {p.inStock ? (
                    <span className="text-xs text-emerald-400">Mavjud</span>
                  ) : (
                    <span className="text-xs text-destructive">Yo'q</span>
                  )}
                </div>
                <h3 className="mt-1 font-medium line-clamp-1">{p.name}</h3>
                <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{p.description}</p>
                <div className="mt-3 flex items-center justify-between">
                  <div className="font-display font-bold text-brand">{formatPrice(p.price)}</div>
                  <a
                    href="tel:+998937577919"
                    className="rounded-full bg-brand/10 border border-brand/30 px-3 py-1.5 text-xs font-semibold text-brand hover:bg-brand hover:text-brand-foreground transition-colors"
                    title="Filialga qo'ng'iroq qiling"
                  >
                    Qo'ng'iroq
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="mt-16 text-center text-muted-foreground">Mahsulot topilmadi.</div>
        )}
      </section>
    </SiteShell>
  );
}