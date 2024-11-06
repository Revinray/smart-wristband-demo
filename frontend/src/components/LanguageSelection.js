// frontend/src/components/LanguageSelection.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LanguageSelection = () => {
  const [language, setLanguage] = useState('English');
  const navigate = useNavigate();

  const proceedToPairing = () => {
    navigate('/pairing');
  };

  return (
    <div className="d-flex flex-column align-items-center justify-content-center vh-100 bg-light">
      <h2>Select Language</h2>
      <select
        className="form-select w-50 my-3"
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
      >
        <option value="English">English</option>
        <option value="Spanish">Spanish</option>
        <option value="Mandarin">Mandarin</option>
        {/* Add more languages as needed */}
      </select>
      <button className="btn btn-primary" onClick={proceedToPairing}>Next</button>
    </div>
  );
};

export default LanguageSelection;