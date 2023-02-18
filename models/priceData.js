const mongoose = require('mongoose')

const dataPointSchema = new mongoose.Schema({
    _id: String,
    price: Number,
    }, {
    virtuals: {
        timestamp: {
            get() {
                return new Date(parseInt(this._id) * 1000)
            }
        },
    }
})

const priceDataSchema = new mongoose.Schema({
    _id: String,
    symbol: String,
    timeframe: {
        name: String,
        seconds: Number,
    },
    timeframeTo: {
        seconds: Number,
    },
    observations: [dataPointSchema]
    }, {
    virtuals: {
        earliest: {
            get() {
                const getEarliest = (earliest, observation) => {
                    const current = observation.timestamp
                    return current <= earliest ? current : earliest
                }

                return this.observations.reduce(getEarliest, this.observations[0].timestamp)
            }
        },
        latest: {
            get() {
                const getLatest = (latest, observation) => {
                    const current = observation.timestamp
                    return current >= latest ? current : latest
                }

                return this.observations.reduce(getLatest, this.observations[0].timestamp)
            }
        },
    }
})

const getEarliest = (observations) => {
    const getEarliest = (earliest, observation) => {
        const current = new Date(parseInt(observation._id) * 1000)
        return current <= earliest ? current : earliest
    }

    return observations.reduce(getEarliest, new Date(parseInt(observations[0]._id) * 1000))
}

const getLatest = (observations) => {
    const getLatest = (latest, observation) => {
        const current = new Date(parseInt(observation._id) * 1000)
        return current >= latest ? current : latest
    }

    return observations.reduce(getLatest, new Date(parseInt(observations[0]._id) * 1000))
}

const calculatePriceArray = (timeframeFrom, timeframeTo, observations) => {
    let dataArray = [...observations]
    let open = 0;
    let high = 0;
    let low = 0;
    let close = 0;
    let startTimeframe = 0;
    let newCandleTimestamp = 0;
    let priceArray = {};

    if(timeframeTo % timeframeFrom !== 0) {
        throw(`Timeframe to ${timeframeTo} is not a multiple of timeframe from ${timeframeFrom}`);
    }

    dataArray.sort((a, b) => {
        return parseInt(a._id) - parseInt(b._id)
    })

    for(let i = 0; i < dataArray.length; i +=1) {
        let timestamp = parseInt(dataArray[i]._id);
        let priceObservation = dataArray[i].price;
        close = priceObservation;
        if(i === 0) { // Opening a new cande at the beginning of the series
            startTimeframe = timestamp - (timestamp % timeframeTo);
            newCandleTimestamp = startTimeframe + timeframeTo;
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
            startTimeframe = timestamp - (timestamp % timeframeTo);
            newCandleTimestamp = startTimeframe + timeframeTo;
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

priceDataSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        const {
            _id,
            timeframe,
            timeframeTo,
            observations
        } = returnedObject
        returnedObject.id = _id.toString()
        returnedObject.arrayOHLC = calculatePriceArray(
            timeframe.seconds,
            timeframeTo.seconds,
            observations
        )
        returnedObject.observationTimeframe = {
            name: timeframe.name,
            seconds: timeframe.seconds
        }
        returnedObject.earliest = getEarliest(observations)
        returnedObject.latest = getLatest(observations)
        returnedObject.maxObservations = observations.length
        delete returnedObject.observations
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = priceDataSchema