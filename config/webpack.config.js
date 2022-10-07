'use strict';

const { merge } = require('webpack-merge');

const common = require('./webpack.common.js');
const PATHS = require('./paths');

const Dotenv = require('dotenv-webpack');

// Merge webpack configuration files
const config = (env, argv) =>
  merge(common, {
    entry: {
      popup: PATHS.src + '/popup.js',
      html2canvas: PATHS.src + '/html2canvas.js',
      contentScript: PATHS.src + '/contentScript.js',
      background: PATHS.src + '/background.js',
    },
    devtool: argv.mode === 'production' ? false : 'source-map',
    plugins: [
      new Dotenv(),
    ],
  });

module.exports = config;
