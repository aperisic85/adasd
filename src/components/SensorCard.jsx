import React from "react";
import "../styles/SensorDataDisplay.css";

const SensorCard = ({ sensor }) => {
  return (
    <div className="sensor-card">
      <p><strong>EUI:</strong> {sensor.eui}</p>
      <p><strong>Battery:</strong> {sensor.bat ? `${sensor.bat}%` : "N/A"}</p>
      <p><strong>Received At:</strong> {new Date(sensor.received_at).toLocaleString()}</p>
      {/* Add more fields as needed */}
    </div>
  );
};

export default SensorCard;
