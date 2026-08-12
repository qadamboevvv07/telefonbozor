import { useState, useRef, useEffect } from "react";
import { Sparkles, X, Send, Bot, User, Loader2 } from "lucide-react";
import { askGemini } from "@/lib/gemini";

interface Message {
  id: string;
  sender: "ai" | "user";
  text: string;
  time: string;
}

interface AiAdvisorProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}

export function AiAdvisor({ isOpen, onClose, onOpen }: AiAdvisorProps) {
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "ai",
      text: "Salom! Men Telefon Bozor'ning Onlayn Yordamchisiman. Sizga mos telefon yoki aksessuar tanlashda qanday yordam bera olaman?",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const currentInput = input.trim();
    setInput("");

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: currentInput,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const aiResponseText = await askGemini(currentInput);
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: aiResponseText,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.error("AI bilan bog'lanishda xato:", error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: "Kechirasiz, tarmoqda biroz uzilish bo'ldi. Qaytadan urinib ko'rasizmi?",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen && (
        <button
          onClick={onOpen}
          className="group relative flex items-center gap-2 rounded-full bg-brand px-4 py-3 font-medium text-brand-foreground shadow-[var(--shadow-glow)] transition-all duration-300 hover:scale-105"
        >
          <Sparkles className="h-5 w-5 animate-pulse" />
          <span className="text-sm font-semibold">Onlayn Yordamchi</span>
        </button>
      )}

      {isOpen && (
        <div className="flex h-[500px] w-[340px] sm:w-[380px] flex-col overflow-hidden rounded-2xl border border-brand/30 bg-card/95 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-5">
          <div className="flex items-center justify-between border-b border-border bg-brand/10 px-4 py-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-brand-foreground">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold leading-none">Onlayn Yordamchi</h3>
                <span className="text-[10px] text-brand">Gemini AI Texnologiyasi</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex items-start gap-2 ${
                  m.sender === "user" ? "flex-row-reverse" : ""
                }`}
              >
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs ${
                    m.sender === "user"
                      ? "bg-brand text-brand-foreground"
                      : "bg-secondary text-foreground"
                  }`}
                >
                  {m.sender === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>
                <div
                  className={`max-w-[75%] rounded-2xl px-3 py-2 text-xs leading-relaxed whitespace-pre-line ${
                    m.sender === "user"
                      ? "bg-brand text-brand-foreground rounded-tr-none font-medium"
                      : "bg-secondary/80 text-foreground rounded-tl-none border border-border/50"
                  }`}
                >
                  <p>{m.text}</p>
                  <span className="mt-1 block text-[9px] opacity-60 text-right">{m.time}</span>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Bot className="h-4 w-4" />
                <span className="flex items-center gap-1">
                  AI o'ylamoqda... <Loader2 className="h-3 w-3 animate-spin" />
                </span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-border p-3 bg-card">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Savol berishingiz mumkin..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-xs outline-none focus:border-brand"
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand text-brand-foreground disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}