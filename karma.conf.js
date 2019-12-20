/* eslint no-console: "off" */

const sauceLaunchers = {
  'chrome-latest-macos': {
    base: 'SauceLabs',
    browserName: 'chrome',
    version: 'latest',
    platform: 'macOS 10.14',
  },
  'chrome-previous-macos': {
    base: 'SauceLabs',
    browserName: 'chrome',
    version: 'latest-1',
    platform: 'macOS 10.14',
  },
  'firefox-latest-macos': {
    base: 'SauceLabs',
    browserName: 'firefox',
    version: 'latest',
    platform: 'macOS 10.14',
  },
  'firefox-previous-macos': {
    base: 'SauceLabs',
    browserName: 'firefox',
    version: 'latest-1',
    platform: 'macOS 10.14',
  },
  'safari-latest-macos': {
    base: 'SauceLabs',
    browserName: 'safari',
    version: 'latest',
    platform: 'macOS 10.14',
  },
  'edge-latest-win10': {
    base: 'SauceLabs',
    browserName: 'microsoftedge',
    version: 'latest',
    platform: 'Windows 10',
  },
  'safari-latest-ios': {
    base: 'SauceLabs',
    browserName: 'safari',
    platformName: 'iOS',
    platformVersion: 'latest',
    deviceName: 'iPad (6th generation) Simulator',
  },
};

const getTestFiles = (config) => {
  if (config.file) {
    return config.file.split(',');
  }

  return ['test/index.js'];
};

module.exports = function karma(config) {
  let browsers = [];
  let customLaunchers = {};

  if (process.env.TRAVIS_BUILD_NUMBER) {
    if (
      process.env.TRAVIS_SECURE_ENV_VARS === 'true'
      && process.env.SAUCE_USERNAME
      && process.env.SAUCE_ACCESS_KEY
    ) {
      // We're on Travis, and Sauce Labs environment variables are available.
      // Run on the Sauce Labs cloud using the full set of browsers.

      console.log('Running on Sauce Labs.');

      customLaunchers = sauceLaunchers;
      browsers = Object.keys(customLaunchers);
    } else {
      // We're on Travis, but Sauce Labs environment variables aren't available.
      // Run on Travis, using Firefox.

      console.log('Running on Travis.');

      browsers = [
        'Firefox',
      ];
    }
  } else {
    // This is a local run. Use Chrome.

    console.log('Running locally.');

    browsers = [
      'Chrome',
    ];
  }

  config.set({
    browsers,
    customLaunchers,
    files: getTestFiles(config),

    frameworks: [
      'mocha',
      'chai',
    ],

    reporters: [
      'mocha',
      'coverage',
      'saucelabs',
    ],

    browserConsoleLogOptions: {
      level: 'log',
      format: '%b %T: %m',
      terminal: true,
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
      resolve: {
        extensions: ['.js', '.jsx'],
      },
    },

    // Make webpack output less verbose, so Travis can display the entire log.

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

    // Sauce Labs configuration.

    sauceLabs: {
      testName: 'cspace-input tests',
      recordScreenshots: false,
      public: true,
    },

    // Tolerate Sauce Labs slowness/flakiness.

    browserDisconnectTimeout: 20000,
    browserDisconnectTolerance: 1,
    browserNoActivityTimeout: 4 * 60 * 1000,
    captureTimeout: 4 * 60 * 1000,
  });
};
