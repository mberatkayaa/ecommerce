import path from "path";
import fs from "fs";

import multer from "multer";
import lodash from "lodash";
import ShortUniqueId from "short-unique-id";

import { imageFolder } from "./paths.js";

export const productFileKeys = { mainImg: "file-mainImg", images: "file-images" };

export function productImageHandler() {
  return multer({ dest: imageFolder }).fields([{ name: productFileKeys.mainImg }, { name: productFileKeys.images }]);
}

export function renameImage(file: Express.Multer.File): string {
  // [...Dosya Adı Segmentleri, Uzantı] dizisine çevir.
  const arr = file.originalname.split(".");
  // Uzantıyı diziden çıkar ve değişkene değer olarak ata.
  const extension = arr.pop();
  // Uzantısız dosya adını bul.
  let newName = arr.join(".");
  // lodash ile adı dönüştür.
  newName = lodash.kebabCase(lodash.escape(newName));
  // Aynı resmin tekrar yüklenmesine olasılığına karşın rastgele karakter ekle.
  newName += "-" + new ShortUniqueId.default({ length: 8 }).rnd();
  // Geçerli URI karakterlerine dönüştür.
  newName = encodeURI(newName);
  // Eklentiyi dosya sonuna ekle.
  newName += extension ? "." + extension : "";
  // multer tarafından kaydedilmiş dosyanın tam yolunu değişkene ata.
  const oldPath = path.join(imageFolder, file.filename);
  // Hedef tam yolu değişkene ata.
  const newPath = path.join(imageFolder, newName);
  // Dosyayı yeniden adlandır.
  fs.renameSync(oldPath, newPath);
  // URI döndür.
  return `images/${newName}`;
}
