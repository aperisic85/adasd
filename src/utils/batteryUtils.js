// Converts raw battery value (0-255) to percentage (0-100%)
export const parseBatteryPercentage = (bat) => {
    if (bat === null || bat === undefined) {
      return "N/A"; // Handle cases where bat is null or missing
    }
    return `${Math.round((bat / 255) * 100)}%`;
  };
  