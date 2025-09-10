import type { Product } from "../types";
import ProductCard from "./ProductCard";


interface ProductGridProps {
  products: Product[];
  onAddToCart: (productId: number) => void;
}

export default function ProductGrid({ products, onAddToCart }: ProductGridProps) {
  return (
    <div className="product-grid">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} />
      ))}
    </div>
  );
}
