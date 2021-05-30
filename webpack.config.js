const path = require("path")
// const fs = require('fs');
const HtmlWebpackPlugin = require("html-webpack-plugin")
const webpack = require("webpack");
const dotenv = require('dotenv');

// call dotenv and it will return an Object with a parsed key 
const env = dotenv.config().parsed;
  
// reduce it to a nice object, the same as before
const envKeys = Object.keys(env).reduce((prev, next) => {
  prev[`process.env.${next}`] = JSON.stringify(env[next]);
  return prev;
}, {});
module.exports = {

    entry:["@babel/polyfill", "./src/js/index.js"],
    output:{
        path:path.resolve(__dirname,"dist"),
        filename: "js/bundle.js"
    },
    devServer:{
        open:true,
        contentBase: "dist"
    },
    plugins:[
        new HtmlWebpackPlugin({
            filename: "index.html",
            template: "./src/index.html"
        }),
        new webpack.DefinePlugin(envKeys)
    ],
    module:{
        rules:[
            {
            test:/\.js$/,
            exclude:/node_modules/,
            use: {
                loader:"babel-loader"
            }
        },
        {
            test: /\.css$/,
            use: ["style-loader", "css-loader"]
        }
    ]
    }
}