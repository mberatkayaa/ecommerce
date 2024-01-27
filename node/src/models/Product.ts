import mongoose from "mongoose";

const Schema = mongoose.Schema;

const productSchema = new Schema({
  title: {
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
});

const productModel = mongoose.model("Product", productSchema);
export default productModel;
