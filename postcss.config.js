module.exports = {
    parser: 'postcss-scss',
    plugins: [
        require('autoprefixer'),
        require('postcss-flexbugs-fixes'),
        require('postcss-strip-inline-comments'),
    ],
}
