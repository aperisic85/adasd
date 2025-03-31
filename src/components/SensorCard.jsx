import React from "react";
import "../styles/SensorDataDisplay.css";
import { parseBatteryPercentage } from "../utils/batteryUtils";
import { parseSensorData } from "../utils/dataUtils";
import { formatGatewayInfo } from "../utils/gatewayUtils";

const DeviceInfo = ({ sensor }) => (
  <div className="device-info">
    <h3>Device Info</h3>
    <p><strong>Naziv:</strong> {sensor.EUI === '513F167B004A0024' ? 'Izabela South' : 'Izabela North'}</p>
    <p><strong>EUI:</strong> {sensor.EUI}</p>
    <p><strong>Baterija:</strong> {parseBatteryPercentage(sensor.bat)}</p>
    <p><strong>Posljednji podaci:</strong> {new Date(sensor.received_at).toLocaleString()}</p>
  </div>
);

const DataSection = ({ parsedData }) => (
  <div className="data-section">
    <h4>Podaci</h4>
    {/* Station A */}
    <div className="station-card">
      <h5>Pozicija A</h5>
      <div className="station-info">
        <p><strong>Status:</strong> {parsedData.stationA.status.join(", ")}</p>
        <p><strong>Alarm:</strong> {parsedData.stationA.alarm.join(", ")}</p>
      </div>
    </div>

    {/* Other Stations */}
    <div className="stations">
      {parsedData.stations.map((station, index) => (
        <div key={index} className="station-card">
          <h5>Pozicija {String.fromCharCode(66 + index)}</h5> {/* Converts index to letters (B, C, D, ...) */}
          <div className="station-info">
            <p><strong>Status:</strong> {station.slice(0, 2).join(", ")}</p>
            <p><strong>Alarm:</strong> {station.slice(2, 4).join(", ")}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const SensorCard = ({ sensor }) => {
  const gateways = formatGatewayInfo(sensor.gws);
  const parsedData = parseSensorData(sensor.data);

  return (
    <div className="sensor-card">
      {/* Device Info */}
      <DeviceInfo sensor={sensor} />

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
      <DataSection parsedData={parsedData} />
    </div>
  );
};

export default SensorCard;
