// Converts raw battery value (0-255) to percentage (0-100%)
export const parseBatteryPercentage = (bat) => {
    if (bat === null || bat === undefined) {
      return "N/A"; // Handle cases where bat is null or missing
    }
    return `${Math.round((bat / 255) * 100)}%`;
  };
  // Battery Status Decoder (2-bit)
export const decodeBatteryState = (statusBits) => {
  // Mask to ensure we only use 2 bits (0b11 = 3)
  const maskedValue = statusBits & 0b11;

  switch(maskedValue) {
    case 0b00:  // Binary 00
      return {
        state: 'Unknown',
        description: 'No valid status available',
        color: 'gray',
        icon: '❓'
      };
      
    case 0b01:  // Binary 01
      return {
        state: 'Good',
        description: 'Battery within normal parameters',
        color: 'green',
        icon: '✔️'
      };
      
    case 0b10:  // Binary 10
      return {
        state: 'Float',
        description: 'Battery in charging/maintenance mode',
        color: 'orange',
        icon: '⚡'
      };
      
    case 0b11:  // Binary 11
      return {
        state: 'Bad',
        description: 'Battery requires attention',
        color: 'red',
        icon: '⚠️'
      };
      
    default:
      return {
        state: 'Invalid',
        description: 'Unexpected status code',
        color: 'black',
        icon: '❌'
      };
  }
};

// Usage Example
const batteryStatus = decodeBatteryState(0b01); 
// Returns { state: 'Good', ... }
