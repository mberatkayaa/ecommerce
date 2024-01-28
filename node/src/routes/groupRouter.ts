import express from "express";

import { decodeToken } from "../util/token.js";
import { wrapper } from "../util/requestHandlerWrapper.js";
import { ResultBuilder } from "../util/ResultBuilder.js";
import userModel from "../models/User.js";
import { adminProductRouter } from "./admin/adminProductRouter.js";
import { adminCategoryRouter } from "./admin/adminCategoryRouter.js";
import categoryModel from "../models/Category.js";

const groupNames = [
  { value: "mousePad", name: "Mouse Pad" },
  { value: "bardak", name: "Kupa Bardak" },
  { value: "patch", name: "Patch & Yama" },
  { value: "yastık", name: "Gamer Yastık" },
  { value: "stand", name: "Kulaklık Standı" },
  { value: "poster", name: "Ahşap Poster" },
];

export const groupRouter = express.Router();

groupRouter.get("/", (req, res, next) => {
  wrapper(async () => {
    let result = [];
    for (let i = 0; i < groupNames.length; i++) {
      const element = groupNames[i];
      const categories = await categoryModel.find(
        {
          group: element.value,
        },
        {
          products: 0,
        }
      );
      result.push({ ...element, categories });
    }
    return res.status(200).json(new ResultBuilder().ok().body(result).result);
  }, res);
});
