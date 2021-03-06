/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require("fs");
const path = require("path");
const pkg = require("./package.json");
const dts = require("dts-bundle");
const removeEmpty = require("remove-empty-directories");

const paths = {
  src: "./src",
  dist: "./dist",
  entry: "./src/index.ts",
};

Object.keys(paths).forEach((key) => (paths[key] = path.join(__dirname, paths[key])));

module.exports = {
  entry: paths.entry,
  mode: "development",
  devtool: "inline-source-map",
  target: "node",
  node: { fs: "empty" },
  stats: {
    warningsFilter: /^(?!CriticalDependenciesWarning$)/,
  },
  output: {
    filename: "index.js",
    library: {
      root: pkg.name,
      amd: pkg.name,
      commonjs: pkg.name,
    },
    //  libraryExport: ["default"],
    libraryTarget: "umd",
    globalObject: "this",
  },
  externals: ["axios"],
  devServer: {
    contentBase: paths.dist,
    compress: true,
    port: 9000,
    hot: true,
  },
  resolve: {
    enforceExtension: false,
    extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [new DtsBundlePlugin(), new RemoveEmptyDirsPlugin(), new DtsRemoveDynamicImportsPlugin()],
};

function DtsBundlePlugin() {}
DtsBundlePlugin.prototype.apply = function (compiler) {
  compiler.plugin("done", function () {
    dts.bundle({
      name: pkg.name,
      main: pkg.types,
      out: "../" + pkg.types,
      indent: "  ",
      newline: "\n",
      removeSource: true,
      outputAsModuleFolder: true, // to use npm in-package typings
    });
  });
};

function RemoveEmptyDirsPlugin() {}
RemoveEmptyDirsPlugin.prototype.apply = function (compiler) {
  compiler.plugin("done", function () {
    removeEmpty(paths.dist);
  });
};

function DtsRemoveDynamicImportsPlugin() {}
DtsRemoveDynamicImportsPlugin.prototype.apply = function (compiler) {
  compiler.plugin("done", function () {
    const regexDynamicImport = /import\("[^"]+"\)\./g;
    const regexUnexportedConst = /([\n\r]+)(const [^\s:]+:)/g;

    const dtsSource = fs.readFileSync(pkg.types).toString("utf8");
    const stripped = dtsSource.replace(regexDynamicImport, "");
    const replaced = stripped.replace(regexUnexportedConst, (all, lb, val) => `${lb}export ${val}`);

    fs.writeFileSync(pkg.types, replaced);
  });
};
