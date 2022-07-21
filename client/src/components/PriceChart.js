import React, { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import Chart from "react-apexcharts";
import TimeframeSelector from './TimeframeSelector';
import { 
  fetchPriceData,
  priceDataSelector,
  scrollGraph
} from '../slices/priceData';
import {indicatorConfigSelector} from '../slices/indicatorConfig';

import {
  calculateCandlestickData,
  getChartingData
} from '../helpers/priceDataCalculator';
import {defaultChartOptions} from '../helpers/chartOptions';

// Temporary parameters derived from user interaction
const userSymbol = 'AAVEWETH';

const PriceChart = () => {
  const dispatch = useDispatch();

  const {
    loading,
    hasErrors,
    priceObject,
    chartObject,
    viewTimeframe,
  } = useSelector(priceDataSelector);

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
    if(event.deltaY < 0) {
      dispatch(scrollGraph(-1));
    } else if (event.deltaY > 0) {
      dispatch(scrollGraph(1));
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
    if(loading) return <p>Loading price data...</p>
    if(hasErrors) return <p>Unable to display chart</p>

    const priceChart = {
      symbol: priceObject.symbol,
      options: defaultChartOptions(chartObject.xMin, chartObject.xMax, indicatorColors),
      series: priceSeries
    }

    return (
      <div>
        <div className="d-flex w-100 align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <h2 className="p-2 mr-auto">
                {`${priceObject.baseToken.symbol} / ${priceObject.quoteToken.symbol}`}</h2>
              <span></span>
              <a
                href={`https://etherscan.io/address/${priceObject.baseToken.address.toLowerCase()}`}
                target="_blank" rel="noreferrer noopener">
                <img src="https://assets.coingecko.com/coins/images/12645/thumb/AAVE.png?1601374110" style={{height: "100%"}}></img>
              </a>
              <a
                href={`https://etherscan.io/address/${priceObject.quoteToken.address.toLowerCase()}`}
                target="_blank" rel="noreferrer noopener">
                <img src="https://assets.coingecko.com/coins/images/2518/thumb/weth.png?1628852295" style={{height: "100%"}}></img>
              </a>
            </div>
            <div>
              <a className="btn btn-outline-secondary"
                href={`https://info.uniswap.org/#/pools/${priceObject.poolAddress.toLowerCase()}`}
                target="_blank" rel="noreferrer noopener">
              Pool: {`${priceObject.poolAddress.slice(0,6)}...${priceObject.poolAddress.slice(priceObject.poolAddress.length - 4)}`}</a>
            </div>
        </div>
        <TimeframeSelector />
        <div onWheel={handleScroll}>
          <Chart
            options={priceChart.options}
            series={priceChart.series}
          />
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