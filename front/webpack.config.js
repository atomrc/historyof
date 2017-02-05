var webpack = require("webpack");

var plugins = [
    new webpack.optimize.CommonsChunkPlugin({ name: "vendor", filename: "vendor.js"})
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
                test: /src\/js.*\.js$/,
                loader: 'babel-loader',
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
