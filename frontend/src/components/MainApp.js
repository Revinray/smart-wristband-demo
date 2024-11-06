// frontend/src/components/MainApp.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Welcome from './Welcome';
import LanguageSelection from './LanguageSelection';
import Pairing from './Pairing';
import UserProfileSetup from './UserProfileSetup';
import MainInterface from './MainInterface';

const MainApp = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainInterface component={<Welcome />} />} />
        <Route path="/language-selection" element={<MainInterface component={<LanguageSelection />} />} />
        <Route path="/pairing" element={<MainInterface component={<Pairing />} />} />
        <Route path="/user-profile-setup" element={<MainInterface component={<UserProfileSetup />} />} />
        <Route path="/main-app" element={<MainInterface />} />
      </Routes>
    </Router>
  );
};

export default MainApp;