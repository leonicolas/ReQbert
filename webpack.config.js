const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  devtool: 'source-map',

  watch: true,
  watchOptions: {
    ignored: /node_modules/
  },

  context: path.resolve('src'),
  entry: './assets/js/main.js',
  output: {
    path: path.resolve('dist'),
    filename: './assets/js/main.js'
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
    })
  ]
};
