import React from "react";
import "../styles/SensorDataDisplay.css";
import { parseBatteryPercentage } from "../utils/batteryUtils";
import { parseSensorData } from "../utils/dataUtils";
import { formatGatewayInfo } from "../utils/gatewayUtils";
import ErrorBoundary from "./ErrorBoundary";

const SensorCard = ({ sensor }) => {
  const gateways = formatGatewayInfo(sensor.gws?.data); // Adjust based on your JSON structure

  return (
    <div className="sensor-card">
      {/* Device Info */}
      <div className="device-info">
        <h3>Device: {sensor.eui}</h3>
        <p><strong>Battery:</strong> {parseBatteryPercentage(sensor.bat)}</p>
        <p><strong>Last Update:</strong> {new Date(sensor.received_at).toLocaleString()}</p>
      </div>

      <ErrorBoundary>
      <div className="gateway-section">
        <h4>Gateways:</h4>
        {gateways.length > 0 ? (
          gateways.map((gw, index) => (
            <div key={index} className="gateway">
              <p><strong>EUI:</strong> {gw.eui}</p>
              <p><strong>RSSI:</strong> {gw.rssi} dBm</p>
              <p><strong>Position:</strong> {gw.lat}, {gw.lng}</p>
            </div>
          ))
        ) : (
          <p>No gateways found</p>
        )}
      </div>
      </ErrorBoundary>

      {/* Sensor Data */}
      <div className="data-section">
        <h4>Raw Data:</h4>
        <pre>{parseSensorData(sensor.data)}</pre>
      </div>
    </div>
  );
};

export default SensorCard;
