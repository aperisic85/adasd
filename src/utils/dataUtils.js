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
    for (let i = 0; i < dataBytes.length; i += 4) {
      const [status, alarm] = dataBytes.slice(i, i + 4);
      
      stations.push({
        //status1: decodeStatus(status1),
        status: decodeStatus(status),
        alarm: decodeAlarm(alarm),
        //alarm2: decodeAlarm8Bit(alarm2)
      });
    }
  
    return { stationLabel, stations, rawBytes: bytes };
  }
  
  // 8-bit Status Decoder
  export const decodeStatus8Bit = (statusValue) => ({
    code: statusValue,
    // Battery status: bits 0-1 (0b00000011)
    Battery_status: statusValue & 0x03,
    // Solar panel: bit 3 (0b00001000)
    Solar_panel_day_light: !!(statusValue & 0x08),
    // Modem power: bit 4 (0b00010000)
    Modem_power_state: !!(statusValue & 0x10),
    // Internet connection: bit 5 (0b00100000)
    Internet_connection_ok: !!(statusValue & 0x20),
    // Lantern comms: bit 6 (0b01000000)
    Lantern_communication_ok: !!(statusValue & 0x40),
    // Lantern light: bit 7 (0b10000000)
    Lantern_light_active: !!(statusValue & 0x80)
  });
    // 8-bit Status Decoder
    export const decodeStatusSecond8Bit = (statusValue) => ({
        code: statusValue,
        Lantern_current_active: !!(statusValue & 0x01), // Bit 8
        Visibility_communication_ok: !!(statusValue & 0x02), // Bit 9
        Visibility_alarm: !!(statusValue & 0x04)  
      });
// 8-bit Alarm Decoder
export const decodeAlarm8Bit = (alarmValue) => ({
    code: alarmValue,
    // High temp: bit 1 (0b00000010)
    Alarm_datalogger_high_temp: !!(alarmValue & 0x02),
    // High voltage: bit 2 (0b00000100)
    Alarm_datalogger_high_voltage: !!(alarmValue & 0x04),
    // Low battery: bit 3 (0b00001000)
    Alarm_battery_voltage_low: !!(alarmValue & 0x08),
    // Flat battery: bit 4 (0b00010000)
    Alarm_battery_voltage_flat: !!(alarmValue & 0x10),
    // Modem error: bit 5 (0b00100000)
    Alarm_modem_network_error: !!(alarmValue & 0x20),
    // Lantern comm failed: bit 6 (0b01000000)
    Alarm_lantern_communication_failed: !!(alarmValue & 0x40),
    // Lantern night light: bit 7 (0b10000000)
    Alarm_lantern_night_light_off: !!(alarmValue & 0x80)
  });


  // Status decoder for 16-bit values
  export const decodeStatus = (statusValue) => ({
    code: statusValue,
    Battery_status: (statusValue >> 1) & ((1<<1) + ((1<<2)*2)),       // Bits 1-2
    Solar_panel_day_light: !!(statusValue & (1<<3)), // Bit 3
    Modem_power_state: !!(statusValue & (1<<4)),     // Bit 4
    Internet_connection_ok: !!(statusValue & (1 << 5)),// Bit 5
    Lantern_communication_ok: !!(statusValue & (1 << 6)), // Bit 6
    Lantern_light_active: !!(statusValue & (1<<7)),  // Bit 7
    Lantern_current_active: !!(statusValue & (1<<8)), // Bit 8
    Visibility_communication_ok: !!(statusValue & (1<<9)), // Bit 9
    Visibility_alarm: !!(statusValue & (1<<10))       // Bit 10
  });
  // Alarm decoder for 16-bit values
  export const decodeAlarm = (alarmValue) => ({
    code: alarmValue,
    Alarm_datalogger_high_temp: !!(alarmValue & (1<<1)),    // Bit 1
    Alarm_datalogger_high_voltage: !!(alarmValue & (1<<2)), // Bit 2
    Alarm_battery_voltage_low: !!(alarmValue & (1<<3)),     // Bit 3
    Alarm_battery_voltage_flat: !!(alarmValue & (1<<4)),    // Bit 4
    Alarm_modem_network_error: !!(alarmValue & (1<<5)),     // Bit 5
    Alarm_lantern_communication_failed: !!(alarmValue & (1<<6)), // Bit 6
    Alarm_lantern_night_light_off: !!(alarmValue & (1<<7)),      // Bit 7
    Alarm_lantern_day_light_on: !!(alarmValue & (1<<8)),         // Bit 8
    Alarm_visibility_communication_failed: !!(alarmValue & (1<<9)), // Bit 9
    Alarm_visibility_error: !!(alarmValue & (1<<10)),              // Bit 10
    Alarm_fog_signal_off_during_fog: !!(alarmValue & (1<<11)),     // Bit 11
    Alarm_fog_signal_on_while_no_fog: !!(alarmValue & (1<<12))     // Bit 12
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