import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import getPriceObject from './priceObservation'

const getCandleStickData = (arrayOHLC) => {
  let candlestickData = [];
  let timestamps = Object.keys(arrayOHLC);
  for(let timestamp of timestamps) {
    let pricePoint = {};
    let priceOHLC = arrayOHLC[timestamp];
    pricePoint.x = new Date(timestamp * 1000);
    pricePoint.y = [
      priceOHLC.open,
      priceOHLC.high,
      priceOHLC.low,
      priceOHLC.close
    ];
    candlestickData.push(pricePoint);
  }

  return candlestickData;
}

const getLineData = (linearArray) => {
  let lineData = [];
  let timestamps = Object.keys(linearArray);
  for(let timestamp of timestamps) {
    let pricePoint = {};
    pricePoint.x = new Date(timestamp * 1000);
    pricePoint.y = linearArray[timestamp];
    lineData.push(pricePoint);
  }

  return lineData;
}

const PriceChart = (props) => {

  const defaultOptions = {
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

  const initialPriceChart = {
    symbol: '',
    options: defaultOptions,
    series: []
  }

  const [priceChart, setPriceChart]  = useState(initialPriceChart)

  useEffect(() => {

    const getResponse = async () => {
      const response = await fetch("http://localhost:5000/get-url/30 seconds/AAVEWETH")

      const data = await response.json();

      const priceObject =  getPriceObject(data);
      const timeframe = {
        name: '30 minutes',
        seconds: 30 * 60
      }
      const arrayOHLC = priceObject.getPriceArray(timeframe);

      const arrayEMA20 = priceObject.getEMA(timeframe, 'close', 20);
      const arraySMA20 = priceObject.getSMA(timeframe, 'close', 50);

      const candleData = getCandleStickData(arrayOHLC);
      const averageData20 = getLineData(arrayEMA20);
      const averageData50 = getLineData(arraySMA20);

      const priceSeries = [
        {
          name: 'line',
          type: 'line',
          data: averageData20
        } , {
          name: 'candle',
          type: 'candlestick',
          data: candleData
        } , {
            name: 'line',
            type: 'line',
            data: averageData50
          }
      ];

      const newPriceChart = {
        symbol: data.symbol,
        options: defaultOptions,
        series: priceSeries
      }

      setPriceChart(newPriceChart);
    }

    getResponse()
  }, [])

  return (
          <div>
            <h1>{priceChart.symbol}</h1>
            <Chart
              options={priceChart.options}
              series={priceChart.series}
            />
          </div>
  )
}

export default PriceChart;