import { Product } from "./Product.model";

export interface Category {
  _id: string,
  title: string,
  slug: string,
  group: string,
  products?:Array<Product>
}
