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
          <div className="col-12 col-lg-3 mt-2">
            <IndicatorSidebar />
          </div>
          <div className="col-12 col-lg-7 mt-2">
            <PriceChart />
          </div>
          <div className="col-12 col-lg-2 mt-2">
            <PairsSidebar />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;