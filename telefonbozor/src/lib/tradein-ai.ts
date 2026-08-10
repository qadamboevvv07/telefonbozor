export async function evaluatePhoneWithAI(phoneData: {
  model: string;
  storage: string;
  conditionDetails: string;
}) {
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

  if (!API_KEY) {
    console.error("API kalit topilmadi!");
    return null;
  }

  try {
    const promptText = `Siz "Telefon Bozor" do'konining tajribali va ehtiyotkor Trade-In baholovchisisiz.
Vazifangiz: Mijoz bergan telefon modeli, xotirasi va holati/nuqsonlari tavsifiga qarab do'kon sotib olish narxini hisoblash.

QOIDALAR:
1. Telefonning real ikkilamchi bozor narxini (AQSh dollarida) aniqlang.
2. Do'konga marja (foyda) qolishi va yashirin nuqsonlar xavfini hisobga olgan holda, real bozor narxidan 35% dan 45% gacha ARZONROQ bo'lgan "Do'kon sotib olish narxi"ni (estimatedPriceUSD) belgilang. Narxni aslo baland aytmang!
3. Javobni FAQAT VA FAQAT TOZA JSON FORMATIDA QAYTARING (markdown bloklarisiz, masalan \`\`\`json \`\`\` belgilarsiz), boshqa hech qanday matn yozmang:
{
  "estimatedPriceUSD": number,
  "estimatedPriceUZS": number,
  "reasoning": "Do'kon sotib olish narxi nega shunday belgilangani haqida qisqa izoh"
}

Mijoz ma'lumotlari:
Model: ${phoneData.model}, Xotira: ${phoneData.storage}, Holati: "${phoneData.conditionDetails}". Dollarning kursi: 12,200 so'm.`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": window.location.origin,
        "X-Title": "Telefon Bozor"
      },
      body: JSON.stringify({
        model: "google/gemma-2-9b-it:free",
        messages: [
          {
            role: "user",
            content: promptText
          }
        ]
      })
    });

    const data = await response.json();

    if (data.error) {
      console.error("OpenRouter API Xatosi:", data.error.message || data.error);
      return null;
    }

    const content = data.choices?.[0]?.message?.content || "";
    const cleanJson = content.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanJson);

  } catch (error) {
    console.error("OpenRouter AI orqali baholashda xato:", error);
    return null;
  }
}