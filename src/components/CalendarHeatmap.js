import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import CalHeatMap from 'cal-heatmap/cal-heatmap.js'
import _ from 'lodash'

import 'cal-heatmap/cal-heatmap.css'

const defaultProps = {
  cellSize: 15,
  cellPadding: 3,
  //cellRadius: 10,
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

    this.calHeatMap = new CalHeatMap()
    this.calHeatMap.init({
      ...defaultProps,
      ...this.props.heatmap,
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
  data: PropTypes.array.isRequired
}
