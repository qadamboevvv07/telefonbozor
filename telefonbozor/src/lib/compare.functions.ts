import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const CompareInput = z.object({
  phoneA: z.string().min(1).max(120),
  phoneB: z.string().min(1).max(120),
});

export type CompareSpec = {
  name: string;
  image?: string;
  release: string;
  display: string;
  processor: string;
  gpu?: string;
  ram: string;
  storage: string;
  mainCamera: string;
  frontCamera: string;
  video?: string;
  battery: string;
  charging?: string;
  os: string;
  connectivity?: string;
  build?: string;
  extras?: string;
  advantages: string[];
};

export type CompareResult = {
  phoneA: CompareSpec;
  phoneB: CompareSpec;
  categories: Array<{ name: string; winner: "A" | "B" | "Teng"; note: string }>;
  verdict: { winner: "A" | "B" | "Teng"; summary: string };
};

export type CompareError = { error: "not_found"; message: string };
export type CompareResponse = CompareResult | CompareError;

export const comparePhones = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => CompareInput.parse(data))
  .handler(async ({ data }): Promise<CompareResponse> => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("AI xizmati sozlanmagan.");

    const system = `Siz tajribali smartfon ekspertisiz. O'zbek tilida javob berasiz.
Foydalanuvchi telefon nomlarini qisqacha, xato yoki har xil formatda yozishi mumkin (masalan: "redmi a3", "s24", "iphone 16"). Siz ularni o'zingiz tushunib, eng mos keladigan haqiqiy rasmiy modellar sifatida qabul qilib solishtirishingiz shart. "Topilmadi" deb xato berishga shoshilmang, qaysi model nazarda tutilganini o'zingiz aniqlang.

FAQAT quyidagi JSON strukturani qaytaring, boshqa hech qanday matn yozmang:

{
  "phoneA": {
    "name": "to'liq rasmiy nomi",
    "image": "rasm URL manzili",
    "release": "yil, oy",
    "display": "ekran",
    "processor": "chipset",
    "gpu": "GPU",
    "ram": "RAM",
    "storage": "xotira",
    "mainCamera": "asosiy kamera",
    "frontCamera": "old kamera",
    "video": "video",
    "battery": "batareya",
    "charging": "zaryadlash",
    "os": "OS",
    "connectivity": "aloqa",
    "build": "korpus",
    "extras": "qo'shimcha",
    "advantages": ["1", "2", "3"]
  },
  "phoneB": {
    "name": "to'liq rasmiy nomi",
    "image": "rasm URL manzili",
    "release": "yil, oy",
    "display": "ekran",
    "processor": "chipset",
    "gpu": "GPU",
    "ram": "RAM",
    "storage": "xotira",
    "mainCamera": "asosiy kamera",
    "frontCamera": "old kamera",
    "video": "video",
    "battery": "batareya",
    "charging": "zaryadlash",
    "os": "OS",
    "connectivity": "aloqa",
    "build": "korpus",
    "extras": "qo'shimcha",
    "advantages": ["1", "2", "3"]
  },
  "categories": [
    { "name": "Dizayn va material", "winner": "A", "note": "izoh" },
    { "name": "Ekran", "winner": "B", "note": "izoh" },
    { "name": "Protsessor (ishlash)", "winner": "Teng", "note": "izoh" },
    { "name": "Operativ xotira (RAM)", "winner": "A", "note": "izoh" },
    { "name": "Kamera", "winner": "A", "note": "izoh" },
    { "name": "Batareya va zaryadlash", "winner": "B", "note": "izoh" },
    { "name": "Dasturiy ta'minot", "winner": "Teng", "note": "izoh" },
    { "name": "Narx / qiymat", "winner": "A", "note": "izoh" }
  ],
  "verdict": {
    "winner": "A",
    "summary": "Umumiy xulosa"
  }
}`;

    const user = `Solishtir: A) ${data.phoneA}   vs   B) ${data.phoneB}`;

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!resp.ok) {
      throw new Error("AI xizmatida xatolik yuz berdi.");
    }

    const json = (await resp.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = json.choices?.[0]?.message?.content ?? "{}";

    let parsed: Record<string, unknown> = {};
    try {
      parsed = JSON.parse(content);
    } catch {
      const m = content.match(/\{[\s\S]*\}/);
      parsed = m ? JSON.parse(m[0]) : {};
    }

    const result = parsed as Partial<CompareResult>;
    if (!result?.phoneA?.name || !result?.phoneB?.name || !result?.categories || !result?.verdict) {
      return {
        error: "not_found",
        message: "Modelni aniqlashda xatolik. Iltimos, nomini aniqroq yozib ko'ring.",
      };
    }
    return result as CompareResult;
  });