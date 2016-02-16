// For instructions about this file refer to
// webpack and webpack-hot-middleware documentation
var webpack = require('webpack');
var path = require('path');

var commonPlugins = [
  new webpack.optimize.OccurenceOrderPlugin(),
  new webpack.NoErrorsPlugin()
];

const config = {

  context: path.join(__dirname, 'app', 'js'),
  devtool: 'source-map',
  entry: [
    './main'
  ],

  output: {
    path: path.join(__dirname, 'app', 'js'),
    publicPath: '/js/',
    filename: 'dist/bundle.js'
  },

  plugins: commonPlugins.concat([
    new webpack.NormalModuleReplacementPlugin(/^rx$/, require.resolve('rx/dist/rx.lite')),
    new webpack.NormalModuleReplacementPlugin(/^react$/, require.resolve('react-lite')),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      mangle: true
    })
  ]),

  module: {
    loaders: [
      { test: /\.jsx?$/, exclude: /node_modules/, loaders: ['babel'] }
    ]
  }
};

module.exports = config;
module.exports.commonPlugins = commonPlugins;
