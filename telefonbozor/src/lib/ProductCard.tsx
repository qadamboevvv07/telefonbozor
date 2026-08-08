import { Heart } from "lucide-react";
import { useWishlist, Product } from "@/lib/wishlist-store";

export function ProductCard({ product }: { product: Product }) {
  const { toggleFavorite, isFavorite } = useWishlist();
  const liked = isFavorite(product.id);

  return (
    <div className="relative border rounded-2xl p-4 bg-card group">
      {/* Yurakcha Tugmasi */}
      <button
        onClick={() => toggleFavorite(product)}
        className="absolute top-3 right-3 p-2 rounded-full bg-background/80 backdrop-blur-md border border-border/50 hover:scale-110 transition-all z-10"
      >
        <Heart
          className={`h-5 w-5 transition-colors ${
            liked ? "fill-red-500 text-red-500" : "text-muted-foreground"
          }`}
        />
      </button>

      {/* Mahsulot ma'lumotlari... */}
      <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded-xl" />
      <h3 className="font-bold mt-2">{product.name}</h3>
      <p className="text-brand font-bold">{product.price} so'm</p>
    </div>
  );
}