import React, { useEffect, useState } from 'react';
import {
  Routes,
  Route,
  useLocation
} from 'react-router-dom';
import './css/style.css';

// Import pages
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <>
      <Routes>
        <Route exact path="/" element={<Dashboard />} />
      </Routes>
    </>
  );
}

export default App;
