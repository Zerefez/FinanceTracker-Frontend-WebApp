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
  const diffMs = endTime.getTime() - startTime.getTime();
  const diffHrs = diffMs / (1000 * 60 * 60);
  const hours = Math.floor(diffHrs);
  const minutes = Math.round((diffHrs - hours) * 60);
  return `${hours}h ${minutes}m`;
}; 