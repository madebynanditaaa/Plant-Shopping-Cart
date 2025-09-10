import type{ CartItem as CartItemType } from "../types";
import CartItem from "./CartItem";

interface CartListProps {
  items: CartItemType[];
  onQuantityChange: (id: number, quantity: number) => void;
  onRemove: (id: number) => void;
}

export default function CartList({ items, onQuantityChange, onRemove }: CartListProps) {
  return (
    <ul className="cart-list">
      {items.map((item) => (
        <CartItem
          key={item.id}
          item={item}
          onQuantityChange={onQuantityChange}
          onRemove={onRemove}
        />
      ))}
    </ul>
  );
}
