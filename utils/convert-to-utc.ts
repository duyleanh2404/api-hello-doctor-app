import { toDate } from "date-fns-tz";

export const convertToUTC = (date: Date): string => {
  const localDate = toDate(date, { timeZone: "Asia/Ho_Chi_Minh" });
  const utcDate = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000);
  return utcDate.toISOString();
};