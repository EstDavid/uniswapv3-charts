// In order to be able to run Google Cloud Storage on React check out:
// https://javascript.plainenglish.io/upload-files-to-google-cloud-storage-from-react-cf839d7361a5

require('dotenv').config()
const express = require("express");
const morgan = require('morgan')
var cors = require("cors");
var { format }  = require("util");
var Multer = require( "multer");
var path = require('path');

const app = express();
app.use(express.static('build'))
app.use(express.json())
app.use(cors())
const port = process.env.PORT || 5000;

// Creating custom token 'data' which returns the request.data stringified object from
// the 'processData' middleware function
morgan.token('data', (request, response) => request.data)

const processData = (request, response, next) => {
    request.data = JSON.stringify(request.body)
    next()
}

// Using middleware function 'processData', which stringifies the request.body
app.use(processData)

// Using a custom format function which replicates the output of
// the 'tiny' format, and adds request data with HTTP POST resquests
app.use(morgan((tokens, request, response) => {
    let customFormat = [
        tokens.method(request, response),
        tokens.url(request, response),
        tokens.status(request, response),
        tokens.res(request, response, 'content-length'), '-',
        tokens['response-time'](request, response), 'ms'
    ]

    // When the server receives a 'POST' request, the data of the request is added to the console log
    if (request.method === 'POST') {
        customFormat = customFormat.concat(tokens.data(request, response))
    }
    return customFormat.join(' ')
}))

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
const Price = require('./models/price')

// DOWNLOAD FILE
app.get("/get-url/:timeframe/:timeframeto/:symbol", (req, res) => {
  const { symbol, timeframe, timeframeto } = req.params

  const yearSeconds = 60 * 60 * 24 * 365
  const monthSeconds = 60 * 60 * 24 * 30
  const weekSeconds = 60 * 60 * 24 * 7
  const daySeconds = 60 * 60 * 24
  const hourSeconds = 60 * 60
  const minuteSeconds = 60

  const fieldsOHLC = {
    open: { $first: "$price"},
    low: { $min: "$price"},
    high: {$max: "$price"},
    close: { $last: "$price"},
  }

  const yearGroup = {
    'year': { $year: '$timestamp' }
  }

  const monthGroup = {
    ...yearGroup,
    'month': { $month: '$timestamp' }
  }

  const weekGroup = {
    'isoWeekYear': { $isoWeekYear: '$timestamp' } ,
    'isoWeek': { $isoWeek: '$timestamp' },
  }

  const dayGroup = {
    ...monthGroup,
    'day': { $dayOfMonth: '$timestamp' }
  }

  const minutesHoursGroup = {
    ...monthGroup,
    'day': {
        $subtract: [
            { $dayOfMonth: '$timestamp'},
            { $mod: [
                { $dayOfMonth: '$timestamp'},
                timeframeto / daySeconds
            ]}]
    },
    'hour': {
        $subtract: [
            { $hour: '$timestamp'},
            { $mod: [
                { $hour: '$timestamp'},
                timeframeto / hourSeconds
            ]}]
    },
    'minute': {
        $subtract: [
            { $minute: '$timestamp'},
            { $mod: [
                { $minute: '$timestamp'},
                timeframeto / minuteSeconds
            ]}]
    }   
  }

  if ( timeframeto % yearSeconds === 0 ) {
    timestampGroup = yearGroup
  } else if ( timeframeto % monthSeconds === 0 ) {
    timestampGroup = monthGroup
  } else if ( timeframeto % weekSeconds === 0 ) {
    timestampGroup = weekGroup
  } else if ( timeframeto % daySeconds === 0 ) {
    timestampGroup = dayGroup
  } else {
    timestampGroup = minutesHoursGroup
  }

  const groupParams = {
    '$group': {
        _id: {
            '$dateFromParts': {
                ...timestampGroup
            }
        },
        open: { $first: "$price"},
        low: { $min: "$price"},
        high: {$max: "$price"},
        close: { $last: "$price"},
    }
  }

  Price.aggregate([
    {
        $match: {
            // timestamp: { $gt: new Date("2022-12-01") },
            "metadata.symbol" : symbol,
            "metadata.seconds": parseInt(timeframe)
        }
    },
    {
        $project: {
            timestamp: 1,
            price: 1,
        }
    },
    {
        ...groupParams,
    },
    {
        $sort: {
            _id: 1
        }
    }
]).then(arrayOHLC => {
    console.log(arrayOHLC.length, 'candles')

    Pair.findById(symbol, {priceData: 0})
        .then(pair => {
            if (
                pair !== undefined &&
                pair !== null &&
                arrayOHLC.length > 0
            ) {
                const {
                    symbol,
                    baseToken,
                    quoteToken,
                    poolAddress,
                    poolFee,
                    arrayTypes,
                    extraMinutesData,
                } = pair

                const pairObject = {
                    symbol,
                    baseToken,
                    quoteToken,
                    poolAddress,
                    poolFee,
                    arrayTypes,
                    extraMinutesData,
                    arrayOHLC,
                    observationTimeframe: {
                        name: "30 seconds",
                        seconds: 30,
                    },
                    startTimestamp: new Date(arrayOHLC[0]._id),
                    endTimestamp: new Date(arrayOHLC[arrayOHLC.length - 1]._id),
                    maxTimestamp: new Date(arrayOHLC[arrayOHLC.length - 1]._id),
                    maxObservations: arrayOHLC.length,
                }
                res.status(200).send(pairObject)
            } else {
                res.status(404).end()
            }
        })               
    })
});

// DOWNLOAD ALL FILENAMES AND CLASSIFY PAIRS ACCORDING TO QUOTE TOKEN
app.get("/get-symbols/", (req, res) => {
  const symbols = []

  Pair.find({}, {symbol: 1, _id: 0})
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