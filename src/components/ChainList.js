import React, { PropTypes } from 'react'
import Chain from './Chain'
import shuffle from 'lodash/shuffle'

const ChainList = ({ chains }) => (
  <div className='chains'>
    {shuffle(chains).map(chain =>
      <Chain
        key={chain.id}
        {...chain}
      />
    )}
  </div>
)

ChainList.propTypes = {
  chains: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    frequency: PropTypes.string.isRequired,
    links: PropTypes.array.isRequired,
    required: PropTypes.number.isRequired,
    creationTime: PropTypes.number.isRequired,
    archiveTime: PropTypes.number,
    heatmap: PropTypes.object }).isRequired).isRequired
}

export default ChainList
