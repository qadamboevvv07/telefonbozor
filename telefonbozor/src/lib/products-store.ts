import { useEffect, useState } from "react";
import { supabase } from "./supabase";

export type Product = {
  id: string;
  name: string;
  category: "Telefon" | "Aksesuar" | "Boshqa";
  price: number;
  image: string;
  description: string;
  inStock: boolean;
};

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [ready, setReady] = useState(false);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase.from('Products').select('*');
      if (error) {
        console.error("Bazadan o'qishda xatolik:", error.message);
      } else if (data) {
        const formatted: Product[] = data.map((item: any) => ({
          id: String(item.id),
          name: item.name || "",
          category: (item.brand as any) || "Telefon",
          price: Number(item.price) || 0,
          image: item.image || "",
          description: item.specs || "",
          inStock: true,
        }));
        setProducts(formatted);
      }
    } catch (err) {
      console.error("Kutilmagan xatolik:", err);
    } finally {
      setReady(true);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    ready,
    add: async (p: Omit<Product, "id">) => {
      const { error } = await supabase.from('Products').insert([
        {
          name: p.name,
          price: Number(p.price),
          image: p.image,
          brand: p.category,
          specs: p.description,
        }
      ]);
      if (error) {
        console.error("Qo'shishda xatolik:", error.message);
      } else {
        // Zerikarli alert olib tashlandi, o'rniga silliq ishlaydi
        fetchProducts();
      }
    },
    update: async (id: string, patch: Partial<Product>) => {
      const updateData: any = {};
      if (patch.name !== undefined) updateData.name = patch.name;
      if (patch.price !== undefined) updateData.price = Number(patch.price);
      if (patch.image !== undefined) updateData.image = patch.image;
      if (patch.category !== undefined) updateData.brand = patch.category;
      if (patch.description !== undefined) updateData.specs = patch.description;

      const { error } = await supabase
        .from('Products')
        .update(updateData)
        .eq('id', id);

      if (error) {
        console.error("Yangilashda xatolik:", error.message);
      } else {
        fetchProducts();
      }
    },
    remove: async (id: string) => {
      const { error } = await supabase
        .from('Products')
        .delete()
        .eq('id', id);

      if (error) {
        console.error("O'chirishda xatolik:", error.message);
      } else {
        fetchProducts();
      }
    },
  };
}

export function formatPrice(v: number) {
  return new Intl.NumberFormat("uz-UZ").format(v) + " so'm";
}