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

const pairSchema = new mongoose.Schema({
    _id: String,
    symbol: String,
    baseToken: tokenSchema,
    quoteToken: tokenSchema,
    poolAddress: String,
    poolFee: String,
    arrayTypes: [String],
    extraMinutesData: Number,
})

pairSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Pair', pairSchema)
