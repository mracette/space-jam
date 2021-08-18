// Generated using webpack-cli https://github.com/webpack/webpack-cli

const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const path = require("path");

const isProduction = process.env.NODE_ENV === "production";
const optimize = process.env.OPTIMIZE === "true";

const stylesHandler = "style-loader";

const config = {
  entry: "./src/index.ts",
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "bundle.js"
  },
  devServer: {
    open: true,
    host: "localhost"
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "index.html"
    })
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
        use: [stylesHandler, "css-loader"]
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
    config.mode = "production";
    config.optimization = {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: {
              ecma: 2020,
              unsafe: true
            },
            mangle: {
              toplevel: true,
              properties: {
                debug: !isProduction,
                reserved: []
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
