import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';




ReactDOM.createRoot(document.getElementById('root')).render(

  <React.StrictMode>
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <Notifications position="top-right"/>
      <App />
    </MantineProvider>
  </React.StrictMode>
);
