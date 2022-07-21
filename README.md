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
    - [ ] Styling
        - [X]Align _Submit_ and _Cancel_ buttons on the same line
- [ ] Navbar
    - [ ] Add logo
    - [X] Add github button
    - [X] Wire up search field
    - [ ] Add balances
    - [ ] Switch location of the github and the connect to metamask buttons
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
- [ ] Add token logos
- [ ] Use localStorage to save user settings
- [ ] Responsivity
