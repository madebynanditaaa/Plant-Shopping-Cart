// src/api.ts
import type { Product, CartItem } from "./types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch(`${API_URL}/products`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export async function fetchCart(): Promise<CartItem[]> {
  const res = await fetch(`${API_URL}/cart`);
  if (!res.ok) throw new Error("Failed to fetch cart");
  return res.json();
}

export async function addToCart(productId: number): Promise<void> {
  const res = await fetch(`${API_URL}/cart`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ product_id: productId, quantity: 1 }),
  });
  if (!res.ok) throw new Error("Failed to add to cart");
}

export async function updateCartItem(id: number, quantity: number): Promise<void> {
  const res = await fetch(`${API_URL}/cart/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ quantity }),
  });
  if (!res.ok) throw new Error("Failed to update cart");
}

export async function deleteCartItem(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/cart/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete cart item");
}
