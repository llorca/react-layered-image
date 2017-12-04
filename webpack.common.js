const path = require("path");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: "./lib/index.ts",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.js",
    library: "react-layered-image",
    libraryTarget: "umd",
  },
  resolve: {
    extensions: [".js", "jsx", ".ts", ".tsx"],
  },
  externals: {
    react: "react",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "awesome-typescript-loader",
        exclude: /node_modules/,
        query: {
          declaration: false,
        },
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(["dist"]),
    new CopyWebpackPlugin([
      {
        from: "typings/LayeredImage.d.ts",
        to: "index.d.ts",
      },
    ]),
  ],
};
