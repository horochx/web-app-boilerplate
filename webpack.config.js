const fs = require("fs");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const { DefinePlugin } = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");

const envConfig = require("dotenv").parse(fs.readFileSync(".env"));

const exclude = /node_modules/;

const isDev = process.env.NODE_ENV !== "production";

module.exports = {
  mode: isDev ? "development" : "production",

  target: isDev ? "web" : "browserslist",

  entry: {
    index: "./src/index.tsx",
  },

  output: {
    path: path.join(__dirname, "dist"),
    publicPath: "",
    hashDigestLength: 8,
    filename: isDev ? "js/[name].js" : "js/[name].[contenthash].js",
    assetModuleFilename: isDev
      ? "assets/[name][ext]"
      : "assets/[name].[contenthash][ext]",
    clean: true,
  },

  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude,
        use: [
          "cache-loader",
          "thread-loader",
          "babel-loader",
          {
            loader: "ts-loader",
            options: {
              happyPackMode: true,
              getCustomTransformers: path.join(
                __dirname,
                "./webpack.ts-transformers"
              ),
            },
          },
        ],
      },

      {
        test: /\.css$/,
        use: [
          isDev
            ? "style-loader"
            : {
                loader: MiniCssExtractPlugin.loader,
                options: {
                  publicPath: "../",
                },
              },
          "css-loader",
          "postcss-loader",
        ],
      },

      {
        test: /\.(png|svg|jpe?g|gif)$/,
        type: "asset",
      },

      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        type: "asset",
      },
    ],
  },

  resolve: {
    extensions: [".tsx", ".ts", ".js", ".json"],
    alias: {
      assets: path.join(__dirname, "src/assets"),
      lib: path.join(__dirname, "src/lib"),
    },
  },

  devtool: isDev ? "eval-source-map" : false,

  devServer: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },
    },
    publicPath: "/",
    contentBase: path.join(__dirname, "public"),
    disableHostCheck: true,
    hot: true,
  },

  plugins: [
    isDev
      ? null
      : new CopyPlugin({
          patterns: [{ from: "public" }],
        }),

    new DefinePlugin({
      ...Object.entries(envConfig).reduce((obj, [key, val]) => {
        obj[`process.env.${key}`] = JSON.stringify(val);
        return obj;
      }, {}),
    }),

    new HtmlWebpackPlugin({
      template: "./src/index.html",
      chunks: ["index"],
      filename: "index.html",
    }),

    isDev
      ? null
      : new MiniCssExtractPlugin({
          filename: "css/[name].[contenthash].css",
        }),

    isDev
      ? new ForkTsCheckerWebpackPlugin({
          typescript: {
            diagnosticOptions: {
              semantic: true,
              syntactic: true,
            },
          },
        })
      : null,

    isDev ? new ReactRefreshWebpackPlugin() : null,
  ].filter((_) => _ != null),

  optimization: {
    moduleIds: "deterministic",
    runtimeChunk: "single",
    minimize: !isDev,
    minimizer: ["...", new CssMinimizerPlugin()],
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/](core-js|react|react-dom|react-router-dom)[\\/]/,
          name: "vendor",
          chunks: "all",
        },
      },
    },
  },
};
