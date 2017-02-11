/* eslint import/no-extraneous-dependencies: "off" */

const webpack = require('webpack');
const values = require('postcss-modules-values');

const library = 'cspaceInput';
const env = process.env.NODE_ENV;
const isProduction = env === 'production';
const filename = `${library}${isProduction ? '.min' : ''}.js`;

const config = {
  entry: './src/index.js',
  output: {
    filename,
    library,
    libraryTarget: 'umd',
    path: 'dist',
  },
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel',
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader?modules&importLoaders=1&localIdentName=[folder]-[name]--[local]!postcss-loader',
      },
      {
        test: /\.(png|jpg|svg)$/,
        loader: 'url-loader',
      },
    ],
  },
  postcss: [
    values,
  ],
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
  ],
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
};

if (isProduction) {
  config.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
    })
  );
}

module.exports = config;
