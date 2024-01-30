import express from "express";
import * as core from "express-serve-static-core";
import mongoose, { Document, ObjectId } from "mongoose";

import { UserDocument } from "../models/User.js";
import { ProductData } from "../models/Product.js";

export interface Extension {
  /**
   * İlk middleware'de express request.body.__ext içerisine eklediğim bilgiler burada yer alacak.
   */
  host: string;
  auth?: {
    tokenVerified: boolean;
    decoded?: boolean;
    user:
      | (mongoose.Document<unknown, {}, UserDocument> &
          UserDocument & {
            _id: mongoose.Types.ObjectId;
          })
      | null;
  };
}
