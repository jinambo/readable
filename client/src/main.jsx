// React dependencies
import React from 'react';
import ReactDOM from 'react-dom/client';

// Components
import App from './App';

// Import global styles
import 'styles/main.scss';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
