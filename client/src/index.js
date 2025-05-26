import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider } from '@mui/material/styles';
import theme from './styles/theme';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <NotificationProvider>
        <ThemeProvider theme={theme}>
            <App />
        </ThemeProvider>
    </NotificationProvider>
);
