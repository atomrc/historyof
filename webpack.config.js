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
            "react",
            "react-router",
            "react-dom",
            "history/lib/createBrowserHistory",
            "moment",
            "redux",
            "redux-router",
            "redux-thunk",
            "react-redux",
            "pikaday",
            "object-assign",
            "whatwg-fetch",
            "debounce",
            "bcryptjs",
            "uuid",
            "react-addons-css-transition-group"
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
                    presets: ['es2015', "react"]
                }
            },
            { test: /\.scss$/, loaders: ["style", "css", "sass"] }
        ]
    },
    plugins: plugins
}
