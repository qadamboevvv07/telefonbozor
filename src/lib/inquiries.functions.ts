import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const InquiryInput = z.object({
  name: z.string().min(2).max(80),
  phone: z.string().min(6).max(30),
  message: z.string().min(3).max(2000),
});

export const sendInquiryToTelegram = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => InquiryInput.parse(data))
  .handler(async ({ data }) => {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      // Not configured — front-end still stores the inquiry locally for admin panel.
      return { ok: false, reason: "not_configured" as const };
    }

    const text =
      `🛒 <b>Yangi murojaat — Telefon Bozor</b>\n\n` +
      `👤 <b>Ism:</b> ${escapeHtml(data.name)}\n` +
      `📞 <b>Telefon:</b> ${escapeHtml(data.phone)}\n\n` +
      `💬 <b>Xabar:</b>\n${escapeHtml(data.message)}\n\n` +
      `🕒 ${new Date().toLocaleString("uz-UZ")}`;

    const resp = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    });

    if (!resp.ok) {
      const body = await resp.text();
      console.error("Telegram send failed", resp.status, body.slice(0, 200));
      return { ok: false, reason: "send_failed" as const };
    }
    return { ok: true as const };
  });

function escapeHtml(s: string) {
  return s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c] as string);
}