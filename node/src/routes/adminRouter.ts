import express from "express";

import { decodeToken, verifyToken } from "../util/token.js";
import { wrapper } from "../util/requestHandlerWrapper.js";
import { ResultBuilder } from "../util/ResultBuilder.js";
import userModel from "../models/User.js";
import { adminProductRouter } from "./admin/adminProductRouter.js";
import { adminCategoryRouter } from "./admin/adminCategoryRouter.js";
import { Extension } from "../util/ExtendedRequest.js";

export const adminRouter = express.Router();

adminRouter.use("/", (req, res, next) => {
  wrapper(async () => {
    const extension: Extension = req.body.__ext;
    if (!extension.auth) {
      return res.status(401).json(new ResultBuilder().error("Lütfen kullanıcı girişi yapınız!").result);
    }

    if (!extension.auth.tokenVerified) {
      return res.status(401).json(new ResultBuilder().error("Geçersiz JWT!").result);
    }
    if (!extension.auth.decoded || !extension.auth.user)
      return res.status(401).json(new ResultBuilder().error("Belirtilen kullanıcı sistemde tanımlı değil!").result);

    if (!extension.auth.user.admin) return res.status(401).json(new ResultBuilder().error("Yetki yok!").result);

    next();
  }, res);
});

/* Kullanıcının admin rotasına girişinin 
olup olmadığını kontrol eden basit bir request handler. 
Yukarıda admin değilse zaten 401 gönderilecek ve bu rotaya gelinmeyecek. 
O yüzden burada sadece 200 göndermek yeterli. */
adminRouter.get("/", (req, res) => {
  return res.status(200).send();
});

adminRouter.use("/products", adminProductRouter);
adminRouter.use("/categories", adminCategoryRouter);
