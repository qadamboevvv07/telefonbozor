import { useEffect, useState, useRef } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Plus, Trash2, LogOut, Package, Edit3, X, ExternalLink, MessageSquare,
  Phone, CheckCircle2, Camera, Upload, KeyRound, Lock, Megaphone, CheckCircle, XCircle, Eye
} from "lucide-react";
import { useAdminAuth } from "@/lib/admin-auth";
import { useProducts, formatPrice, type Product } from "@/lib/products-store";
import { useInquiries } from "@/lib/inquiries-store";
import { useAnnouncements } from "@/lib/announcements-store";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "Admin — Telefon Bozor" }] }),
  component: AdminPanel,
});

const PHONE_MODELS = [
  "iPhone 15 Pro Max", "iPhone 15 Pro", "iPhone 15 Plus", "iPhone 15",
  "iPhone 14 Pro Max", "iPhone 14 Pro", "iPhone 14", "iPhone 13 Pro Max",
  "iPhone 13", "iPhone 12", "iPhone 11", "Samsung Galaxy S24 Ultra",
  "Samsung Galaxy S24+", "Samsung Galaxy S24", "Samsung Galaxy S23 Ultra",
  "Samsung Galaxy A55", "Samsung Galaxy A35", "Samsung Galaxy A15",
  "Xiaomi 14 Ultra", "Xiaomi 14", "Redmi Note 13 Pro+", "Redmi Note 13 Pro",
  "Redmi Note 13", "Redmi 13C", "Poco X6 Pro",
];

const STORAGE_OPTIONS = ["64 GB", "128 GB", "256 GB", "512 GB", "1 TB", "Mavjud emas"];
const COLOR_OPTIONS = ["Black (Qora)", "White (Oq)", "Titanium / Natural", "Blue (Ko'k)", "Gold (Tilla)", "Green (Yashil)", "Purple (Binafsha)", "Boshqa"];

interface ExtendedFormState extends Omit<Product, "id"> {
  model?: string;
  storage?: string;
  color?: string;
}

const emptyForm: ExtendedFormState = {
  name: "",
  category: "Telefon",
  price: 0,
  image: "",
  description: "",
  inStock: true,
  storage: "128 GB",
  color: "Black (Qora)",
};

