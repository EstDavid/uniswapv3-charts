# Uniswap V3 Charts
Uniswap V3 Charts is a web app that reads price data from a set of Uniswap V3 pools and displays it on candlestick charts.
The app allows adjusting the charts to different timeframes and also allows adding up to 5 moving average indicators These indicators can be a simple moving average (SMA) or exponential moving average (EMA)

The price data is produced by another app called <a href="https://github.com/EstDavid/UniswapV3OracleReader" target="_blank" rel="noreferrer noopener">Uniswap V3 Oracle Reader (UV3OR)</a>. The UV3OR reads historical price data from different token pair pools on Uniswap V3 and writes it to Google Cloud Storage.

Uniswap V3 Charts uses an express server to download all the price data from Google Cloud Storage.

## Express server
The express server allows to fetch price data from Google Cloud Storage and feed it into the charting application.

### Setup
The setup was done following <a href="https://javascript.plainenglish.io/upload-files-to-google-cloud-storage-from-react-cf839d7361a5" target="_blank" rel="noreferrer noopener">this article</a> that explains how to upload files to Google Cloud Storage from React using Node.js and Multer.

### Retrieving symbol list
Everytime the website is first loaded, it needs to retrieve all the existing symbols in the database.

The request is made from the `<PairsList>` component. 

```javascript
useEffect(() => {
    dispatch(fetchPairsLists());
}, [dispatch]);
```

The `fetchPairsLists` function is located in the `pairsLists` slice. 

In order to download the symbol list, `fetchPairsLists` makes a request Google Cloud Storage using the `bucket.getFiles(options)` function to get all the filenames in a specific `timeframe`. Since the filename comes in the form of `/[timeframe]/[symbol].json`, i.e. `/30 seconds/WETHUSDC.json`, the symbol is obtained by removing the folder prefix and the `.json` suffix. The the express server then returns an array with all the symbols in the given timeframe folder. 

```javascript
app.get("/get-symbols/:timeframe/", (req, res) => {
  const options = {
    prefix: `${req.params.timeframe}/`,
  };

  bucket.getFiles(options).then((response) => {
    const [files] = response;
    const fileNames = [];

    files.map((file) => {
      let startCharacter = options.prefix.length;
      let endCharacter = file.name.length - '.json'.length;
      let symbol = file.name.substring(startCharacter, endCharacter);
      fileNames.push(symbol);
    });

    res.status(200).send(fileNames);      
  })
});
```

### Retrieving price data
Symbol price data is retrieved everytime a symbol from the symbol list is selected. The request is made from the `<PriceChart>` component. 

```javascript
useEffect(() => {
    dispatch(fetchPriceData(userSymbol, viewTimeframe));
}, [dispatch]);
```

The `fetchPriceData` function is located in the `priceData` slice. 

In order to download the symbol list, `fetchPriceData` makes a request Google Cloud Storage using the `bucket.file.download` function to the content of a specific symbol file. The the express server then returns an array with the price data `.json` file for the specific symbol. 

```javascript
app.get("/get-url/:timeframe/:symbol", (req, res) => {
    const file = bucket.file(`${req.params.timeframe}/${req.params.symbol}.json`);

    file.download((error, data) => {
        res.status(200).send(data)
    });
});
```

## Charting App
### Reading price data
Price data is stored in a .json file. The .json file contains an object with the following structure, where the AAVEUSDT token pair is used as an example:

```javascript
{
    symbol: "AAVEUSDT",
    baseToken: 
    {
        chainId: 1,
        decimals: 18,
        symbol: "AAVE",
        name: "Aave",
        isNative: false,
        isToken: true,
        address: "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9",
        logoURI: "https://assets.coingecko.com/coins/images/12645/thumb/AAVE.png?1601374110"
    },
    quoteToken: 
    {
        chainId: 1,
        decimals: 6,
        symbol: "USDT",
        name: "Tether",
        isNative: false,
        isToken: true,
        address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
        logoURI: "https://assets.coingecko.com/coins/images/325/thumb/Tether-logo.png?1598003707"
    },
    poolAddress: "0x4D1Ad4A9e61Bc0E5529d64F38199cCFca56f5a42",
    poolFee: 3000,
    observationTimeframe: 
    {
        name: "30 seconds",
        seconds: 30
    },
    arrayTypes: ["open","high","low","close"],
    extraMinutesData: 180,
    observations: {
        "1661765250": 88.118166402644,
        "1661765280": 88.118166402644,
        ...,
        "1663663710": 205.31315964938253,
        "1663663740": 205.31315964938253
    },
    startTimestamp: "1661769990",
    endTimestamp: "1663663740",
    maxObservations: 396
}
```
Price data is an object where the keys are timestamps, and the values are price observations a the given timestamp. To avoid mistakes, price is always referred to as the ratio between the base token and the quote token, or how much of the quote token is needed to buy one unit of the base token.
The main object contains not only price data, but also data about both tokens of the pair, pool data and the timeframe of the base obvservations. In this case observations have been made every 30 seconds.

