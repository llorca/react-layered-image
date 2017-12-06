module.exports = {
  resolve: {
    extensions: [".ts", ".tsx", ".js", "jsx"],
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
};
