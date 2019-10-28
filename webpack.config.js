const path = require('path')
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
  entry: "./src/happypreview.js",
  mode: "production",
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'happypreview.js',
    library: 'happypreview',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /(\.jsx|\.js)$/,
        use: {
          loader: "babel-loader"
        },
        exclude: /node_modules/
      },
      {
        test: /(\.vue)$/,
        use: {
          loader: "vue-loader"
        },
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: "url-loader",
        options: {
          limit: 10000,
          name: "image/[name].[ext]",
          publicPath: "./"
        }
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin("container.css"), 
    new VueLoaderPlugin(), 
    new CleanWebpackPlugin()]
};
