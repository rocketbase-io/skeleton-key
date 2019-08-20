const path = require("path");
const webpackConfig = require("./webpack.config");

process.env.CHROME_BIN = require("puppeteer").executablePath();

delete webpackConfig.entry;
webpackConfig.target = 'web';

webpackConfig.module.rules.push({
  test: /\.tsx?$/,
  loader: 'istanbul-instrumenter-loader',
  include: path.join(__dirname, 'src'),
  options: {
    esModules: true,
    produceSourceMap: true
  },
  enforce: 'post',
  exclude: /(node_modules|\.test\.tsx?$)/
});

webpackConfig.externals = [];

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      { pattern: 'test/index.ts', watch: false },
    ],


    // list of files / patterns to exclude
    exclude: [
      '**.d.ts'
    ],

    // Webpack Configuration
    webpack: {
      ...webpackConfig,
      stats: {
        warnings: false
      }
    },

    webpackMiddleware: {
      noInfo: true
    },


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'test/index.ts': ['webpack', 'sourcemap']
    },

    mime: {
      "text/x-typescript": ["ts", "tsx"],
    },

    coverageIstanbulReporter: {
      reports: ['text-summary', 'lcov'],
      options: { esModules: true },
      fixWebpackSourcePaths: true,
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'coverage-istanbul'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['ChromeHeadless'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
};
