const path = require("path")
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const CopyWebpackPlugin = require("copy-webpack-plugin")

const common = require("./webpack.common.js")

module.exports = {
  ...common,
  mode: "development",
  entry: "./example/index.tsx",
  output: {
    path: path.resolve(__dirname, "./example/build"),
    filename: "index.js",
    library: "react-layered-image",
    libraryTarget: "umd",
  },
  devServer: {
    contentBase: "./example/build",
    host: "0.0.0.0",
    port: 8080,
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanAfterEveryBuildPatterns: ["example/build"],
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "./example/index.html",
          to: "./index.html",
        },
        {
          from: "./example/static/",
          to: "./static/",
        },
      ],
    }),
  ],
}
