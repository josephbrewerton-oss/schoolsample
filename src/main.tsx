import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './css/custom.css';
import { registerServiceWorker } from './registerServiceWorker';
import { isDataSaverActive, applyDataSaverToDOM } from './services/dataSaverStore';

// Initialize PWA Offline Engine & Low-Bandwidth Data Saver
registerServiceWorker();
applyDataSaverToDOM(isDataSaverActive());

const rootElement = document.getElementById('root');

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
