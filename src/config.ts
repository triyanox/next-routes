import path from "path";
import { NextRoutesOptions } from "./types";

const __app_dir__ = path.resolve(process.cwd(), "src/app");
const __types_dir__ = path.resolve(
  process.cwd(),
  "node_modules/@types",
  "next-routes",
);
const __valid_page_extensions__ = [".tsx", ".ts", ".js", ".jsx", ".mdx"];

const defaultNextRoutesOptions: NextRoutesOptions = {
  appDir: __app_dir__,
  declarationPath: path.resolve(__types_dir__, "index.d.ts"),
  utilsPath: path.resolve(path.resolve(__app_dir__, "..", "lib", "link$.ts")),
};

export {
  __app_dir__,
  __valid_page_extensions__,
  defaultNextRoutesOptions,
  __types_dir__,
};
