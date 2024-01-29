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
import { slugify } from "../../util/slugify.js";
import { Extension } from "../../util/ExtendedRequest.js";

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
    let groups: Array<string> = [];
    if (req.body.groups) groups = JSON.parse(req.body.groups);

    let categories: Array<mongoose.Types.ObjectId> = [];
    if (groups.length <= 0) {
      if (req.body.categories) req.body.categories = JSON.parse(req.body.categories);
      if (req.body.categories && Array.isArray(req.body.categories) && req.body.categories.length > 0) {
        categories = req.body.categories.map((id: string) => {
          const result = new mongoose.Types.ObjectId(id);
          return result;
        });
      }
    }
    const product = new productModel({
      title: req.body.title,
      slug: slugify(req.body.title),
      description: req.body.description,
      stock: +req.body.stock,
      price: +req.body.price,
      unit: req.body.unit,
      categories: categories,
      groups: groups,
      mainImg: mainImgUrl,
      images: imageUrls,
    });
    const savedProduct = await product.save();
    const productObj = savedProduct.toObject();
    //#endregion
    if (categories.length > 0) {
      await categoryModel.updateMany({ _id: { $in: categories } }, { $push: { products: savedProduct._id } });
    }
    //#region Category'lere Product'ı ekle.
    // categories.forEach(async (id) => {
    //   const catResult = await categoryModel.findByIdAndUpdate(
    //     id,
    //     { $push: { products: savedProduct._id } },
    //     { new: true }
    //   );
    //   const catObj = catResult?.toObject();
    // });
    res.status(200).json(new ResultBuilder().ok().body(productObj).result);
    //#endregion
  }, res);
});

adminProductRouter.patch("/edit/:_id", productImageHandler(), (req, res) => {
  wrapper(async () => {
    const extension: Extension = req.body.__ext;
    let mainImgUrl: string = "";
    let imageUrls: Array<string> = [];
    // mainImg var ise URL'i setle.
    if (req.body.mainImg) mainImgUrl = req.body.mainImg.replace(extension.host, "");
    // images var ise diziye ekle.
    if (req.body.images) {
      req.body.images = JSON.parse(req.body.images);
      if (Array.isArray(req.body.images) && req.body.images.length > 0) {
        imageUrls.push(...req.body.images.map((x: string) => x.replace(extension.host, "")));
      }
    }
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
    // Query ve filter nesneleri.
    const productUpdateQuery: mongoose.UpdateQuery<{
      title: string;
      slug: string;
      description: string;
      stock: number;
      price: number;
      unit: string;
      mainImg: string;
      images: string[];
      categories: mongoose.Types.ObjectId[];
    }> = {};
    const productRemoveCategoriesQuery: mongoose.UpdateQuery<{
      title: string;
      slug: string;
      description: string;
      stock: number;
      price: number;
      unit: string;
      mainImg: string;
      images: string[];
      categories: mongoose.Types.ObjectId[];
    }> = {};
    const deleteFromCategoryFilter: mongoose.FilterQuery<{
      title: string;
      slug: string;
      group: string;
      products: mongoose.Types.ObjectId[];
    }> = {};
    const deleteFromCategoryQuery: mongoose.UpdateQuery<{
      title: string;
      slug: string;
      group: string;
      products: mongoose.Types.ObjectId[];
    }> = {};
    const addToCategoryFilter: mongoose.FilterQuery<{
      title: string;
      slug: string;
      group: string;
      products: mongoose.Types.ObjectId[];
    }> = {};
    const addToCategoryQuery: mongoose.UpdateQuery<{
      title: string;
      slug: string;
      group: string;
      products: mongoose.Types.ObjectId[];
    }> = {};
    // Eski ürünü al.
    const oldProduct = await productModel.findById(req.params._id);
    // Eski ürün yoksa hata ver.
    if (!oldProduct) {
      return res.status(404).json(new ResultBuilder().error("Belirtilen ürün bulunamadı!").result);
    }

    let groups: Array<string> = [];
    if (req.body.groups) groups = JSON.parse(req.body.groups);

    //#region Eski kategorileri üründen sil, yeni kategorileri diziye at.
    let categories: Array<mongoose.Types.ObjectId> = [];
    if (req.body.categories) req.body.categories = JSON.parse(req.body.categories);
    if (req.body.categories && Array.isArray(req.body.categories) && req.body.categories.length > 0) {
      categories = req.body.categories.map((id: string) => {
        const result = new mongoose.Types.ObjectId(id);
        return result;
      });
    }
    if (oldProduct.categories && oldProduct.categories.length > 0) {
      // Artık üründe bulunmayacak olan kategorileri bul.
      const categoriesToDelete =
        groups.length > 0
          ? oldProduct.categories
          : oldProduct.categories.filter((x) => categories.findIndex((y) => y.toString() === x.toString()) < 0);
      // Yeni eklenecek kategorileri bul.
      categories =
        groups.length > 0
          ? []
          : categories.filter((x) => oldProduct.categories.findIndex((y) => y.toString() === x.toString()) < 0);

      // // Artık üründe bulunmayacak olan kategorileri sil.
      // await productModel.findByIdAndUpdate(req.params.id, {
      //   $pull: { categories: { $in: categoriesToDelete } },
      // });

      // Silinecek kategori varsa query'e ekle.
      if (categoriesToDelete.length > 0) {
        productRemoveCategoriesQuery.$pull = { categories: { $in: categoriesToDelete.map((x) => x.toString()) } };

        deleteFromCategoryFilter._id = { $in: categoriesToDelete };
        deleteFromCategoryQuery.$pull = { products: req.params._id };
      }
      // Eklenecek kategori varsa query'e ekle.
      if (categories.length > 0) {
        productUpdateQuery.$push = { categories: { $each: categories.map((x) => x.toString()) } };

        addToCategoryFilter._id = { $in: categories };
        addToCategoryQuery.$push = { products: req.params._id };
      }
    }
    //#endregion
    productUpdateQuery.title = req.body.title;
    productUpdateQuery.slug = slugify(req.body.title);
    productUpdateQuery.description = req.body.description;
    productUpdateQuery.stock = +req.body.stock;
    productUpdateQuery.price = +req.body.price;
    productUpdateQuery.unit = req.body.unit;
    productUpdateQuery.mainImg = mainImgUrl;
    productUpdateQuery.images = imageUrls;

    const result = await productModel.findByIdAndUpdate(req.params._id, productRemoveCategoriesQuery, { new: true });
    const newProd = await productModel.findByIdAndUpdate(req.params._id, productUpdateQuery, { new: true });
    const deletedCats = await categoryModel.updateMany(deleteFromCategoryFilter, deleteFromCategoryQuery);
    const addedCats = await categoryModel.updateMany(addToCategoryFilter, addToCategoryQuery);

    return res.status(200).json(new ResultBuilder().ok().body(newProd?.toObject()).result);
  }, res);
});

adminProductRouter.delete("/delete/:_id", productImageHandler(), (req, res) => {
  wrapper(async () => {
    const result = await productModel.findByIdAndDelete(req.params._id);
    await categoryModel.updateMany({ products: req.params._id }, { $pull: { products: req.params._id } });
    return res.status(200).json(new ResultBuilder().ok().result);
  }, res);
});
