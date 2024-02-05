/* eslint no-console: "off" */

const path = require('path');

const getTestFiles = (config) => {
  if (config.file) {
    return config.file.split(',');
  }

  return ['test/index.js'];
};

module.exports = function karma(config) {
  const localBrowsers = ['Chrome'];
  const githubBrowsers = ['Chrome'];

  let browsers;

  if (process.env.GITHUB_ACTIONS) {
    // This is a CI run on GitHub.

    console.log('Running on GitHub.');

    browsers = githubBrowsers;
  } else {
    // This is a local run.

    console.log('Running locally.');

    const localBrowsersEnv = process.env.KARMA_BROWSERS;

    browsers = localBrowsersEnv ? localBrowsersEnv.split(',') : localBrowsers;
  }

  config.set({
    browsers,
    concurrency: 1,

    files: getTestFiles(config),

    frameworks: [
      'mocha',
      'chai',
      'webpack',
    ],

    reporters: [
      'mocha',
      'coverage',
    ],

    client: {
      mocha: {
        timeout: 4000,
      },
    },

    autoWatch: true,
    singleRun: config.singleRun === 'true',

    preprocessors: {
      'test/**/*.+(js|jsx)': [
        'webpack',
        'sourcemap',
      ],
    },

    webpack: {
      mode: 'development',
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
    },

    // Make webpack output less verbose.

    webpackMiddleware: {
      stats: {
        chunks: false,
      },
    },

    port: 9876,
    colors: true,

    // Code will have been instrumented via Babel and babel-plugin-istanbul
    // when NODE_ENV is 'test' (see .babelrc).

    coverageReporter: {
      type: 'json',
      dir: 'coverage/',
    },
  });
};
