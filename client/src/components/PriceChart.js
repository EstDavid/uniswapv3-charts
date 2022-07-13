import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import Chart from "react-apexcharts";
import { 
  fetchPriceData,
  changeTimeframe,
  addMovingAverage,
  priceDataSelector,
  deleteMovingAverage
} from '../slices/priceData';
import { priceObjectSelector } from '../slices/priceObject';
import initializePriceObject from '../helpers/priceObservation';


import {timeframes} from '../helpers/timeframes';

import {
  calculateArrayTimeframe,
  calculateCandlestickData,
  calculateSMAFromOHLC,
  calculateEMAFromOHLC
} from '../helpers/priceDataCalculator';
import {defaultChartOptions} from '../helpers/chartOptions';
import {dummyData} from '../helpers/dummyData';

// Temporary parameters derived from user interaction
const userSymbol = 'WETHUSDC';
const userViewTimeframe = 'days1';
const userArrayType = 'close';
const userMAPeriods1 = 20;
const userMAType1 = 'EMA';

const PriceChart = () => {
  const dispatch = useDispatch();
  const {
    loading,
    hasErrors,
    priceDataRaw,
    priceObject,
    chartObject,
    viewTimeframe
  } = useSelector(priceDataSelector);

  const getNewTimeframe = (timeframeKey) => {
    dispatch(changeTimeframe(timeframes[timeframeKey]));
  }

  // setTimeout(getNewTimeframe, 15000, 'hours4');

  const getNewSymbol = (symbol) => {
    dispatch(fetchPriceData(symbol, viewTimeframe));
  }

  // var timeout3 = setTimeout(getNewSymbol, 25000, 'WBTCUSDC');

  const getNewMA = (typeMA, nPeriods, arrayType) => {
    dispatch(addMovingAverage(typeMA, nPeriods, arrayType));
  }

  // var timeout1 = setTimeout(getNewMA, 15000, 'SMA', 20, priceObject.arrayTypes[3]);
  // var timeout2 = setTimeout(getNewMA, 15000, 'EMA', 20, priceObject.arrayTypes[3]);

  const deleteMA = (id) => {
    dispatch(deleteMovingAverage(id))
  }
  // var timeout4 = setTimeout(deleteMA, 17000, 2);

  useEffect(() => {
    dispatch(fetchPriceData(userSymbol, viewTimeframe));

  }, [dispatch]);

  const clearTimeouts = () => {
    // clearTimeout(timeout1);
    // clearTimeout(timeout2);
    // clearTimeout(timeout3);
  } 

  const renderChart = () => {
    if(loading) return <p>Loading price data...</p>
    if(hasErrors) return <p>Unable to display chart</p>

    const arrayOHLC = calculateArrayTimeframe(priceObject, viewTimeframe);

    const candleData = calculateCandlestickData(arrayOHLC);

    const priceSeries = [
      {
        id: 1,
        name: chartObject.series[0].name,
        type: 'candlestick',
        data: candleData
      }
    ];

    console.log(chartObject.series)

    // Checking if there are moving average objects in the chartObject series
    for(let series of chartObject.series) {
      if(series.id > 1) {
        let movingAverageData;
        if(series.typeMA === 'SMA') {
          movingAverageData = calculateSMAFromOHLC(arrayOHLC, series.nPeriods, series.arrayType);
        } else if(series.typeMA === 'EMA') {
          movingAverageData = calculateEMAFromOHLC(arrayOHLC, series.nPeriods, series.arrayType);
        }

        const movingAverageObject = {
          name: series.name,
          type: series.type,
          data: movingAverageData
        }

        priceSeries.push(movingAverageObject);
      }
    }

    const priceChart = {
      symbol: priceObject.symbol,
      options: defaultChartOptions,
      series: priceSeries
    }

    return (
      <div>
        <h1>{priceObject.symbol}</h1>
        <Chart
          options={priceChart.options}
          series={priceChart.series}
        />
        {clearTimeouts()}
      </div>
    );
  }

  return (
    <div>
      {renderChart()}
    </div>
  )
}

export default PriceChart;

    // const getResponse = async () => {
    //   const response = await fetch("/get-url/30 seconds/AAVEWETH")

    //   const data = await response.json();

    //   const priceObject =  getPriceObject(data);
    //   const timeframe = {
    //     name: '30 minutes',
    //     seconds: 30 * 60
    //   }
    //   const arrayOHLC = priceObject.getPriceArray(timeframe);

    //   const arrayEMA20 = priceObject.getEMA(timeframe, 'close', 20);
    //   const arraySMA20 = priceObject.getSMA(timeframe, 'close', 50);

    //   const candleData = getCandleStickData(arrayOHLC);
    //   const averageData20 = getLineData(arrayEMA20);
    //   const averageData50 = getLineData(arraySMA20);

    //   const priceSeries = [
    //     {
    //       id: 1,
    //       name: 'line',
    //       type: 'line',
    //       data: averageData20
    //     } , {
    //       id: 2,
    //       name: 'candle',
    //       type: 'candlestick',
    //       data: candleData
    //     } , {
    //       id: 3,
    //       name: 'line',
    //       type: 'line',
    //       data: averageData50
    //     }
    //   ];

    //   const newPriceChart = {
    //     symbol: data.symbol,
    //     options: defaultOptions,
    //     series: priceSeries
    //   }

    //   setPriceChart(newPriceChart);
    // }

    // getResponse();