import React from 'react'
import ChainList from './ChainList'
import expandHomeDir from 'expand-home-dir'

const chains = require(expandHomeDir('~/.chain/chains.json'))

const App = () => {
  return (<div>
    <ChainList chains={chains} />
  </div>)
}

export default App
