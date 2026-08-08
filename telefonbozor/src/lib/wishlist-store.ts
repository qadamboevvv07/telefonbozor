import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

interface WishlistStore {
  favorites: Product[];
  toggleFavorite: (product: Product) => void;
  isFavorite: (id: string) => boolean;
}

export const useWishlist = create<WishlistStore>()(
  persist(
    (set, get) => ({
      favorites: [],
      toggleFavorite: (product) => {
        const { favorites } = get();
        const exists = favorites.some((item) => item.id === product.id);

        if (exists) {
          set({ favorites: favorites.filter((item) => item.id !== product.id) });
        } else {
          set({ favorites: [...favorites, product] });
        }
      },
      isFavorite: (id) => get().favorites.some((item) => item.id === id),
    }),
    {
      name: "telefon-bozor-wishlist", // Browser LocalStorage'ga saqlaydi
    }
  )
);