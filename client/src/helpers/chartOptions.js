export const defaultChartOptions = {
  chart: {
    height: 350,
    type: 'line',
  },
/*   title: {
    text: 'CandleStick Chart',
    align: 'left'
  }, */
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
  },
  yaxis: {
    forceNiceScale: false,
    min: function(min) { return min * 0.97},
    max: function(max) { return max * 1.03},
    logarithmic: false,
    logBase: 10,
    tickAmount: 5,
    labels: {
      /**
      * Allows users to apply a custom formatter function to yaxis labels.
      *
      * @param { String } value - The generated value of the y-axis tick
      * @param { index } index of the tick / currently executing iteration in yaxis labels array
      */
      formatter: function(val, index) {
        return parseFloat(val.toPrecision(3));
      }
    }
  }
}
