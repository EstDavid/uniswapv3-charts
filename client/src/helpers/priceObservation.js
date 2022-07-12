class PriceObservation {
    constructor (priceData) {
        this.symbol = priceData.symbol;
        this.baseToken = priceData.baseToken;
        this.quoteToken = priceData.quoteToken;
        this.poolAddress = priceData.poolAddress;
        this.poolFee = priceData.poolFee;
        this.observationTimeframe = priceData.observationTimeframe;
        this.arrayTypes = ['open', 'high', 'low', 'close'];
        this.startTimestamp = priceData.startTimestamp;
        this.endTimestamp = priceData.endTimestamp;
        this.observations = priceData.observations;
        this.prices = {};
    }

    getPriceArray(timeframe) {
        if(this.prices === undefined || this.prices[timeframe.name] === undefined) {
            return this.convertTimeframe(timeframe);
        }
        else {
            return this.prices[timeframe.name];
        }
    }

    convertTimeframe(timeframeTo) {
        let timestamps = [];
        let open = 0;
        let high = 0;
        let low = 0;
        let close = 0;
        let startTimeframe = 0;
        let newCandleTimestamp = 0;
        let priceArray = {};

        if(timeframeTo.seconds % this.observationTimeframe.seconds !== 0) {
            throw('Timeframe to is not a multiple of time framefrom');
        }
        if(this.observations !== undefined) {
            timestamps = Object.keys(this.observations);
            timestamps.sort((a, b) => parseInt(a) - parseInt(b));
        }
        else {
            throw(`No price observation price array has been initialized for the ${this.baseToken.symbol + this.quoteToken.symbol} pair`);
        }

        // Initializing price array
        if(this.prices === undefined) {
            this.prices = {};
        }        
    
        for(let i = 0; i < timestamps.length; i +=1) {
            let timestamp = parseInt(timestamps[i]);
            let priceObservation = this.observations[timestamp];
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
        this.prices[timeframeTo.name] = priceArray;
        return this.prices[timeframeTo.name];
    }

    getArray(timeframe, arrayType) {
        if(!this.arrayTypes.includes(arrayType)) {
            throw(`Array ${arrayType} is not supported`);
        }
        let arrayOHLC = this.getPriceArray(timeframe);
        let array = {};
        for(let timestamp in arrayOHLC) {
            let valuesOHLC = arrayOHLC[timestamp];
            // Brute but effective way of getting the array...
            if(arrayType === 'open') {
                array[timestamp] = valuesOHLC.open;
            }
            if(arrayType === 'high') {
                array[timestamp] = valuesOHLC.high;
            }
            if(arrayType === 'low') {
                array[timestamp] = valuesOHLC.low;
            }
            if(arrayType === 'close') {
                array[timestamp] = valuesOHLC.close;
            }
        }
        return array;
    }

    getSMAFromArray(inputArray, nPeriods) {
        let arraySMA = {};
        let timestampsArray = [];
        for(let timestamp in inputArray) {
            timestampsArray.push(parseInt(timestamp));
        }
        timestampsArray.sort((a, b) => a - b);
        let periodArray = [];
        let sum = 0;
        for(let i = 0; i < timestampsArray.length; i += 1) {
            let timestamp = timestampsArray[i];
            periodArray.push(inputArray[timestamp]);
            
            if(periodArray.length > nPeriods) {
                periodArray.shift();
            }

            if(periodArray.length === nPeriods) {
                sum = periodArray.reduce(function (accumVariable, curValue) {
                    return accumVariable + curValue
                }, 0);
                
                arraySMA[timestamp] = sum / nPeriods;
            };
        }
        return arraySMA;
    }

    getEMAFromArray(inputArray, nPeriods) {
        let arrayEMA = {};
        let k = 2 / (nPeriods + 1);
        let timestampsArray = [];
        for(let timestamp in inputArray) {
            timestampsArray.push(parseInt(timestamp));
        }
        timestampsArray.sort((a, b) => a - b);
        let sum = 0;
        let ema = 0;
        for(let i = 0; i < timestampsArray.length; i += 1) {
            let timestamp = timestampsArray[i];
            if(i < nPeriods - 1) {
                sum = sum + inputArray[timestamp];
                continue;
            }
            else if(i === nPeriods - 1) {
                sum = sum + inputArray[timestamp];
                ema = sum / nPeriods;
                continue;
            }
            else {
                ema =  inputArray[timestamp] * k + ema * (1 - k);
            }
            arrayEMA[timestamp] = ema;
        }
        return arrayEMA;
    }

    getSMA(timeframe, arrayType ,nPeriods) {
        let inputArray = this.getArray(timeframe, arrayType);
        return this.getSMAFromArray(inputArray, nPeriods);
    }

    getEMA(timeframe, arrayType ,nPeriods) {
        let inputArray = this.getArray(timeframe, arrayType);
        return this.getEMAFromArray(inputArray, nPeriods);
    }

    getATR(timeframe, nPeriods) {
        // Formula for the ATR obtained from:
        // https://www.investopedia.com/terms/a/atr.asp
        let arrayATR= {};
        let highArray = this.getArray(timeframe, 'high');
        let lowArray = this.getArray(timeframe, 'low');
        let closeArray = this.getArray(timeframe, 'close');
        let timestampsArray = [];
        for(let timestamp in closeArray) {
            timestampsArray.push(parseInt(timestamp));
        }
        timestampsArray.sort((a, b) => a - b);
        let previousTrueRange = [];
        let previousATR = 0;
        let trueRange;
        let trueRangeSum;
        for(let i = 0; i < timestampsArray.length; i += 1) {
            let timestamp = timestampsArray[i];
            let high = highArray[timestamp];
            let low = lowArray[timestamp];
            if(i === 0) {
                previousTrueRange.push(high - low);
                trueRangeSum = previousTrueRange.reduce(function (accumVariable, curValue) {
                    return accumVariable + curValue
                }, 0);
                if(nPeriods === 1) {
                    arrayATR[timestamp] = trueRangeSum / nPeriods;
                }
                continue;
            }

            let previousClose = closeArray[timestampsArray[i - 1]];

            trueRange = Math.max(
                                    high - low,
                                    Math.abs(high - previousClose),
                                    Math.abs(low - previousClose)
            );

            if(i < nPeriods) {
                previousTrueRange.push(trueRange);
                if(i === nPeriods - 1) {
                    trueRangeSum = previousTrueRange.reduce(function (accumVariable, curValue) {
                        return accumVariable + curValue
                    }, 0);
                    previousATR = trueRangeSum / nPeriods;
                }
            }
            else {
                arrayATR[timestamp] = (previousATR * (nPeriods - 1) + trueRange) / nPeriods;
                previousATR = arrayATR[timestamp];
            }         
        }
        return arrayATR;
    }

    getVolatility(timeframe, nPeriodsATR, nPeriodsSmoothing) {
        // Volatility here is defined as the ATR% divided by its own EMA
        // For instance, a value of 1.25  means that the ATR% is above its own EMA by 25%
        let ATRArray = this.getATR(timeframe, nPeriodsATR);
        let ATRPercentageArray = {};
        let volatilityArray = {};
        // let volatilityEMAArray = this.;
        let closeArray = this.getArray(timeframe, 'close');
        let timestampsArray = [];
        for(let timestamp in ATRArray) {
            timestampsArray.push(parseInt(timestamp));
        }
        timestampsArray.sort((a, b) => a - b);

        for(let i = 0; i < timestampsArray.length; i += 1) {
            let timestamp = timestampsArray[i];
            ATRPercentageArray[timestamp] = (ATRArray[timestamp] / closeArray[timestamp]) * 100;
        }

        let ATRPercentageEMA = this.getEMAFromArray(ATRPercentageArray, nPeriodsSmoothing);
        timestampsArray = [];
        for(let timestamp in ATRPercentageEMA) {
            timestampsArray.push(parseInt(timestamp));
        }
        timestampsArray.sort((a, b) => a - b);
        
        for(let i = 0; i < timestampsArray.length; i += 1) {
            let timestamp = timestampsArray[i];
            volatilityArray[timestamp] = ATRPercentageArray[timestamp] / ATRPercentageEMA[timestamp];
        }
        return volatilityArray;
    }
}

const initializePriceObject = (priceData) => {
    return new PriceObservation(priceData);
}

export default initializePriceObject;