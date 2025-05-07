/**
 * Formats a date object to a localized date string
 */
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString();
};

/**
 * Formats a date object to a localized time string with hours and minutes
 */
export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

/**
 * Calculates the hours worked between two dates and returns as a string in the format 'Xh Ym'
 */
export const getHoursWorked = (startTime: Date, endTime: Date): string => {
  // Convert to milliseconds and get difference
  const diffMs = Math.max(0, endTime.getTime() - startTime.getTime());
  
  // Convert to hours and minutes precisely
  const diffHrs = diffMs / (1000 * 60 * 60);
  const hours = Math.floor(diffHrs);
  const minutes = Math.round((diffHrs - hours) * 60);
  
  // Handle case where minutes round up to 60
  if (minutes === 60) {
    return `${hours + 1}h 0m`;
  }
  
  return `${hours}h ${minutes}m`;
};

/**
 * Calculate decimal hours worked (for paycheck calculations)
 */
export const getDecimalHoursWorked = (startTime: Date, endTime: Date): number => {
  const diffMs = Math.max(0, endTime.getTime() - startTime.getTime());
  // Convert to decimal hours with 2 decimal precision
  return parseFloat((diffMs / (1000 * 60 * 60)).toFixed(2));
};

/**
 * Formats a date for input in datetime-local field
 */
export const formatDateForInput = (date: Date): string => {
  const isoStr = new Date(date.getTime() - (date.getTimezoneOffset() * 60000))
    .toISOString()
    .slice(0, 16);
  return isoStr;
}; 