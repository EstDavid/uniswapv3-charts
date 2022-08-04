import React  from 'react';
import Navbar from './components/Navbar';
import PriceChart from './components/PriceChart';
import PairsSidebar from './components/PairsSidebar';
import IndicatorSidebar from './components/IndicatorSidebar';

function App() {
  return (
    <div className="App">
      <Navbar />
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-3">
            <IndicatorSidebar />
          </div>
          <div className="col-lg-7">
            <PriceChart />
          </div>
          <div className="col-lg-2">
            <PairsSidebar />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;