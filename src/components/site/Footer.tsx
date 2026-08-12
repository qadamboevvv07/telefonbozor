import { Link } from "@tanstack/react-router";
import { Instagram, Send, Phone, MapPin, Code2, UserCheck } from "lucide-react";
import { SITE, BRANCHES } from "@/lib/site-data";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border bg-card/40">
      <div className="mx-auto max-w-[1400px] px-4 py-14 sm:px-6 lg:px-8 grid gap-10 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand text-brand-foreground font-display font-bold">
              tb
            </div>
            <div className="font-display text-lg font-semibold">
              Telefon <span className="text-brand">Bozor</span>
            </div>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Xorazm bo'ylab ishonchli telefon va aksessuarlar do'koni.
          </p>
          {SITE.hours && (
            <p className="mt-2 text-xs text-muted-foreground">
              Ish vaqti: <span className="text-foreground">{SITE.hours}</span>
            </p>
          )}
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Sahifalar</h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link to="/" className="hover:text-brand">Bosh sahifa</Link></li>
            <li><Link to="/products" className="hover:text-brand">Mahsulotlar</Link></li>
            <li><Link to="/compare" className="hover:text-brand">Taqqoslash</Link></li>
            <li><Link to="/installment" className="hover:text-brand">Muddatli to'lov</Link></li>
            <li><Link to="/customers" className="hover:text-brand">Bizning mijozlar</Link></li>
            <li><Link to="/branches" className="hover:text-brand">Filiallar</Link></li>
            <li><Link to="/contact" className="hover:text-brand">Aloqa</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Filiallar</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            {BRANCHES?.map((b) => (
              <li key={b.id} className="flex gap-2">
                <MapPin className="h-4 w-4 text-brand flex-shrink-0 mt-0.5" />
                <span>{b.address}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Aloqa</h4>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <a href={SITE.phoneHref} className="inline-flex items-center gap-2 hover:text-brand">
                <Phone className="h-4 w-4 text-brand" /> {SITE.phone}
              </a>
            </li>
            <li>
              <a href={SITE.instagramUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-brand">
                <Instagram className="h-4 w-4 text-brand" /> Instagram: @{SITE.instagram}
              </a>
            </li>
            <li>
              <a href={SITE.telegramChannelUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-brand">
                <Send className="h-4 w-4 text-brand" /> Telegram Kanal: @{SITE.telegramChannel}
              </a>
            </li>
            <li>
              <a href={SITE.telegramAdminUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-brand">
                <UserCheck className="h-4 w-4 text-brand" /> Telegram Admin: @{SITE.telegramAdmin}
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* DASTURCHI MA'LUMOTLARI VA COPYRIGHT */}
      <div className="border-t border-border py-6">
        <div className="mx-auto max-w-[1400px] px-4 flex flex-col items-center justify-center gap-4 text-center">

          <p className="text-xs sm:text-sm text-muted-foreground">
            © {new Date().getFullYear()} Telefon Bozor. Barcha huquqlar himoyalangan
            <Link
              to="/admin/login"
              className="inline-block px-1 opacity-20 hover:opacity-100 transition-opacity cursor-default hover:cursor-pointer select-none"
              tabIndex={-1}
            >
              .
            </Link>
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2.5 text-xs sm:text-sm text-muted-foreground bg-secondary/60 px-5 py-2.5 rounded-full border border-border/80 shadow-sm">
            <Code2 className="h-4 w-4 text-brand" />
            <span className="font-medium text-foreground">Dasturchi:</span>
            <a
              href="https://t.me/qadamboyevvv_07"
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-brand hover:underline transition-all"
            >
              @qadamboyevvv_07
            </a>
            <span className="opacity-40">•</span>
            <a
              href="tel:+998948460914"
              className="font-medium hover:text-brand transition-colors"
            >
              +998 94 846 09 14
            </a>
          </div>

        </div>
      </div>
    </footer>
  );
}