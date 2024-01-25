import express from "express";

import { userModel } from "../models/User.js";
import { wrapper } from "../util/requestHandlerWrapper.js";
import { ResultBuilder } from "../util/ResultBuilder.js";

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
    const createResult = await userModel.create({ email: req.body.email, password: req.body.password });
    return res.status(200).json(new ResultBuilder().ok().result);
    userModel
      .findOne({
        email: req.body.email,
      })
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });
    res.status(200).send();
  }, res);
});

authRouter.post("/signin", (req, res) => {
  userModel
    .findOne({
      email: req.body.email,
    })
    .then((result) => {
      console.log(result);
    })
    .catch((err) => {
      console.log(err);
    });
  res.status(200).send();
});
