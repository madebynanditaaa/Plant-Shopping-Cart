import { useEffect, useState } from "react";
import { fetchCart, deleteCartItem } from "../api";
import CartList from "../components/CartList"; // adjust path if needed
import type { CartItem as CartItemType } from "../types";

export default function CartPage() {
  const [cart, setCart] = useState<CartItemType[]>([]);

  useEffect(() => {
    fetchCart().then(setCart).catch(console.error);
  }, []);

  const handleRemove = async (id: number) => {
    await deleteCartItem(id);
    setCart((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="cart-page">
      <h1 className="page-title">Your Cart</h1>
      {cart.length === 0 ? (
        <p>No items in cart.</p>
      ) : (
        <CartList
          items={cart}
          onQuantityChange={(id, qty) =>
            setCart((prev) =>
              prev.map((item) =>
                item.id === id ? { ...item, quantity: qty } : item
              )
            )
          }
          onRemove={handleRemove}
        />
      )}
    </div>
  );
}
