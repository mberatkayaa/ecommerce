import path from "path";
import fs from "fs";

import express from "express";
import multer from "multer";
import lodash from "lodash";
import ShortUniqueId from "short-unique-id";

import { wrapper } from "../../util/requestHandlerWrapper.js";
import productModel from "../../models/Product.js";
import mongoose from "mongoose";
import categoryModel from "../../models/Category.js";
import { ResultBuilder } from "../../util/ResultBuilder.js";
import { imageFolder } from "../../util/paths.js";
import { productFileKeys as fileKeys, productImageHandler, renameImage } from "../../util/fileUpload.js";

export const adminProductRouter = express.Router();

adminProductRouter.post("/add", productImageHandler(), (req, res) => {
  wrapper(async () => {
    let mainImgUrl: string = "";
    let imageUrls: Array<string> = [];
    //#region Dosya işlemleri
    const files: any = req.files;
    if (files) {
      if (files[fileKeys.mainImg] && files[fileKeys.mainImg][0]) {
        const mainImg = files[fileKeys.mainImg][0];
        mainImgUrl = renameImage(mainImg);
      }
      if (files[fileKeys.images] && files[fileKeys.images].length > 0) {
        for (let i = 0; i < files[fileKeys.images].length; i++) {
          const file = files[fileKeys.images][i];
          imageUrls.push(renameImage(file));
        }
      }
    }
    //#endregion
    //#region Product oluştur.
    let categories: Array<mongoose.Types.ObjectId> = [];
    if (req.body.categories) req.body.categories = JSON.parse(req.body.categories);
    if (req.body.categories && Array.isArray(req.body.categories) && req.body.categories.length > 0) {
      categories = req.body.categories.map((id: string) => {
        const result = new mongoose.Types.ObjectId(id);
        return result;
      });
    }
    const product = new productModel({
      title: req.body.title,
      description: req.body.description,
      stock: +req.body.stock,
      price: +req.body.price,
      unit: req.body.unit,
      categories: categories,
      mainImg: mainImgUrl,
      images: imageUrls,
    });
    const savedProduct = await product.save();
    const productObj = savedProduct.toObject();
    //#endregion
    //#region Category'lere Product'ı ekle.
    categories.forEach(async (id) => {
      const catResult = await categoryModel.findByIdAndUpdate(
        id,
        { $push: { products: savedProduct._id } },
        { new: true }
      );
      const catObj = catResult?.toObject();
    });
    res.status(200).json(new ResultBuilder().ok().body(productObj).result);
    //#endregion
  }, res);
});
