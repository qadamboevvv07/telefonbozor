export async function askGeminiAI(promptText: string): Promise<string> {
  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

  if (!GEMINI_API_KEY) {
    console.error("VITE_GEMINI_API_KEY topilmadi!");
    return "API kalit sozlanmagan.";
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: promptText }]
            }
          ]
        }),
      }
    );

    const data = await response.json();

    if (data.error) {
      console.error("Gemini API xatosi:", data.error.message);
      return "Kechirasiz, sun'iy intellekt xatosiga duch kelindi.";
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
    return reply || "Javob olinmadi.";
  } catch (error) {
    console.error("Tarmoq xatosi:", error);
    return "Tarmoqda xatolik yuz berdi.";
  }
}