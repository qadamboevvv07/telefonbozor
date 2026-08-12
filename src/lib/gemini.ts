import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function askGemini(promptText: string): Promise<string> {
  try {
    // 1. Bazadan API kalitni xavfsiz olish (.single o'rniga maybeSingle ishlatamiz)
    const { data, error } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'gemini_api_key')
      .maybeSingle();

    if (error || !data?.value) {
      console.warn("Supabase'dan kalit topilmadi:", error);
      return "Admin panelda AI API kalit kiritilmagan. Iltimos, admin panelga kirib kalitni saqlang.";
    }

    const API_KEY = data.value.trim();

    // 2. OpenRouter orqali so'rov yuborish (ishonchli bepul model bilan)
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": window.location.origin,
        "X-Title": "Telefon Bozor"
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3-8b-instruct:free", // Barqaror ishlaydigan bepul model
        messages: [
          {
            role: "user",
            content: promptText
          }
        ]
      })
    });

    const resData = await response.json();

    if (resData.error) {
      console.error("OpenRouter API xatosi:", resData.error.message || resData.error);
      return "Kechirasiz, sun'iy intellekt xatosiga duch kelindi. Kalitni tekshiring.";
    }

    const reply = resData.choices?.[0]?.message?.content;
    return reply || "Javob olinmadi.";
  } catch (error) {
    console.error("Tarmoq xatosi:", error);
    return "Tarmoqda xatolik yuz berdi.";
  }
}