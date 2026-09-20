import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import IronLog from './IronLog.jsx'

window.storage = {
  async get(key) {
    const value = localStorage.getItem(key);
    return value !== null ? { value } : null;
  },
  async set(key, value) {
    localStorage.setItem(key, value);
    return true;
  },
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <IronLog />
  </StrictMode>,
)
