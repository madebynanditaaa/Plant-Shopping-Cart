export interface Product {
  id: number;
  name: string;
  price: number;
  image_url?: string;
  description?: string;
}

export interface CartItem {
  id: number;
  product_id: number;
  quantity: number;
  product?: Product;
}
