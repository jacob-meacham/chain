import React, { PropTypes } from 'react'
import CalendarHeatmap from './CalendarHeatmap'
import groupBy from 'lodash/groupBy'
import moment from 'moment'

import './chain.scss'

export const WEEKLY = 'weekly'
export const DAILY = 'daily'

// TODO: Come up with a better algorithm here, if required
function getStreakLength(links, frequency) {
  let startOf = 'day'
  if (frequency === WEEKLY) {
    startOf = 'isoWeek'
  }

  // Group by the set of contiguous buckets,
  // then create an array of all dates, sorted by most recent.
  const groupedResults = groupBy(links, (l) => moment.unix(l.timestamp).startOf(startOf).unix())
  const buckets = Object.keys(groupedResults).sort().reverse()

  // Now, get the current day, and count backwards
  const currentBucketTime = moment().startOf(startOf)
  let streak = 0
  for (let i = 0; i < buckets.length; i++) {
    if (currentBucketTime.isSame(buckets[i])) {
      break
    }

    streak += 1
    if (frequency === DAILY) {
      currentBucketTime.subtract(1, 'days')
    } else {
      currentBucketTime.subtract(7, 'days')
    }
  }

  return streak
}

const Chain = ({ title, frequency, links, heatmap = {} }) => {
  const streakLength = getStreakLength(links, frequency)

  let domain = null
  let streakType = null
  switch (frequency) {
    case WEEKLY:
      domain = { domain: 'month', subDomain: 'week' }
      streakType = streakLength === 1 ? 'week' : 'weeks'
      break
    case DAILY:
      domain = { domain: 'month', subDomain: 'day' }
      streakType = streakLength === 1 ? 'day' : 'days'
      break
    default:
      domain = { domain: 'year', subDomain: 'day' }
      streakType = streakLength === 1 ? 'day' : 'days'
  }

  return (
    <div className='chain'>
      <div className='panel panel-default'>
        <div className='panel-heading'>
          <h3 className='panel-title'>{title}</h3>
        </div>
        <div className='panel-body'>
          <CalendarHeatmap heatmap={{ ...heatmap, ...domain }} data={links} />
          <div className='streak'>
            Your current streak is {streakLength} {streakType} long. Don't break the chain!
          </div>
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
