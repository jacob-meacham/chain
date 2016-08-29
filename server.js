const http = require('http')
const express = require('express')
const fallback = require('express-history-api-fallback')

const ENV = process.env.NODE_ENV || 'development'
const PORT = process.env.PORT || 9292

const app = express()
const server = http.Server(app)

if (ENV === 'development') {
  const webpack = require('webpack')
  const WebpackDevServer = require('webpack-dev-server')
  const config = require('./config/webpack.config')

  new WebpackDevServer(webpack(config), {
    publicPath: config.output.publicPath,
    hot: true,
    progress: true,
    historyApiFallback: true
  }).listen(PORT, (err) => {
    if (err) {
      console.log(err)
      return err
    }

    console.log(`Listening at http://localhost:${PORT}/`)
  })
} else {
  app.use(express.static('dist'))
  app.use(fallback('dist/app.html', { root: __dirname }))

  server.listen(PORT, () => {
    console.log(`Listening at http://localhost:${PORT}/`)
  })
}
