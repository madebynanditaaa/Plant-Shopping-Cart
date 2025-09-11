// src/pages/CartPage.tsx
import { useEffect, useState } from "react";
import { fetchCart, updateCartItem, deleteCartItem } from "../api";
import CartList from "../components/CartList";
import type { CartItem as CartItemType } from "../types";

export default function CartPage() {
  const [cart, setCart] = useState<CartItemType[]>([]);

  // Load cart items from the API
  const loadCart = async () => {
    try {
      const data = await fetchCart();
      setCart(data);
    } catch (err) {
      console.error("Failed to load cart:", err);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  // Update quantity of a cart item
  const handleQuantityChange = async (id: number, qty: number) => {
    try {
      await updateCartItem(id, qty);
      setCart((prev) =>
        prev.map((item) => (item.id === id ? { ...item, quantity: qty } : item))
      );
    } catch (err) {
      console.error("Failed to update item quantity:", err);
    }
  };

  // Remove an item from the cart
  const handleRemove = async (id: number) => {
    try {
      await deleteCartItem(id);
      setCart((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Failed to remove item:", err);
    }
  };

  return (
    <div className="cart-page">
      <h1 className="page-title">Your Cart</h1>
      {cart.length === 0 ? (
        <p>No items in cart.</p>
      ) : (
        <CartList
          items={cart}
          onQuantityChange={handleQuantityChange}
          onRemove={handleRemove}
        />
      )}
    </div>
  );
}
