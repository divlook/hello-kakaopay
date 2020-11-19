const path = require('path')
const webpack = require('webpack')
const { merge } = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const devConfig = require('./configs/webpack.dev')
const prodConfig = require('./configs/webpack.prod')
require('dotenv').config()

/**
 * @type { webpack.Configuration }
 */
const config = {
    entry: {
        index: './src/index.ts',
    },
    output: {
        publicPath: process.env.PUBLIC_PATH,
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
            },
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: [
                    'babel-loader',
                    {
                        loader: 'ts-loader',
                        options: {
                            transpileOnly: true,
                        },
                    },
                ],
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js', '.scss', '.css'],
        alias: {
            '~': path.resolve(__dirname, 'src'),
        },
    },
    plugins: [
        new webpack.EnvironmentPlugin(['TITLE', 'PUBLIC_PATH']),
        new HtmlWebpackPlugin({
            template: 'src/views/index.ejs',
            filename: 'index.html',
            templateParameters: {
                TITLE: process.env.TITLE,
                PUBLIC_PATH: process.env.PUBLIC_PATH,
            },
        }),
        new ForkTsCheckerWebpackPlugin({
            eslint: {
                files: './src/**/*.{js,ts}',
            },
        }),
    ],
    stats: 'minimal',
}

module.exports = (env, argv) => {
    /**
     * @type { 'development' | 'production' }
     */
    const mode = argv.mode

    switch (mode) {
        case 'development':
            return merge(config, devConfig)

        case 'production':
            return merge(config, prodConfig)

        default:
            throw new Error(
                '다음 옵션이 필요합니다. --mode=<development|production>'
            )
    }
}
