import React, { PropTypes } from 'react'
import CalendarHeatmap from './CalendarHeatmap'
//import _ from 'lodash/groupBy'
//import moment from 'moment'

import './chain.scss'

export const WEEKLY = 'weekly'
export const DAILY = 'daily'

const Chain = ({ name, frequency, links, heatmap = {} }) => {
  let domain = null
  switch (frequency) {
    case WEEKLY:
      domain = { domain: 'month', subDomain: 'week' }
      break
    case DAILY:
      domain = { domain: 'month', subDomain: 'day' }
      break
    default:
      domain = { domain: 'year', subDomain: 'day' }
  }

  return (<div className='chain'>
    <div className='title'>{name}</div>
    <CalendarHeatmap heatmap={{ ...heatmap, ...domain }} data={links} />
  </div>)
}

Chain.propTypes = {
  name: PropTypes.string.isRequired,
  frequency: PropTypes.string.isRequired,
  heatmap: PropTypes.object,
  links: PropTypes.array.isRequired
}

export default Chain
