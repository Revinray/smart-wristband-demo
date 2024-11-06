// frontend/src/components/UserProfileSetup.js

import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { SocketContext } from '../SocketContext';

const UserProfileSetup = () => {
  const navigate = useNavigate();
  const { WristbandSocket } = useContext(SocketContext);
  const userId = 'user-456'; // Simulated user ID
  const [sounds] = useState([
    { name: 'Doorbell', isEmergency: false },
    { name: 'Phone Ring', isEmergency: false },
    { name: 'Alarm', isEmergency: true },
    { name: 'Baby Crying', isEmergency: true },
    { name: 'Oven Timer', isEmergency: false },
  ]);
  const [customSounds, setCustomSounds] = useState([]);

  const handleAddCustomSound = () => {
    setCustomSounds([...customSounds, { name: '', isEmergency: false }]);
  };

  const handleCustomSoundChange = (index, field, value) => {
    const updatedSounds = [...customSounds];
    updatedSounds[index][field] = value;
    setCustomSounds(updatedSounds);
  };

  const saveProfiles = () => {
    WristbandSocket.emit('update_sounds', { userId, sounds });
    WristbandSocket.emit('update_emergencies', {
      userId,
      emergencyAlerts: customSounds.filter((sound) => sound.isEmergency),
    });
    alert('Profiles saved successfully.');
    navigate('/main-app');
  };

  return (
    <div className="user-profile-setup">
      <h4>User Profile Setup</h4>
      <div className="my-3">
        <h5>Pre-defined Important Sounds</h5>
        {sounds.map((sound, index) => (
          <div key={index} className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              checked={sound.isEmergency}
              readOnly
            />
            <label className="form-check-label">
              {sound.name}{' '}
              {sound.isEmergency && (
                <span className="badge bg-danger">Emergency</span>
              )}
            </label>
          </div>
        ))}
      </div>

      <div className="my-3">
        <h5>Custom Sounds</h5>
        {customSounds.map((sound, index) => (
          <div key={index} className="mb-2">
            <input
              type="text"
              className="form-control mb-1"
              placeholder="Sound Name"
              value={sound.name}
              onChange={(e) =>
                handleCustomSoundChange(index, 'name', e.target.value)
              }
            />
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                checked={sound.isEmergency}
                onChange={(e) =>
                  handleCustomSoundChange(
                    index,
                    'isEmergency',
                    e.target.checked
                  )
                }
              />
              <label className="form-check-label">Emergency Alert</label>
            </div>
          </div>
        ))}
        <button className="btn btn-light" onClick={handleAddCustomSound}>
          Add Custom Sound
        </button>
      </div>

      <button className="btn btn-primary mt-3" onClick={saveProfiles}>
        Save Profiles
      </button>
    </div>
  );
};

export default UserProfileSetup;