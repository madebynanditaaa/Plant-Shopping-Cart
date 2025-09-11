import { useEffect, useState } from "react";
import { fetchProducts, addToCart } from "../api";
import ProductGrid from "../components/ProductGrid"; // add this
import type { Product } from "../types";

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchProducts().then(setProducts).catch(console.error);
  }, []);

  return (
    <div className="home-page">
      <h1 className="page-title">Available Plants</h1>
      <ProductGrid products={products} onAddToCart={addToCart} />
    </div>
  );
}
