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
        new ForkTsCheckerWebpackPlugin({
            eslint: {
                files: './src/**/*.{js,ts}',
            },
        }),
    ],
    stats: 'minimal',
}

/**
 * Html webpack plugin
 *
 * @param { 'development' | 'production' } mode
 */
function useMultiHtmlWebpackPlugin(mode) {
    const filenames = ['index.html']
    const PUBLIC_PATH = process.env.PUBLIC_PATH

    if (mode === 'production') {
        filenames.push('complete/index.html')
    }

    config.plugins = config.plugins.concat(
        filenames.map((filename) => {
            return new HtmlWebpackPlugin({
                template: 'src/views/index.ejs',
                filename,
                templateParameters: {
                    TITLE: process.env.TITLE,
                    PUBLIC_PATH,
                },
            })
        })
    )
}

module.exports = (env, argv) => {
    /**
     * @type { 'development' | 'production' }
     */
    const mode = argv.mode

    useMultiHtmlWebpackPlugin(mode)

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
