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

export function parseSensorData(hexString) {
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
  const stationSize = 4;

  for (let i = 4; i < dataBytes.length; i += stationSize) {
    const endIndex = i + stationSize;

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

// Status Decoder
export const decodeStatus = (statusValue) => {
  return {
    batteryStatus: (statusValue & 0x06) >> 1, // Bits 1-2
    solarPanelDaylight: Boolean(statusValue & 0x08) // Bit 3
  };
};

// Alarm Decoder
export const decodeAlarm = (alarmValue) => {
  return {
    tempOver60: Boolean(alarmValue & 0x02),  // Bit 1
    tempOver70: Boolean(alarmValue & 0x04),  // Bit 2
    tempOver80: Boolean(alarmValue & 0x08),  // Bit 3
    voltageOver16: Boolean(alarmValue & 0x10), // Bit 4
    voltageOver18: Boolean(alarmValue & 0x20), // Bit 5
    batteryLow: Boolean(alarmValue & 0x40),   // Bit 6
    batteryFlat: Boolean(alarmValue & 0x80)   // Bit 7
  };
};
