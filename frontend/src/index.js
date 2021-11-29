import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import "bootstrap/dist/css/bootstrap.min.css";

const theme = createTheme({
    palette: {
        primary: {
            main: "#1DB954",
            dark: "#15883E"
        }
    }
});

ReactDOM.render(
    <React.Fragment>
        <ThemeProvider theme={theme}>
            <App/>
        </ThemeProvider>
    </React.Fragment>,
    document.getElementById('root')
);