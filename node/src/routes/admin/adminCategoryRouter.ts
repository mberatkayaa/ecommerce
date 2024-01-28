import express from "express";
import mongoose from "mongoose";

import { wrapper } from "../../util/requestHandlerWrapper.js";
import categoryModel from "../../models/Category.js";
import { ResultBuilder } from "../../util/ResultBuilder.js";
import { slugify } from "../../util/slugify.js";

export const adminCategoryRouter = express.Router();

adminCategoryRouter.post("/add", (req, res) => {
  wrapper(async () => {
    const category = new categoryModel({
      title: req.body.title,
      slug: slugify(req.body.title),
      group: req.body.group,
    });
    const savedCategory = await category.save();
    const categoryObj = savedCategory.toObject();
    res.status(200).json(new ResultBuilder().ok().body(categoryObj).result);
  }, res);
});

adminCategoryRouter.patch("/edit", (req, res) => {
  wrapper(async () => {
    const result = await categoryModel.findByIdAndUpdate(
      req.body._id,
      {
        title: req.body.title,
        slug: slugify(req.body.title),
        group: req.body.group,
      },
      { new: true }
    );
    if (!result) {
      return res.status(404).json(new ResultBuilder().error("Kategori bulunamadı!").result);
    }
    const categoryObj = result.toObject();
    res.status(200).json(new ResultBuilder().ok().body(categoryObj).result);
  }, res);
});

adminCategoryRouter.delete("/delete/:_id", (req, res) => {
  wrapper(async () => {
    const result = await categoryModel.findByIdAndDelete(req.params._id, { new: true });
    if (!result) {
      return res.status(404).json(new ResultBuilder().error("Kategori bulunamadı!").result);
    }
    const categoryObj = result.toObject();
    res.status(200).json(new ResultBuilder().ok().body(categoryObj).result);
  }, res);
});
