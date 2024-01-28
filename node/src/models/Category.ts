import mongoose from "mongoose";

const Schema = mongoose.Schema;

const categorySchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  group: {
    type: String,
    default: "",
  },
  products: [
    {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
});

const categoryModel = mongoose.model("Category", categorySchema);
export default categoryModel;
