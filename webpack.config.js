const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const assetsPath = 'assets';
const jsPath = path.join(assetsPath, 'js');
const imgPath = path.join(assetsPath, 'img');

module.exports = {
  devtool: 'inline-source-map',

  watchOptions: {
    ignored: /node_modules/
  },

  context: path.resolve('src'),
  entry: './main.js',
  output: {
    path: path.resolve('dist'),
    filename: path.join(jsPath, 'main.js')
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },

  plugins: [
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      inject: true,
      template: 'index.html'
    }),
    new CopyWebpackPlugin([{ from: assetsPath, to: assetsPath }])
  ]
};
