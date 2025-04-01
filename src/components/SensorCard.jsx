import React from "react";
import "../styles/SensorDataDisplay.css";
import { parseBatteryPercentage } from "../utils/batteryUtils";
import { parseSensorData } from "../utils/dataUtils";
import { formatGatewayInfo } from "../utils/gatewayUtils";
import { decodeStatus, decodeAlarm } from "../utils/dataUtils";

const DeviceInfo = ({ sensor }) => (
  <div className="device-info">
    <h3>Device Info</h3>
    <p><strong>Naziv:</strong> {sensor.EUI === '513F167B004A0024' ? 'Izabela South' : 'Izabela North'}</p>
    <p><strong>EUI:</strong> {sensor.EUI}</p>
    <p><strong>Baterija:</strong> {parseBatteryPercentage(sensor.bat)}</p>
    <p><strong>Posljednji podaci:</strong> {new Date(sensor.received_at).toLocaleString()}</p>
  </div>
);
/* // Helper for battery status text
const getBatteryStatusText = (statusCode) => {
  switch(statusCode) {
    case 0: return "Normal";
    case 1: return "Flat";
    case 2: return "Low";
    default: return "Unknown";
  }
}; */
const DataSection = ({ parsedData }) => {
  // Decode Station A status and alarms
  const stationAStatus = decodeStatus(parsedData.stationA.status);
  const stationAAlarms = decodeAlarm(parsedData.stationA.alarm);

  return (
    <div className="data-section">
      <h4>Podaci</h4>
      
      {/* Station A */}
      <div className="station-card">
        <h5>Pozicija A</h5>
        <div className="station-info">
          <p><strong>Status:</strong></p>
          <ul>
            <li>Battery: {stationAStatus.batteryStatus ? "Flat" : "Ok"}</li>
            <li>Solar Panel Daylight: {stationAStatus.solarPanelDaylight ? "Yes" : "No"}</li>
          </ul>
          

          {/* Display Station A alarms */}
          <p><strong>Alarmi:</strong></p>
          <ul>
            {stationAAlarms.tempAlarm && <li>Temperatura {">"} 60°C </li>}
            {stationAAlarms.batteryHigh && <li>Napon baterije {">"} 16 V</li>}
            {stationAAlarms.batteryLow && <li>Napon baterije - nizak </li>}
            {stationAAlarms.batteryFlat && <li>Voltage {">"} 16V</li>}
            {stationAAlarms.modemNetworkError && <li>Modem network error</li>}
            
          </ul>
        </div>
      </div>

      {/* Other Stations */}
      <div className="stations">
        {parsedData.stations.map((station, index) => {
          const stationStatus = decodeStatus(station.status);
          const stationAlarms = decodeAlarm(station.alarm);

          return (
            <div key={index} className="station-card">
              <h5>Pozicija {String.fromCharCode(66 + index)}</h5>
              <div className="station-info">
              <p><strong>Status:</strong></p>

          <ul>
            <li>Battery:{stationAStatus.batteryStatusFlat ? "Flat" : "Ok"}</li>
            <li>Solar Panel Daylight: {stationStatus.solarPanelDaylight ? "Yes" : "No"}</li>
            <li>Modem Power State: {stationStatus.modemPowerState ? "On" : "Off"}</li>
            <li>Internet Connection: {stationStatus.internetConnectionOk ? "Ok" : "Error"}</li>
          </ul>
          <ul>
            {stationAlarms.tempOver60 && <li>Temperature {">"} 60°C</li>}
            {stationAlarms.tempOver70 && <li>Temperature {">"}  70°C</li>}
            {stationAlarms.tempOver80 && <li>Temperature {">"}  80°C</li>}
            {stationAlarms.voltageOver16 && <li>Voltage {">"} 16V</li>}
            {stationAlarms.voltageOver18 && <li>Voltage  {">"} 18V</li>}
            {stationAlarms.batteryLow && <li>Battery Low</li>}
            {stationAlarms.batteryFlat && <li>Battery Flat</li>}
          </ul>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};




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
        {/* Compact Gateway Section */}
        <div className="compact-gateways">
          {gateways.map((gw, index) => (
            <div key={index} className="gateway-compact">
              <p><strong>RSSI:</strong> {gw.rssi} dBm</p>
              <p><strong>SNR:</strong> {gw.snr}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Data Section */}
      <DataSection parsedData={parsedData} />
    </div>
  );
};

export default SensorCard;
