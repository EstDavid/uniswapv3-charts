const mongoose = require('mongoose')
const priceDataSchema = require('./priceData')

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
    // priceData: priceDataSchema,
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

pairSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        const { priceData } = returnedObject
        // returnedObject.id = returnedObject._id.toString()
        // returnedObject.observationTimeframe = {
        //     name: priceData.timeframe.name,
        //     seconds: priceData.timeframe.seconds
        // }
        // returnedObject.observations = {}
        // returnedObject.arrayOHLC = priceData.arrayOHLC
        // returnedObject.startTimestamp = (priceData.earliest).getTime() / 1000
        // returnedObject.endTimestamp = (priceData.latest).getTime() / 1000
        // returnedObject.maxObservations = priceData.maxObservations
        delete returnedObject.priceData
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Pair', pairSchema)
