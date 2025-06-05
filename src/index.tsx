import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './swiss-design-system.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Add error event listener
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
});

// Add unhandled promise rejection listener
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});

// Log initial render
console.log('Starting application render...');

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// Remove StrictMode in development to prevent double rendering
root.render(
  <App />
);

// Log successful render
console.log('Application rendered successfully');

// Only measure performance in production
if (process.env.NODE_ENV === 'production') {
  reportWebVitals(console.log);
}
