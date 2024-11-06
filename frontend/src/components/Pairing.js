// frontend/src/components/Pairing.js

import React, { useEffect, useContext, useState } from 'react';
import { SocketContext } from '../SocketContext';
import { useNavigate } from 'react-router-dom';

const Pairing = () => {
  const { WristbandSocket, setPaired } = useContext(SocketContext);
  const navigate = useNavigate();
  const deviceId = 'wristband-123'; // Simulated device ID
  const userId = 'user-456'; // Simulated user ID
  const [pairingStatus, setPairingStatus] = useState('Pairing in progress...');

  useEffect(() => {
    // Initiate pairing when component mounts
    WristbandSocket.emit('pair_device', { deviceId, userId });

    const handlePairSuccess = (data) => {
      console.log(data.message);
      setPaired(true); // Update global paired state
      setPairingStatus('Paired successfully!');
      // Introduce a delay before navigating
      setTimeout(() => {
        navigate('/user-profile-setup');
      }, 2000); // 2-second delay
    };

    const handleError = (data) => {
      console.error(data.message);
      setPairingStatus('Pairing failed. Please try again.');
    };

    WristbandSocket.on('pair_success', handlePairSuccess);
    WristbandSocket.on('error', handleError);

    return () => {
      WristbandSocket.off('pair_success', handlePairSuccess);
      WristbandSocket.off('error', handleError);
    };
  }, [WristbandSocket, navigate, deviceId, userId, setPaired]);

  return (
    <div className="d-flex flex-column align-items-center justify-content-center h-100">
      <h5>Pairing Status</h5>
      <p>{pairingStatus}</p>
    </div>
  );
};

export default Pairing;