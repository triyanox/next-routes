import { defineConfig } from "tsup";

export default defineConfig({
  target: "esnext",
  format: ["cjs", "esm"],
  dts: true,
});
