const merge = require("webpack-merge");
const path = require("path");

const CopyWebpackPlugin = require("copy-webpack-plugin");

const common = require("./webpack.common.js");

module.exports = merge(common, {
  entry: {
    index: "./site/index.tsx",
    bundle: "./lib/index.ts",
  },
  output: {
    path: path.resolve(__dirname, "./site/build"),
    filename: "[name].js",
    library: "react-layered-image",
    libraryTarget: "umd",
  },
  devtool: "eval",
  devServer: {
    contentBase: "./site/build",
    hot: false,
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: "./site/index.html",
        to: "./index.html",
      },
      {
        from: "./site/static/",
        to: "./static/",
      },
    ]),
  ],
});
