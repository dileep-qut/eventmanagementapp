import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { MantineProvider } from '@mantine/core';

import '@mantine/core/styles.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
     <AuthProvider>
    <MantineProvider withGlobalStyles withNormalizeCSS>
   
      <App />
    
    </MantineProvider>
    </AuthProvider>
  </React.StrictMode>
);

