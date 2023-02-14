const mongoose = require('mongoose')

const dataSchema = new mongoose.Schema({
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

const observationSchema = new mongoose.Schema({
    _id: String,
    symbol: String,
    timeframe: {
        name: String,
        seconds: Number,
    },
    timeframeTo: {
        seconds: Number,
    },
    data: [dataSchema],
    }, {
    virtuals: {
        earliest: {
            get() {
                const getEarliest = (earliest, observation) => {
                    const current = observation.timestamp
                    return current <= earliest ? current : earliest
                }

                return this.data.reduce(getEarliest, this.data[0].timestamp)
            }
        },
        latest: {
            get() {
                const getLatest = (latest, observation) => {
                    const current = observation.timestamp
                    return current >= latest ? current : latest
                }

                return this.data.reduce(getLatest, this.data[0].timestamp)
            }
        },
        arrayOHLC: {
            get() {
                let timeframeFrom = this.timeframe.seconds;
                let timeframeTo = this.timeframeTo.seconds;
                let dataArray = [...this.data]
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
        },
        to: {
            set(v) {
                this.timeframeTo.seconds = v
            }
        }
    }

})

observationSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        // delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Observation', observationSchema)