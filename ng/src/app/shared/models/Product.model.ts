export class Product {
  _id: string;
  title: string;
  description: string;
  stock: number;
  price: number;
  unit: string;
  fav: boolean;
  mainImg: string;
  images: Array<string>;

  static default(): Product {
    const prod = new Product();
    prod._id = Math.random().toString();
    prod.title = Math.random().toString();
    prod.description = "Beam xl mouse pad";
    prod.stock = 10;
    prod.price = 10;
    prod.unit = "Adet";
    prod.fav = false;
    prod.mainImg = "https://picsum.photos/200/300";
    return prod;
  }

  set(propName: string, value): Product {
    this[propName] = value;
    return this;
  }
}
