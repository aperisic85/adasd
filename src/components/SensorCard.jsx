import React from "react";
import "../styles/SensorDataDisplay.css";
import { parseBatteryPercentage } from "../utils/batteryUtils";
import { parseSensorData, bytesToUInt16BE } from "../utils/dataUtils";
import { formatGatewayInfo } from "../utils/gatewayUtils";
import { decodeStatus, decodeAlarm } from "../utils/dataUtils";
import { TemperatureIcon, BatteryIcon, NetworkErrorIcon } from "../assets/StatusIcons";
import { SolarPanelIcon, ModemIcon, InternetIcon, BatteryLowIcon, BatteryFlatIcon, BatteryNormalIcon, BatteryUnknownIcon } from "../assets/StatusIcons";

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

const DataSection = ({ parsedData }) => {
  // Get all stations including the first one
  const stations = parsedData.stations;

  return (
    <div className="data-section">
      <h4>Podaci</h4>
      
      {/* All Stations */}
      <div className="stations">
        {stations.map((station, index) => {
          const stationStatus = decodeStatus(station.status);
          const stationAlarms = decodeAlarm(station.alarm);

          return (
            <div key={index} className="station-card">
              <h5>Pozicija {String.fromCharCode(65 + index)}</h5>
              <div className="station-info">
                <p><strong>Status:</strong></p>
                <ul className="status-list">
                  <li>
                    <BatteryIcon />
                    <span>Baterija: {
                      stationStatus.Battery_status === 0 ? 'Nepoznat' :
                      stationStatus.Battery_status === 1 ? 'Flat' :
                      stationStatus.Battery_status === 2 ? 'Punjenje' :
                      'Pun'
                    }</span>
                  </li>
                  <li>
                    <SolarPanelIcon />
                    <span>Solarni panel: {stationStatus.Solar_panel_day_light ? 'Dan' : 'Noć'}</span>
                  </li>
                  <li>
                    <ModemIcon />
                    <span>Modem: {stationStatus.Modem_power_state ? 'Uključen' : 'Isključen'}</span>
                  </li>
                  <li>
                    <InternetIcon />
                    <span>Internet: {stationStatus.Internet_connection_ok ? 'OK' : 'Greška'}</span>
                  </li>
                </ul>

                <p><strong>Alarmi:</strong></p>
                <ul className="alarm-list">
                  {stationAlarms.Alarm_datalogger_high_temp && (
                    <li>
                      <TemperatureIcon size={16} color="red" />
                      <span>Visoka temperatura dataloggera</span>
                    </li>
                  )}
                  {stationAlarms.Alarm_datalogger_high_voltage && (
                    <li>
                      <BatteryIcon size={16} color="orange" />
                      <span>Visoki napon ({">"} 16V)</span>
                    </li>
                  )}
                  {stationAlarms.Alarm_battery_voltage_low && (
                    <li>
                      <BatteryIcon size={16} color="red" />
                      <span>Nizak napon baterije</span>
                    </li>
                  )}
                  {stationAlarms.Alarm_battery_voltage_flat && (
                    <li>
                      <BatteryIcon size={16} color="red" />
                      <span>Baterija ispražnjena</span>
                    </li>
                  )}
                  {stationAlarms.Alarm_modem_network_error && (
                    <li>
                      <NetworkErrorIcon size={16} color="red" />
                      <span>Greška mreže modema</span>
                    </li>
                  )}
                  {stationAlarms.Alarm_lantern_communication_failed && (
                    <li>
                      <NetworkErrorIcon size={16} color="red" />
                      <span>Greška komunikacije svjetionika</span>
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
  const parsedData = parseSensorData(sensor.data);

  return (
    <div className="sensor-card">
      <DeviceInfo sensor={sensor} />
      <DataSection parsedData={parsedData} />
    </div>
  );
};

export default SensorCard;
