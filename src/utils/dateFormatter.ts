import dayjs from "dayjs";

export const dateFormatter = (date: string, type = "short" as string) => {
  if (!date) return null;
  if (date && type === "short") {
    return dayjs(date).format("MMM D, YYYY");
  }
  return dayjs(date).format("MMM D, YYYY h:mm A");
};

/**
 * Calculate the difference between now and a given date
 * Returns the number of days if difference is greater than 72 hours, otherwise returns hours
 * Always returns a positive value (absolute difference)
 */
export const calculateTimeDifference = (date: string): string => {
  if (!date) return "0 hours";
  const now = dayjs();
  const targetDate = dayjs(date);
  const hoursDiff = targetDate.diff(now, "hour");

  // If absolute difference is greater than 72 hours, return days
  if (Math.abs(hoursDiff) > 72) {
    return `${Math.abs(targetDate.diff(now, "day"))} day${Math.abs(targetDate.diff(now, "day")) > 1 ? "s" : ""}`;
  }

  // Otherwise return hours
  return `${Math.abs(hoursDiff)} hour${Math.abs(hoursDiff) > 1 ? "s" : ""}`;
};
