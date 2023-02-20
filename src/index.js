import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import QuoteBox from './QuoteBox';

const quoteBox = ReactDOM.createRoot(document.getElementById('quote-box'));
quoteBox.render(
  // <React.StrictMode>
    <QuoteBox />
  // </React.StrictMode>
);