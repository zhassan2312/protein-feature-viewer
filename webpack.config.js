// Generated using webpack-cli https://github.com/webpack/webpack-cli
// Dependencies
const path = require("path");
// Plugins
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlInlineScriptPlugin = require('html-inline-script-webpack-plugin');
const HtmlInlineCSSWebpackPlugin = require('html-inline-css-webpack-plugin').default;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// Define whether current environment is production or not
const isProduction = process.env.NODE_ENV === "production";
// Main configuration options
const config = {
  // Entry point for the app
  entry: {
    'constructor': { import: './feature-constructor.ts'},
  },
  // Define output file and directory
  output: {
    // Define output file name
    filename: "[name].js",
    // Define output directory
    path: path.resolve(__dirname, "dist"),
    // Define a library (Universal Module Definition)
    library: "feature-viewer-typescript",
    libraryTarget: "umd",
    umdNamedDefine: true,
    // Clean the output directory before emit.
    clean: true,
  },
  // Live development server
  devServer: {
    open: true,
    host: "localhost",
  },
  plugins: [
    new MiniCssExtractPlugin(),
  ],
 externals:[
    {inputValues: "inputValues"}
  ],
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        loader: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.s[ac]ss$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
        // use: ["css-loader", "sass-loader"],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: "asset",
      },
      // Add your rules for custom modules here
      // Learn more about loaders from https://webpack.js.org/loaders/
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", "..."],
  },
};

if(isProduction){
  // template  for production
  config["plugins"].push(
    new HtmlWebpackPlugin({
      template: "prod_template.html",
    }),
    new HtmlInlineScriptPlugin(),
    new HtmlInlineCSSWebpackPlugin()
  )
} else {
  // Template for live dev server
  config["plugins"].push(
    new HtmlWebpackPlugin({
      template: "dev_template_alt.html",
    })
  )
}

// Export actual module
module.exports = () => {
  if (isProduction) {
    config.mode = "production";
  } else {
    config.mode = "development";
  }
  return config;
};
