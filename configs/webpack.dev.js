const webpack = require('webpack')
require('dotenv').config()

/**
 * @type { webpack.Configuration }
 */
const config = {
    devServer: {
        publicPath: process.env.PUBLIC_PATH,
        port: 3000,
        hot: true,
        open: true,
        stats: 'minimal',
    },
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader',
                    'postcss-loader',
                ],
            },
        ],
    },
}

module.exports = config
