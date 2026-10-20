import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';
import PlaylistDetail from './pages/PlaylistDetailPage/PlaylistDetailPage';
import { CssBaseline, ThemeProvider } from "@mui/material"
import theme from "./theme";
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      <App />
    </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// dpoint. Learn more: hor send to an analytics enttps://bit.ly/CRA-vitals
reportWebVitals();
