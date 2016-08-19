import React from 'react'
import ReactDOM from 'react-dom'
import CalHeatMap from 'cal-heatmap/cal-heatmap.js'

import 'cal-heatmap/cal-heatmap.css'

export default class CalendarHeatmap extends React.Component {
  componentDidMount() {
    const { ...config } = this.props
    const cal = new CalHeatMap()
    const startDate = new Date()
    startDate.setFullYear(startDate.getFullYear() - 1)
    cal.init({ ...config, itemSelector: ReactDOM.findDOMNode(this), start: startDate, range: 13 })
  }

  render() {
    return <div className='heatmap' />
  }
}
