// src/utils/gatewayUtils.js
export const formatGatewayInfo = (gateways) => {
    return gateways?.map((gw) => ({
      eui: gw.gweui || 'N/A',
      rssi: gw.rssi ?? 'N/A',
      lat: gw.lat?.toFixed(5) || 'N/A',
      lng: gw.lon?.toFixed(5) || 'N/A', // Note: API uses "lon" instead of "lng"
      snr: gw.snr?.toFixed(1) || 'N/A',
      time: new Date(gw.time).toLocaleTimeString()
    })) || [];
  };