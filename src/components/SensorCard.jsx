import React from "react";
import "../styles/SensorDataDisplay.css";
import { parseBatteryPercentage } from "../utils/batteryUtils";
import { parseSensorData } from "../utils/dataUtils";
import { formatGatewayInfo } from "../utils/gatewayUtils";
import ErrorBoundary from "./ErrorBoundary";

// src/components/SensorCard.jsx
const SensorCard = ({ sensor }) => {
    const gateways = formatGatewayInfo(sensor.gws);

    return (
        <div className="sensor-card">
            {/* Device Info */}
            <div className="device-info">
                <h3>Device Info</h3>
                <p><strong>EUI:</strong> {sensor.EUI}</p>
                <p><strong>Battery:</strong> {parseBatteryPercentage(sensor.bat)}</p>
                <p><strong>Last Update:</strong> {new Date(sensor.received_at).toLocaleString()}</p>
            </div>

            {/* Gateway Info */}
            <div className="gateway-section">
                <h4>Gateways ({gateways.length})</h4>
                {gateways.map((gw, index) => (
                    <div key={index} className="gateway">
                        <p><strong>Position:</strong> {gw.lat}, {gw.lng}</p>
                        <p><strong>RSSI:</strong> {gw.rssi} dBm</p>
                        <p><strong>SNR:</strong> {gw.snr}</p>
                    </div>
                ))}
            </div>

            {/* Data Section */}
            <div className="data-section">
                <h4>Data</h4>
                <pre>{parseSensorData(sensor.data)}</pre>
            </div>
        </div>
    );
};

export default SensorCard;