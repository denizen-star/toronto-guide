import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './swiss-design-system.css';
import BoulderRouter from './BoulderRouter';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <BoulderRouter />
  </React.StrictMode>
);

reportWebVitals(); 