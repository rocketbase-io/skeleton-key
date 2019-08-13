const path = require('path');
const pkg = require('./package.json');
const dts = require('dts-bundle');
const removeEmpty = require('remove-empty-directories');

const paths = {
  src: './src',
  dist: './dist',
  entry: './src/index.ts'
};

Object.keys(paths).forEach(key => paths[key] = path.join(__dirname, paths[key]));


module.exports = {
  entry: paths.entry,
  mode: 'development',
  devtool: "inline-source-maps",
  node: {
    fs: 'empty'
  },
  stats: {
    warningsFilter: /^(?!CriticalDependenciesWarning$)/
  },
  output: {
    filename: 'index.js',
    path: paths.dist
  },
  devServer: {
    contentBase: paths.dist,
    compress: true,
    port: 9000,
    hot: true
  },
  resolve: {
    enforceExtension: false,
    extensions: [".ts",".tsx",".js",".jsx",".json"]
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new DtsBundlePlugin(),
    new RemoveEmptyDirsPlugin()
  ]
};


function DtsBundlePlugin(){}
DtsBundlePlugin.prototype.apply = function (compiler) {
  compiler.plugin('done', function(){
    dts.bundle({
      name: pkg.name,
      main: pkg.types,
      out: '../' + pkg.types,
      indent: '  ',
      newline: '\n',
      removeSource: true,
      outputAsModuleFolder: true // to use npm in-package typings
    });
  });
};


function RemoveEmptyDirsPlugin(){}
RemoveEmptyDirsPlugin.prototype.apply = function(compiler) {
  compiler.plugin('done', function() {
    removeEmpty(paths.dist);
  });
};
