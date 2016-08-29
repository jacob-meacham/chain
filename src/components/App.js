import React from 'react'
import ChainList from './ChainList'
import chains from '../../data/chains'

const App = () => {
  return (<div>
    <ChainList chains={chains} />
  </div>)
}

export default App
