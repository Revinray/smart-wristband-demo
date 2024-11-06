// frontend/src/components/SmartphoneApp.js

import React, { useState, useEffect, useContext } from 'react';
import { SocketContext } from '../SocketContext';

const SmartphoneApp = () => {
  const { SmartphoneSocket, paired } = useContext(SocketContext);
  const [sounds, setSounds] = useState([]);
  const [emergencies, setEmergencies] = useState([]);
  const [recording, setRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState(null);

  useEffect(() => {
    if (paired) {
      console.log('SmartphoneApp: Paired with device.');
      // Additional setup if needed
    }

    const handleAlert = (alert) => {
      if (alert.isEmergency) {
        alert(`Emergency Alert: ${alert.soundName} detected!`);
      } else {
        console.log(`Sound detected: ${alert.soundName}`);
      }
    };

    SmartphoneSocket.on('alert', handleAlert);

    return () => {
      SmartphoneSocket.off('alert', handleAlert);
    };
  }, [SmartphoneSocket, paired]);

  const handleAddSound = () => {
    setSounds([...sounds, { name: '', isEmergency: false }]);
  };

  const handleSoundChange = (index, field, value) => {
    const updatedSounds = [...sounds];
    updatedSounds[index][field] = value;
    setSounds(updatedSounds);
  };

  const handleSaveSounds = () => {
    SmartphoneSocket.emit('update_sounds', { userId: 'user-456', sounds });
    alert('Sounds saved successfully.');
  };

  const handleAddEmergency = () => {
    setEmergencies([...emergencies, { name: '', isEmergency: true }]);
  };

  const handleEmergencyChange = (index, field, value) => {
    const updatedEmergencies = [...emergencies];
    updatedEmergencies[index][field] = value;
    setEmergencies(updatedEmergencies);
  };

  const handleSaveEmergencies = () => {
    SmartphoneSocket.emit('update_emergencies', { userId: 'user-456', emergencyAlerts: emergencies });
    alert('Emergency alerts saved successfully.');
  };

  // Recording functionality (simplified for demo)
  const startRecording = () => {
    setRecording(true);
    // Implement recording logic here
  };

  const stopRecording = () => {
    setRecording(false);
    // Implement stop recording logic and save audio
    setRecordedAudio('dummy-audio-url'); // Replace with actual audio URL
  };

  return (
    <div className="d-flex flex-column">
      {paired ? (
        <div>
          <h5>Sound Profiles</h5>
          {sounds.map((sound, index) => (
            <div key={index} className="mb-2">
              <input
                type="text"
                className="form-control mb-1"
                placeholder="Sound Name"
                value={sound.name}
                onChange={(e) => handleSoundChange(index, 'name', e.target.value)}
              />
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={sound.isEmergency}
                  onChange={(e) => handleSoundChange(index, 'isEmergency', e.target.checked)}
                />
                <label className="form-check-label">
                  Emergency Alert
                </label>
              </div>
            </div>
          ))}
          <button className="btn btn-light" onClick={handleAddSound}>Add Sound</button>
          <button className="btn btn-primary mt-2" onClick={handleSaveSounds}>Save Sounds</button>

          <h5 className="mt-4">Emergency Alerts</h5>
          {emergencies.map((emergency, index) => (
            <div key={index} className="mb-2">
              <input
                type="text"
                className="form-control mb-1"
                placeholder="Emergency Alert Name"
                value={emergency.name}
                onChange={(e) => handleEmergencyChange(index, 'name', e.target.value)}
              />
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={emergency.isEmergency}
                  onChange={(e) => handleEmergencyChange(index, 'isEmergency', e.target.checked)}
                />
                <label className="form-check-label">
                  Is Emergency
                </label>
              </div>
            </div>
          ))}
          <button className="btn btn-light" onClick={handleAddEmergency}>Add Emergency Alert</button>
          <button className="btn btn-primary mt-2" onClick={handleSaveEmergencies}>Save Emergency Alerts</button>

          <h5 className="mt-4">Recording</h5>
          {recording ? (
            <button className="btn btn-danger" onClick={stopRecording}>Stop Recording</button>
          ) : (
            <button className="btn btn-success" onClick={startRecording}>Start Recording</button>
          )}
          {recordedAudio && <audio controls src={recordedAudio} className="mt-2"></audio>}
        </div>
      ) : (
        <p>Not paired with any device.</p>
      )}
    </div>
  );
};

export default SmartphoneApp;