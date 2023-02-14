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
const Observation = require('./models/observation')

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
app.get("/get-url/:timeframe/:timeframeto/:symbol", (req, res) => {

    Pair.findById(req.params.symbol)
      .then(pair => {
        if (pair !== undefined && pair !== null) {
          const {
            symbol,
            baseToken,
            quoteToken,
            poolAddress,
            poolFee,
            arrayTypes,
            extraMinutesData,
          } = pair

          Observation.findById(`${req.params.symbol}-${req.params.timeframe}`)
            .then(observation => {
              if (observation !== null && observation !== undefined) {
                observation.set('to', parseInt(req.params.timeframeto))
                const arrayOHLC = observation.get('arrayOHLC')

                const earliestTimestamp = observation.earliest
                const latestTimestamp = observation.latest
          
                const symbolObject = {
                  symbol,
                  baseToken,
                  quoteToken,
                  poolAddress,
                  poolFee,
                  arrayTypes,
                  extraMinutesData,
                  observationTimeframe: {
                    name: observation.timeframe.name,
                    seconds: observation.timeframe.seconds
                  },
                  observations: {},
                  arrayOHLC,
                  startTimestamp: (earliestTimestamp / 1000).toString(),
                  endTimestamp: (latestTimestamp / 1000).toString(),
                  maxObservations: observation.data.length,
                }
          
                res.status(200).send(symbolObject)                
              } else {
                res.status(404).end()
              }
            })
        } else {
          res.status(404).end()
        }
      })
});

// DOWNLOAD ALL FILENAMES AND CLASSIFY PAIRS ACCORDING TO QUOTE TOKEN
app.get("/get-symbols/", (req, res) => {
  const symbols = []
  
  Pair.find()
    .then(result => {
      result.forEach(pair => {
          symbols.push(pair.symbol)
      })

      res.status(200).send(symbols); 
    })
    .catch(error => {
      console.log(error)
    })
  })

app.use(express.static(path.join(__dirname, process.env.HTML_FOLDER)));

app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, process.env.HTML_FOLDER, 'index.html'));
});

app.listen(port, () => {
    console.log(`Storage downloader listening at http://localhost:${port}`);
});