All of this data is downloaded from the express server and stored in the state of the `priceData` slice by the use of the following reducer function which uses the object from the .json file as payload:

```javascript
initPriceObject: (state, {payload}) => {
    state.priceObject.symbol = payload.symbol;
    state.priceObject.baseToken = payload.baseToken;
    state.priceObject.quoteToken = payload.quoteToken;
    state.priceObject.poolAddress = payload.poolAddress;
    state.priceObject.poolFee = payload.poolFee;
    state.priceObject.observationTimeframe = payload.observationTimeframe;
    state.priceObject.arrayTypes = payload.arrayTypes;
    state.priceObject.startTimestamp = payload.startTimestamp;
    state.priceObject.endTimestamp = payload.endTimestamp;
    state.priceObject.observations = payload.observations;
    state.priceObject.maxTimestamp = Math.max(...Object.keys(payload.observations));
    state.loadingPriceObject = false;
}
```

### Chart generation
Candlestick charts are generated with the use of the <a href="https://apexcharts.com/docs/react-charts/" target="_blank" rel="noreferrer noopener">react-apexcharts library</a>.
In the ```PriceChart.js``` component, the ```Chart``` component is imported from the react-apexcharts library.

```javascript
import Chart from "react-apexcharts";
```

In order to pass custom chart options and price data to the ```Chart``` component, an object called ```priceCharts``` is used:

```javascript
const priceChart = {
    symbol: priceObject.symbol,
    options: defaultChartOptions(chartObject.xMin, chartObject.xMax, indicatorColors),
    series: priceSeries
}
```

The ```Chart``` component is included inside the ```PriceChart``` component. The options and chart data are passed in the ```options={priceChart.options}``` and ```series={priceChart.series}``` lines respectively:

```javascript
return (
    <div>
        <ChartTitle />
        <TimeframeSelector />
        <div className="card my-2">
            <div onWheel={handleScroll}>
            <Chart style={showCTRLMouseWheel ? { opacity: "0.2" } : {}}
                options={priceChart.options}
                series={priceChart.series}
            />
            {showCTRLMouseWheel ?
                <div className="ctrl-mousewheel-text card-img-overlay">
                <div>Press CTRL key + mouse wheel to scroll the chart left and right</div>
                </div>
                : ''}
            </div>
        </div>
    </div>
);
```

### Formatting price data
In order to create a candlestick chart using the react-apexcharts `Chart` component, the data needs to have the following format:

```javascript
export const candlestickData = [
    {
      x: new Date(1538778600000),
      y: [1360.60, 1401.07, 1312.25, 1330.01]
    },
    {
      x: new Date(1538780400000),
      y: [1330.01, 1350.59, 1297.34, 1350.59]
    },
    ...
]
```

The value of `x` represents the timestamp of the candle and the array `y` contains the values for the `[open, high, low, close]` (OHLC) prices.

![Candlestick diagram](/images/candlestickDiagram.png)

For all price related calculations, a file named `priceDataCalculator.js` is used. The file is located in the `helpers` folder.

The price observations are located the `observations` key of the `priceObject` variable. The value of this key is an object whose keys are timestamps and the values are the price observed.

In order to transform this data into a format readable for the candlestick chart, the `calculateArrayTimeframe` function in the `priceDataCalculator.js` file is called. This function takes as input the `priceObject` variable, as well as a `timeframe` object which tells the function which is the timeframe of the candles (30 seconds, ..., 5 minutes, ..., 1 hour, ...).

The `calculateArrayTimeframe` returns an object with the following format:
```javascript
priceArray[startTimeframe] = {
    timestamp: startTimeframe,
    open,
    high,
    low,
    close
}
```

### Moving average indicators
So far the Uniswap V3 Charts web app allows the creation of only two types of indicators:
+ Simple Moving Average <a href="https://www.investopedia.com/terms/s/sma.asp" target="_blank" rel="noreferrer noopener">(SMA)</a>
+ Exponential Moving Average <a href="https://www.investopedia.com/terms/e/ema.asp" target="_blank" rel="noreferrer noopener">(EMA)</a>

These indicators are obtained using the `calculateSMAFromOHLC` and `calculateEMAFromOHLC` functions respectively, which are located in the `priceDataCalculator.js` file.

(arrayOHLC, nPeriods, arrayType)

Both functions take the following inputs:
+ `arrayOHLC` &rarr; Array with the open, high, low and close prices of the candles
+ `nPeriods` &rarr; Number with the length (number of previous candles) of the time period to calculate the average
+ `arrayType` &rarr; String which tells the function which of the four price arrays in the OHLC array use to calculate the moving average. The default is the `close` array.