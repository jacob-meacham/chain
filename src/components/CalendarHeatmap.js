import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import CalHeatMap from 'cal-heatmap/cal-heatmap.js'

import 'cal-heatmap/cal-heatmap.css'

const defaultProps = {
  cellSize: 15,
  cellPadding: 3,
  range: 13,
  considerMissingDataAsZero: true,
  tooltip: true,
  displayLegend: false
}

export default class CalendarHeatmap extends React.Component {
  componentDidMount() {
    const startDate = new Date()
    startDate.setFullYear(startDate.getFullYear() - 1)

    const cal = new CalHeatMap()
    cal.init({
      ...defaultProps,
      ...this.props.heatmap,
      data: this.props.data,
      itemSelector: ReactDOM.findDOMNode(this),
      start: startDate,
    })
  }

  render() {
    return <div className='heatmap' />
  }
}

CalendarHeatmap.propTypes = {
  heatmap: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
}
