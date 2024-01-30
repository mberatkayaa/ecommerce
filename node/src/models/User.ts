import mongoose, { InferSchemaType } from "mongoose";
import { ProductData, ProductDocument } from "./Product.js";

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  admin: {
    type: Boolean,
    default: false,
  },
  cart: [
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: { type: Number, required: true },
    },
  ],
});

export interface UserData {
  email: string;
  password: string;
  admin: boolean;
  cart: Array<{ item: Array<string | mongoose.Types.ObjectId | ProductDocument>; quantity: number }>;
}

export interface UserDocument extends InferSchemaType<typeof userSchema> {
 
}

const userModel = mongoose.model<UserDocument>("User", userSchema);
export default userModel;
