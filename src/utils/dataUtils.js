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

/* export function parseSensorData(hexString) {
  // Validate minimum length (1 station label byte + 4 bytes for Station A)
  if (!hexString || hexString.length < 10) { // 5 bytes = 10 hex characters
    throw new Error('Invalid sensor data: minimum 5 bytes (10 hex characters) required');
  }

  const bytes = hexStringToBytes(hexString);

  // Extract station label (first byte)
  const stationLabel = bytes[0]; // First byte is the station label
  const dataBytes = bytes.slice(1); // Sensor data starts from byte 1

  // Validate Station A data exists
  if (dataBytes.length < 4) {
    throw new Error('Invalid sensor data: incomplete Station A data');
  }

  // Helper function to convert two bytes into a single value (big-endian)
  const bytesToUInt16BE = (byteArray) => (byteArray[0] << 8) | byteArray[1];

  // Parse Station A (first 4 bytes of data)
  const stationA = {
    status: bytesToUInt16BE(dataBytes.slice(0, 2)), // Combine first two bytes into one value
    alarm: bytesToUInt16BE(dataBytes.slice(2, 4))   // Combine next two bytes into one value
  };

  // Parse remaining stations (4 bytes each: status + alarm)
  const stations = [];
  const stationSizeBytes = 4;

  for (let i = 4; i < dataBytes.length; i += stationSizeBytes) {
    const endIndex = i + stationSizeBytes;

    if (endIndex > dataBytes.length) {
      console.warn(`Incomplete station data at position ${i}`);
      break;
    }

    stations.push({
      status: bytesToUInt16BE(dataBytes.slice(i, i + 2)), // Combine first two bytes of station into one value
      alarm: bytesToUInt16BE(dataBytes.slice(i + 2, endIndex)) // Combine next two bytes of station into one value
    });
  }

  return {
    stationLabel, // Include the station label
    stationA,
    stations,
    rawBytes: bytes // Original byte array for debugging
  };
}


export function formatGatewayInfo(gateways) {
  if (!Array.isArray(gateways)) {
    throw new Error("Invalid gateways data: Expected an array");
  }

  return gateways.map((gateway) => ({
    lat: gateway.latitude || "N/A",
    lng: gateway.longitude || "N/A",
    rssi: gateway.rssi || "N/A",
    snr: gateway.snr || "N/A",
  }));
}
 */
// Status Decoder
/* export const decodeStatus = (statusValue) => {
  return {
    batteryStatusFlat: Boolean(statusValue & 0x01), // Bit 1
    solarPanelDaylight: Boolean(statusValue & 0x04), // Bit 3
    modemPowerState: Boolean(statusValue & 0x08), // Bit 4
    internetConnectionOk: Boolean(statusValue & 0x10), // Bit 5
  };
};

// Alarm Decoder
export const decodeAlarm = (alarmValue) => {
  return {
    tempAlarm: Boolean(alarmValue & 0x01),  // Bit 1
    batteryHigh: Boolean(alarmValue & 0x02),  // Bit 2
    batteryLow: Boolean(alarmValue & 0x04),  // Bit 3
    batteryFlat: Boolean(alarmValue & 0x8), // Bit 4
    modemNetworkError: Boolean(alarmValue & 0x10), // Bit 5
    unused1: Boolean(alarmValue & 0x20),   // Bit 6
    unused2: Boolean(alarmValue & 0x40)   // Bit 7
  };
};
 */


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
    
    stations.push({
      status: decodeStatus(bytesToUInt16BE(statusBytes)),
      alarm: decodeAlarm(bytesToUInt16BE(alarmBytes))
    });
  }

  return { stationLabel, stations, rawBytes: bytes };
}

// Status decoder for 2-byte values
export const decodeStatus = (statusValue) => ({
  code: statusValue,
  Battery_status: (statusValue >> 1) & 0x03,       // Bits 1-2
  Solar_panel_day_light: !!(statusValue & 0x08),   // Bit 3
  Modem_power_state: !!(statusValue & 0x10),       // Bit 4
  Internet_connection_ok: !!(statusValue & 0x20),  // Bit 5
  Lantern_communication_ok: !!(statusValue & 0x40),// Bit 6
  Lantern_light_active: !!(statusValue & 0x80),    // Bit 7
  // 16-bit fields
  Lantern_current_active: !!(statusValue & 0x100),      // Bit 8
  Visibility_communication_ok: !!(statusValue & 0x200), // Bit 9
  Visibility_alarm: !!(statusValue & 0x400),            // Bit 10
  Fog_signal_current_active: !!(statusValue & 0x800)    // Bit 11
});

// Alarm decoder for 2-byte values
export const decodeAlarm = (alarmValue) => ({
  code: alarmValue,
  Alarm_datalogger_high_temp: !!(alarmValue & 0x02),        // Bit 1
  Alarm_datalogger_high_voltage: !!(alarmValue & 0x04),     // Bit 2
  Alarm_battery_voltage_low: !!(alarmValue & 0x08),         // Bit 3
  Alarm_battery_voltage_flat: !!(alarmValue & 0x10),        // Bit 4
  Alarm_modem_network_error: !!(alarmValue & 0x20),         // Bit 5
  // 16-bit fields  
  Alarm_lantern_communication_failed: !!(alarmValue & 0x40),   // Bit 6
  Alarm_lantern_night_light_off: !!(alarmValue & 0x80),        // Bit 7
  Alarm_lantern_day_light_on: !!(alarmValue & 0x100),          // Bit 8
  Alarm_visibility_communication_failed: !!(alarmValue & 0x200), // Bit 9
  Alarm_visibility_error: !!(alarmValue & 0x400),              // Bit 10
  Alarm_fog_signal_off_during_fog: !!(alarmValue & 0x800),     // Bit 11
  Alarm_fog_signal_on_while_no_fog: !!(alarmValue & 0x1000)    // Bit 12
});

// Helper function for big-endian byte conversion
export const bytesToUInt16BE = (byteArray) => 
  (byteArray[0] << 8) | byteArray[1];
