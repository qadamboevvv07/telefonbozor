import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function askGemini(promptText: string): Promise<string> {
  try {
    // Bazadan API kalitni olish
    const { data, error } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'gemini_api_key')
      .single();

    if (error || !data?.value) {
      console.error("Supabase'dan kalit topilmadi:", error);
      return "API kalit bazadan topilmadi.";
    }

    const API_KEY = data.value;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": window.location.origin,
        "X-Title": "Telefon Bozor"
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat:free",
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
      return "Kechirasiz, sun'iy intellekt xatosiga duch kelindi.";
    }

    const reply = resData.choices?.[0]?.message?.content;
    return reply || "Javob olinmadi.";
  } catch (error) {
    console.error("Tarmoq xatosi:", error);
    return "Tarmoqda xatolik yuz berdi.";
  }
}