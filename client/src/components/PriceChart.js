import React, { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import Chart from "react-apexcharts";
import TimeframeSelector from './TimeframeSelector';
import { 
  fetchPriceData,
  changeTimeframe,
  addMovingAverage,
  priceDataSelector,
  deleteMovingAverage,
  updateSeriesData,
  updateArrayOHLC
} from '../slices/priceData';
import {indicatorConfigSelector, updateCurrentData} from '../slices/indicatorConfig';

import {timeframes} from '../helpers/timeframes';

import {
  calculateArrayTimeframe,
  calculateCandlestickData,
  calculateSMAFromOHLC,
  calculateEMAFromOHLC,
  getChartingData
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
    priceObject,
    chartObject,
    viewTimeframe
  } = useSelector(priceDataSelector);

  const arrayOHLC = priceObject.arrayOHLC;

  const {configuringIndicator, currentIndicator} = useSelector(indicatorConfigSelector);

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

        // If the current series belongs to an indicator that is being configured,
        // the use the currentIndicator state variable
        // Otherwise use the default configuration stored in the state
        if(configuringIndicator && currentIndicator.id === series.id) {
          series = currentIndicator;          
        }

        const {name, type, data} = series;    

        const chartingData = getChartingData(data, arrayOHLC);

        const movingAverageObject = {
          name: name,
          type: type,
          data: chartingData
        }

        priceSeries.push(movingAverageObject);
      }
    }

    // Checking if there is an indicator being configured in the user dialog
    // This section only renders new indicators, not the existing ones that are being configured
    if (configuringIndicator && currentIndicator.id === 0) {

      const { name, type, data} = currentIndicator;

      const chartingData = getChartingData(data, arrayOHLC);

      const movingAverageObject = {
        name: name,
        type: type,
        data: chartingData
      }

      priceSeries.push(movingAverageObject);
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