import { useEffect, useRef, useState } from "react";
import { Smartphone } from "lucide-react"; //

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    setEnabled(fine);
    if (!fine) return;
    document.body.setAttribute("data-custom-cursor", "1");

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let rx = x;
    let ry = y;

    const onMove = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${x - 8}px, ${y - 8}px, 0)`;
      }
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      const interactive = t.closest("a,button,[role='button'],input,textarea,select,label");
      if (ringRef.current) {
        ringRef.current.dataset.hover = interactive ? "1" : "0";
      }
    };

    let raf = 0;
    const tick = () => {
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${rx - 18}px, ${ry - 18}px, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      document.body.removeAttribute("data-custom-cursor");
    };
  }, []);

  if (!enabled) return null;

  return (
    <>

      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[100] flex items-center justify-center text-brand"
        style={{ filter: "drop-shadow(0 0 8px oklch(0.85 0.19 95 / 0.9))" }}
      >
        <Smartphone className="w-4 h-4 animate-pulse" />
      </div>


      <div
        ref={ringRef}
        data-hover="0"
        className="pointer-events-none fixed left-0 top-0 z-[100] h-9 w-9 rounded-full border border-brand/60 transition-[width,height,border-color,background-color] duration-200 data-[hover=1]:h-12 data-[hover=1]:w-12 data-[hover=1]:-ml-1.5 data-[hover=1]:-mt-1.5 data-[hover=1]:bg-brand/10"
      />
    </>
  );
}