import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { CharmsErrorBoundary } from './components/CharmsErrorBoundary';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CharmsErrorBoundary fallbackMode="retry">
      <App />
    </CharmsErrorBoundary>
  </React.StrictMode>
);
