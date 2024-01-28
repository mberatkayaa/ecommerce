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

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(rootPath, "public")));
console.log(imageFolder);

app.use("/", (req, res, next) => {
  const reqAny: any = req;
  reqAny.__host = req.protocol + "://" + req.get("host") + "/";
  next();
});

app.use("/", authRouter);
app.use("/admin", adminRouter);
app.use("/categories", categoryRouter);
app.use("/products", productRouter);

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
