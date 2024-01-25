import { Response } from "express";
import { ResultBuilder } from "./ResultBuilder.js";

export const wrapper = async (callback: Function, res: Response) => {
  try {
    await callback();
  } catch (err) {
    res.status(500).json(new ResultBuilder().error("Internal server error!").result);
  }
};
