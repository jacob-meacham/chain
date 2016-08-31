import React from 'react'
import ChainList from './ChainList'
import 'bootstrap/dist/css/bootstrap.css'
import './app.scss'

// TODO: Obviously fix this
const chains = require('json!/Users/jmeacham/.chain/chains.json')

const App = () => {
  return (
    <div>
      <div className='jumbotron'>
        <h1>Chain <small>Don't break the chain!</small></h1>
      </div>
      <ChainList chains={chains} />
    </div>)
}

export default App