function AdminPanel() {
  const { authed, ready, logout } = useAdminAuth();
  const navigate = useNavigate();
  const { products, add, update, remove } = useProducts();
  const { items: inquiries, markAnswered, remove: removeInquiry } = useInquiries();
  const { announcements, addAnnouncement, deleteAnnouncement, toggleStatus } = useAnnouncements();

  const [editing, setEditing] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<ExtendedFormState>(emptyForm);
  const [tab, setTab] = useState<"products" | "inquiries" | "announcements">("products");
  const [visitorCount, setVisitorCount] = useState<number>(0);

  useEffect(() => {
    const count = parseInt(localStorage.getItem("tb_total_visitors") || "0", 10);
    setVisitorCount(count);
  }, []);

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authStep, setAuthStep] = useState<"secret" | "new_credentials">("secret");
  const [secretKeyInput, setSecretKeyInput] = useState("");
  const [secretError, setSecretError] = useState("");
  const [newLogin, setNewLogin] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [ancTitle, setAncTitle] = useState("");
  const [ancText, setAncText] = useState("");
  const [ancType, setAncType] = useState<'job' | 'info' | 'promo'>("job");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ready && !authed) navigate({ to: "/admin/login" });
  }, [ready, authed, navigate]);

  if (!ready || !authed) return null;

  const openNew = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({
      name: p.name,
      category: p.category,
      price: p.price,
      image: p.image,
      description: p.description,
      inStock: p.inStock,
      storage: (p as any).storage || "128 GB",
      color: (p as any).color || "Black (Qora)",
    });
    setShowForm(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Supabase bazasi bilan to'g'ri ishlaydigan tahrirlash va qo'shish funksiyasi
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    const finalProductData = {
      name: form.name,
      brand: form.category,
      price: form.price,
      image: form.image || "/placeholder-phone.png",
      specs: `${form.storage || '128 GB'} | ${form.color || 'Black (Qora)'}`,
    };

    if (editing) {
      const { error } = await supabase
        .from("Products")
        .update(finalProductData)
        .eq("id", editing.id);

      if (error) {
        console.error("Tahrirlashda xatolik:", error.message);
        alert("Xatolik yuz berdi: " + error.message);
      } else {
        update(editing.id, {
          ...editing,
          name: form.name,
          category: form.category,
          price: form.price,
          image: finalProductData.image,
          inStock: form.inStock,
          description: finalProductData.specs,
        });
        alert("Muvaffaqiyatli tahrirlandi!");
      }
    } else {
      const { error } = await supabase
        .from("Products")
        .insert([finalProductData]);

      if (error) {
        console.error("Qo'shishda xatolik:", error.message);
        alert("Xatolik yuz berdi: " + error.message);
      } else {
        add({
          name: form.name,
          category: form.category,
          price: form.price,
          image: finalProductData.image,
          inStock: form.inStock,
          description: finalProductData.specs,
        });
        alert("Muvaffaqiyatli qo'shildi!");
      }
    }

    setShowForm(false);
  };

  const handleVerifySecret = (e: React.FormEvent) => {
    e.preventDefault();
    if (secretKeyInput.trim() === "ggggg") {
      setSecretError("");
      setAuthStep("new_credentials");
    } else {
      setSecretError("Kalit so'z noto'g'ri!");
    }
  };

  const handleSaveCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLogin.trim()) { setPasswordError("Loginni kiriting!"); return; }
    if (newPassword.length < 4) { setPasswordError("Parol kamida 4 belgidan iborat bo'lsin!"); return; }
    if (newPassword !== confirmPassword) { setPasswordError("Parollar mos kelmadi!"); return; }

    localStorage.setItem("tb_admin_login", newLogin.trim());
    localStorage.setItem("tb_admin_password", newPassword);

    setPasswordError("");
    setSuccessMsg("Muvaffaqiyatli o'zgartirildi!");

    setTimeout(() => {
      setShowAuthModal(false);
      setAuthStep("secret");
      setSecretKeyInput("");
      setNewLogin("");
      setNewPassword("");
      setConfirmPassword("");
      setSuccessMsg("");
    }, 1500);
  };

  const handleAddAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ancTitle || !ancText) return;
    addAnnouncement({ title: ancTitle, text: ancText, type: ancType, isActive: true });
    setAncTitle("");
    setAncText("");
  };

  const stats = {
    total: products.length,
    phones: products.filter((p) => p.category === "Telefon").length,
    accessories: products.filter((p) => p.category === "Aksesuar").length,
    announcements: announcements.length,
    visitors: visitorCount,
  };
  const newInquiries = inquiries.filter((i) => i.status === "new").length;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/60 backdrop-blur-xl sticky top-0 z-40">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-brand-foreground font-display font-bold">
              tb
            </div>
            <div>
              <div className="font-display font-semibold leading-tight">Admin panel</div>
              <div className="text-xs text-muted-foreground">Telefon Bozor</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setAuthStep("secret");
                setSecretKeyInput("");
                setSecretError("");
                setPasswordError("");
                setShowAuthModal(true);
              }}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm hover:border-brand hover:text-brand transition-all"
            >
              <KeyRound className="h-4 w-4 text-brand" /> Login & Parol
            </button>

            <Link
              to="/"
              className="hidden sm:inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm hover:border-brand"
            >
              <ExternalLink className="h-4 w-4" /> Saytga
            </Link>

            <button
              onClick={() => {
                logout();
                navigate({ to: "/admin/login" });
              }}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm hover:border-destructive hover:text-destructive"
            >
              <LogOut className="h-4 w-4" /> Chiqish
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {[
            { label: "Jami mahsulot", value: stats.total },
            { label: "Telefonlar", value: stats.phones },
            { label: "E'lonlar", value: stats.announcements },
            { label: "Yangi murojaat", value: newInquiries },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border border-border bg-card p-5">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</div>
              <div className="mt-2 font-display text-3xl font-bold text-brand">{s.value}</div>
            </div>
          ))}

          <div className="rounded-2xl border border-brand/40 bg-card p-5 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Sayt Tashriflari
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand/10 text-brand">
                <Eye className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <div className="font-display text-3xl font-bold text-brand">
                {stats.visitors} <span className="text-xs font-normal text-muted-foreground">ta</span>
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                Jonli
              </span>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-2 border-b border-border">
          <button
            onClick={() => setTab("products")}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-colors ${tab === "products" ? "border-brand text-brand" : "border-transparent text-muted-foreground hover:text-foreground"}`}
          >
            <Package className="h-4 w-4 inline mr-1.5" /> Mahsulotlar
          </button>

          <button
            onClick={() => setTab("announcements")}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-colors ${tab === "announcements" ? "border-brand text-brand" : "border-transparent text-muted-foreground hover:text-foreground"}`}
          >
            <Megaphone className="h-4 w-4 inline mr-1.5" /> E'lonlar (Vakansiya)
          </button>

          <button
            onClick={() => setTab("inquiries")}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-colors ${tab === "inquiries" ? "border-brand text-brand" : "border-transparent text-muted-foreground hover:text-foreground"}`}
          >
            <MessageSquare className="h-4 w-4 inline mr-1.5" /> Mijozlar murojaati
            {newInquiries > 0 && (
              <span className="ml-2 inline-flex items-center justify-center rounded-full bg-brand text-brand-foreground text-[10px] h-5 min-w-5 px-1.5 font-bold">{newInquiries}</span>
            )}
          </button>
        </div>

        {tab === "products" && (
          <>
            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-brand" />
                <h2 className="font-display text-xl font-bold">Mahsulotlar</h2>
              </div>
              <button
                onClick={openNew}
                className="inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground shadow-md hover:brightness-110"
              >
                <Plus className="h-4 w-4" /> Yangi qo'shish
              </button>
            </div>

            <div className="mt-4 overflow-hidden rounded-2xl border border-border">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-card text-muted-foreground">
                    <tr className="text-left">
                      <th className="p-3 font-medium">Rasm</th>
                      <th className="p-3 font-medium">Nomi</th>
                      <th className="p-3 font-medium">Kategoriya</th>
                      <th className="p-3 font-medium">Narx</th>
                      <th className="p-3 font-medium">Status</th>
                      <th className="p-3 font-medium text-right">Amallar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={p.id} className="border-t border-border hover:bg-card/50">
                        <td className="p-3">
                          <img src={p.image || "/placeholder-phone.png"} alt={p.name} className="h-12 w-12 rounded-lg object-cover" />
                        </td>
                        <td className="p-3 font-medium">{p.name}</td>
                        <td className="p-3 text-muted-foreground">{p.category}</td>
                        <td className="p-3 text-brand font-semibold">{formatPrice(p.price)}</td>
                        <td className="p-3">
                          {p.inStock ? (
                            <span className="rounded-full bg-emerald-500/10 text-emerald-400 px-2 py-1 text-xs">Mavjud</span>
                          ) : (
                            <span className="rounded-full bg-destructive/10 text-destructive px-2 py-1 text-xs">Yo'q</span>
                          )}
                        </td>
                        <td className="p-3">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => openEdit(p)}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border hover:border-brand hover:text-brand"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={async () => {
                                if (confirm(`"${p.name}" ni o'chirmoqchimisiz?`)) {
                                  await supabase.from("Products").delete().eq("id", p.id);
                                  remove(p.id);
                                }
                              }}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border hover:border-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {tab === "announcements" && (
          <div className="mt-6 space-y-6">
            <h2 className="font-display text-xl font-bold flex items-center gap-2">
              <Megaphone className="h-5 w-5 text-brand" /> E'lonlar Boshqaruvi
            </h2>

            <form onSubmit={handleAddAnnouncement} className="bg-card p-5 rounded-2xl border border-border space-y-4 shadow-md">
              <h3 className="font-semibold text-base">Yangi e'lon chop etish</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">E'lon Sarlavhasi</label>
                  <input
                    type="text"
                    value={ancTitle}
                    onChange={(e) => setAncTitle(e.target.value)}
                    placeholder="Masalan: Sotuvchi kerak yoki Chegirma!"
                    className="w-full bg-background px-3 py-2 rounded-xl text-sm border border-border focus:outline-none focus:border-brand"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs text-muted-foreground block mb-1">E'lon Turi</label>
                  <select
                    value={ancType}
                    onChange={(e) => setAncType(e.target.value as any)}
                    className="w-full bg-background px-3 py-2 rounded-xl text-sm border border-border focus:outline-none focus:border-brand"
                  >
                    <option value="job">💼 Ish e'loni (Vakansiya)</option>
                    <option value="info">ℹ️ Muhim ma'lumot</option>
                    <option value="promo">🔥 Aksiya / Chegirma</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-muted-foreground block mb-1">E'lon Matni va Aloqa</label>
                <textarea
                  rows={3}
                  value={ancText}
                  onChange={(e) => setAncText(e.target.value)}
                  placeholder="Tafsilotlar va aloqa..."
                  className="w-full bg-background px-3 py-2 rounded-xl text-sm border border-border focus:outline-none focus:border-brand"
                  required
                />
              </div>

              <button
                type="submit"
                className="flex items-center gap-2 bg-brand text-black font-bold px-4 py-2 rounded-xl text-sm hover:brightness-110 transition-all"
              >
                <Plus className="h-4 w-4" /> Joylash
              </button>
            </form>

            <div className="space-y-3">
              {announcements.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl border border-border bg-card/60"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-base">{item.title}</span>
                      <span className="text-xs text-muted-foreground">({item.date})</span>
                    </div>
                    <p className="text-xs text-muted-foreground whitespace-pre-wrap">{item.text}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => toggleStatus(item.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 ${
                        item.isActive ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {item.isActive ? <><CheckCircle className="h-3.5 w-3.5" /> Faol</> : <><XCircle className="h-3.5 w-3.5" /> Yashirilgan</>}
                    </button>

                    <button
                      onClick={() => { if (confirm("O'chirilsinmi?")) deleteAnnouncement(item.id); }}
                      className="p-2 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "inquiries" && (
          <div className="mt-6">
            <h2 className="font-display text-xl font-bold flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-brand" /> Mijozlar murojaati
            </h2>
            <div className="mt-4 grid gap-3">
              {inquiries.map((i) => (
                <div key={i.id} className="rounded-2xl border border-border bg-card p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{i.name}</span>
                        {i.status === "new" ? (
                          <span className="rounded-full bg-brand/15 text-brand px-2 py-0.5 text-[10px] font-bold uppercase">Yangi</span>
                        ) : (
                          <span className="rounded-full bg-emerald-500/10 text-emerald-400 px-2 py-0.5 text-[10px] font-bold uppercase">Javob berilgan</span>
                        )}
                      </div>
                      <a href={`tel:${i.phone.replace(/\s/g, "")}`} className="mt-1 inline-flex items-center gap-1.5 text-sm text-brand hover:underline">
                        <Phone className="h-3.5 w-3.5" /> {i.phone}
                      </a>
                    </div>
                    <div className="text-xs text-muted-foreground">{new Date(i.createdAt).toLocaleString("uz-UZ")}</div>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground whitespace-pre-wrap">{i.message}</p>
                  <div className="mt-4 flex gap-2">
                    {i.status === "new" && (
                      <button
                        onClick={() => markAnswered(i.id)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold hover:border-brand hover:text-brand"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" /> Javob berildi
                      </button>
                    )}
                    <button
                      onClick={() => { if (confirm("O'chirilsinmi?")) removeInquiry(i.id); }}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold hover:border-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> O'chirish
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setShowAuthModal(false)}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <h3 className="font-display text-lg font-bold flex items-center gap-2">
                <Lock className="h-5 w-5 text-brand" /> Login & Parolni o'zgartirish
              </h3>
              <button type="button" onClick={() => setShowAuthModal(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>

            {authStep === "secret" && (
              <form onSubmit={handleVerifySecret} className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Tasdiqlash kaliti:
                  </label>
                  <input
                    type="password"
                    required
                    value={secretKeyInput}
                    onChange={(e) => setSecretKeyInput(e.target.value)}
                    placeholder="Kalit so'z..."
                    className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-brand font-medium"
                  />
                  {secretError && <p className="mt-1.5 text-xs text-destructive font-semibold">{secretError}</p>}
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setShowAuthModal(false)} className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-muted">
                    Bekor qilish
                  </button>
                  <button type="submit" className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground hover:brightness-110">
                    Davom etish
                  </button>
                </div>
              </form>
            )}

            {authStep === "new_credentials" && (
              <form onSubmit={handleSaveCredentials} className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Yangi Login</label>
                  <input
                    type="text"
                    required
                    value={newLogin}
                    onChange={(e) => setNewLogin(e.target.value)}
                    placeholder="Yangi login..."
                    className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-brand font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Yangi Parol</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Yangi parol..."
                    className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-brand font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Parolni tasdiqlang</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Qayta kiriting..."
                    className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-brand font-medium"
                  />
                </div>

                {passwordError && <p className="text-xs text-destructive font-semibold">{passwordError}</p>}
                {successMsg && <p className="text-xs text-emerald-500 font-bold">{successMsg}</p>}

                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setShowAuthModal(false)} className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-muted">
                    Bekor qilish
                  </button>
                  <button type="submit" className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground hover:brightness-110">
                    Saqlash
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto" onClick={() => setShowForm(false)}>
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={submit}
            className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl my-8 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-border pb-4">
              <h3 className="font-display text-lg font-bold">
                {editing ? "Mahsulotni tahrirlash" : "Yangi mahsulot"}
              </h3>
              <button type="button" onClick={() => setShowForm(false)} className="rounded-lg p-1 text-muted-foreground hover:bg-secondary hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <Field label="Qurilma modeli">
                <input
                  type="text"
                  list="phone-models-list"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Model nomini yozing yoki tanlang..."
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-brand font-semibold"
                  required
                />
                <datalist id="phone-models-list">
                  {PHONE_MODELS.map((m) => (
                    <option key={m} value={m} />
                  ))}
                </datalist>
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Kategoriya">
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value as Product["category"] })}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-brand"
                  >
                    <option value="Telefon">Telefon</option>
                    <option value="Aksesuar">Aksesuar</option>
                    <option value="Boshqa">Boshqa</option>
                  </select>
                </Field>

                <Field label="Narx (so'm)">
                  <input
                    required
                    type="number"
                    value={form.price || ""}
                    onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                    placeholder="Masalan: 8500000"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-brand font-bold"
                  />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Xotira hajmi">
                  <select
                    value={form.storage}
                    onChange={(e) => setForm({ ...form, storage: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-brand font-medium"
                  >
                    {STORAGE_OPTIONS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </Field>

                <Field label="Rangi">
                  <select
                    value={form.color}
                    onChange={(e) => setForm({ ...form, color: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-brand font-medium"
                  >
                    {COLOR_OPTIONS.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </Field>
              </div>

              <Field label="Rasm havolasi (URL) yoki fayl yuklash">
                <div className="space-y-2">
                  <input
                    type="text"
                    value={form.image}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                    placeholder="https://..."
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-brand"
                  />

                  <div className="flex gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-xs font-semibold hover:border-brand hover:text-brand"
                    >
                      <Upload className="h-4 w-4" /> Fayldan yuklash
                    </button>

                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      ref={cameraInputRef}
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => cameraInputRef.current?.click()}
                      className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-xs font-semibold hover:border-brand hover:text-brand"
                    >
                      <Camera className="h-4 w-4" /> Kameradan tushirish
                    </button>
                  </div>

                  {form.image && (
                    <div className="mt-2 flex items-center justify-center rounded-lg border border-border bg-background p-2">
                      <img src={form.image} alt="Preview" className="h-24 object-contain rounded-md" />
                    </div>
                  )}
                </div>
              </Field>

              <Field label="Tavsif (ixtiyoriy)">
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Qo'shimcha ma'lumotlar..."
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-brand"
                />
              </Field>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="inStock"
                  checked={form.inStock}
                  onChange={(e) => setForm({ ...form, inStock: e.target.checked })}
                  className="h-4 w-4 rounded border-border text-brand focus:ring-brand accent-brand"
                />
                <label htmlFor="inStock" className="text-sm font-medium">
                  Sotuvda mavjud (In Stock)
                </label>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2 pt-4 border-t border-border">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-secondary"
              >
                Bekor qilish
              </button>
              <button
                type="submit"
                className="rounded-lg bg-brand px-4 py-2 text-sm font-bold text-brand-foreground hover:brightness-110"
              >
                Saqlash
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-medium text-muted-foreground block mb-1">
        {label}
      </label>
      {children}
    </div>
  );
}