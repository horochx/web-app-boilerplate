const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

const toml = require("toml");
const yaml = require("yamljs");
const json5 = require("json5");

const include = path.resolve(__dirname, "src");

module.exports = env => {
  const isEnvProduction = !!env.production;

  return {
    mode: !isEnvProduction ? "development" : "production",

    entry: {
      main: "./src/entry/main.js",
      login: "./src/entry/login.js",
    },

    output: {
      path: path.resolve(__dirname, "dist"),
      filename: !isEnvProduction ? "[name].bundle.js" : "js/[name].[contenthash].js",
      publicPath: "./",
    },

    module: {
      rules: [
        {
          test: /\.css$/i,
          include,
          use: [!isEnvProduction ? "style-loader" : MiniCssExtractPlugin.loader, "css-loader"],
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
      symlinks: false,
    },

    devtool: !isEnvProduction ? "eval-cheap-module-source-map" : false,

    devServer: {
      proxy: {
        "/api": "http://localhost:3000",
      },
      contentBase: path.join(__dirname, "public"),
      open: true,
      hot: true,
    },

    plugins: [
      new CleanWebpackPlugin(),

      new CopyPlugin({
        patterns: [
          { from: "public" },
        ],
      }),

      new HtmlWebpackPlugin({
        title: "Hello webpack",
        chunks: ["main"],
        filename: "index.html",
      }),
      new HtmlWebpackPlugin({
        title: "Login",
        chunks: ["login"],
        filename: "login.html",
      }),

      !isEnvProduction ? void 0 : new MiniCssExtractPlugin({ filename: "css/[name].[contenthash].css" }),
    ].filter(Boolean),

    optimization: {
      runtimeChunk: "single",
      minimize: isEnvProduction,
      minimizer: !isEnvProduction ? void 0 : ["...", new CssMinimizerPlugin()],
      splitChunks: !isEnvProduction ? false : {
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
