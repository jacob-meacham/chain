import debug from 'debug'
import App from './components/App'

if (__DEV__) {
  // Enable debug output before any modules are loaded
  debug.enable('chain:*')
}

import { AppContainer } from 'react-hot-loader'
import React from 'react'
import ReactDOM from 'react-dom'
import RedBox from 'redbox-react'

const ROOT = document.getElementById('root')

function renderApp() {
  ReactDOM.render(
    <AppContainer>
      <App />
    </AppContainer>, ROOT
  )
}

let render = renderApp

if (__DEV__) {
  const wrapRender = (renderFn, ...renderArgs) => {
    const renderError = (error) => {
      ReactDOM.render(<RedBox error={error} />, ROOT)
    }

    // Wrap render in try/catch
    return () => {
      try {
        renderFn(renderArgs)
      } catch (error) {
        renderError(error)
      }
    }
  }

  render = wrapRender(renderApp, App)

  if (module.hot) {
    module.hot.accept('./components/App', () => {
      require('./components/App')

      render()
    })
  }
}

render()
