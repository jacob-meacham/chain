import React, { PropTypes } from 'react'
import Chain from './Chain'

const ChainList = ({ chains }) => (
  <div className='chains'>
    {chains.map(chain =>
      <Chain
        {...chain}
      />
    )}
  </div>
)

ChainList.propTypes = {
  chains: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    frequency: PropTypes.string.isRequired,
    data: PropTypes.object.isRequired,
    heatmap: PropTypes.object }).isRequired).isRequired
}

export default ChainList
