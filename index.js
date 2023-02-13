// In order to be able to run Google Cloud Storage on React check out:
// https://javascript.plainenglish.io/upload-files-to-google-cloud-storage-from-react-cf839d7361a5

require('dotenv').config()
const express = require("express");
var cors = require("cors");
var { format }  = require("util");
var Multer = require( "multer");
var path = require('path');

const app = express();
const port = process.env.PORT || 5000;

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // no larger than 5mb, you can change as needed.
  },
});

const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB', error.message)
    })

const Pair = require('./models/pair')

const getObservationsObject = (observationsArray) => {
  const observationsObject = {}

  observationsArray.forEach(observation => {
    const timestampSeconds = Date.parse(observation.timestamp) / 1000
    observationsObject[timestampSeconds] = observation.price
  })

  return observationsObject
}

const getEarliest = (earliest, observation) => {
  const current = observation.timestamp
  return current <= earliest ? current : earliest
}

const getLatest = (latest, observation) => {
  const current = observation.timestamp
  return current >= latest ? current : latest
}

// DOWNLOAD FILE
app.get("/get-url/:timeframe/:symbol", (req, res) => {

    Pair.find({symbol: req.params.symbol})
      .then(result => {
        const [pair] = result

        if (pair !== undefined) {
          const {
            symbol,
            baseToken,
            quoteToken,
            poolAddress,
            poolFee,
            arrayTypes,
            extraMinutesData,
          } = pair

          const observationsIndex = pair.observations.findIndex(observation => {
            return observation.name === req.params.timeframe
          })

          if (observationsIndex !== -1 ) {
            const observationsData = pair.observations[observationsIndex].observationsData

            const earliestTimestamp = observationsData.reduce(getEarliest, observationsData[0].timestamp)
            const latestTimestamp = observationsData.reduce(getLatest, observationsData[0].timestamp)
      
            const symbolObject = {
              symbol,
              baseToken,
              quoteToken,
              poolAddress,
              poolFee,
              arrayTypes,
              extraMinutesData,
              observationTimeframe: {
                name: pair.observations[observationsIndex].name,
                seconds: pair.observations[observationsIndex].seconds
              },
              observations: getObservationsObject(observationsData),
              startTimestamp: (earliestTimestamp / 1000).toString(),
              endTimestamp: (latestTimestamp / 1000).toString(),
              maxObservations: observationsData.length,
            }
      
            res.status(200).send(symbolObject)
          } else {
            res.status(404).end()
          }
        } else {
          res.status(404).end()
        }
      })
});

// DOWNLOAD ALL FILENAMES AND CLASSIFY PAIRS ACCORDING TO QUOTE TOKEN
app.get("/get-symbols/:timeframe/", (req, res) => {
  const symbols = []

  Pair.find({})
    .then(result => {
      result.forEach(pair => {
        if (pair.observations.find(observation => {
          return observation.name === req.params.timeframe
        }) !== undefined) {
          symbols.push(pair.symbol)
        }
      })

      res.status(200).send(symbols); 
    })

     
});

app.use(express.static(path.join(__dirname, process.env.HTML_FOLDER)));

app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, process.env.HTML_FOLDER, 'index.html'));
});

app.listen(port, () => {
    console.log(`Storage downloader listening at http://localhost:${port}`);
});