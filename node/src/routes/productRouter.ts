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
import { Extension } from "../util/ExtendedRequest.js";

export const productRouter = express.Router();

productRouter.get("/:_id", (req, res, next) => {
  wrapper(async () => {
    const extension: Extension = req.body.__ext;

    let result;
    if (req.query.bySlug === "true") {
      result = await productModel.findOne({ slug: req.params._id }).populate("categories").exec();
    } else {
      result = await productModel.findById(req.params._id).populate("categories").exec();
    }
    if (!result) return res.status(404).json(new ResultBuilder().error("İlgili ürün bulunamadı!").result);
    if (result) {
      if (result.mainImg) {
        result.mainImg = extension.host + result.mainImg;
      }
      if (result.images && result.images.length > 0) {
        result.images = result.images.map((x) => extension.host + x);
      }
    }
    return res.status(200).json(new ResultBuilder().ok().body(result?.toObject()).result);
  }, res);
});

productRouter.get("/", (req, res) => {
  wrapper(async () => {
    let query: FilterQuery<ProductDocument> | undefined = {};
    let sort: any = {};

    const extension: Extension = req.body.__ext;
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
    const inStock = req.query.inStock === "true";
    let grps: Array<string> = [];
    let cats: Array<string> = [];
    let grpLimit: Array<string> = [];
    let allowedCats: Array<string> = [];
    let catIds: Array<string> = [];
    if (req.query.grpLimit) {
      grpLimit = (<string>req.query.grpLimit).split(",");
    }
    if (req.query.grps) {
      grps = (<string>req.query.grps).split(",");
    }
    if (req.query.cats) {
      cats = (<string>req.query.cats).split(",");
    }

    if (grpLimit && grpLimit.length > 0) {
      allowedCats = (await categoryModel.find({ group: { $in: grpLimit } }, { _id: 1 })).map((x) => x._id.toString());
      catIds = allowedCats;
      if (grps && grps.length > 0) {
        grps = grps.filter((x) => grpLimit.findIndex((y) => y === x) >= 0);
      } else {
        grps = grpLimit;
      }
    }
    if (cats && cats.length > 0) {
      catIds = (await categoryModel.find({ slug: { $in: cats } }, { _id: 1 })).map((x) => x._id.toString());
    }
    if (allowedCats && allowedCats.length > 0) {
      catIds = catIds.filter((x) => allowedCats.findIndex((y) => y === x) >= 0);
    }

    if (catIds && catIds.length > 0 && grps && grps.length > 0) {
      query.$or = [{ groups: { $in: grps } }, { categories: { $in: catIds } }];
    } else {
      if (catIds && catIds.length > 0) {
        query.categories = { $in: catIds };
      } else if (grps && grps.length > 0) {
        query.groups = { $in: grps };
      }
      // else if(grpLimit && grpLimit.length > 0){
      //   query.groups = { $in: grpLimit };
      //   if(allowedCats && allowedCats.length > 0){
      //     query.$or = [{ groups: { $in: grpLimit } }, { categories: { $in: allowedCats } }];
      //   }
      // }
    }

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
    if (req.query.search) {
      const search: string = <string>req.query.search;
      if (search.length > 0)
        query.$text = {
          $search: search.includes(" ") ? '"' + search + '"' : search,
          $caseSensitive: false,
        };
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
        mainImg: x.mainImg ? extension.host + x.mainImg : x.mainImg,
        images: x.images.map((y) => extension.host + y),
      }));
    }
    res.status(200).json(new ResultBuilder().ok().body(prods).result);
  }, res);
});

productRouter.get("/search/:text", (req, res) => {
  wrapper(async () => {
    const result = await productModel.find({
      $text: {
        $search: req.params.text.includes(" ") ? '"' + req.params.text + '"' : req.params.text,
        $caseSensitive: false,
      },
    });
    return res.status(200).json(new ResultBuilder().ok().body(result).result);
  }, res);
});
