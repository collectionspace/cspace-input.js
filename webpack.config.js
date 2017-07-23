/* eslint import/no-extraneous-dependencies: "off" */

const webpack = require('webpack');
const path = require('path');

const library = 'cspaceInput';
const env = process.env.NODE_ENV;
const isProduction = env === 'production';
const filename = `${library}${isProduction ? '.min' : ''}.js`;

process.traceDeprecation = true;

const config = {
  entry: './src/index.js',
  output: {
    filename,
    library,
    libraryTarget: 'umd',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
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
              modules: true,
              importLoaders: 1,
              localIdentName: '[folder]-[name]--[local]',
            },
          },
          {
            loader: 'postcss-loader',
          },
        ],
      },
      {
        test: /\.(png|jpg|svg)$/,
        use: [
          {
            loader: 'url-loader',
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
  ],
  resolve: {
    extensions: ['.js', '.jsx'],
  },
};

if (isProduction) {
  config.plugins.push(new webpack.optimize.UglifyJsPlugin());
}

module.exports = config;
