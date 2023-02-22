const mongoose = require('mongoose')

const priceSchema = new mongoose.Schema(
    {
        timestamp: Date,
        price: Number,
        metadata: {
            symbol: String,
            seconds: Number
        },
    },
    {
        timeseries: {
            timeField: "timestamp",
            metaField: 'metadata',
            granularity: 'seconds'
        }    
    }
)

const priceModel = mongoose.model('Price', priceSchema)

module.exports = priceModel