export function hexStringToBytes(hexString) {
  // Validate input format
  if (typeof hexString !== 'string' || !/^[0-9a-fA-F]+$/.test(hexString)) {
    throw new Error('Invalid hex string format');
  }

  // Pad with leading zero if odd length
  const normalizedHex = hexString.length % 2 !== 0 
    ? `0${hexString}` 
    : hexString;

  const bytes = new Uint8Array(normalizedHex.length / 2);
  
  for (let i = 0; i < normalizedHex.length; i += 2) {
    const byteValue = parseInt(normalizedHex.substr(i, 2), 16);
    if (isNaN(byteValue)) {
      throw new Error(`Invalid hex byte at position ${i}`);
    }
    bytes[i/2] = byteValue;
  }
  
  return bytes;
}
export const bytesToUInt16LE = (byteArray) => 
  (byteArray[1] << 8) | byteArray[0];


export function parseSensorData(hexString) {
  // Validate minimum length: 1 byte label + at least 4 bytes for one station
  if (!hexString || hexString.length < 10) { // 5 bytes = 10 hex characters
    throw new Error('Invalid sensor data: minimum 5 bytes (10 hex characters) required');
  }

  const bytes = hexStringToBytes(hexString);
  const stationLabel = String.fromCharCode(bytes[0]); // First byte is label
  const dataBytes = bytes.slice(1); // Remaining bytes are station data

  // Validate data length matches 4-byte station chunks
  if (dataBytes.length % 4 !== 0) {
    throw new Error(`Invalid data length: ${dataBytes.length} bytes (must be multiple of 4)`);
  }

  const stations = [];
  
  // Parse stations in 4-byte chunks (2 bytes status + 2 bytes alarm)
  for (let i = 0; i < dataBytes.length; i += 4) {
    const statusBytes = dataBytes.slice(i, i + 2);
    const alarmBytes = dataBytes.slice(i + 2, i + 4);
    
    // Convert to 16-bit integers
    const statusValue = bytesToUInt16BE(statusBytes);
    const alarmValue = bytesToUInt16BE(alarmBytes);
    
    stations.push({
      status: decodeStatus(statusValue),
      alarm: decodeAlarm(alarmValue)
    });
  }

  return { stationLabel, stations, rawBytes: bytes };
}
// Status decoder for 16-bit values
export const decodeStatus = (statusValue) => ({
  code: statusValue,
  Battery_status: (statusValue >> 1) & 0x03,       // Bits 1-2
  Solar_panel_day_light: !!(statusValue & 0x0008), // Bit 3
  Modem_power_state: !!(statusValue & 0x0010),     // Bit 4
  Internet_connection_ok: !!(statusValue & 0x0020),// Bit 5
  Lantern_communication_ok: !!(statusValue & 0x0040), // Bit 6
  Lantern_light_active: !!(statusValue & 0x0080),  // Bit 7
  Lantern_current_active: !!(statusValue & 0x0100), // Bit 8
  Visibility_communication_ok: !!(statusValue & 0x0200), // Bit 9
  Visibility_alarm: !!(statusValue & 0x0400)       // Bit 10
});
// Alarm decoder for 16-bit values
export const decodeAlarm = (alarmValue) => ({
  code: alarmValue,
  Alarm_datalogger_high_temp: !!(alarmValue & 0x0002),    // Bit 1
  Alarm_datalogger_high_voltage: !!(alarmValue & 0x0004), // Bit 2
  Alarm_battery_voltage_low: !!(alarmValue & 0x0008),     // Bit 3
  Alarm_battery_voltage_flat: !!(alarmValue & 0x0010),    // Bit 4
  Alarm_modem_network_error: !!(alarmValue & 0x0020),     // Bit 5
  Alarm_lantern_communication_failed: !!(alarmValue & 0x0040), // Bit 6
  Alarm_lantern_night_light_off: !!(alarmValue & 0x0080),      // Bit 7
  Alarm_lantern_day_light_on: !!(alarmValue & 0x0100),         // Bit 8
  Alarm_visibility_communication_failed: !!(alarmValue & 0x0200), // Bit 9
  Alarm_visibility_error: !!(alarmValue & 0x0400),              // Bit 10
  Alarm_fog_signal_off_during_fog: !!(alarmValue & 0x0800),     // Bit 11
  Alarm_fog_signal_on_while_no_fog: !!(alarmValue & 0x1000)     // Bit 12
});
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