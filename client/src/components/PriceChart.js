import React, { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import Chart from "react-apexcharts";
import TimeframeSelector from './TimeframeSelector';
import ChartTitle from './ChartTitle';
import { 
  fetchPriceData,
  priceDataSelector,
  scrollGraph,
  toggleShowCTRLMouseWheel
} from '../slices/priceData';
import {indicatorConfigSelector} from '../slices/indicatorConfig';
import {accountsSelector} from '../slices/accounts';

import {
  calculateCandlestickData,
  getChartingData
} from '../helpers/priceDataCalculator';
import {defaultChartOptions} from '../helpers/chartOptions';

// Temporary parameters derived from user interaction
const userSymbol = 'WETHUSDT';

const PriceChart = () => {
  const dispatch = useDispatch();

  const {
    loading,
    hasErrors,
    priceObject,
    chartObject,
    viewTimeframe,
    showCTRLMouseWheel
  } = useSelector(priceDataSelector);

  const { 
    account,
    metamaskInstalled
  } = useSelector(accountsSelector);

  const arrayOHLC = priceObject.arrayOHLC;

  const {configuringIndicator, currentIndicator} = useSelector(indicatorConfigSelector);

  const indicatorColors = [''];

  useEffect(() => {
    dispatch(fetchPriceData(userSymbol, viewTimeframe));
    // const {baseToken, quoteToken} = priceObject;
    // dispatch(loadTokenContracts(baseToken.address, quoteToken.address));
    // dispatch(loadBalances(account, baseTokenContract, quoteTokenContract));
  }, [dispatch]);

  const handleScroll = (event) => {
    event.preventDefault();
    if(event.ctrlKey === true) {
      event.preventDefault();
      if(event.deltaY < 0) {
        dispatch(scrollGraph(-1));
      } else if (event.deltaY > 0) {
        dispatch(scrollGraph(1));
      }
    } else {
      dispatch(toggleShowCTRLMouseWheel(true));
      setTimeout(() => dispatch(toggleShowCTRLMouseWheel(false)), 1500);
    }
  }

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

      const {name, type, data, visible, color} = series;    

      const chartingData = visible ? getChartingData(data, arrayOHLC) : [];

      const movingAverageObject = {
        name: name,
        type: type,
        data: chartingData
      }

      priceSeries.push(movingAverageObject);
      indicatorColors.push(color);
    }
  }

  // Checking if there is an indicator being configured in the user dialog
  // This section only renders new indicators, not the existing ones that are being configured
  if (configuringIndicator && currentIndicator.id === 0) {

    const { name, type, data, color} = currentIndicator;

    const chartingData = getChartingData(data, arrayOHLC);

    const movingAverageObject = {
      name: name,
      type: type,
      data: chartingData
    }

    priceSeries.push(movingAverageObject);
    indicatorColors.push(color);
  }

  const renderChart = () => {
    if(loading) return (
      <div className="d-flex w-100 align-items-center justify-content-between p-2">
        <div className="spinner-border text-secondary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>        
      </div>

    )
    if(hasErrors) return <p>Unable to display chart</p>

    const priceChart = {
      symbol: priceObject.symbol,
      options: defaultChartOptions(chartObject.xMin, chartObject.xMax, indicatorColors),
      series: priceSeries
    }

    return (
      <div>
        <ChartTitle />
        <TimeframeSelector />
        <div className="card my-2">
          <div onWheel={handleScroll}>
            <Chart style={showCTRLMouseWheel ? {opacity: "0.2"} : {} }
              options={priceChart.options}
              series={priceChart.series}
            />
            {showCTRLMouseWheel ? 
            <div className="ctrl-mousewheel-text card-img-overlay">
              <div>Press CTRL key + mouse wheel to scroll the chart left and right</div>
            </div>
              : ''}

        </div>
          
        </div>

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