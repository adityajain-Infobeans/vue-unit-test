'use strict';
const path = require('path');
const utils = require('./utils');
const config = require('../config');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const devMode = process.env.NODE_ENV !== 'production';

function resolve(dir) {
    return path.join(__dirname, '..', dir);
}

const createLintingRule = () => ({
    test: /\.(js|vue)$/,
    loader: 'eslint-loader',
    enforce: 'pre',
    include: [resolve('src'), resolve('test')],
    options: {
        formatter: require('eslint-formatter-friendly'),
        emitWarning: !config.dev.showEslintErrorsInOverlay,
    },
});

module.exports = {
    context: path.resolve(__dirname, '../'),
    entry: {
        app: './src/main.js',
    },
    output: {
        path: config.build.assetsRoot,
        filename: '[name].js',
        publicPath: process.env.NODE_ENV === 'production' ? config.build.assetsPublicPath : config.dev.assetsPublicPath,
    },
    performance: {
        hints: 'warning',
    },
    resolve: {
        extensions: [
            '.js',
            '.vue',
            '.json',
            '.scss',
            '.css',
            '.png',
            '.jpg',
            '.svg',
            '.ttf',
            '.woff',
            '.woff2',
            '.eot',
        ],
        alias: {
            node: resolve('node_modules'),
            vue$: 'vue/dist/vue.esm.js',
            '@': path.resolve(__dirname, '../src'),
            'shared-scss': path.resolve(__dirname, '../src/assets/sass'),
            images: path.resolve(__dirname, '../static/img'),
            scripts: path.resolve(__dirname, '../static/js'),
            fonts: path.resolve(__dirname, '../static/fonts'),
            config: path.resolve(__dirname, '../config'),
            inc: path.resolve(__dirname, '../src/components/inc'),
            enums: path.resolve(__dirname, '../src/components/shared/enums'),
            shared: path.resolve(__dirname, '../src/components/shared'),
        },
    },
    plugins: [
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: devMode ? '[name].css' : '[name].[hash].css',
            chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
        }),
        new VueLoaderPlugin(),
    ],
    module: {
        rules: [
            ...(devMode && config.dev.useEslint ? [createLintingRule()] : []),
            {
                test: /\.vue$/,
                loader: 'vue-loader',
            },
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: devMode || false,
                        },
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: devMode || false,
                        },
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: devMode || false,
                        },
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: devMode || false,
                        },
                    },
                ],
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: [resolve('src'), resolve('test'), resolve('node_modules/webpack-dev-server/client')],
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('img/[name].[hash:7].[ext]'),
                },
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('media/[name].[hash:7].[ext]'),
                },
            },
            {
                test: /\.(woff2?|eot|ttf|otf|woff|svg)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('fonts/[name].[hash:7].[ext]'),
                },
            },
        ],
    },
    node: {
        // prevent webpack from injecting useless setImmediate polyfill because Vue
        // source contains it (although only uses it if it's native).
        setImmediate: false,
        // prevent webpack from injecting mocks to Node native modules
        // that does not make sense for the client
        dgram: 'empty',
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
        child_process: 'empty',
    },
};
