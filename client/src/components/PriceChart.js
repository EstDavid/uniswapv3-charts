import React, { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import Chart from "react-apexcharts";
import TimeframeSelector from './TimeframeSelector';
import { 
  fetchPriceData,
  changeTimeframe,
  addMovingAverage,
  priceDataSelector,
  deleteMovingAverage
} from '../slices/priceData';

import {timeframes} from '../helpers/timeframes';

import {
  calculateArrayTimeframe,
  calculateCandlestickData,
  calculateSMAFromOHLC,
  calculateEMAFromOHLC
} from '../helpers/priceDataCalculator';
import {defaultChartOptions} from '../helpers/chartOptions';

// Temporary parameters derived from user interaction
const userSymbol = 'AAVEWETH';
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

  const getNewMA = (typeMA, nPeriods, arrayType) => {
    dispatch(addMovingAverage(typeMA, nPeriods, arrayType));
  }


  const deleteMA = (id) => {
    dispatch(deleteMovingAverage(id))
  }

  useEffect(() => {
    dispatch(fetchPriceData(userSymbol, viewTimeframe));

  }, [dispatch]);


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
        <TimeframeSelector />
        <Chart
          options={priceChart.options}
          series={priceChart.series}
        />
      </div>
    );
  }

  return (
    <div className="container">
      {renderChart()}
    </div>
  )
}

export default PriceChart;