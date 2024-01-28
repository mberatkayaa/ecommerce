import express from "express";
import * as core from "express-serve-static-core";
import mongoose, { Document, ObjectId } from "mongoose";

import { UserDocument } from "../models/User.js";

export interface Extension {
  /**
   * İlk middleware'de express request.body.__ext içerisine eklediğim bilgiler burada yer alacak.
   */
  host: string;
  auth?: {
    tokenVerified: boolean;
    decoded?: boolean;
    user?: (Document<unknown, {}, UserDocument> & UserDocument & { _id: ObjectId }) | null;
  };
}
