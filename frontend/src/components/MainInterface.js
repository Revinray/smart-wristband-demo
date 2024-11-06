// frontend/src/components/MainInterface.js

import React from 'react';
import { useLocation } from 'react-router-dom';
import Pairing from './Pairing';
import UserProfileSetup from './UserProfileSetup';
import Wristband from './Wristband';
import SmartphoneApp from './SmartphoneApp';

const MainInterface = ({ component }) => {
  const location = useLocation();
  const route = location.pathname;

  // Determine content for Wristband
  const renderWristbandContent = () => {
    switch (route) {
      case '/':
        return component; // Welcome component passed as prop
      case '/language-selection':
        return component; // LanguageSelection component passed as prop
      case '/pairing':
        return null; // Pairing content managed separately
      case '/user-profile-setup':
        return <WristbandPrompt />;
      case '/main-app':
        return <Wristband />;
      default:
        return null;
    }
  };

  // Determine content for Smartphone
  const renderSmartphoneContent = () => {
    switch (route) {
      case '/pairing':
        return <Pairing />;
      case '/user-profile-setup':
        return <SmartphoneSetup />;
      case '/main-app':
        return <SmartphoneApp />;
      default:
        // For Welcome and LanguageSelection, display "Companion App" label
        return <CompanionAppLabel />;
    }
  };

  return (
    <div className="d-flex flex-row vh-100 position-relative">
      {/* Partition Line */}
      <div className="partition"></div>

      {/* Labels */}
      <div className="label label-left">Wristband</div>
      <div className="label label-right">Smartphone App</div>

      {/* Wristband Half */}
      <div className="d-flex align-items-center justify-content-center w-50">
        <div className="squircle-container">
          {renderWristbandContent()}
        </div>
      </div>

      {/* Smartphone Half */}
      <div className="d-flex align-items-center justify-content-center w-50">
        <div className="rectangular-container">
          <div className="smartphone-content">
            {renderSmartphoneContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

// Placeholder Components
const WristbandPrompt = () => (
  <div className="d-flex flex-column align-items-center justify-content-center">
    <p>Complete the setup on the app.</p>
  </div>
);

const SmartphoneSetup = () => (
  <UserProfileSetup />
);

const CompanionAppLabel = () => (
  <div className="d-flex flex-column align-items-center justify-content-center h-100">
    <h3>Companion App</h3>
  </div>
);

export default MainInterface;