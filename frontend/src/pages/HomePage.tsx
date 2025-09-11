import { useEffect, useState } from "react";
import { fetchProducts, addToCart } from "../api";
import ProductGrid from "../components/ProductGrid";
import type { Product } from "../types";

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchProducts().then(setProducts).catch(console.error);
  }, []);

  const handleAddToCart = async (productId: number) => {
    try {
      await addToCart(productId, 1);
      alert("Added to cart!");
    } catch (err) {
      console.error(err);
      alert("Failed to add to cart");
    }
  };

  return (
    <div className="home-page">
      <h1 className="page-title">Available Plants</h1>
      <ProductGrid products={products} onAddToCart={handleAddToCart} />
    </div>
  );
}
