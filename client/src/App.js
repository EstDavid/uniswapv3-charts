import React  from 'react';
import Navbar from './components/Navbar';
import PriceChart from './components/PriceChart';
import PairsSidebar from './components/PairsSidebar';
import IndicatorSidebar from './components/IndicatorSidebar';
import TokenBalances from './components/TokenBalances';

function App() {
  return (
    <div className="App">
      <Navbar />
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-3">
            <TokenBalances />
            <IndicatorSidebar />
          </div>
          <div className="col-sm-7">
            <PriceChart />
          </div>
          <div className="col-sm-2">
            <PairsSidebar />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;