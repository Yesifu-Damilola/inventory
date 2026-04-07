import { format, differenceInHours, differenceInDays } from "date-fns";

export const dateFormatter = (date: string, type = "short" as string) => {
  if (!date) return null;
  if (date && type === "short") {
    return format(new Date(date), "MMM d, yyyy");
  }
  return format(new Date(date), "MMM d, yyyy h:mm a");
};

/**
 * Calculate the difference between now and a given date
 * Returns the number of days if difference is greater than 72 hours, otherwise returns hours
 * Always returns a positive value (absolute difference)
 */
export const calculateTimeDifference = (date: string): string => {
  if (!date) return "0 hours";
  const now = new Date();
  const targetDate = new Date(date);
  const hoursDiff = differenceInHours(targetDate, now);

  // If absolute difference is greater than 72 hours, return days
  if (Math.abs(hoursDiff) > 72) {
    const daysDiff = differenceInDays(targetDate, now);
    return `${Math.abs(daysDiff)} day${Math.abs(daysDiff) > 1 ? "s" : ""}`;
  }

  // Otherwise return hours
  return `${Math.abs(hoursDiff)} hour${Math.abs(hoursDiff) > 1 ? "s" : ""}`;
};
