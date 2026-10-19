import { execFileSync } from 'node:child_process'
import webpackConfig from './webpack.test.config.js'

// Karma necesita la ruta del Chrome de Puppeteer de forma síncrona
process.env.CHROME_BIN = execFileSync(
  process.execPath,
  ['-e', "require('puppeteer').executablePath().then((ruta) => process.stdout.write(ruta))"],
  { encoding: 'utf8' }
).trim()

export default function (config) {
  config.set({
    basePath: '',

    frameworks: ['jasmine'],

    files: [
      { pattern: 'src/**/*.spec.jsx', watched: false }
    ],

    preprocessors: {
      'src/**/*.spec.jsx': ['webpack']
    },

    webpack: webpackConfig,
    webpackMiddleware: {
      stats: 'minimal'
    },

    reporters: ['progress', 'coverage'],

    coverageReporter: {
      dir: 'coverage/',
      reporters: [
        { type: 'html', subdir: 'html', file: 'index.html' },
        { type: 'text-summary' },
        { type: 'lcov', subdir: 'lcov', file: 'lcov.info' }
      ]
    },

    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage']
      }
    },

    browsers: ['ChromeHeadlessNoSandbox'],

    singleRun: true,
    port: 9876
  })
}
