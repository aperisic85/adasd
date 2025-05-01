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
      //const status = byteSlice[0] | (byteSlice[1] << 8);
      //const alarm = byteSlice[2] | (byteSlice[3] << 8);
      console.log(`Raw bytes: [${byteSlice.join(', ')}] → 16-bit: ${status} → Binary: ${status.toString(2).padStart(16, '0')}`);
      
      stations.push({
        //status1: decodeStatus(status1),
        status: decodeStatus(status),
        alarm: decodeAlarm(alarm),
        //alarm2: decodeAlarm8Bit(alarm2)
      });
    }
  
    return { stationLabel, stations, rawBytes: bytes };
  }
  
  
  const BITS = {
    BATTERY: 0b11,          // Bits 1-2
    SOLAR_PANEL: 1 << 2,    // Bit 3
    MODEM_POWER: 1 << 3,    // Bit 4
    INTERNET: 1 << 4,       // Bit 5
    LANTERN_COMMS: 1 << 5,  // Bit 6
    LANTERN_LIGHT: 1 << 6,  // Bit 7
    LANTERN_CURRENT: 1 << 7,// Bit 8
    VISIBILITY_COMMS: 1 << 8, // Bit 9
    VISIBILITY_ALARM: 1 << 9, // Bit 10
    FOG_CURRENT: 1 << 10    // Bit 11
  };
  // Status decoder for 16-bit values
  export const decodeStatus = (statusValue) => {
    if (typeof statusValue !== 'number' || statusValue < 0 || statusValue > 0xFFFF) {
      throw new Error('Alarm value must be 16-bit unsigned integer');
    }
    
    return{
    codeNum: statusValue,
    Battery_status: statusValue & BITS.BATTERY,
    Solar_panel_day_light: Boolean(statusValue & BITS.SOLAR_PANEL),
    Modem_power_state: Boolean(statusValue & BITS.MODEM_POWER),
    Internet_connection_ok: Boolean(statusValue & BITS.INTERNET),
    Lantern_communication_ok: Boolean(statusValue & BITS.LANTERN_COMMS),
    Lantern_light_active: Boolean(statusValue & BITS.LANTERN_LIGHT),
    Lantern_current_active: Boolean(statusValue & BITS.LANTERN_CURRENT),
    Visibility_communication_ok: Boolean(statusValue & BITS.VISIBILITY_COMMS),
    Visibility_alarm: Boolean(statusValue & BITS.VISIBILITY_ALARM),
    FogCurrentActive: Boolean(statusValue & BITS.FOG_CURRENT)};
  };
  // Alarm decoder for 16-bit values
  export const decodeAlarm = (alarmValue) => {
    // Input validation
    if (typeof alarmValue !== 'number' || alarmValue < 0 || alarmValue > 0xFFFF) {
      throw new Error('Alarm value must be 16-bit unsigned integer');
    }
  
    return {
      code: alarmValue,
      Alarm_datalogger_high_temp: Boolean(alarmValue & 0b00000000_00000001),
      Alarm_datalogger_high_voltage: Boolean(alarmValue & (1 << 1)),
      Alarm_battery_voltage_low: Boolean(alarmValue & (1 << 2)),
      Alarm_battery_voltage_flat: Boolean(alarmValue & (1 << 3)),
      Alarm_modem_network_error: Boolean(alarmValue & (1 << 4)),
      Alarm_lantern_communication_failed: Boolean(alarmValue & (1 << 5)),
      Alarm_lantern_night_light_off: Boolean(alarmValue & (1 << 6)),
      Alarm_lantern_day_light_on: Boolean(alarmValue & (1 << 7)),
      Alarm_visibility_communication_failed: Boolean(alarmValue & (1 << 8)),
      Alarm_visibility_error: Boolean(alarmValue & (1 << 9)),
      Alarm_fog_signal_off_during_fog: Boolean(alarmValue & (1 << 10)),
      Alarm_fog_signal_on_while_no_fog: Boolean(alarmValue & (1 << 11))
    };
  };
  
  // Helper function for big-endian byte conversion
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