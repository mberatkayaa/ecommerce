import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    stock: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
    },
    unit: {
      type: String,
      default: "Adet",
    },
    mainImg: {
      type: String,
      default: "",
    },
    images: {
      type: [String],
      default: [],
    },
    categories: [
      {
        type: Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    groups: [String],
  },
  {
    autoCreate: true,
    autoIndex: true,
  }
);
productSchema.index({ title: "text" });
export interface ProductData {
  title: string;
  slug: string;
  desciption: string;
  stock: number;
  price: number;
  unit: string;
  mainImg: string;
  images: Array<string>;
  categories: Array<string | mongoose.Types.ObjectId>;
  groups: Array<string>;
}
export interface ProductDocument extends mongoose.Document, ProductData {}

productSchema.plugin(paginate);
const productModel = mongoose.model<ProductDocument, mongoose.PaginateModel<ProductDocument>>("Product", productSchema);
export default productModel;
