const fs = require("fs");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const { DefinePlugin } = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const { GenerateSW } = require("workbox-webpack-plugin");

const dotenv = require("dotenv");
const envConfig = dotenv.parse(fs.readFileSync(".env"));

const toml = require("toml");
const yaml = require("yamljs");
const json5 = require("json5");

const include = path.resolve(__dirname, "src");

module.exports = (env) => {
  const isEnvProduction = !!env.production;

  const cssLoaders = [
    !isEnvProduction
      ? "style-loader"
      : {
          loader: MiniCssExtractPlugin.loader,
          options: {
            publicPath: "../",
          },
        },
    "css-loader",
    "postcss-loader",
  ];

  return {
    mode: !isEnvProduction ? "development" : "production",

    entry: {
      main: "./src/entry/main.tsx",
    },

    output: {
      path: path.resolve(__dirname, "dist"),
      filename: !isEnvProduction
        ? "[name].bundle.js"
        : "js/[name].[contenthash].js",
      assetModuleFilename: !isEnvProduction
        ? "assets/[name][ext]"
        : "assets/[name][contenthash][ext]",
      publicPath: "./",
    },

    module: {
      rules: [
        {
          test: /\.[jt]sx?$/,
          include,
          use: [
            {
              loader: "babel-loader",
              options: {
                envName: !isEnvProduction ? "development" : "production",
              },
            },
          ],
        },

        {
          test: /\.css$/i,
          include,
          use: cssLoaders,
        },

        {
          test: /\.s[ac]ss$/i,
          include,
          use: [...cssLoaders, "sass-loader"],
        },

        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          include,
          type: "asset/resource",
        },

        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          include,
          type: "asset/resource",
        },

        {
          test: /\.(csv|tsv)$/i,
          include,
          use: ["csv-loader"],
        },

        {
          test: /\.xml$/i,
          include,
          use: ["xml-loader"],
        },

        {
          test: /\.toml$/i,
          include,
          type: "json",
          parser: {
            parse: toml.parse,
          },
        },

        {
          test: /\.yaml$/i,
          include,
          type: "json",
          parser: {
            parse: yaml.parse,
          },
        },

        {
          test: /\.json5$/i,
          include,
          type: "json",
          parser: {
            parse: json5.parse,
          },
        },
      ],
    },

    resolve: {
      alias: {
        assets: path.join(__dirname, "src/assets"),
        lib: path.join(__dirname, "src/lib"),
      },
      extensions: [".ts", ".tsx", ".js", ".jsx"],
      symlinks: false,
    },

    devtool: !isEnvProduction ? "eval-cheap-module-source-map" : false,

    target: "web",

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
      open: true,
      hot: true,
    },

    plugins: [
      !isEnvProduction ? void 0 : new CleanWebpackPlugin(),

      !isEnvProduction
        ? void 0
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
        title: "Hello webpack",
        template: "./src/template/index.html",
        chunks: ["main"],
        filename: "index.html",
      }),

      !isEnvProduction
        ? void 0
        : new MiniCssExtractPlugin({
            filename: "css/[name].[contenthash].css",
          }),

      !isEnvProduction ? new ReactRefreshWebpackPlugin() : void 0,

      !isEnvProduction
        ? void 0
        : new GenerateSW({
            clientsClaim: true,
            skipWaiting: false,
          }),
    ].filter(Boolean),

    optimization: {
      runtimeChunk: "single",
      minimize: isEnvProduction,
      minimizer: !isEnvProduction ? void 0 : ["...", new CssMinimizerPlugin()],
      splitChunks: !isEnvProduction
        ? false
        : {
            cacheGroups: {
              vendor: {
                test: /[\\/]node_modules[\\/]/,
                name: "vendors",
                chunks: "all",
              },
            },
          },
    },
  };
};
