'use strict';

const path = require('path');
const utils = require('./utils');
const webpack = require('webpack');
const config = require('../config');
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { InjectManifest } = require('workbox-webpack-plugin');
const CspHtmlWebpackPlugin = require('csp-html-webpack-plugin');

const webpackConfig = merge(baseWebpackConfig, {
    mode: 'production',
    optimization: {
        splitChunks: {
            chunks: 'async',
            name: false,
            cacheGroups: {
                manifest: {
                    minChunks: Infinity,
                },
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10,
                    chunks: 'initial',
                    name: 'vendor',
                    enforce: true,
                },
                default: {
                    minChunks: 3,
                    priority: -20,
                    reuseExistingChunk: true,
                },
            },
        },
        minimize: true,
        minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
    },
    devtool: config.build.productionSourceMap ? config.build.devtool : false,
    output: {
        path: config.build.assetsRoot,
        filename: utils.assetsPath('js/[name].[chunkhash].js'),
        chunkFilename: utils.assetsPath('js/[id].[name].[chunkhash].js'),
    },
    plugins: [
        new CleanWebpackPlugin(), //clean older build data
        // http://vuejs.github.io/vue-loader/en/workflow/production.html
        // extract css into its own file
        new MiniCssExtractPlugin({
            filename: utils.assetsPath('css/[name].[contenthash].css'),
        }),
        // generate dist index.html with correct asset hash for caching.
        // you can customize output by editing /index.html
        // see https://github.com/ampedandwired/html-webpack-plugin
        new HtmlWebpackPlugin({
            filename: config.build.index,
            template: 'index.html',
            inject: true,
            scriptSrc: '/',
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeAttributeQuotes: false,
                // more options:
                // https://github.com/kangax/html-minifier#options-quick-reference
            },
            // necessary to consistently work with multiple chunks via CommonsChunkPlugin
            chunksSortMode: 'dependency',
        }),

        //Content security policy
        new CspHtmlWebpackPlugin(
            {},
            {
                nonceEnabled: {
                    'style-src': false,
                },
            }
        ),

        // keep module.id stable when vendor modules does not change
        new webpack.HashedModuleIdsPlugin(),
        new webpack.optimize.MinChunkSizePlugin({
            minChunkSize: 15000, // Minimum number of characters
        }),
        // Ignore all locale files of moment.js
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),

        new webpack.optimize.OccurrenceOrderPlugin(true),

        new InjectManifest({
            swSrc: path.resolve(__dirname, '../pwa/service-workers/sw.js'),
        }),
        // Copy custom static assets
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, '../static/'),
                to: config.build.assetsSubDirectory,
                ignore: ['.*'],
            },
        ]),
        new HtmlWebpackTagsPlugin({
            append: true,
            useHash: true,
            prependExternals: true,
            links: [
                {
                    useHash: false,
                    publicPath: false,
                    path: 'https://fonts.googleapis.com/css?family=Material+Icons|Material+Icons+Outlined',
                    type: 'css',
                    attributes: {
                        rel: 'stylesheet',
                    },
                },
                {
                    useHash: false,
                    publicPath: false,
                    path: 'https://cdn.quilljs.com/1.2.6/quill.snow.css',
                    type: 'css',
                    attributes: {
                        rel: 'stylesheet',
                    },
                },
                {
                    publicPath: config.CDN_PUBLIC_PATH === '', //user public path if cdn disabled
                    path: config.CDN_PUBLIC_PATH === '' ? 'static/pwa/manifest.json' : '/static/pwa/manifest.json',
                    attributes: {
                        rel: 'manifest',
                    },
                },
                {
                    path: 'static/img/icons/app-icon-192.png',
                    attributes: {
                        rel: 'apple-touch-icon',
                    },
                },
            ],
            //Scripts which should be loaded first
            scripts: [
                {
                    append: false,
                    useHash: false,
                    path: 'static/smartlook.js',
                    attributes: {
                        type: 'text/plain',
                        charset: 'utf-8',
                        'data-categories': 'analytics'
                    },
                },
                {
                    append: false,
                    useHash: false,
                    path: 'static/newrelic.js',
                    attributes: {
                        type: 'text/plain',
                        'data-categories': 'analytics'
                    },
                },
                //firebase push notification script - check if after removing this if it still works
                {
                    append: false,
                    useHash: false,
                    publicPath: false,
                    path: 'https://www.gstatic.com/firebasejs/4.6.2/firebase.js',
                    type: 'js',
                },
            ],
            tags: [],
        }),
    ],
});

if (config.build.productionGzip) {
    const CompressionWebpackPlugin = require('compression-webpack-plugin');

    webpackConfig.plugins.push(
        new CompressionWebpackPlugin({
            filename: '[path].gz[query]',
            algorithm: 'gzip',
            test: new RegExp('\\.(' + config.build.productionGzipExtensions.join('|') + ')$'),
            threshold: 10240,
            minRatio: 0.8,
        })
    );
}

if (config.build.bundleAnalyzerReport) {
    const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
    webpackConfig.plugins.push(
        new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            reportFilename: 'build-inspect.html',
            openAnalyzer: false,
        })
    );
}

module.exports = webpackConfig;
