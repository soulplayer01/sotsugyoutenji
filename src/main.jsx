import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './life/GrowthApp.jsx';
import './life/life.css';

createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);


