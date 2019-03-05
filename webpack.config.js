const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const assetsPath = 'assets';
const jsPath = path.join(assetsPath, 'js');
const imgPath = path.join(assetsPath, 'img');

module.exports = {
  devtool: 'inline-source-map',

  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: false,
    port: 9000
  },

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
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env']
        }
      }
    ]
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
    new CopyWebpackPlugin([{ from: assetsPath, to: assetsPath }])
  ]
};
