const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")
//const MiniCssExtractPlugin = require('mini-css-extract-plugin')

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
        })/*,
        new MiniCssExtractPlugin({
            filename:"style.css"
        })   */
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
        /*{
            test:/\.css$/,
            use:[MiniCssExtractPlugin.loader,{
                loader:'css-loader',
                options:{
                    importLoaders:1,
                    modules:true
                }
            }
        ],
        include: /\.module\.css$/
        },
        {
            test:/\.css$/,
            use: [
                MiniCssExtractPlugin.loader,
                'css-loader'
            ],
            exclude: /\.module\.css$/
        }*/
        {
            test: /\.css$/,
            use: ["style-loader", "css-loader"]
        }
    ]
    }
}