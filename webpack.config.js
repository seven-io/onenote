const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
    devServer: {
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        https: {
            key: '../../.office-addin-dev-certs/localhost.key',
            cert: '../../.office-addin-dev-certs/localhost.crt',
        },
        port: process.env.npm_package_config_dev_server_port || 3000,
    },
    devtool: 'source-map',
    entry: {
        vendor: [
            'react',
            'react-dom',
            'core-js',
            'office-ui-fabric-react',
        ],
        taskpane: [
            'react-hot-loader/patch',
            './src/taskpane/index.tsx',
        ],
    },
    module: {
        rules: [
            {
                include: [/src/, /node_modules\/@sms77\/office-base/],
                test: /\.([jt])sx?$/,
                use: ['babel-loader'],
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
                use: {
                    loader: 'file-loader',
                    query: {
                        name: 'assets/[name].[ext]',
                    },
                },
            },
        ],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new ExtractTextPlugin('[name].[hash].css'),
        new HtmlWebpackPlugin({
            chunks: ['taskpane', 'vendor', 'polyfills'],
            filename: 'taskpane.html',
            template: 'node_modules/@sms77/office-base/public/index.html',
        }),
        new CopyWebpackPlugin([{
            from: 'node_modules/@sms77/office-base/public/assets',
            ignore: ['*.scss'],
            to: 'assets',
        }]),
        new webpack.ProvidePlugin({
            Promise: ['es6-promise', 'Promise'],
        }),
    ],
    resolve: {
        extensions: ['.ts', '.tsx', '.html', '.js', 'jsx'],
    },
};