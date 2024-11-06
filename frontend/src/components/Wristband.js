// frontend/src/components/Wristband.js

import React, { useState, useEffect, useContext } from 'react';
import { SocketContext } from '../SocketContext';

const Wristband = () => {
  const { WristbandSocket } = useContext(SocketContext);
  const [time, setTime] = useState(new Date());
  const [battery, setBattery] = useState(100);
  const [alerts, setAlerts] = useState([]);
  const [showAlertDetails, setShowAlertDetails] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
      fetchBatteryStatus();
    }, 60000); // Update every minute

    const handleAlert = (alert) => {
      setAlerts((prevAlerts) => [...prevAlerts, alert]);
      if (alert.isEmergency) {
        flashScreen();
      }
    };

    WristbandSocket.on('alert', handleAlert);

    return () => {
      clearInterval(timer);
      WristbandSocket.off('alert', handleAlert);
    };
  }, [WristbandSocket]);

  const fetchBatteryStatus = () => {
    // Simulate battery status fetching
    setBattery((prevBattery) => (prevBattery > 0 ? prevBattery - 1 : 0));
  };

  const flashScreen = () => {
    document.body.classList.add('flash');
    setTimeout(() => {
      document.body.classList.remove('flash');
    }, 500);
  };

  const handleDismiss = (index) => {
    setAlerts(alerts.filter((_, i) => i !== index));
  };

  const handleAlertClick = (alert) => {
    setShowAlertDetails(alert);
  };

  return (
    <div className="d-flex flex-column align-items-center">
      <p>Time: {time.toLocaleTimeString()}</p>
      <p>Battery: {battery}%</p>

      <h6>Alerts:</h6>
      {alerts.length === 0 && <p>No alerts.</p>}
      <ul className="list-group">
        {alerts.map((alert, index) => (
          <li key={index} className="list-group-item list-group-item-action">
            <strong
              onClick={() => handleAlertClick(alert)}
              style={{ cursor: 'pointer' }}
            >
              {alert.soundName}
            </strong>{' '}
            at {alert.timestamp} from {alert.direction}
            {alert.isEmergency && (
              <span className="badge bg-danger ms-2">Emergency</span>
            )}
            <button
              className="btn btn-sm btn-secondary float-end"
              onClick={() => handleDismiss(index)}
            >
              Dismiss
            </button>
          </li>
        ))}
      </ul>

      {showAlertDetails && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Alert Details</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowAlertDetails(null)}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  <strong>Sound:</strong> {showAlertDetails.soundName}
                </p>
                <p>
                  <strong>Time:</strong> {showAlertDetails.timestamp}
                </p>
                <p>
                  <strong>Direction:</strong> {showAlertDetails.direction}
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setShowAlertDetails(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wristband;