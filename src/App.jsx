import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './auth/context/AuthContext';
import { BancoProvider } from './context/BancoContext';
import { LojaProvider } from './context/LojaContext';

import BrowserWindow from './components/BrowserWindow';

import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <BancoProvider>
          <LojaProvider>
            <BrowserWindow />
          </LojaProvider>
        </BancoProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
