import React from "react";
import "../styles/SensorDataDisplay.css";
import { parseBatteryPercentage } from "../utils/batteryUtils";
import { parseSensorData, bytesToBits } from "../utils/dataUtils";
import { formatGatewayInfo } from "../utils/gatewayUtils";
import { TemperatureIcon, BatteryIcon, NetworkErrorIcon, Sun, Moon, LEDLightActiveICon } from "../assets/StatusIcons";
import { SolarPanelIcon, ModemIcon, InternetIcon, BatteryLowIcon, BatteryFlatIcon, BatteryNormalIcon, VisibilityMeterIcon, LEDLightIcon } from "../assets/StatusIcons";
import { decodeBatteryState } from "../utils/batteryUtils";

const DeviceInfo = ({ sensor }) => {
  const gateways = formatGatewayInfo(sensor.gws);
  return (
    <div className="device-info">
      <h2>{sensor.EUI === '513F167B004A0024' ? 'Izabela South' : 'Izabela North'}</h2>
     
      <p><strong>EUI:</strong> {sensor.EUI}</p>
      <p><strong>Baterija:</strong> {parseBatteryPercentage(sensor.bat)}</p>
      <p><strong>Posljednji podaci:</strong> {new Date(sensor.received_at).toLocaleString()}</p>
      <p><strong>Gateways: {gateways.length}</strong></p>
{/*       <div className="gateway-section">
        <h5>Gateways ({gateways.length})</h5>
        <div className="compact-gateways">
          {gateways.map((gw, index) => (
            <div key={index} className="gateway-compact">
              <p><strong>RSSI:</strong> {gw.rssi} dBm</p>
              <p><strong>SNR:</strong> {gw.snr}</p>
              <p><strong>Pozicija: </strong>{gw.lat},{gw.lng}</p>
            </div>
          ))}
        </div>
      </div> */}
    </div>
  );
};

const BatteryStatus = ({ statusCode }) => {
  const status = decodeBatteryState(statusCode);
  
  return (
    <div className={`battery-status ${status.color}`}>
      <span className="icon">{status.icon}</span>
      <div className="battery-status-info">
        <p>Baterija: {status.state}  - {status.description}</p>
      </div>
    </div>
  );
};

const DataSection = ({ parsedData, sensor }) => {
  return (
    <div className="data-section">
        
     
      <div className="stations">
        {parsedData.stations.map((station, index) => (
          <div key={index} className="station-card">
            
            {index==0 ? <h5>Pozicija - Modem</h5> : sensor.EUI == '513F167B004A0024' ? <h5>Pozicija - {index }</h5> : <h5>Pozicija - {index + 5}</h5>}
            
            {/* Status 1 */}
            <div className="status-group">
              <h6>Status:</h6>
              <ul className="status-list">
             {/*    <li>status code: {station.status.codeNum}</li> */}
                <li><BatteryStatus statusCode={station.status.codeNum}>Baterija:</BatteryStatus></li>
                <li> Period dana: {station.status.Solar_panel_day_light ? <Sun /> : <Moon/>}</li>
                <li><ModemIcon /> Modem: {station.status.Modem_power_state ? 'On' : 'Off'}</li>
                <li><InternetIcon /> Internet: {station.status.Internet_connection_ok ? 'OK' : 'Greška'}</li>
                <li><LEDLightIcon /> Svjetlo komunikacija: {station.status.Lantern_communication_ok ? 'OK' : 'Error'}</li>
                <li><LEDLightActiveICon/>Svjetlo Aktivno : {station.status.Lantern_light_active ? 'DA' : 'NE'}</li>
                <li><VisibilityMeterIcon/> Detektor magle:{station.status.Alarm_visibility_error ? 'Greška' : 'OK'}</li>
              </ul>
            </div>

            
            {/* Alarms */}
            <div className="alarms">
              <h6>Alarmi:</h6>
              <h6>alarm value: {station.alarm.codeNum}</h6> 
              <ul className="alarm-list">
                
                {station.alarm.Alarm_datalogger_high_temp && <li>Datalogger: High Temp</li>}
                {station.alarm.Alarm_battery_voltage_low && <li>Low Battery</li>}
                {station.alarm.Alarm_modem_network_error && <li>Modem Network Error</li>}
                {station.alarm.Alarm_battery_voltage_flat && <li>Batterija flat</li>}
                {station.alarm.Alarm_lantern_communication_failed && <li>Svjetlo: Greška komunikacije</li>}
                {station.alarm.Alarm_lantern_night_light_off && <li>Svjetlo: Ne radi po noći</li>} 
                {station.alarm.Alarm_lantern_day_light_on && <li>Svjetlo: Radi po danu</li>} 
                {station.alarm.Alarm_visibility_communication_failed && <li>Vaisala: greška komunikacije</li>} 
                {station.alarm.Alarm_visibility_error && <li>Vaisala: greška!</li>} 
                {station.alarm.Alarm_fog_signal_off_during_fog && <li>FOG: ne radi tijekom magle!</li>} 
                {station.alarm.Alarm_fog_signal_on_while_no_fog && <li>FOG: radi,a nema magle!</li>} 
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
  const BitRepresentation = bytesToBits(parsedData.rawBytes);
/*   console.log('Raw bytes as bits:');
    bitRepresentation.forEach((bits, index) =>  {
  console.log(`Byte ${index}: ${bytesToBits(bits)}`);
  }); */
  return (
    <div className="sensor-card">
      <DeviceInfo sensor={sensor} />
      <DataSection parsedData={parsedData} sensor={sensor} />
      <div className="raw-data">
  


{/* <div className="byte-debug">
  <h4>bits in bytes vizualizacija bitova  :/</h4>
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
</div>  */}
      </div>
      
    </div>
  );
};

export default SensorCard;
