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

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(rootPath, "public")));
console.log(imageFolder)
app.use("/", authRouter);
app.use("/admin", adminRouter);
app.use("/categories", categoryRouter);

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
