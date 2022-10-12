# Uniswap V3 Charts
Uniswap V3 Charts is a web app that reads price data from a set of Uniswap V3 pools and displays it on candlestick charts.
The app allows adjusting the charts to different timeframes and also allows adding up to 5 moving average indicators These indicators can be a simple moving average (SMA) or exponential moving average (EMA)

The price data is produced by another app called <a href="https://github.com/EstDavid/UniswapV3OracleReader" target="_blank" rel="noreferrer noopener">Uniswap V3 Oracle Reader (UV3OR)</a>. The UV3OR reads historical price data from different token pair pools on Uniswap V3 and writes it to Google Cloud Storage.

Uniswap V3 Charts uses an express server to download all the price data from Google Cloud Storage.

## Express server
### Setup
### Retrieving symbol list
### Retrieving price data

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


### Connecting Metamask



# Main features of the app
- [ ] Reading data from storage
- [ ] Processing data for display
    - [ ] Switch timeframes
    - [ ] Add main averages and indicators
- [ ] Display data
    - [ ] Show several graphs? (2, 4..)
    - [ ] Allow easy selection of pairs
    - [ ] Display pool data (pair, liquidity, fee, address (link to Etherscan), link to Uniswap)
    - [ ] Display carrousel with latest prices from most popular crypto pairs
    - [ ] Pool list with most liquid pools and link to their graph


# Initial TODO list
- [X] Check best chart provider &rarr; Apexcharts. Other providers: canvasjs and lightweight charts from TradingView &rarr; It seems not possible
- [X] Check if json object can include methods
- [X] Create data downloader
- [X] Create object data methods
- [X] Upload initial seed app to heroku and run
    - [X] Create an express app, and inside it create the react app, in the client/ folder. See an example [here](https://daveceddia.com/deploy-react-express-app-heroku/)
    - [X] In the client/package.json file add 
    ```
            "proxy": "http://localhost:5000",
            "homepage": "https://uniswapv3-charts.herokuapp.com/",
    ```
    - [X] Text for the Procfile ```web: node index.js```
    - [X] In the main package.json file add 
    ```
            "heroku-postbuild": "cd client && npm install && npm run build"
    ```
    - [X] IMPORTANT. From this [page](https://create-react-app.dev/docs/deployment/ "Deployment on React app docs") Add the following lines/functions to the index.js server file:
    ```
            var path = require('path');

            app.use(express.static(path.join(__dirname, 'client/build')));

            app.get('*', function (req, res) {
            res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
            });
    ```
- [ ] Clean code in PriceChart.js
    - [X] Make data be propagated
    - [X] Allow addition/deletion of averages
    - [X] Study and use chart options
        - [X] Control size of candles
        - [X] Take out 'Candlestick chart' text
        - [X] Is it easy to add color chooser?
    - [X] Make this component a function of symbol, timeframe...
    - [X] Improve candle display calculation
- [X] Create app structure (redux, components, etc)
- [ ] Clean up boilerplate code on index.html
- [X] Prepare power point with logo, layout, etc...
- [ ] Figure out how to update data as it is created
- [X] Create function to download all symbols
    - [X] It happens once the page is loaded
    - [X] Below the pairs sections the 'Loading...' spinner is shown
- [X] Sidebar for pair selection
    - [X] Add different pair groups
    - [X] Add search field functionality
- [X] Add timeframe selection button group
    - [X] Create 'abbreviation' field on timeframes object
- [ ] Indicators sidebar
    - [X] Add create indicator dialog with options
    - [X] Add indicator place holder with configure and cancel button
    - [ ] Add ATR indicator
    - [X] Add _Visibility_ button
    - [X] Add color selector
    - [X] Store moving average data, so it is only processed and updated when needed
    - [X] Add array ```['open', 'high', 'low', 'close']``` selector
    - [X] Styling
        - [X]Align _Submit_ and _Cancel_ buttons on the same line
- [ ] Navbar
    - [ ] Add logo
    - [X] Add github button
    - [X] Wire up search field
    - [X] Add balances
    - [X] Switch location of the github and the connect to metamask buttons
    - [X] Make responsive
- [ ] URGENT
    - [X] Add spinners
    - [ ] Add blockchain selection
    - [X] Add website name

## Features to add
- [ ] View liquidity history (this would have to be implemented in the reader as well)
- [ ] Have 1 hour observations data (this would have to be implemented in the reader)
- [ ] Download all the historical data (to be implemented in the reader)
- [X] Add the possibility of viewing your balance of each coin
- [ ] How to update prices real time?
- [ ] How to update symbol list?
- [X] Add token logos
- [ ] Use localStorage to save user settings
- [ ] Responsivity
