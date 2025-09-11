import type { Product } from "../types";

interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: number) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
    const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://backend:8080";

  return (
    <div className="product-card">
      {product.image_url && (
        <img
          className="product-image"
          src={`${API_BASE}${product.image_url}`}
          alt={product.name}
        />
      )}
      <h2 className="product-name">{product.name}</h2>
      <p className="product-description">{product.description}</p>
      <p className="product-price">Rs.{product.price.toFixed(2)}</p>
      <button
        className="add-to-cart-button"
        onClick={() => onAddToCart(product.id)}
      >
        Add to Cart
      </button>
    </div>
  );
}
