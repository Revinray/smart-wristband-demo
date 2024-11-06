// frontend/src/components/Welcome.js

import React from 'react';
import { useNavigate } from 'react-router-dom';

const Welcome = () => {
  const navigate = useNavigate();

  const startSetup = () => {
    navigate('/language-selection');
  };

  return (
    <div className="d-flex flex-column align-items-center justify-content-center">
      <h1>Welcome to Your Smart Wristband</h1>
      <p>Enhancing your awareness and safety.</p>
      <button className="btn btn-light" onClick={startSetup}>Get Started</button>
    </div>
  );
};

export default Welcome;