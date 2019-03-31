'use strict'
//var path = require('path')
//const VueLoaderPlugin = require('vue-loader/lib/plugin'); // плагин для загрузки кода Vue
//const { VueLoaderPlugin } = require('vue-loader')
const {VueLoaderPlugin} = require('vue-loader')
const ExtractTextPlugin = require("extract-text-webpack-plugin")
module.exports = {
  mode: 'development', //production
  entry: {
    callboard: './src/callboard/index.js',
    administration: './src/administration/index.js',
    requests: './src/requests/index.js'
  },
  output: {
    filename: '[name].js',
    path: __dirname + '/dist',
  },
  module: { 
      rules: [
        {
          // For .js files...
          test: /\.js$/,
          loader: 'babel-loader'
        },
        {
          test: /\.vue$/,
          loader: 'vue-loader',
          exclude: /node_modules/
        },
        { 
          test: /\.css$/,
          use: ['vue-style-loader', 'style-loader', 'css-loader'],
          //loader: 'vue-style-loader!css-loader',
          exclude: /node_modules/
        },
        { 
          test: /\.scss$/, 
          loader: 'vue-style-loader!css-loader!sass-loader',
          exclude: /node_modules/
        }
      ]
  },
  plugins: [
    new VueLoaderPlugin()
  ],
  watch: true,
  watchOptions: {
    aggregateTimeout: 50
  }
}


//var ExtractTextPlugin = require("extract-text-webpack-plugin")
//const { VueLoaderPlugin } = require('vue-loader')
//const VueLoaderPlugin = require('vue-loader/lib/plugin')
//module.exports = {
//  mode: 'development',
//  entry: {
//    app: './main.js'
//  },
//  output: {
//    filename: '[name].js',
//    path: __dirname + '/dist',
//  },
//  module: {
//    rules: [
//      {
//        test: /\.vue$/,
//        loader: 'vue-loader',
//        exclude: /node_modules/
//      }
//    ]
//  },
//  plugins: [
//    new VueLoaderPlugin()
//  ]
//}