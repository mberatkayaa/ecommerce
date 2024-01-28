import express from "express";

import { decodeToken } from "../util/token.js";
import { wrapper } from "../util/requestHandlerWrapper.js";
import { ResultBuilder } from "../util/ResultBuilder.js";
import userModel from "../models/User.js";
import { adminProductRouter } from "./admin/adminProductRouter.js";
import { adminCategoryRouter } from "./admin/adminCategoryRouter.js";
import categoryModel from "../models/Category.js";
import productModel, { ProductDocument } from "../models/Product.js";
import { FilterQuery } from "mongoose";

export const productRouter = express.Router();

productRouter.get("/:_id", (req, res, next) => {
  wrapper(async () => {
    const reqAny: any = req;
    const result = await productModel.findById(req.params._id).populate("categories").exec();
    if (result) {
      if (result.mainImg) {
        result.mainImg = reqAny.__host + result.mainImg;
      }
      if (result.images && result.images.length > 0) {
        result.images = result.images.map((x) => reqAny.__host + x);
      }
    }
    return res.status(200).json(new ResultBuilder().ok().body(result?.toObject()).result);
  }, res);
});

productRouter.get("/", (req, res) => {
  wrapper(async () => {
    const reqAny: any = req;
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
    const inStock = req.query.inStock === "true";

    let query: FilterQuery<ProductDocument> | undefined = {};
    let sort: any = {};

    if (inStock) query.stock = { $gt: 0 };
    switch (req.query.sort) {
      case "titleAsc":
        sort.title = 1;
        break;
      case "titleDesc":
        sort.title = -1;
        break;
      case "priceAsc":
        sort.price = 1;
        break;
      case "priceDesc":
        sort.price = -1;
        break;
      default:
        break;
    }
    const prods = await productModel.paginate(query, {
      page,
      limit,
      sort,
      lean: true,
    });
    if (prods.docs && prods.docs.length > 0) {
      prods.docs = prods.docs.map<any>((x) => ({
        ...x,
        mainImg: x.mainImg ? reqAny.__host + x.mainImg : x.mainImg,
        images: x.images.map((y) => reqAny.__host + y),
      }));
    }
    res.status(200).json(new ResultBuilder().ok().body(prods).result);
  }, res);
});
