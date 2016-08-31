const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const env = process.env.NODE_ENV || 'development'
const DEV = env === 'development'

const basePath = __dirname
const paths = {
  app_path: path.resolve(basePath, '..', 'src'),
  styles: path.resolve(basePath, '..', 'src', 'styles'),
  dist: path.resolve(basePath, '..', 'dist'),
  lib: path.resolve(basePath, '..', 'node_modules'),
}

paths.app = function appResolve(p) {
  return path.resolve(paths.app_path, p)
}

const webpackConfig = {
  env: process.env.NODE_ENV,
  entry: {
    app: [paths.app('main.js')],
    vendor: ['react', 'react-redux', 'redux'],
  },
  output: {
    path: paths.dist,
    filename: 'js/[name].js',
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.scss']
  },
  devServer: {
    contentBase: paths.app_path,
  },
  plugins: [],
  devtool: 'cheap-module-source-map',
  module: {
    loaders: [],
  },
}

if (DEV) {
  webpackConfig.devtool = 'inline-source-map'
}

if (DEV) {
  console.log('Adding HMR and dev server support')
  webpackConfig.entry.app.unshift('webpack/hot/dev-server')
  webpackConfig.entry.app.unshift('webpack-dev-server/client?http://0.0.0.0:9292')
  webpackConfig.entry.app.unshift('react-hot-loader/patch')
}

// Setup plugins
webpackConfig.plugins = [
  // Vendor chunk to a common chunk
  new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.bundle.js'),

  // Define __DEV__ if started as debug
  new webpack.DefinePlugin({
    __DEV__: JSON.stringify(DEV),
    'process.env': {
      NODE_ENV: JSON.stringify(env),
      SUGGEST_SERVICE_URL: JSON.stringify(process.env.SUGGEST_SERVICE_URL)
    }
  }),

  // Generate an index.html for this app
  new HtmlWebpackPlugin({
    template: paths.app('index.html'),
    favicon: paths.app('static/favicon.png'),
    hash: false,
    filename: 'index.html',
    inject: 'body',
    minify: {
      collapseWhitespace: true
    },
  })
]

if (DEV) {
  webpackConfig.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin() // No errors when building
  )
} else {
  webpackConfig.plugins.push(
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        unused: true,
        dead_code: true,
        warnings: false
      }
    })
  )
}

// Setup loaders
webpackConfig.module.loaders = [
  { test: /\.(js|jsx)$/, exclude: /node_modules/, loaders: ['babel'] }, // JavaScript
  { test: /\.scss$/, loaders: ['style', 'css?sourceMap', 'sass?sourceMap'] }, // Sass
  { test: /\.css$/, loaders: ['style', 'css?sourceMap'] }, // CSS
  { test: /\.(eot|svg|ttf|woff(2)?)(\?v=\d+\.\d+\.\d+)?/, loader: 'url' },
  { test: /\.(png|jpg)$/, loader: 'file?name=images/[name].[ext]' }, // Images
]

module.exports = webpackConfig
