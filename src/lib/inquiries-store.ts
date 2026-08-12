import { useEffect, useState } from "react";

export type Inquiry = {
  id: string;
  name: string;
  phone: string;
  message: string;
  createdAt: number;
  status: "new" | "answered";
};

const KEY = "tb_inquiries_v1";

function read(): Inquiry[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]") as Inquiry[];
  } catch {
    return [];
  }
}

function write(list: Inquiry[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(list));
  window.dispatchEvent(new CustomEvent("tb:inquiries-updated"));
}

export function useInquiries() {
  const [items, setItems] = useState<Inquiry[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setItems(read());
    setReady(true);
    const h = () => setItems(read());
    window.addEventListener("tb:inquiries-updated", h);
    window.addEventListener("storage", h);
    return () => {
      window.removeEventListener("tb:inquiries-updated", h);
      window.removeEventListener("storage", h);
    };
  }, []);

  return {
    items,
    ready,
    add: (i: Omit<Inquiry, "id" | "createdAt" | "status">) => {
      const next: Inquiry = {
        ...i,
        id: `i${Date.now()}`,
        createdAt: Date.now(),
        status: "new",
      };
      write([next, ...read()]);
    },
    markAnswered: (id: string) => {
      write(read().map((x) => (x.id === id ? { ...x, status: "answered" } : x)));
    },
    remove: (id: string) => {
      write(read().filter((x) => x.id !== id));
    },
  };
}