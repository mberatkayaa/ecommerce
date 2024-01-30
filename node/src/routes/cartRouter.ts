import express from "express";
import mongoose from "mongoose";

import { decodeToken } from "../util/token.js";
import { wrapper } from "../util/requestHandlerWrapper.js";
import { ResultBuilder } from "../util/ResultBuilder.js";
import userModel from "../models/User.js";
import { adminProductRouter } from "./admin/adminProductRouter.js";
import { adminCategoryRouter } from "./admin/adminCategoryRouter.js";
import categoryModel from "../models/Category.js";
import productModel, { ProductData, ProductDocument } from "../models/Product.js";
import { FilterQuery } from "mongoose";
import { Extension } from "../util/ExtendedRequest.js";

export const cartRouter = express.Router();

cartRouter.use("/", (req, res, next) => {
  wrapper(async () => {
    const extension: Extension = req.body.__ext;
    if (!extension.auth || !extension.auth.user) {
      return res
        .status(401)
        .json(new ResultBuilder().error("Sepette düzenleme yapmak için kullanıcı girişi yapınız!").result);
    }
    next();
  }, res);
});

cartRouter.get("/", (req, res, next) => {
  wrapper(async () => {
    const extension: Extension = req.body.__ext;

    return res.status(200).json(new ResultBuilder().ok().body(extension.auth!.user!.cart).result);
  }, res);
});

cartRouter.post("/", (req, res) => {
  wrapper(async () => {
    const extension: Extension = req.body.__ext;

    const item: ProductDocument = req.body.item;
    const quantity: number = req.body.quantity || 1;

    if (!item) {
      return res.status(404).json(new ResultBuilder().error("Ürün bulunamadı!").body(extension.auth?.user?.cart));
    }

    const product = await productModel.findById(item._id);
    if (!product) {
      return res.status(404).json(new ResultBuilder().error("Ürün bulunamadı!").body(extension.auth?.user?.cart));
    }
    if (product.stock < quantity) {
      return res
        .status(404)
        .json(
          new ResultBuilder()
            .error("Stok miktarından fazla sayıda ürün sepete eklenemez!")
            .body(extension.auth?.user?.cart)
        );
    }
    const user = extension.auth?.user!;
    let cart: Array<{ product: mongoose.Types.ObjectId; quantity: number }> = user.cart.toObject();

    const index = cart.findIndex((x) => x.product._id.toString() === product._id.toString());
    if (index >= 0) {
      if (req.query.exact !== "true") cart[index].quantity += quantity;
      else cart[index].quantity = quantity;

      if (cart[index].quantity < 0) {
        cart[index].quantity = 0;
      }
    } else {
      cart.push({ product: product._id, quantity: quantity < 0 ? 0 : quantity });
    }
    cart = cart.filter((x) => x.quantity >= 0);
    const newUser = await userModel
      .findByIdAndUpdate(user._id, { cart: cart }, { new: true })
      .populate("cart.product")
      .exec();
    const newUserCart = newUser?.cart.toObject();

    newUserCart.forEach((x: any) => {
      x.product.mainImg = extension.host + x.product.mainImg;
      x.product.images = x.product.images.map((y: any) => extension.host + y);
    });

    extension.auth!.user = newUser;

    // await productModel.updateOne({ _id: product._id }, { $inc: { stock: -quantity } }); // Siparişte bu işlem yapılacak.
    return res.status(200).json(new ResultBuilder().ok().body(newUserCart).result);
  }, res);
});
