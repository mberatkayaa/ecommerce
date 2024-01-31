import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import mongoose from "mongoose";
import dotenv from "dotenv";
import { authRouter } from "./routes/authRouter.js";
import { adminRouter } from "./routes/adminRouter.js";
import { categoryRouter } from "./routes/categoryRouter.js";
import path from "path";
import { imageFolder, rootPath } from "./util/paths.js";
import categoryModel from "./models/Category.js";
import { productRouter } from "./routes/productRouter.js";
import { decodeToken, verifyToken } from "./util/token.js";
import userModel from "./models/User.js";
import { Extension } from "./util/ExtendedRequest.js";
import { groupRouter } from "./routes/groupRouter.js";
import { cartRouter } from "./routes/cartRouter.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(rootPath, "public")));

app.use("/", async (req, res, next) => {
  // Host, resim bilgilerine eklemek için.
  req.body.__ext = { host: req.protocol + "://" + req.get("host") + "/" };
  //#region Auth
  if (req.headers.authorization) {
    const token = req.headers.authorization.replace("Bearer", "").trim();
    if (!verifyToken(token)) {
      req.body.__ext.auth = { tokenVerified: false };
    } else {
      req.body.__ext.auth = { tokenVerified: true };
      const decoded = decodeToken(token);
      if (!decoded) {
        req.body.__ext.auth.decoded = false;
      } else {
        req.body.__ext.auth.decoded = true;
        const user = await userModel
          .findOne({ email: decoded.email, _id: decoded._id })
          .populate("cart.product")
          .exec();

        req.body.__ext.auth.user = user;
      }
    }
  }
  //#endregion
  next();
});

app.use("/", authRouter);
app.use("/admin", adminRouter);
app.use("/categories", categoryRouter);
app.use("/products", productRouter);
app.use("/groups", groupRouter);
app.use("/cart", cartRouter);

mongoose
  .connect(process.env.MONGO_CONN_STR!, { autoIndex: true })
  .then(() => {
    app.listen(3000, () => {
      console.log("Server running");
    });
  })
  .catch((err) => console.error("Error at start: ", err));
