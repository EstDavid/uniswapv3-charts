export const defaultChartOptions = {
    chart: {
      height: 350,
      type: 'line',
    },
    title: {
      text: 'CandleStick Chart',
      align: 'left'
    },
    stroke: {
      width: [3, 1]
    },
    tooltip: {
      shared: false,
      custom: [function ({ seriesIndex, dataPointIndex, w }) {
        return w.globals.series[seriesIndex][dataPointIndex]
      }, function ({ seriesIndex, dataPointIndex, w }) {
        var o = w.globals.seriesCandleO[seriesIndex][dataPointIndex]
        var h = w.globals.seriesCandleH[seriesIndex][dataPointIndex]
        var l = w.globals.seriesCandleL[seriesIndex][dataPointIndex]
        var c = w.globals.seriesCandleC[seriesIndex][dataPointIndex]
        return (
          ''
        )
      }]
    },
    xaxis: {
      type: 'datetime'
    }
  }
