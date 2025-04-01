import React from "react";
import "../styles/SensorDataDisplay.css";
import { parseBatteryPercentage } from "../utils/batteryUtils";
import { parseSensorData } from "../utils/dataUtils";
import { formatGatewayInfo } from "../utils/gatewayUtils";
import { decodeStatus, decodeAlarm } from "../utils/dataUtils";
import { TemperatureIcon, BatteryIcon, NetworkErrorIcon } from "../assets/StatusIcons"; // Adjust the import path as necessary
import { SolarPanelIcon, ModemIcon, InternetIcon, BatteryLowIcon, BatteryFlatIcon, BatteryNormalIcon, BatteryUnknownIcon } from "../assets/StatusIcons"; // Adjust the import path as necessary

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
);}
/* // Helper for battery status text
const getBatteryStatusText = (statusCode) => {
  switch(statusCode) {
    case 0: return "Normal";
    case 1: return "Flat";
    case 2: return "Low";
    default: return "Unknown";
  }
}; 


<div className="gateway-section">
<h4>Gateways ({gateways.length})</h4>
  <div className="compact-gateways">
    {gateways.map((gw, index) => (
      <div key={index} className="gateway-compact">
        <p><strong>RSSI:</strong> {gw.rssi} dBm</p>
        <p><strong>SNR:</strong> {gw.snr}</p>
      </div>
    ))}
  </div>
</div>





*/
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
          <ul className="status-list">
          <li><BatteryIcon></BatteryIcon><span>Battery:{stationAStatus.batteryStatusFlat ? "Flat" : "Ok"}</span></li>
            <li><SolarPanelIcon></SolarPanelIcon><span>Solar Panel Daylight: {stationAStatus.solarPanelDaylight ? "Yes" : "No"}</span></li>
            <li><ModemIcon></ModemIcon><span>Modem Power State: {stationAStatus.modemPowerState ? "On" : "Off"}</span></li>
            <li><InternetIcon></InternetIcon><span>Internet Connection: {stationAStatus.internetConnectionOk ? "Ok" : "Error"}</span></li>
          </ul>
          

          {/* Display Station A alarms */}
          <p><strong>Alarmi:</strong></p>
          <ul className="alarm-list">
  {stationAAlarms.tempAlarm && (
    <li>
      <TemperatureIcon size={16} color="red" />
      <span>Temperatura {">"} 60°C</span>
    </li>
  )}
  {stationAAlarms.batteryHigh && (
    <li>
      <BatteryIcon size={16} color="orange" />
      <span>Napon baterije {">"} 16 V</span>
    </li>
  )}
  {stationAAlarms.batteryLow && (
    <li>
      <BatteryIcon size={16} color="red" />
      <span>Napon baterije - nizak</span>
    </li>
  )}
  {stationAAlarms.batteryFlat && (
    <li>
      <BatteryIcon size={16} color="red" />
      <span>Voltage {">"} 16V</span>
    </li>
  )}
  {stationAAlarms.modemNetworkError && (
    <li>
      <NetworkErrorIcon size={16} color="red" />
      <span>Modem network error</span>
    </li>
  )}
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

          <ul className="status-list">
          <li><BatteryIcon></BatteryIcon><span>Battery:{stationStatus.batteryStatusFlat ? "Flat" : "Ok"}</span></li>
            <li><SolarPanelIcon></SolarPanelIcon><span>Solar Panel Daylight: {stationStatus.solarPanelDaylight ? "Yes" : "No"}</span></li>
            <li><ModemIcon></ModemIcon><span>Modem Power State: {stationStatus.modemPowerState ? "On" : "Off"}</span></li>
            <li><InternetIcon></InternetIcon><span>Internet Connection: {stationStatus.internetConnectionOk ? "Ok" : "Error"}</span></li>
          </ul>
      {/* Display other Station  alarms */}
      <p><strong>Alarmi:</strong></p>
      <ul className="alarm-list">
        {stationAlarms.tempAlarm && (
          <li>
            <TemperatureIcon size={16} color="red" />
            <span>Temperatura {">"} 60°C</span>
          </li>
          )}
        {stationAlarms.batteryHigh && (
          <li>
            <BatteryIcon size={16} color="orange" />
            <span>Napon baterije {">"} 16 V</span>
          </li>
        ) }
        {stationAlarms.batteryLow && (
          <li>
            <BatteryIcon size={16} color="red" />
            <span>Napon baterije - nizak</span>
          </li>
        )}
        {stationAlarms.batteryFlat && (
        <li>
          <BatteryIcon size={16} color="red" />
          <span>Voltage {">"} 16V</span>
        </li>
        )}
        {stationAlarms.modemNetworkError && (
          <li>
            <NetworkErrorIcon size={16} color="red" />
            <span>Modem network error</span>
          </li>
        )}
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
 //const gateways = formatGatewayInfo(sensor.gws);
  const parsedData = parseSensorData(sensor.data);

  return (
    <div className="sensor-card">
      {/* Device Info */}
      <DeviceInfo sensor={sensor} />

      

      {/* Data Section */}
      <DataSection parsedData={parsedData} />
    </div>
  );
};

export default SensorCard;
