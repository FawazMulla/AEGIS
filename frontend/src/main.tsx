import React from 'react';
import ReactDOM from 'react-dom/client';
import '@/app/globals.css';
import { RootLayout } from '@/app/layout';
import { Page } from '@/app/page';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RootLayout>
      <Page />
    </RootLayout>
  </React.StrictMode>
);
