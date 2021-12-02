'use strict';

const path = require('path');
const utils = require('./utils');
const webpack = require('webpack');
const config = require('../config');
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin');
const portfinder = require('portfinder');

const HOST = process.env.HOST;
const DISABLE_HOST_CHECK = process.env.DISABLE_HOST_CHECK && Boolean(process.env.DISABLE_HOST_CHECK);
const PORT = process.env.PORT && Number(process.env.PORT);

const devWebpackConfig = merge(baseWebpackConfig, {
    mode: 'development',
    optimization: {
        runtimeChunk: 'single',
        splitChunks: {
            chunks: 'all',
        },
    },
    // cheap-module-eval-source-map is faster for development
    devtool: config.dev.devtool,
    performance: {
        hints: false,
    },
    // these devServer options should be customized in /config/index.js
    devServer: {
        clientLogLevel: 'warning',
        historyApiFallback: true,
        hot: true,
        contentBase: false, // since we use CopyWebpackPlugin.
        compress: true,
        host: HOST || config.dev.host,
        port: PORT || config.dev.port,
        disableHostCheck: DISABLE_HOST_CHECK || false,
        open: config.dev.autoOpenBrowser,
        overlay: config.dev.errorOverlay ? { warnings: false, errors: true } : false,
        publicPath: config.dev.assetsPublicPath,

        quiet: true, // necessary for FriendlyErrorsPlugin
        watchOptions: {
            poll: config.dev.poll,
        },
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.optimize.OccurrenceOrderPlugin(true),
        // https://github.com/ampedandwired/html-webpack-plugin
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'index.html',
            inject: 'body',
            scriptSrc: '/www/',
        }),
        // 1. Copy custom static assets
        // 2. Copy favicon
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, '../static/'),
                to: config.build.assetsSubDirectory,
                ignore: ['.*'],
            }
        ]),

        new HtmlWebpackTagsPlugin({
            append: true,
            prependExternals: true,
            useHash: true,
            links: [],
            //Scripts which should be loaded first
            scripts: [],
            tags: [],
        }),

        // Ignore all locale files of moment.js
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    ],
});

module.exports = new Promise((resolve, reject) => {
    portfinder.basePort = process.env.PORT || config.dev.port;
    portfinder.getPort((err, port) => {
        if (err) {
            reject(err);
        } else {
            // publish the new Port, necessary for e2e tests
            process.env.PORT = port;
            // add port to devServer config
            devWebpackConfig.devServer.port = port;

            // Add FriendlyErrorsPlugin
            devWebpackConfig.plugins.push(
                new FriendlyErrorsPlugin({
                    compilationSuccessInfo: {
                        messages: [
                            `Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`,
                        ],
                    },
                    onErrors: config.dev.notifyOnErrors ? utils.createNotifierCallback() : undefined,
                })
            );

            resolve(devWebpackConfig);
        }
    });
});
