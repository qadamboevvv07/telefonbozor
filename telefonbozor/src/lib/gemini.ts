export async function askGroqAI(userMessage: string) {
  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

  if (!GEMINI_API_KEY) {
    console.error("Gemini API kaliti topilmadi!");
    return "Kechirasiz, tizim sozlamalarida xatolik yuz berdi.";
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Siz "Telefon Bozor" do'konining aqlli va tajribali texno-maslahatchisisiz.
Qoidalaringiz:
1. Faqat va faqat telefonlar, ularning xarakteristikalari (kamera, batareya, o'yin unumdorligi) va narxlari haqida maslahat berasiz.
2. Mijoz so'ragan telefon do'konimizda sotuvda borligini, rasmiy kafolati borligini va pasport evaziga muddatli to'lovga berilishini aytasiz.
3. Javoblaringiz londa, aniq va xushmuomala o'zbek tilida bo'lsin. Ortiqcha uzun matn yozmang.

Mijoz savoli: ${userMessage}`
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();

    const aiReply = data.candidates?.[0]?.content?.parts?.[0]?.text;
    return aiReply || "Kechirasiz, javob olishda xatolik bo'ldi.";
  } catch (error) {
    console.error("Gemini API xatosi:", error);
    return "Hozircha aloqada biroz uzilish bor, bir ozdan so'ng qayta urinib ko'ring.";
  }
}