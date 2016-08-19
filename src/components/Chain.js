import React, { PropTypes } from 'react'
import CalendarHeatmap from './CalendarHeatmap'

const Chain = ({ title, domain, subDomain }) => (
  <div className='chain'>
    <div className='title'>{title}</div>
    <CalendarHeatmap domain={domain} subDomain={subDomain} />
  </div>
)

Chain.propTypes = {
  title: PropTypes.string.isRequired,
  domain: PropTypes.string,
  subDomain: PropTypes.string
}

export default Chain
