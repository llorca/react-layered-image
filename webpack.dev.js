const merge = require("webpack-merge");
const path = require("path");

const CleanWebpackPlugin = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const common = require("./webpack.common.js");

module.exports = merge(common, {
  entry: "./example/index.tsx",
  output: {
    path: path.resolve(__dirname, "./example/build"),
    filename: "index.js",
    library: "react-layered-image",
    libraryTarget: "umd",
  },
  devtool: "eval",
  devServer: {
    contentBase: "./example/build",
  },
  plugins: [
    new CleanWebpackPlugin(["example/build"]),
    // prettier-ignore
    new CopyWebpackPlugin([{
      from: "./example/index.html",
        to: "./index.html",
    }, {
      from: "./example/static/",
        to: "./static/",
    }]),
  ],
});
