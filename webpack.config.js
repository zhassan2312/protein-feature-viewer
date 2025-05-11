const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlInlineScriptPlugin = require("html-inline-script-webpack-plugin");
const HtmlInlineCSSWebpackPlugin = require("html-inline-css-webpack-plugin").default;
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const isProduction = process.env.NODE_ENV === "production";

// Define multiple entry points
const entries = {
  //For Webpack Serve 
  index: { import: "./feature-constructor.ts" }, 

  // Panel Entries
  Main_Panel_Canvas: { import: "./panels/Main_Panel.ts" },
  Disorder_Panel_Canvas: { import: "./panels/Disorder_Panel.ts" }, 
  ASA_Panel_Canvas: { import: "./panels/ASA_Panel.ts" }, 
  SS_Panel_Canvas: { import: "./panels/SS_Panel.ts" }, 
  Protein_Panel_Canvas: { import: "./panels/Protein_Panel.ts" }, 
  DNA_Panel_Canvas: { import: "./panels/DNA_Panel.ts" }, 
  RNA_Panel_Canvas: { import: "./panels/RNA_Panel.ts" }, 
  SignalP_Panel_Canvas: { import: "./panels/SignalP_Panel.ts" }, 
  Conservation_Panel_Canvas: { import: "./panels/Conservation_Panel.ts" }, 
  Linker_Panel_Canvas: { import: "./panels/Linker_Panel.ts" }, 
  PTM_Panel_allrow_Canvas: { import: "./panels/PTM_Panel_allrow.ts" }, 
};

const config = {
  entry: entries,
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
    library: "feature-viewer-typescript",
    libraryTarget: "umd",
    umdNamedDefine: true,
    clean: true,
  },
  devServer: {
    open: true,
    host: "localhost",
  },
  plugins: [
    new MiniCssExtractPlugin(),
    ...Object.keys(entries).map((name) =>
      new HtmlWebpackPlugin({
        filename: `${name}.html`,
        chunks: [name],
        template: isProduction ? "utils/templates/prod_template.html" : "utils/templates/dev_template_alt.html",
        inject: "body",
        scriptLoading: "blocking",
      })
    ),
    ...(isProduction
      ? [new HtmlInlineScriptPlugin(), new HtmlInlineCSSWebpackPlugin()]
      : []),
  ],
  externals: [{ inputValues: "inputValues" }],
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
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: "asset",
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", "..."],
  },
};

module.exports = () => {
  config.mode = isProduction ? "production" : "development";
  return config;
};

