import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.js';
import { ThemeProvider } from './context/ThemeContext.js';
import { ReportFormProvider } from './context/ReportFormContext.js';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <ReportFormProvider>
          <App />
        </ReportFormProvider>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
);
