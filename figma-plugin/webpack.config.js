const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = (env, argv) => ({
  mode: argv.mode === 'production' ? 'production' : 'development',

  // This is necessary because Figma's 'eval' works differently than normal eval
  devtool: argv.mode === 'production' ? false : 'inline-source-map',

  entry: {
    code: './src/code.ts',
  },

  module: {
    rules: [
      { test: /\.tsx?$/, use: 'ts-loader', exclude: /node_modules/ },
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },
      { test: /\.(png|jpg|gif|webp)$/, loader: 'url-loader' },
    ],
  },

  // Webpack tries these extensions for you if you omit the extension
  resolve: { extensions: ['.tsx', '.ts', '.jsx', '.js'] },

  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },

  // Copy the HTML files to the dist folder without processing
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/ui/ui.html',
      filename: 'ui.html',
      inject: false,
    }),
    new HtmlWebpackPlugin({
      template: './src/ui/simple.html',
      filename: 'simple.html',
      inject: false,
    }),
  ],
}); 