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
console.log(imageFolder);

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

app.get("/deneme4/:categoryIds", async (req, res) => {
  try {
    const objId = req.params.categoryIds.split(",");
    const res2 = await categoryModel.updateMany({}, {});
    res.send(req.params.categoryIds + " id'lerine sahip kategorilerden, " + " boş id'sine sahip ürün silindi.");
  } catch (err) {
    const q = err;
  }
});

app.get("/deneme3/:categoryIds/:prodId", async (req, res) => {
  try {
    const objId = req.params.categoryIds.split(",");
    const res2 = await categoryModel.updateMany(
      {
        _id: {
          $in: objId,
        },
      },
      { $pull: { products: req.params.prodId } }
    );
    res.send(
      req.params.categoryIds + " id'lerine sahip kategorilerden, " + req.params.prodId + " id'sine sahip ürün silindi."
    );
  } catch (err) {
    const q = err;
  }
});

app.get("/deneme2/:categoryIds", async (req, res) => {
  try {
    const objId = req.params.categoryIds.split(",");
    const res2 = await categoryModel.find({
      _id: {
        $in: objId,
      },
    });
    res.send(req.params.categoryIds + " id'lerine sahip kategoriler bulundu");
  } catch (err) {
    const q = err;
  }
});

app.get("/deneme/:prodId", async (req, res) => {
  try {
    const objId = req.params.prodId;
    const res2 = await categoryModel.find({ products: objId });
    const result = await categoryModel.updateMany({ products: objId }, { $pull: { products: objId } });
    res.send(req.params.prodId + " id'sine sahip ürün, bulunduğu kategorilerden silindi. ");
  } catch (err) {
    const q = err;
  }
});

app.post("/signin", (req, res) => {
  res.send("server up and running");
});

app.post("/signup", (req, res) => {
  res.send("hey!");
});

mongoose
  .connect(process.env.MONGO_CONN_STR!)
  .then(() => {
    app.listen(3000, () => {
      console.log("server running");
    });
  })
  .catch((err) => console.log(err));
