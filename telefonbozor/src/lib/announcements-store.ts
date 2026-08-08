import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Announcement {
  id: string;
  title: string;
  text: string;
  type: "job" | "info" | "promo";
  date: string;
  isActive: boolean;
}

interface AnnouncementsStore {
  announcements: Announcement[];
  addAnnouncement: (item: Omit<Announcement, "id" | "date">) => void;
  deleteAnnouncement: (id: string) => void;
  toggleStatus: (id: string) => void;
}

export const useAnnouncements = create<AnnouncementsStore>()(
  persist(
    (set) => ({
      announcements: [
        {
          id: "1",
          title: "Sotuvchi-konsultant kerak",
          text: "Telefon Bozor do'koniga tajribali sotuvchi kerak. Oylik kelishilgan holda. Tel: +998 93 746 79 99",
          type: "job",
          date: new Date().toISOString(),
          isActive: true,
        },
      ],
      addAnnouncement: (item) =>
        set((state) => ({
          announcements: [
            {
              ...item,
              id: Date.now().toString(),
              // ✅ Toshkent vaqtini aniq olish uchun to'liq ISO shaklida saqlaymiz
              date: new Date().toISOString(),
            },
            ...state.announcements,
          ],
        })),
      deleteAnnouncement: (id) =>
        set((state) => ({
          announcements: state.announcements.filter((a) => a.id !== id),
        })),
      toggleStatus: (id) =>
        set((state) => ({
          announcements: state.announcements.map((a) =>
            a.id === id ? { ...a, isActive: !a.isActive } : a
          ),
        })),
    }),
    {
      name: "tb_announcements_storage",
    }
  )
);