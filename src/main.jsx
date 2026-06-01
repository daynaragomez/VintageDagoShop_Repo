import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import performanceMonitor from './shared/utils/performanceMonitor';

// Initialize performance monitoring
// eslint-disable-next-line no-console
console.log('📊 Performance monitoring initialized');

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
