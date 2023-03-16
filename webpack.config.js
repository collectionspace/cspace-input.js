/* eslint import/no-extraneous-dependencies: "off" */

const path = require('path');

const library = 'cspaceInput';
const env = process.env.NODE_ENV;
const isProduction = env === 'production';
const filename = `${library}${isProduction ? '.min' : ''}.js`;

const config = {
  mode: isProduction ? 'production' : 'development',
  entry: './src/index.js',
  output: {
    filename,
    library,
    libraryTarget: 'umd',
    libraryExport: 'default',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: path.resolve(__dirname, 'node_modules'),
        use: [
          {
            loader: 'babel-loader',
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: {
                localIdentName: '[folder]-[name]--[local]',
              },
            },
          },
          {
            loader: 'postcss-loader',
          },
        ],
      },
      {
        test: /\.(png|jpg|svg)$/,
        type: 'asset/inline',
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
};

module.exports = config;
