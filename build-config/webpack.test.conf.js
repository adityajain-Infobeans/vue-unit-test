'use strict';
// This is the webpack config used for unit tests.

const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');

const webpackConfig = merge(baseWebpackConfig, {
    mode: 'none',
    devtool: 'inline-cheap-source-map',
    plugins: [],
    performance: {
        hints: false,
    },
});

// no need for app entry during tests
delete webpackConfig.entry;

module.exports = webpackConfig;
