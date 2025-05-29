import React from 'react';
import { Provider } from 'react-redux';
import store from './redux/store';
import KoreHouse from './components/home/KoreHouse';

function App() {
  return (
    <Provider store={store}>
      <div className="min-h-screen">
        <KoreHouse />
      </div>
    </Provider>
  );
}

export default App;