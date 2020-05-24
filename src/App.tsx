import React from 'react';
import Header from './ui/components/Header/Header';
import SortMerge from './ui/containers/SortMerge/SortMerge';

import './App.scss';

const App = () => {
  return (
    <div className="App">
      <div className={'container'}>
        <Header />
        <SortMerge />
      </div>
    </div>
  );
};

export default App;
