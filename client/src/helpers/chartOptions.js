export const defaultChartOptions = (xMin, xMax, lineColors) => {
  return {
    chart: {
      height: 350,
      type: 'line',
    },
  /*   title: {
      text: 'CandleStick Chart',
      align: 'left'
    }, */
    stroke: {
      width: [3, 2, 2, 2, 2, 2],
      colors: lineColors
    },
    tooltip: {
      enabled: true,
      shared: false,
      custom: [function ({ seriesIndex, dataPointIndex, w }) {
        return w.globals.series[seriesIndex][dataPointIndex]
      }, function ({ seriesIndex, dataPointIndex, w }) {
        var o = w.globals.seriesCandleO[seriesIndex][dataPointIndex]
        var h = w.globals.seriesCandleH[seriesIndex][dataPointIndex]
        var l = w.globals.seriesCandleL[seriesIndex][dataPointIndex]
        var c = w.globals.seriesCandleC[seriesIndex][dataPointIndex]
        return (
          o
        )
      }]
    },
    xaxis: {
      type: 'datetime',
      max: xMax,
      min: xMin
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
    },
    plotOptions: {
      candlestick: {
        wick: {
          useFillColor: true,
        }
      }
    },
    legend: {
      show: false,
      markers: {
        fillColors: ['#FFD700', '#1E90FF', '#FF4500','#008000', '#FFD700', '#FF0000']
      }
    }
  }

}