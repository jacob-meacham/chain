import React, { PropTypes } from 'react'
import CalendarHeatmap from './CalendarHeatmap'
import groupBy from 'lodash/groupBy'
import moment from 'moment'
import reduce from 'lodash/reduce'

import './chain.scss'

export const WEEKLY = 'weekly'
export const DAILY = 'daily'

function getBucketStride(frequency) {
  let bucketType = 'day'
  let bucketWidth = 1
  if (frequency === WEEKLY) {
    bucketType = 'isoWeek'
    bucketWidth = 7
  }

  return { bucketType, bucketWidth }
}

// TODO: Clean this up!
function getStreakLength({ groupedResults, bucketType, bucketWidth, numRequiredEvents }) {
  // Create an array of all dates, sorted by most recent.
  const buckets = Object.keys(groupedResults).sort().reverse()

  const continuesStreak = (currentMoment, bucketTime) => {
    if (!currentMoment.isSame(moment.unix(bucketTime))) {
      return false
    }

    if (groupedResults[bucketTime].length < numRequiredEvents) {
      // There is a bucket here, but not enough to keep the streak alive
      return false
    }

    return true
  }

  // Now, get the current day, and count backwards
  const currentMoment = moment().startOf(bucketType)
  let streak = 0
  for (let i = 0; i < buckets.length;) {
    if (!continuesStreak(currentMoment, buckets[i])) {
      // If this is the first bucket we should be testing, then we'll allow it
      if (!moment().startOf(bucketType).isSame(currentMoment)) {
        break
      }
    } else {
      streak += 1
      // TODO: Especially this is nasty. We don't want to skip buckets
      // on the first day. Change this to a while.
      i++
    }

    currentMoment.subtract(bucketWidth, 'days')
  }

  return streak
}

function calculateLinksInfo({ links, frequency, numRequiredEvents }) {
  const { bucketType, bucketWidth } = getBucketStride(frequency)

  // Group by the set of contiguous buckets
  const groupedResults = groupBy(links, (l) => moment.unix(l.timestamp).startOf(bucketType).unix())

  const currentStreakLength = getStreakLength({
    groupedResults,
    bucketType,
    bucketWidth,
    numRequiredEvents
  })

  const max = reduce(Object.keys(groupedResults),
    (curMax, key) => (Math.max(curMax, groupedResults[key].length)), 0)

  // TODO: Lots of duplication between this and getStreakLength.
  const buckets = Object.keys(groupedResults).sort().reverse()
  const nowMoment = moment().startOf(bucketType)

  // TODO: This may be upset with 0 buckets...
  const isUpToDate = nowMoment.isSameOrBefore(moment.unix(buckets[0]))

  return { currentStreakLength, max, isUpToDate }
}

function fillZeroes({ links, creationTime, frequency, archiveMoment = moment() }) {
  const { bucketType, bucketWidth } = getBucketStride(frequency)
  const currentMoment = moment.unix(creationTime).startOf(bucketType)
  const nowMoment = moment().startOf(bucketType)

  const data = links.slice()

  while (!currentMoment.isSame(nowMoment) && currentMoment.isSameOrBefore(archiveMoment)) {
    data.push({
      number: 0,
      timestamp: currentMoment.unix(),
    })

    currentMoment.add(bucketWidth, 'days')
  }

  return data
}

function getLegend({ required, max }) {
  // TODO: tweak
  // TODO: This should move up into Chain.
  const legend = [required - 1, required, required * 2, required * 3]
  if (max > required * 3) {
    legend[4] = max
  }

  return {
    legend
  }
}


const Chain = ({ title,
  frequency, links, required, creationTime, archiveTime = null, heatmap = {} }) => {
  const { currentStreakLength, max, isUpToDate } =
    calculateLinksInfo({ links, frequency, numRequiredEvents: required })

  let domain = null
  let streakType = null
  switch (frequency) {
    case WEEKLY:
      domain = { domain: 'month', subDomain: 'week' }
      streakType = currentStreakLength === 1 ? 'week' : 'weeks'
      break
    case DAILY:
      domain = { domain: 'month', subDomain: 'day' }
      streakType = currentStreakLength === 1 ? 'day' : 'days'
      break
    default:
      domain = { domain: 'year', subDomain: 'day' }
      streakType = currentStreakLength === 1 ? 'day' : 'days'
  }

  // Fill zeroes for all dates since we started, and before the archived date
  let archiveMoment = moment()
  if (archiveTime) {
    archiveMoment = moment.unix(archiveTime)
  }

  // TODO: Add this to cal-heatmap itself instead?
  const heatmapData = fillZeroes({ links, creationTime, frequency, archiveMoment })

  const legend = getLegend({ required, max })

  const panelHeadingClass = isUpToDate ? 'panel-heading' : 'panel-heading panel-heading-danger'

  return (
    <div className='chain'>
      <div className='panel panel-default'>
        <div className={panelHeadingClass}>
          <h3 className='panel-title'>{title}</h3>
        </div>
        <div className='panel-body'>
          <CalendarHeatmap
            heatmap={{ ...heatmap, ...domain, ...legend }}
            data={heatmapData}
          />
          <div className='streak'>
            Your current streak is {currentStreakLength} {streakType} long.
            <span className='dbtc'> Don't break the chain!</span>
          </div>
        </div>
      </div>
    </div>)
}

Chain.propTypes = {
  title: PropTypes.string.isRequired,
  frequency: PropTypes.string.isRequired,
  heatmap: PropTypes.object,
  creationTime: PropTypes.number.isRequired,
  archiveTime: PropTypes.number,
  required: PropTypes.number.isRequired,
  links: PropTypes.array.isRequired
}

export default Chain
