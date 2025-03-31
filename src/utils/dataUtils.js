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
  if (!hexString || hexString.length < 8) {
    throw new Error('Invalid sensor data: minimum 4 bytes (8 hex characters) required');
  }

  const bytes = hexStringToBytes(hexString);
  
  // Parse Station A (first 4 bytes)
  const stationA = {
    status: bytes.slice(0, 2),
    alarm: bytes.slice(2, 4)
  };
  
  // Parse remaining stations (4 bytes each)
  const stations = [];
  const stationSize = 4;
  
  for (let i = 4; i < bytes.length; i += stationSize) {
    const stationBytes = bytes.slice(i, i + stationSize);
    
    // Handle incomplete station data
    if (stationBytes.length < stationSize) {
      console.warn(`Incomplete station data at position ${i}`);
      continue;
    }
    
    stations.push(stationBytes);
  }
  
  return {
    stationA,
    stations,
    rawBytes: bytes // Include raw bytes for debugging
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
