import { Product } from "./Product.model";

export interface RawCart extends Array<{ product: Product; quantity: number }> {}
export interface Cart {
  items: Array<{ product: Product; quantity: number, totalPrice: number }>;
  totalItemCount: number;
  totalPrice: number;
}
