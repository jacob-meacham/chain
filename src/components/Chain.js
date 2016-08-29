import React, { PropTypes } from 'react'
import CalendarHeatmap from './CalendarHeatmap'
//import _ from 'lodash/groupBy'
//import moment from 'moment'

import './chain.scss'

export const WEEKLY = 'weekly'
export const DAILY = 'daily'

const Chain = ({ title, frequency, data, heatmap = {} }) => {
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
    <div className='title'>{title}</div>
    <CalendarHeatmap heatmap={{ ...heatmap, ...domain, data }} />
  </div>)
}

Chain.propTypes = {
  title: PropTypes.string.isRequired,
  frequency: PropTypes.string.isRequired,
  heatmap: PropTypes.object,
  data: PropTypes.object.isRequired
}

export default Chain
