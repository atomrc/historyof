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
            "@cycle/xstream-run",
            "@cycle/dom",
            "@cycle/storage",
            "@cycle/isolate",
            "uuid",
            "object-assign"
            /*"moment",
            "pikaday",
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
                test: /src\/js.*\.js$/,
                loader: 'babel',
                query: {
                    presets: ['es2015']
                }
            },
            { test: /\.scss$/, loaders: ["style", "css", "sass"] }
        ]
    },
    plugins: plugins
}
