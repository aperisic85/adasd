export function hexStringToBytes(hexString) {
    // Validate input format
    if (typeof hexString !== 'string' || !/^[0-9a-fA-F]+$/.test(hexString)) {
      throw new Error('Invalid hex string format');
    }
  
    // Pad with leading zero if odd length
    const normalizedHex = hexString.length % 2 !== 0 
      ? `0${hexString}` 
      : hexString;
  
    // Create a Uint8Array to hold the bytes
    const bytes = new Uint8Array(normalizedHex.length / 2);
  
    // Iterate over the string in steps of 2 characters
    for (let i = 0; i < hexString.length; i += 2) {
      const byteValue = parseInt(hexString.slice(i, i + 2), 16); // Use slice instead of substr
      if (isNaN(byteValue)) {
        throw new Error(`Invalid hex byte at position ${i}`);
      }
      bytes[i / 2] = byteValue;
    }
  
    return bytes;
  }
  export const bytesToUInt16LE = (byteArray) => 
    (byteArray[1] << 8) | byteArray[0];
  
  export function parseSensorData(hexString) {
    // Validate minimum length: 1 byte label + at least 4 bytes per station
    if (!hexString || hexString.length < 10) { // 5 bytes = 10 hex characters
    throw new Error('Invalid sensor data: minimum 5 bytes (10 hex characters) required');
     
    }
  
    const bytes = hexStringToBytes(hexString);
    const stationLabel = String.fromCharCode(bytes[0]);
    const dataBytes = bytes.slice(1);
  
    // Validate data length matches 4-byte station chunks
    if (dataBytes.length % 4 !== 0) {
      throw new Error(`Invalid data length: ${dataBytes.length} bytes (must be multiple of 4)`);
    }
  
    const stations = [];
    
    // Parse stations in 4-byte chunks (2 status + 2 alarm bytes)
    for (let i = 4; i < dataBytes.length; i += 4) { //start from 4
      const byteSlice = dataBytes.slice(i, i + 4);
      const status = (byteSlice[0] << 8) | byteSlice[1];  
      const alarm = (byteSlice[2] << 8) | byteSlice[3];   
    
      stations.push({
        //status1: decodeStatus(status1),
        status: decodeStatus(status),
        alarm: decodeAlarm(alarm),
        //alarm2: decodeAlarm8Bit(alarm2)
      });
    }
  
    return { stationLabel, stations, rawBytes: bytes };
  }
  
  //bit 0 je kontrolni - uvijek je 1
  const STATUS_BITS = {
    ALWAYS_ON_1:          1 << 0,  // Bit 0
    BATTERY: (1 << 1) | (1 << 2),  // 0b110
    SOLAR_PANEL:          1 << 3,  // Bit 3
    MODEM_POWER:          1 << 4,  // Bit 4
    INTERNET:             1 << 5,  // Bit 5
    LANTERN_COMMS:        1 << 6,  // Bit 6
    LANTERN_LIGHT:        1 << 7,  // Bit 7
    LANTERN_CURRENT:      1 << 8,  // Bit 8
    VISIBILITY_COMMS:     1 << 9,  // Bit 9
    VISIBILITY_ALARM:     1 << 10, // Bit 10
    FOG_CURRENT:          1 << 11  // Bit 11
};
  // Status decoder for 16-bit values
  export const decodeStatus = (statusValue) => {
    if (typeof statusValue !== 'number' || statusValue < 0 || statusValue > 0xFFFF) {
      throw new Error('Alarm value must be 16-bit unsigned integer');
    }
    
    return{
    codeNum: statusValue,
    Battery_status: statusValue & STATUS_BITS.BATTERY,
    Solar_panel_day_light: Boolean(statusValue & STATUS_BITS.SOLAR_PANEL),
    Modem_power_state: Boolean(statusValue & STATUS_BITS.MODEM_POWER),
    Internet_connection_ok: Boolean(statusValue & STATUS_BITS.INTERNET),
    Lantern_communication_ok: Boolean(statusValue & STATUS_BITS.LANTERN_COMMS),
    Lantern_light_active: Boolean(statusValue & STATUS_BITS.LANTERN_LIGHT),
    Lantern_current_active: Boolean(statusValue & STATUS_BITS.LANTERN_CURRENT),
    Visibility_communication_ok: Boolean(statusValue & STATUS_BITS.VISIBILITY_COMMS),
    Visibility_alarm: Boolean(statusValue & STATUS_BITS.VISIBILITY_ALARM),
    FogCurrentActive: Boolean(statusValue & STATUS_BITS.FOG_CURRENT)};
  };

  export const ALARM_BITS = {
    NOT_USED:                     1 << 0,
    DATALOGGER_HIGH_TEMP:         1 << 1,
    DATALOGGER_HIGH_VOLTAGE:      1 << 2,
    BATTERY_VOLTAGE_LOW:          1 << 3,
    BATTERY_VOLTAGE_FLAT:         1 << 4,
    MODEM_NETWORK_ERROR:          1 << 5,
    LANTERN_COMMUNICATION_FAILED: 1 << 6,
    LANTERN_NIGHT_LIGHT_OFF:      1 << 7,
    LANTERN_DAY_LIGHT_ON:         1 << 8,
    VISIBILITY_COMMUNICATION_FAILED: 1 << 9,
    VISIBILITY_ERROR:             1 << 10,
    FOG_SIGNAL_OFF_DURING_FOG:    1 << 11,
    FOG_SIGNAL_ON_NO_FOG:         1 << 12
};
  // Alarm decoder for 16-bit values
  export const decodeAlarm = (alarmValue) => {
    // Input validation
    if (typeof alarmValue !== 'number' || alarmValue < 0 || alarmValue > 0xFFFF) {
      throw new Error('Alarm value must be 16-bit unsigned integer');
    }
  
    return {
      codeNum: alarmValue,
      Alarm_datalogger_high_temp: Boolean(alarmValue & ALARM_BITS.DATALOGGER_HIGH_TEMP),
      Alarm_datalogger_high_voltage: Boolean(alarmValue & ALARM_BITS.DATALOGGER_HIGH_VOLTAGE),
      Alarm_battery_voltage_low: Boolean(alarmValue & ALARM_BITS.BATTERY_VOLTAGE_LOW),
      Alarm_battery_voltage_flat: Boolean(alarmValue & ALARM_BITS.BATTERY_VOLTAGE_FLAT),
      Alarm_modem_network_error: Boolean(alarmValue & ALARM_BITS.MODEM_NETWORK_ERROR),
      Alarm_lantern_communication_failed: Boolean(alarmValue & ALARM_BITS.LANTERN_COMMUNICATION_FAILED),
      Alarm_lantern_night_light_off: Boolean(alarmValue & ALARM_BITS.LANTERN_NIGHT_LIGHT_OFF),
      Alarm_lantern_day_light_on: Boolean(alarmValue & ALARM_BITS.LANTERN_DAY_LIGHT_ON),
      Alarm_visibility_communication_failed: Boolean(alarmValue & ALARM_BITS.VISIBILITY_COMMUNICATION_FAILED),
      Alarm_visibility_error: Boolean(alarmValue & ALARM_BITS.VISIBILITY_ERROR),
      Alarm_fog_signal_off_during_fog: Boolean(alarmValue & ALARM_BITS.FOG_SIGNAL_OFF_DURING_FOG),
      Alarm_fog_signal_on_while_no_fog: Boolean(alarmValue & ALARM_BITS.FOG_SIGNAL_ON_NO_FOG)
    };
  };
  
  //  big-endian byte conversion
  export const bytesToUInt16BE = (byteArray) => 
    (byteArray[0] << 8) | byteArray[1];
  
  
  export function bytesToBits(bytes) {
    // Ensure bytes is an array
    if (!Array.isArray(bytes)) {
      if (typeof bytes === 'string') {
        bytes = bytes.split(',').map(Number); // Convert comma-separated string to numbers
      } else if (bytes instanceof Uint8Array) {
        bytes = Array.from(bytes); // Convert typed array to regular array
      } else {
        throw new Error('Invalid input: Expected an array or convertible type');
      }
    }
  
    // Map each byte to its binary representation
    return bytes.map(byte => byte.toString(2).padStart(8, '0'));
  }