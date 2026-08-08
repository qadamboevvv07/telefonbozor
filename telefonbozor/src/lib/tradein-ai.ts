export async function evaluatePhoneWithAI(phoneData: {
  model: string;
  storage: string;
  conditionDetails: string;
}) {
  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: `Siz "Telefon Bozor" do'konining tajribali va ehtiyotkor Trade-In baholovchisisiz.
            Vazifangiz: Mijoz bergan telefon modeli, xotirasi va holati/nuqsonlari tavsifiga qarab do'kon sotib olish narxini hisoblash.

            QOIDALAR:
            1. Telefonning real ikkilamchi bozor narxini (AQSh dollarida) aniqlang.
            2. Do'konga marja (foyda) qolishi va yashirin nuqsonlar xavfini hisobga olgan holda, real bozor narxidan 35% dan 45% gacha ARZONROQ bo'lgan "Do'kon sotib olish narxi"ni (estimatedPriceUSD) belgilang. Narxni aslo baland aytmang, ehtiyotkor va maksimal darajada salmoqli arzon narx bering!
            3. Agar mijoz tushunarsiz harflar (masalan: "gyj", "asda") yozgan bo'lsa yoki holat aniq ko'rsatilmagan bo'lsa, xavf yuqori bo'lgani uchun narxni yanada pasaytiring va izohda buni tushuntiring.
            4. Javobni FAQAT QUYIDAGI JSON FORMATIDA QAYTARING, boshqa hech qanday ortiqcha matn yozmang:
            {
              "estimatedPriceUSD": number,
              "estimatedPriceUZS": number,
              "reasoning": "Do'kon sotib olish narxi nega shunday belgilangani va nuqsonlar/xavflar hisobga olingani haqida qisqa va tushunarli izoh"
            }`
          },
          {
            role: "user",
            content: `Model: ${phoneData.model}, Xotira: ${phoneData.storage}, Mijoz yozgan holati va nuqsonlari: "${phoneData.conditionDetails}". Dollarning kursi: 12,200 so'm.`
          }
        ],
        temperature: 0.3
      })
    });

    const data = await response.json();
    const content = data.choices[0]?.message?.content || "";

    // JSON javobni tozalash va parse qilish
    const cleanJson = content.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error("AI Baholashda xato:", error);
    return null;
  }
}