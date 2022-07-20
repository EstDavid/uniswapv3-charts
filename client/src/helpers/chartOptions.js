export const defaultChartOptions = (xMin, xMax, lineColors) => {
  return {
    chart: {
      height: 250,
      type: 'line',
    },
  /*   title: {
      text: 'CandleStick Chart',
      align: 'left'
    }, */
    stroke: {
      width: [3, 2, 2, 2, 2, 2],
    },
    colors: lineColors,
    tooltip: {
      x: {
        show: false
      },
      y: {
        show: true,
        formatter: function(value, { series, seriesIndex, dataPointIndex, w }) {
          const precision = 4;
          if(w.globals.seriesCandleO[seriesIndex] !== undefined) {
            var o = w.globals.seriesCandleO[seriesIndex][dataPointIndex];
            var h = w.globals.seriesCandleH[seriesIndex][dataPointIndex];
            var l = w.globals.seriesCandleL[seriesIndex][dataPointIndex];
            var c = w.globals.seriesCandleC[seriesIndex][dataPointIndex];

            return `
            Open: ${parseFloat(o.toPrecision(precision)) + '\n'}
            High: ${parseFloat(h.toPrecision(precision)) + '\n'}
            Low: ${parseFloat(l.toPrecision(precision)) + '\n'}
            Close: ${parseFloat(c.toPrecision(precision)) + '\n'}
            `
          } else {
            return parseFloat(value.toPrecision(precision))
          }           
        }
,
        title: {
          formatter: (seriesName) => '',
      },
      },
      enabled: true,
      shared: false,
      marker: {
        show: true,
        color: '#FFD700'

      },
      // custom: [function ({ seriesIndex, dataPointIndex, w }) {
      //   return w.globals.series[seriesIndex][dataPointIndex]
      // }, function ({ seriesIndex, dataPointIndex, w }) {
      //   var o = w.globals.seriesCandleO[seriesIndex][dataPointIndex]
      //   var h = w.globals.seriesCandleH[seriesIndex][dataPointIndex]
      //   var l = w.globals.seriesCandleL[seriesIndex][dataPointIndex]
      //   var c = w.globals.seriesCandleC[seriesIndex][dataPointIndex]
      //   return `Open: ${parseFloat(o.toPrecision(3))}`
      // }],
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
        style: {
          colors:'#8e8da4'
        },
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
    },
    dataLabels: {
      enabled: false
    },
    markers: {
      size: 0,
    },
  }

}