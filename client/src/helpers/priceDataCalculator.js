export const calculateArrayTimeframe = (priceObject, timeframeTo) => {
    let timestamps = [];
    let open = 0;
    let high = 0;
    let low = 0;
    let close = 0;
    let startTimeframe = 0;
    let newCandleTimestamp = 0;
    let priceArray = {};

    if(timeframeTo.seconds % priceObject.observationTimeframe.seconds !== 0) {
        throw(`Timeframe to ${timeframeTo.seconds} is not a multiple of timeframe from ${priceObject.observationTimeframe.seconds}`);
    }
    if(priceObject.observations !== undefined) {
        timestamps = Object.keys(priceObject.observations);
        timestamps.sort((a, b) => parseInt(a) - parseInt(b));
    }
    else {
        throw(`No price observation price array has been initialized for the ${priceObject.baseToken.symbol + priceObject.quoteToken.symbol} pair`);
    }     

    for(let i = 0; i < timestamps.length; i +=1) {
        let timestamp = parseInt(timestamps[i]);
        let priceObservation = priceObject.observations[timestamp];
        close = priceObservation;
        if(i === 0) { // Opening a new cande at the beginning of the series
            startTimeframe = timestamp - (timestamp % timeframeTo.seconds);
            newCandleTimestamp = startTimeframe + timeframeTo.seconds;
            open = priceObservation;
            high = priceObservation;
            low = priceObservation;
            priceArray[startTimeframe] = {
                timestamp: startTimeframe,
                open,
                high,
                low,
                close
            }
        }
        else if(timestamp < newCandleTimestamp) {
            if(priceObservation > high) {
                high = priceObservation;
                priceArray[startTimeframe].high = high;
            }
            if(priceObservation < low) {
                low = priceObservation;
                priceArray[startTimeframe].low = low;
            }
            priceArray[startTimeframe].close = close;
        }
        else {  // Opening a new candle
            startTimeframe = timestamp - (timestamp % timeframeTo.seconds);
            newCandleTimestamp = startTimeframe + timeframeTo.seconds;
            open = priceObservation;
            high = priceObservation;
            low = priceObservation;
            close = priceObservation;
            priceArray[startTimeframe] = {
                timestamp: startTimeframe,
                open,
                high,
                low,
                close
            }
        }
    }

    return priceArray;
}

export const calculateCandlestickData = (arrayOHLC) => {
    let candlestickData = [];
    for(let candle of arrayOHLC) {
      candlestickData.push([new Date(candle._id).getTime(),[candle.open, candle.high, candle.low, candle.close]]);
    }
  
    return candlestickData;
}

export const calculateSMAFromOHLC = (arrayOHLC, nPeriods, arrayType) => {
    let priceArray = getPriceArray(arrayOHLC, arrayType)
    let lineData = [];
    let initialTimestamp;
    let timestampsArray = [];
    for(let timestamp in priceArray) {
        timestampsArray.push(parseInt(timestamp));
    }
    timestampsArray.sort((a, b) => a - b);
    let periodArray = [];
    let sum = 0;
    for(let i = 0; i < timestampsArray.length; i += 1) {
        let timestamp = timestampsArray[i];
        periodArray.push(priceArray[timestamp]);
        
        if(periodArray.length > nPeriods) {
            periodArray.shift();
        }

        if(periodArray.length === nPeriods) {
            sum = periodArray.reduce(function (accumVariable, curValue) {
                return accumVariable + curValue
            }, 0);
            
            lineData.push(sum / nPeriods);

            if(initialTimestamp === undefined) { initialTimestamp = timestamp }
        };
    }
    return {lineData, initialTimestamp};
}

export const calculateEMAFromOHLC = (arrayOHLC, nPeriods, arrayType) => {
    let priceArray = getPriceArray(arrayOHLC, arrayType)
    let lineData = [];
    let initialTimestamp;
    let k = 2 / (nPeriods + 1);
    let timestampsArray = [];
    for(let timestamp in priceArray) {
        timestampsArray.push(parseInt(timestamp));
    }
    timestampsArray.sort((a, b) => a - b);
    let sum = 0;
    let ema = 0;
    for(let i = 0; i < timestampsArray.length; i += 1) {
        let timestamp = timestampsArray[i];
        if(i < nPeriods - 1) {
            sum = sum + priceArray[timestamp];
            continue;
        }
        else if(i === nPeriods - 1) {
            sum = sum + priceArray[timestamp];
            ema = sum / nPeriods;
            continue;
        }
        else {
            ema =  priceArray[timestamp] * k + ema * (1 - k);
        }
        lineData.push(ema);

        if(initialTimestamp === undefined) { initialTimestamp = timestamp }

    }
    return {lineData, initialTimestamp};
}

export const getChartingData = (dataObject, arrayOHLC) => {
    const chartingData = [];
    let timestampsArray = [];
    for(let valueOHLC of arrayOHLC) {
        timestampsArray.push(parseInt(new Date(valueOHLC._id).getTime()));
    }
    timestampsArray.sort((a, b) => a - b);
    let j = 0;
    for(let i = 0; i < timestampsArray.length; i += 1) {
        let timestamp = timestampsArray[i];
        if(timestamp >= dataObject.initialTimestamp) {
            chartingData.push([timestamp, dataObject.lineData[j]]);
            j += 1;
        }
    }
    return chartingData;
}

const getPriceArray = (arrayOHLC, arrayType) => {
    let priceArray = {};
    for(let valueOHLC of arrayOHLC) {
        const timestamp = new Date(valueOHLC._id).getTime()
        // Brute but effective way of getting the array...
        if(arrayType === 'open') {
            priceArray[timestamp] = valueOHLC.open;
        }
        if(arrayType === 'high') {
            priceArray[timestamp] = valueOHLC.high;
        }
        if(arrayType === 'low') {
            priceArray[timestamp] = valueOHLC.low;
        }
        if(arrayType === 'close') {
            priceArray[timestamp] = valueOHLC.close;
        }
    }
    return priceArray;
}