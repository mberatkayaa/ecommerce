import express from "express";
import bcrypt from "bcryptjs";

import userModel from "../models/User.js";
import { wrapper } from "../util/requestHandlerWrapper.js";
import { ResultBuilder } from "../util/ResultBuilder.js";
import { getToken } from "../util/token.js";

export const authRouter = express.Router();

authRouter.post("/signup", (req, res) => {
  wrapper(async () => {
    const result = await userModel.findOne({ email: req.body.email });
    if (result) {
      return res
        .status(400)
        .json(
          new ResultBuilder()
            .error("Bu email hesabıyla daha önce kullanıcı oluşturulmuş!")
            .body({ email: req.body.email }).result
        );
    }
    const hash = await bcrypt.hash(req.body.password, 10);
    const createResult = await userModel.create({ email: req.body.email, password: hash });

    const token = getToken(createResult.email, createResult._id.toString());
    return res.status(200).json(new ResultBuilder().ok().body({ token }).result);
  }, res);
});

authRouter.post("/signin", (req, res) => {
  wrapper(async () => {
    const result = await userModel.findOne({ email: req.body.email });
    if (!result || !(await bcrypt.compare(req.body.password, result.password))) {
      return res.status(404).json(new ResultBuilder().error("Kullanıcı adı veya parola hatalı!").result);
    }

    const token = getToken(result.email, result._id.toString());
    return res.status(200).json(new ResultBuilder().ok().body({ token }).result);
  }, res);
});
