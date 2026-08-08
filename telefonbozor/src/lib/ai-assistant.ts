export function getSmartAiResponse(userMessage: string): string {
  const text = userMessage.toLowerCase().trim();

  // 1. SALOMLASHUV VA MULOZAMAT
  if (
    text === "salom" ||
    text === "assalomu alaykum" ||
    text.startsWith("salom") ||
    text.includes("privet") ||
    text.includes("qalaysiz")
  ) {
    return "Assalomu alaykum! Telefon Bozor texno-yordamchisiman. Sizga qanday telefon, aksesuar yoki muddatli to'lov bo'yicha yordam bera olaman?";
  }

  // 2. O'YIN (GAMING) VA FLAGMANLAR TAQQOSLOVI (iPhone 15 Pro Max vs 16 Pro va b.)
  if (
    (text.includes("15 pro") || text.includes("16 pro") || text.includes("s24")) &&
    (text.includes("oyin") || text.includes("o'yin") || text.includes("pubg") || text.includes("tavsiya"))
  ) {
    return "O'yinlar va yuqori unumdorlik uchun ikkala model ham haqiqiy monstr! Lekin farqlari bor:\n\n" +
      "📱 **iPhone 16 Pro:** Yangi A18 Pro chipi, yaxshilangan titan sovutish tizimi va o'yinlarda uzoq vaqt qizimay doimiy yuqori FPS ushlab turishi bilan ustun.\n\n" +
      "📱 **iPhone 15 Pro Max:** Katta 6.7” ekrani va sig'imli batareyasi tufayli uzoq vaqt o'yin oynamoqchi bo'lganlar uchun juda qulay.\n\n" +
      "💡 **Xulosa:** Agar sizga ixchamlik va eng so'nggi protsessor kerak bo'lsa — **16 Pro**, katta ekran va maksimal batareya muhim bo'lsa — **15 Pro Max** ni tavsiya qilaman!";
  }

  // 3. KAMERA VA FOTOGRAFIYA
  if (text.includes("kamera") || text.includes("rasm") || text.includes("video") || text.includes("vlog")) {
    return "Sifatli rasm va video olish uchun quyidagi yetakchi modellarni tavsiya qilaman:\n\n" +
      "1. **iPhone 15 Pro / 16 Pro** — Video oluvchilar (vlogerlar) va Instagram uchun eng zo'r stabilizatsiya va ranglar.\n" +
      "2. **Samsung Galaxy S24 Ultra** — 200MP kamera va 100x zoom orqali uzoqdagi obyektlarni aniq tushirish uchun tengsiz.\n\n" +
      "Bütjetingizga mosini tanlab berishimni xohlaysizmi?";
  }

  // 4. MUDDATLI TO'LOV VA KREDIT
  if (
    text.includes("muddatli") ||
    text.includes("kredit") ||
    text.includes("bo'lib") ||
    text.includes("bolib") ||
    text.includes("pasport")
  ) {
    return "Bizda muddatli to'lov juda oson va halol!\n\n" +
      "• **Kerakli hujjat:** Faqat pasport yoki ID karta.\n" +
      "• **Muddati:** 3, 6 yoki 12 oyga bo'lib to'lash imkoniyati.\n" +
      "• **Boshlang'ich to'lov:** Boshlang'ich to'lovsiz ham rasmiylashtirish mumkin!\n\n" +
      "Saytimizning 'Muddatli to'lov' bo'limida kalkulyator orqali oylik to'lovni hisoblashingiz mumkin.";
  }

  // 5. BÜTJET / ARZON VA SIFATLI TELEFONLAR
  if (text.includes("arzon") || text.includes("hamyonbop") || text.includes("3 mln") || text.includes("4 mln") || text.includes("5 mln")) {
    return "Hamyonbop va sifatli segmentda eng zo'r tanlovlar:\n\n" +
      "• **Xiaomi Redmi Note 13 Pro:** AMOLED 120Hz ekran va 67W tezkor quvvatlash.\n" +
      "• **Samsung Galaxy A55 / A35:** O'rta narxdagi suvdan himoyalangan va doimiy yangilanuvchi eng ishonchli telefonlar.\n\n" +
      "Ushbu modellarni 'Mahsulotlar' bo'limimizdan batafsil ko'rishingiz mumkin!";
  }

  // 6. RAHMAT VA XAYRLASHUV
  if (text.includes("rahmat") || text.includes("spasibo") || text.includes("kattakon")) {
    return "Arzimaydi! Har doim xizmatingizdamiz. Yana qandaydir savollaringiz bo'lsa, bemalol so'rang! 😊";
  }

  // 7. DEFAULT (UMUMIY EKSPERTCHA JAVOB)
  return `Tushundim! "${userMessage}" bo'yicha do'konimizda juda ko'p ajoyib variantlar va kafolatlangan telefonlar mavjud.\n\n` +
    `Aniqroq maslahat berishim uchun bütjetingizni yoki qanday xususiyat (kamera, batareya, o'yin) muhimligini aytsangiz, eng maqbul modelni tanlab beraman!`;
}