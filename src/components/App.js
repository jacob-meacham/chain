import React from 'react'
import ChainList from './ChainList'

// TODO: Obviously fix this
const chains = require('json!/Users/jmeacham/.chain/chains.json')

const App = () => {
  return (<div>
    <ChainList chains={chains} />
  </div>)
}

export default App
