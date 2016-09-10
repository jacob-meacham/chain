import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import CalHeatMap from 'cal-heatmap/cal-heatmap.js'
import _ from 'lodash'

import 'cal-heatmap/cal-heatmap.css'

const defaultProps = {
  cellSize: 15,
  cellPadding: 3,
  cellRadius: 3,
  range: 13,
  tooltip: true,
  displayLegend: false,
  highlight: ['now'],
}

export default class CalendarHeatmap extends React.Component {
  componentDidMount() {
    this.rebuildHeatmap()
  }

  componentDidUpdate() {
    if (this.calHeatMap) {
      this.calHeatMap.destroy()
      this.rebuildHeatmap()
    }
  }

  rebuildHeatmap() {
    const startDate = new Date()
    startDate.setFullYear(startDate.getFullYear() - 1)

    // Set up the legend min and max
    // TODO: tweak
    const { numRequired, max = 0 } = this.props
    const legend = [numRequired, numRequired * 2, numRequired * 3]
    if (max > numRequired * 3) {
      legend[3] = max
    }

    this.calHeatMap = new CalHeatMap()
    this.calHeatMap.init({
      ...defaultProps,
      ...this.props.heatmap,
      legend,
      data: this.props.data,
      itemSelector: ReactDOM.findDOMNode(this),
      start: startDate,
      afterLoadData: (data) => (_.chain(data)
        .keyBy('timestamp')
        .mapValues((o) => (Math.floor(o.number)))
        .value())
    })
  }

  render() {
    return <div className='heatmap' />
  }
}

CalendarHeatmap.propTypes = {
  heatmap: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired,
  max: PropTypes.number,
  numRequired: PropTypes.number.isRequired
}
