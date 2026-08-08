import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { CustomCursor } from "./CustomCursor";
import { AiAdvisor } from "./AiAdvisor";

export function SiteShell({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [isAiOpen, setIsAiOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "a") {
        e.preventDefault();
        navigate({ to: "/admin/login" });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate]);

  return (
    <div className="relative min-h-screen flex flex-col bg-background text-foreground overflow-hidden">
      {/* Ambient background stack */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.22_0.03_260)_0%,oklch(0.14_0.01_260)_55%,oklch(0.10_0.01_260)_100%)]" />
        <div className="absolute inset-0 bg-grid mask-radial-fade opacity-60" />
        <div className="absolute -top-40 -left-32 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,oklch(0.85_0.19_95/0.35),transparent_70%)] blur-3xl animate-aurora" />
        <div className="absolute top-1/3 -right-40 h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,oklch(0.65_0.18_50/0.28),transparent_70%)] blur-3xl animate-aurora-2" />
        <div className="absolute bottom-0 left-1/3 h-[480px] w-[480px] rounded-full bg-[radial-gradient(circle,oklch(0.78_0.18_75/0.22),transparent_70%)] blur-3xl animate-aurora" />
        <div className="absolute inset-0 bg-noise opacity-[0.08] mix-blend-overlay" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/60 to-transparent" />
      </div>
      <CustomCursor />

      {/* Navbar ga AI ni ochish funksiyasi berildi */}
      <Navbar onOpenAi={() => setIsAiOpen(true)} />

      <main className="flex-1 relative z-0">{children}</main>

      {/* AI Jon komponenti */}
      <AiAdvisor
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
        onOpen={() => setIsAiOpen(true)}
      />

      <Footer />
    </div>
  );
}