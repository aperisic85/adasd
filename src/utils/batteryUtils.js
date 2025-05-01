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
    case 0b11:  
      return {
        state: 'OK',
        description: 'Baterija je uredu',
        color: 'green',
        icon: '✔️'
      };
      
    case 0b10:  
      return {
        state: 'Low',
        description: 'Battery low',
        color: 'yellow',
        icon: '❓'
      };
      
    case 0b01: 
      return {
        state: 'Bad',
        description: 'Battery very low',
        color: 'red',
        icon: '⚠️'
      };
      

      
    default:
      return {
        state: 'unknown',
        description: 'Unexpected status code',
        color: 'black',
        icon: '❌'
      };
  }
};

// Usage Example

// Returns { state: 'Good', ... }
