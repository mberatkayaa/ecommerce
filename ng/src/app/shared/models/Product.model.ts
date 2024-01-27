import { Category } from "./Category.model";

export interface Product {
  _id: string;
  title: string;
  description: string;
  stock: number;
  price: number;
  unit: string;
  fav: boolean;
  mainImg: string;
  images: Array<string>;
  categories?: Array<Category>;
}
