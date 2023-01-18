const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const assetsPath = 'assets';
const jsPath = path.join(assetsPath, 'js');
const imgPath = path.join(assetsPath, 'img');

module.exports = {
  devtool: 'inline-source-map',
  mode: 'development',

  devServer: {
    static: path.join(__dirname, 'dist'),
    compress: false,
    port: 9000
  },

  watchOptions: {
    ignored: /node_modules/
  },

  context: path.resolve('src'),
  entry: './index.ts',
  output: {
    path: path.resolve('dist'),
    filename: path.join(jsPath, 'main.js')
  },

  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: 'ts-loader',
      }
    ],
  },

  plugins: [
    new CleanWebpackPlugin({
      dry: true,
      verbose: true,
      cleanOnceBeforeBuildPatterns: ['dist']
    }),
    new HtmlWebpackPlugin({
      inject: true,
      template: 'index.html'
    }),
    new CopyPlugin({
      patterns: [
        { from: assetsPath, to: assetsPath }
      ]
    }),
  ]
};
