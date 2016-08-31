import React, { PropTypes } from 'react'
import CalendarHeatmap from './CalendarHeatmap'
//import _ from 'lodash/groupBy'
//import moment from 'moment'

import './chain.scss'

export const WEEKLY = 'weekly'
export const DAILY = 'daily'

const Chain = ({ title, frequency, links, heatmap = {} }) => {
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

  return (
    <div className='chain'>
      <div className='panel panel-default'>
        <div className='panel-heading'>
          <h3 className='panel-title'>{title}</h3>
        </div>
        <div className='panel-body'>
          <CalendarHeatmap heatmap={{ ...heatmap, ...domain }} data={links} />
        </div>
      </div>
    </div>)
}

Chain.propTypes = {
  title: PropTypes.string.isRequired,
  frequency: PropTypes.string.isRequired,
  heatmap: PropTypes.object,
  links: PropTypes.array.isRequired
}

export default Chain
