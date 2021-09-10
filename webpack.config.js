const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const InlineChunkHtmlPlugin = require("react-dev-utils/InlineChunkHtmlPlugin");
const TerserPlugin = require("terser-webpack-plugin");
const path = require("path");

const isProduction = process.env.NODE_ENV === "production";
const optimize = process.env.OPTIMIZE === "true";
const designMode = process.env.DESIGN_MODE;

let entry, template;

switch (designMode) {
  case "audio": {
    entry = "./editor-audio/index.ts";
    template = "./editor-audio/template.html";
    break;
  }
  case "visuals": {
    entry = "./editor-visuals/index.ts";
    template = "./editor-visuals/template.html";
    break;
  }
  default: {
    entry = "./src/index.ts";
    template = "./src/index.html";
    break;
  }
}

const config = {
  entry,
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "bundle.js"
  },
  devServer: {
    open: true,
    host: "127.0.0.1",
    disableHostCheck: true
  },
  plugins: [
    new CleanWebpackPlugin({
      dry: !isProduction
    }),
    new HtmlWebpackPlugin({
      template,
      inline: optimize,
      inject: "body",
      minify: {
        collapseWhitespace: isProduction
      }
    }),
    new MiniCssExtractPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        loader: "ts-loader",
        exclude: ["/node_modules/"]
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"]
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: "asset"
      }
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    modules: [path.resolve("./node_modules"), path.resolve("./src")]
  }
};

module.exports = () => {
  if (isProduction && optimize) {
    config.plugins.push(new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/.*/]));
    config.mode = "production";
    config.optimization = {
      minimize: true,
      minimizer: [
        new CssMinimizerPlugin(),
        new TerserPlugin({
          terserOptions: {
            compress: {
              ecma: 2020
              // unsafe: true
            },
            mangle: {
              toplevel: true,
              properties: {
                debug: !isProduction,
                reserved: [
                  "baseVolume",
                  "baseReverb",
                  "lpFrequency",
                  "lpQ",
                  "lpEnvQ",
                  "hpFrequency",
                  "hpQ",
                  "hpEnvQ"
                ]
              }
            }
          }
        })
      ]
    };
  } else if (isProduction && !optimize) {
    config.mode = "none";
    config.optimization = {};
  } else {
    config.mode = "development";
  }
  return config;
};
