import React, { PropTypes } from 'react'
import Chain from './Chain'

const ChainList = ({ chains }) => (
  <div className='chains'>
    {chains.map(chain =>
      <Chain
        key={chain.name}
        {...chain}
      />
    )}
  </div>
)

ChainList.propTypes = {
  chains: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    frequency: PropTypes.string.isRequired,
    links: PropTypes.array.isRequired,
    heatmap: PropTypes.object }).isRequired).isRequired
}

export default ChainList
