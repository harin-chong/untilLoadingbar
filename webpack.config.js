
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const Dotenv = require("dotenv-webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = (env, argv) => {
  const isProduction = argv.mode === "production";

  return {
    mode: isProduction ? "production" : "development",

    entry: path.resolve(__dirname, "src", "index.tsx"),

    resolve: {
      extensions: [".tsx", ".ts", ".js"],
    },

    module: {
      rules: [
        {
          test: /\.css$/i,
          use: ["style-loader", "css-loader"],
        },
        {
          test: /\.svg$/i,
          issuer: /\.[jt]sx?$/,
          use: ["@svgr/webpack"],
        },
        {
          test: /\.(png|jpe?g|gif|ico)$/i,
          type: "asset/resource",
          generator: {
            filename: "images/[name][ext]",
          },
        },
        {
          test: /\.(ts|tsx|js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
          },
        },
      ],
    },

    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "[name].js",
      chunkFilename: "[name].js",
      publicPath: "/",
      clean: true,
    },

    devtool: isProduction ? "source-map" : "inline-source-map",

    devServer: {
      port: 3000,
      open: true,
      hot: true,
      historyApiFallback: true,
    },

    optimization: {
      minimize: isProduction,
    },

    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, "public", "index.html"),
      }),
      new Dotenv({
  allowEmptyValues: true,
  systemvars: true,
  defaults: false,
}),
    ],
  };
};
