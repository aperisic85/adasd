import React from "react";
import "../styles/SensorDataDisplay.css";
import { parseBatteryPercentage } from "../utils/batteryUtils";
import { parseSensorData } from "../utils/dataUtils";
import { formatGatewayInfo } from "../utils/gatewayUtils";
import ErrorBoundary from "./ErrorBoundary";

// src/components/SensorCard.jsx
const SensorCard = ({ sensor }) => {
    const gateways = formatGatewayInfo(sensor.gws);
    const parsedData = parseSensorData(sensor.data); // Parse the sensor data

    return (
        <div className="sensor-card">
            {/* Device Info */}
            <div className="device-info">
                <h3>Device Info</h3>
                <p><strong>Naziv:</strong> {sensor.EUI === '513F167B004A0024' ? 'Izabela South' : 'Izabela North'}</p>
                <p><strong>EUI:</strong> {sensor.EUI}</p>
                <p><strong>Baterija:</strong> {parseBatteryPercentage(sensor.bat)}</p>
                <p><strong>Posljednji podaci:</strong> {new Date(sensor.received_at).toLocaleString()}</p>
            </div>

            {/* Gateway Info */}
            <div className="gateway-section">
                <h4>Gateways ({gateways.length})</h4>
                {gateways.map((gw, index) => (
                    <div key={index} className="gateway">
                        <p><strong>Pozicija:</strong> {gw.lat}, {gw.lng}</p>
                        <p><strong>RSSI:</strong> {gw.rssi} dBm</p>
                        <p><strong>SNR:</strong> {gw.snr}</p>
                    </div>
                ))}
            </div>

            {/* Data Section */}
            <div className="data-section">
                <h4>Podaci</h4>
                <div>
                    <h5>Station A</h5>
                    <p><strong>Status:</strong> {parsedData.stationA.status.join(", ")}</p>
                    <p><strong>Alarm:</strong> {parsedData.stationA.alarm.join(", ")}</p>
                </div>
                <div>
                    <h5>Other Stations</h5>
                    {parsedData.stations.map((station, index) => (
                        <div key={index}>
                            <p><strong>Station {String.fromCharCode(66 + index)}:</strong> {station.join(", ")}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SensorCard;
