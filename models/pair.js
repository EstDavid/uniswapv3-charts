const mongoose = require('mongoose')

const tokenSchema = new mongoose.Schema({
    chanId: Number,
    decimals: Number,
    symbol: String,
    name: String,
    isNative: Boolean,
    isToken: Boolean,
    address: String,
    logoURI: String
})

const observationsDataSchema = new mongoose.Schema({
    timestamp: Date,
    price: Number,
})

const observationsSchema = new mongoose.Schema({
name: String,
seconds: Number,
observationsData: [observationsDataSchema],
})

const pairSchema = new mongoose.Schema({
    symbol: String,
    baseToken: tokenSchema,
    quoteToken: tokenSchema,
    poolAddress: String,
    poolFee: String,
    arrayTypes: [String],
    extraMinutesData: Number,
    observations: [observationsSchema],
})

pairSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Pair', pairSchema)
