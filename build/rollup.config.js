import sourcemaps from "rollup-plugin-sourcemaps";
import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import ts from "@wessberg/rollup-plugin-ts";
import paths from "rollup-plugin-ts-paths";
import { name, globals, external } from "./package";
import banner from "./banner";

export default {
  input: "src/index.ts",
  output: ["umd", "esm", "cjs"].map((format) => ({
    file: `dist/${name}.${format}.js`,
    exports: "named",
    sourcemap: true,
    format,
    globals,
    name,
    banner,
  })),
  external,
  // eslint-disable-next-line prettier/prettier
  plugins: [
    nodeResolve(),
    paths(),
    ts({ tsconfig: "tsconfig.build.json" }),
    sourcemaps(),
    commonjs()
  ],
};
