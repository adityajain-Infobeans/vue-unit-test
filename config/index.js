'use strict';
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path');
//For service worker in localhost dev env.
const PROXY_HOST = process.env.HOST || 'localhost';
const PROXY_PORT = (process.env.PORT && Number(process.env.PORT)) || 8080;
///////////////////////////CDN SETUP STARTS/////////////////////////////////////
/**
 * CDN pull zone URL will be passed with the build command
 * eq. yarn build --cdn={cdn_pull_zone_url}
 */
const COMMAND_ARGS = process.argv;
let CDN_PUBLIC_PATH = ''; //default path without CDN
//find the CDN_URL from the arguments array
COMMAND_ARGS.forEach(arg => {
    if (-1 !== arg.indexOf('cdn=')) {
        //split the string to get CDN url
        const [, CDN_URL] = arg.split('=');
        CDN_PUBLIC_PATH = CDN_URL;
    }
});
////////////////////////////CDN SETUP ENDS//////////////////////////////////////

module.exports = {
    dev: {
        // Paths
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',
        proxyTable: [
            //Set proxy for service worker scripts path on local dev server.
            {
                context: ['/sw.js', '/firebase-messaging-sw.js'],
                target: `http://${PROXY_HOST}:${PROXY_PORT}/www/static/pwa`,
            },
            {
                context: ['/static/img/icons/'],
                target: `http://${PROXY_HOST}:${PROXY_PORT}/www`,
            },
            {
                context: ['/static/favicon.ico'],
                target: `http://${PROXY_HOST}:${PROXY_PORT}/www/static`,
            },
        ],

        // Various Dev Server settings
        host: 'localhost', // can be overwritten by process.env.HOST
        port: 8080, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
        autoOpenBrowser: false,
        errorOverlay: true,
        notifyOnErrors: true,
        poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

        // Use Eslint Loader?
        // If true, your code will be linted during bundling and
        // linting errors and warnings will be shown in the console.
        useEslint: true,
        // If true, eslint errors and warnings will also be shown in the error overlay
        // in the browser.
        showEslintErrorsInOverlay: false,

        /**
         * Source Maps
         */

        // https://webpack.js.org/configuration/devtool/#development
        devtool: 'source-map',
    },

    build: {
        // Template for index.html
        index: path.resolve(__dirname, '../www/index.html'),

        // Paths
        assetsRoot: path.resolve(__dirname, '../www'),
        assetsSubDirectory: 'static',
        jsSubDirectory: 'static',
        assetsPublicPath: CDN_PUBLIC_PATH || '/',

        // Use Eslint Loader?
        // If true, your code will be linted during bundling and
        // linting errors and warnings will be shown in the console.
        useEslint: false,

        /**
         * Source Maps
         */

        productionSourceMap: false,
        // https://webpack.js.org/configuration/devtool/#production
        devtool: 'none',

        // Gzip off by default as many popular static hosts such as
        // Surge or Netlify already gzip all static assets for you.
        // Before setting to `true`, make sure to:
        // npm install --save-dev compression-webpack-plugin
        productionGzip: true,
        productionGzipExtensions: ['js', 'css'],

        // Run the build command with an extra argument to
        // View the bundle analyzer report after build finishes:
        // `npm run build --report`
        // Set to `true` or `false` to always turn it on or off
        bundleAnalyzerReport: process.env.npm_config_report,
    },
    CDN_PUBLIC_PATH,
};
