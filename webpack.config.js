const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
   mode: 'development',
   entry: path.join(__dirname, '/src/index.js'),
   output: {
       path: path.join(__dirname, '/dist'),
       filename: 'build.js'
   },
   module: {
       rules: [{
           test: /\.js$/,
           exclude: /node_modules/,
           use: {
               loader: 'babel-loader',
               options: {
                   presets: ['react']
               }
           }
       }]
   },
   plugins: [
       new CleanWebpackPlugin('./dist', {
           beforeEmit: true
       })
   ]
}