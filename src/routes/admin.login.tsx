import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Lock, User, KeyRound, ShieldAlert, X, CheckCircle2 } from "lucide-react";
import { useAdminAuth } from "@/lib/admin-auth";

export const Route = createFileRoute("/admin/login")({
  head: () => ({ meta: [{ title: "Admin Login — Telefon Bozor" }] }),
  component: AdminLogin,
});

function AdminLogin() {
  const { login, authed, ready } = useAdminAuth();
  const navigate = useNavigate();
  const [l, setL] = useState("");
  const [p, setP] = useState("");
  const [err, setErr] = useState("");

  // Parolni unutdingizmi modali
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [step, setStep] = useState<"secret" | "reset">("secret");

  const [secretKey, setSecretKey] = useState("");
  const [secretError, setSecretError] = useState("");

  const [newLogin, setNewLogin] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetError, setResetError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (ready && authed) navigate({ to: "/admin" });
  }, [ready, authed, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = login(l, p);
    if (ok) {
      navigate({ to: "/admin" });
    } else {
      setErr("Login yoki parol noto'g'ri!");
    }
  };

  const handleVerifySecret = (e: React.FormEvent) => {
    e.preventDefault();
    if (secretKey.trim() === "ggggg") {
      setSecretError("");
      setStep("reset");
    } else {
      setSecretError("Kalit so'z noto'g'ri! Qaytadan urinib ko'ring.");
    }
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLogin.trim()) {
      setResetError("Yangi loginni kiriting!");
      return;
    }
    if (newPassword.length < 4) {
      setResetError("Parol kamida 4 ta belgidan iborat bo'lishi kerak!");
      return;
    }
    if (newPassword !== confirmPassword) {
      setResetError("Parollar mos kelmadi!");
      return;
    }

    localStorage.setItem("tb_admin_login", newLogin.trim());
    localStorage.setItem("tb_admin_password", newPassword);

    setResetError("");
    setSuccessMsg("Ma'lumotlar o'zgartirildi! Yangi loginingiz bilan kiring.");

    setTimeout(() => {
      setShowForgotModal(false);
      setStep("secret");
      setSecretKey("");
      setNewLogin("");
      setNewPassword("");
      setConfirmPassword("");
      setSuccessMsg("");
    }, 1500);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand text-brand-foreground font-display text-xl font-bold shadow-lg shadow-brand/20">
            tb
          </div>
          <h2 className="mt-4 font-display text-2xl font-bold">Admin panelga kirish</h2>
          <p className="mt-1 text-xs text-muted-foreground">Telefon Bozor boshqaruv tizimi</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-xl">
          {err && (
            <div className="flex items-center gap-2 rounded-xl bg-destructive/10 p-3 text-xs font-semibold text-destructive">
              <ShieldAlert className="h-4 w-4 shrink-0" />
              <span>{err}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Login</label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                required
                value={l}
                onChange={(e) => setL(e.target.value)}
                placeholder="Login..."
                className="w-full rounded-xl border border-border bg-background pl-9 pr-4 py-2.5 text-sm outline-none focus:border-brand font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Parol</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                type="password"
                required
                value={p}
                onChange={(e) => setP(e.target.value)}
                placeholder="Parol..."
                className="w-full rounded-xl border border-border bg-background pl-9 pr-4 py-2.5 text-sm outline-none focus:border-brand font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-brand py-2.5 text-sm font-bold text-brand-foreground shadow-md hover:brightness-110 transition-all"
          >
            Kirish
          </button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => {
                setStep("secret");
                setSecretKey("");
                setSecretError("");
                setShowForgotModal(true);
              }}
              className="text-xs text-muted-foreground hover:text-brand font-medium transition-colors"
            >
              Parolni unutdingizmi?
            </button>
          </div>
        </form>
      </div>

      {/* Parolni Tiklash Modali */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setShowForgotModal(false)}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <h3 className="font-display text-lg font-bold flex items-center gap-2">
                <KeyRound className="h-5 w-5 text-brand" /> Parolni tiklash
              </h3>
              <button type="button" onClick={() => setShowForgotModal(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>

            {step === "secret" && (
              <form onSubmit={handleVerifySecret} className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Tasdiqlash uchun kalit so'zni kiriting:
                  </label>
                  <input
                    type="password"
                    required
                    value={secretKey}
                    onChange={(e) => setSecretKey(e.target.value)}
                    placeholder="Kalit so'z..."
                    className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-brand font-medium"
                  />
                  {secretError && <p className="mt-1.5 text-xs text-destructive font-semibold">{secretError}</p>}
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setShowForgotModal(false)} className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-muted">
                    Bekor qilish
                  </button>
                  <button type="submit" className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground hover:brightness-110">
                    Tekshirish
                  </button>
                </div>
              </form>
            )}

            {step === "reset" && (
              <form onSubmit={handleResetPassword} className="space-y-4 pt-2">
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
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Yangi Parolni qayta kiriting</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Parolni qayta kiriting..."
                    className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-brand font-medium"
                  />
                </div>

                {resetError && <p className="text-xs text-destructive font-semibold">{resetError}</p>}
                {successMsg && <p className="text-xs text-emerald-500 font-bold flex items-center gap-1"><CheckCircle2 className="h-4 w-4" /> {successMsg}</p>}

                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setShowForgotModal(false)} className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-muted">
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
    </div>
  );
}