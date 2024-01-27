import express from "express";

import { decodeToken, verifyToken } from "../util/token.js";
import { wrapper } from "../util/requestHandlerWrapper.js";
import { ResultBuilder } from "../util/ResultBuilder.js";
import userModel from "../models/User.js";
import { adminProductRouter } from "./admin/adminProductRouter.js";
import { adminCategoryRouter } from "./admin/adminCategoryRouter.js";

export const adminRouter = express.Router();

adminRouter.use("/", (req, res, next) => {
  // decodeToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InF3ZUBxcSIsIl9pZCI6IjY1YjJiMzUzYzVmOGIxMGM5ZjFlZmQ4OCIsImlhdCI6MTcwNjIxMDEzMSwiZXhwIjoxNzA4ODAyMTMxfQ.D9SbeiQAfwScXXTdZuNDrtuyVsDDs9BG8Hcy7QxGHnU")
  wrapper(async () => {
    if (!req.headers.authorization) {
      return res.status(401).json(new ResultBuilder().error("Lütfen kullanıcı girişi yapınız!").result);
    }
    const token = req.headers.authorization.replace("Bearer", "").trim();
    if (!verifyToken(token)) {
      return res.status(401).json(new ResultBuilder().error("Geçersiz JWT!").result);
    }
    const decoded = decodeToken(token);
    if (!decoded)
      return res.status(401).json(new ResultBuilder().error("Belirtilen kullanıcı sistemde tanımlı değil!").result);

    const user = await userModel.findOne({ email: decoded.email, _id: decoded._id });
    if (!user)
      return res.status(401).json(new ResultBuilder().error("Belirtilen kullanıcı sistemde tanımlı değil!").result);

    if (!user.admin) return res.status(401).json(new ResultBuilder().error("Yetki yok!").result);

    next();
  }, res);
});

adminRouter.use("/products", adminProductRouter);
adminRouter.use("/categories", adminCategoryRouter);
