import { useEffect, useState } from "react";
import { supabase } from "./supabase";

export interface Announcement {
  id: string;
  title: string;
  text: string;
  type: "job" | "info" | "promo";
  date: string;
  isActive: boolean;
}

export function useAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [ready, setReady] = useState(false);

  // Bazadan e'lonlarni o'qib kelish
  const fetchAnnouncements = async () => {
    try {
      const { data, error } = await supabase.from('announcements').select('*');
      if (error) {
        console.error("E'lonlarni o'qishda xatolik:", error.message);
      } else if (data) {
        const formatted: Announcement[] = data.map((item: any) => ({
          id: String(item.id),
          title: item.title || "",
          text: item.text || "",
          type: item.type || "info",
          date: item.date || new Date().toISOString(),
          isActive: item.is_active ?? true,
        }));
        setAnnouncements(formatted);
      }
    } catch (err) {
      console.error("Kutilmagan xatolik:", err);
    } finally {
      setReady(true);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  return {
    announcements,
    ready,
    addAnnouncement: async (item: Omit<Announcement, "id" | "date">) => {
      const { error } = await supabase.from('announcements').insert([
        {
          title: item.title,
          text: item.text,
          type: item.type,
          is_active: item.isActive,
          date: new Date().toISOString(),
        }
      ]);
      if (error) {
        console.error("E'lon qo'shishda xatolik:", error.message);
        alert("Xatolik yuz berdi. Qayta urinib ko'ring!");
      } else {
        fetchAnnouncements();
      }
    },
    deleteAnnouncement: async (id: string) => {
      const { error } = await supabase.from('announcements').delete().eq('id', id);
      if (error) {
        console.error("O'chirishda xatolik:", error.message);
      } else {
        fetchAnnouncements();
      }
    },
    toggleStatus: async (id: string) => {
      const target = announcements.find((a) => a.id === id);
      if (!target) return;

      const { error } = await supabase
        .from('announcements')
        .update({ is_active: !target.isActive })
        .eq('id', id);

      if (error) {
        console.error("Statusni o'zgartirishda xatolik:", error.message);
      } else {
        fetchAnnouncements();
      }
    },
  };
}