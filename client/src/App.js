import React  from 'react';
import Navbar from './components/Navbar';
import PriceChart from './components/PriceChart';
import PairsSidebar from './components/PairsSidebar';
import IndicatorCreator from './components/IndicatorCreator';

function App() {
  return (
    <div className="App">
      <Navbar />
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-2">
            <IndicatorCreator />
          </div>
          <div className="col-sm-8">
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