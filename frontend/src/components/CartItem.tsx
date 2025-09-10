import type { CartItem as CartItemType } from "../types";

interface CartItemProps {
  item: CartItemType;
  onQuantityChange: (id: number, quantity: number) => void;
  onRemove: (id: number) => void;
}

export default function CartItem({ item, onQuantityChange, onRemove }: CartItemProps) {
  return (
    <li className="cart-item">
      <span className="cart-product-name">{item.product?.name ?? "Product"}</span>
      <input
        className="cart-quantity-input"
        type="number"
        value={item.quantity}
        min={1}
        onChange={(e) => onQuantityChange(item.id, Number(e.target.value))}
      />
      <button
        className="cart-remove-button"
        onClick={() => onRemove(item.id)}
      >
        Remove
      </button>
    </li>
  );
}
