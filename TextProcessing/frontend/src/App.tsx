import React from 'react';
import logo from './logo.svg';
import { Button } from '@material-ui/core';
import { createTheme, ThemeProvider, styled } from "@mui/material/styles";
import './App.css';
import Converter from './components/Converter';
const theme = createTheme({palette: { mode: 'light'}});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
      <header className="App-header">
        <Converter />
      </header>
    </div>
    </ThemeProvider>
  );
}

export default App;
