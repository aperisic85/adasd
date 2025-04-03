import React from "react";
import "../styles/SensorDataDisplay.css";
import { parseBatteryPercentage } from "../utils/batteryUtils";
import { parseSensorData, bytesToUInt16BE, bytesToBits } from "../utils/dataUtils";
import { formatGatewayInfo } from "../utils/gatewayUtils";
import { TemperatureIcon, BatteryIcon, NetworkErrorIcon } from "../assets/StatusIcons";
import { SolarPanelIcon, ModemIcon, InternetIcon, BatteryLowIcon, BatteryFlatIcon, BatteryNormalIcon, BatteryUnknownIcon, NetworkIcon } from "../assets/StatusIcons";
import { decodeBatteryState } from "../utils/batteryUtils";

const DeviceInfo = ({ sensor }) => {
  const gateways = formatGatewayInfo(sensor.gws);
  return (
    <div className="device-info">
      <h3>Device Info</h3>
      <p><strong>Naziv:</strong> {sensor.EUI === '513F167B004A0024' ? 'Izabela South' : 'Izabela North'}</p>
      <p><strong>EUI:</strong> {sensor.EUI}</p>
      <p><strong>Baterija:</strong> {parseBatteryPercentage(sensor.bat)}</p>
      <p><strong>Posljednji podaci:</strong> {new Date(sensor.received_at).toLocaleString()}</p>
      <div className="gateway-section">
        <h5>Gateways ({gateways.length})</h5>
        <div className="compact-gateways">
          {gateways.map((gw, index) => (
            <div key={index} className="gateway-compact">
              <p><strong>RSSI:</strong> {gw.rssi} dBm</p>
              <p><strong>SNR:</strong> {gw.snr}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const BatteryStatus = ({ statusCode }) => {
  const status = decodeBatteryState(statusCode);
  
  return (
    <div className={`battery-status ${status.color}`}>
      <span className="icon">{status.icon}</span>
      <div className="status-info">
        <h4>{status.state}</h4>
        <p>{status.description}</p>
      </div>
    </div>
  );
};

const DataSection = ({ parsedData }) => {
  return (
    <div className="data-section">
      <h4>Podaci</h4>
      <div className="stations">
        {parsedData.stations.map((station, index) => (
          <div key={index} className="station-card">
            <h5>Pozicija {String.fromCharCode(65 + index)}</h5>
            
            {/* Status 1 */}
            <div className="status-group">
              <h6>Status 1:</h6>
              <ul className="status-list">
                <li><BatteryStatus></BatteryStatus></li>
                <li><SolarPanelIcon /> Solar: {station.status1.Solar_panel_day_light ? 'Dan' : 'Noć'}</li>
                <li><ModemIcon /> Modem: {station.status1.Modem_power_state ? 'On' : 'Off'}</li>
              </ul>
            </div>

            {/* Status 2 */}
            <div className="status-group">
              <h6>Status 2:</h6>
              <ul className="status-list">
                <li><InternetIcon /> Internet: {station.status2.Internet_connection_ok ? 'OK' : 'Greška'}</li>
                <li><NetworkIcon /> Lantern Comms: {station.status2.Lantern_communication_ok ? 'OK' : 'Error'}</li>
              </ul>
            </div>

            {/* Alarms */}
            <div className="alarms">
              <h6>Alarmi:</h6>
              <ul className="alarm-list">
                {station.alarm1.Alarm_datalogger_high_temp && <li>High Temp</li>}
                {station.alarm1.Alarm_battery_voltage_low && <li>Low Battery</li>}
                {station.alarm2.Alarm_modem_network_error && <li>Modem Error</li>}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


const SensorCard = ({ sensor }) => {
  const parsedData = parseSensorData(sensor.data);
  const bitRepresentation = bytesToBits(parsedData.rawBytes);
/*   console.log('Raw bytes as bits:');
    bitRepresentation.forEach((bits, index) =>  {
  console.log(`Byte ${index}: ${bytesToBits(bits)}`);
  }); */
  return (
    <div className="sensor-card">
      <DeviceInfo sensor={sensor} />
      <DataSection parsedData={parsedData} />
      <div className="raw-data">
  


<div className="byte-debug">
  <h4>Raw Byte Visualization :) :/</h4>
  <div className="bit-grid">
    {bitRepresentation.map((bits, index) => (
      <div key={index} className="byte-row">
        <span className="byte-index">Byte {index < 10 ? `0${index}` : index}: </span> 
        {bits.split('').map((bit, bitIndex) => ( // Ensure bits is a string before calling split()
          <span key={bitIndex} className={`bit ${bit === '1' ? 'active' : ''}`}>
            {bit}
          </span>
        ))}
      </div>
    ))}
  </div>
</div>
      </div>
      
    </div>
  );
};

export default SensorCard;
