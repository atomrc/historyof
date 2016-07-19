var webpack = require("webpack");

var plugins = [
    new webpack.optimize.CommonsChunkPlugin("vendor", "vendor.js")
];
if (process.env.NODE_ENV === "production") {
    plugins.push(new webpack.optimize.UglifyJsPlugin())
}

module.exports = {
    entry: {
        application: "./src/js/application",
        vendor: [
            "xstream",
            "@cycle/xstream-run",
            "@cycle/dom",
            "@cycle/isolate",
            "@cycle/collection",
            "uuid",
            "cyclic-router",
            "cyclejs-auth0",
            "pikaday"
            /*"moment",
            "whatwg-fetch",
            "bcryptjs",*/
        ]
    },
    output: {
        path: __dirname + "/public/js",
        filename: "[name].js"
    },
    module: {
        loaders: [
            {
                test: /node_modules[\\\/]auth0-lock[\\\/].*\.js$/,
                loaders: [
                    'transform-loader/cacheable?brfs',
                    'transform-loader/cacheable?packageify'
                ]
            },
            {
                test: /node_modules[\\\/]auth0-lock[\\\/].*\.ejs$/,
                loader: 'transform-loader/cacheable?ejsify'
            },
            {
                test: /\.json$/,
                loader: 'json-loader'
            },
            {
                test: /src\/js.*\.js$/,
                loader: 'babel',
                query: {
                    presets: ['es2015'],
                    plugins: ['transform-object-rest-spread']
                }
            },
            {
                test: /\.scss$/,
                loaders: ["style", "css", "sass"]
            }
        ]
    },
    plugins: plugins
}
