import path from "path";

let rawRootPath = path.join(path.dirname(import.meta.url), "../");
if (rawRootPath.startsWith("file:")) {
    rawRootPath = rawRootPath.slice(6);
}
export const rootPath = rawRootPath;

export const imageFolder = path.join(rootPath, "public", "images");
