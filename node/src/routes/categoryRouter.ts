import express from "express";

import { decodeToken } from "../util/token.js";
import { wrapper } from "../util/requestHandlerWrapper.js";
import { ResultBuilder } from "../util/ResultBuilder.js";
import userModel from "../models/User.js";
import { adminProductRouter } from "./admin/adminProductRouter.js";
import { adminCategoryRouter } from "./admin/adminCategoryRouter.js";
import categoryModel from "../models/Category.js";

export const categoryRouter = express.Router();

categoryRouter.get("/", (req, res, next) => {
  wrapper(async () => {
    const result = await categoryModel.find();
    return res.status(200).json(new ResultBuilder().ok().body(result).result);
  }, res);
});
