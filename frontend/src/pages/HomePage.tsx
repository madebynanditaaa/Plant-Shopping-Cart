import { useEffect, useState } from "react";
import { fetchProducts, addToCart } from "../api";
import ProductCard from "../components/ProductCard"; // adjust path if needed
import type { Product } from "../types";

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchProducts().then(setProducts).catch(console.error);
  }, []);

  return (
    <div className="home-page">
      <h1 className="page-title">Available Plants</h1>
      <div className="product-grid">
        {products.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            onAddToCart={(id) => addToCart(id)}
          />
        ))}
      </div>
    </div>
  );
}
