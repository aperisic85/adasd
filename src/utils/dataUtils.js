function hexStringToBytes(hexString) {
  const bytes = [];
  for (let i = 0; i < hexString.length; i += 2) {
      bytes.push(parseInt(hexString.substr(i, 2), 16));
  }
  return bytes;
}

export function parseSensorData(hexString) {
  const bytes = hexStringToBytes(hexString);
  
  // First 4 bytes for station A
  const stationA = {
      status: bytes.slice(0, 2),
      alarm: bytes.slice(2, 4)
  };
  
  // Remaining bytes for stations B, C, D, etc.
  const stations = [];
  for (let i = 4; i < bytes.length; i += 4) {
      stations.push(bytes.slice(i, i + 4));
  }
  
  return { stationA, stations };
}




