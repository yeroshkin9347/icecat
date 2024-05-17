import dayjs from "dayjs";
import map from "lodash/map";
import range from "lodash/range";
import { getLang } from "../redux/localization";

export const DATE_FORMAT_HOURS = {
  hour: "numeric",
  minute: "numeric",
  hour12: false
};
export const DATE_FORMAT_DATE = {
  year: "numeric",
  month: "numeric",
  day: "numeric"
};
export const DATE_FORMAT_FULL = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric"
};
export const DATE_FORMAT_MONTH = { month: "short", day: "numeric" };

export const parseDate = (d, options) => {
  if (
    d === "undefined" ||
    d === null ||
    !d ||
    d === "0001-01-01T00:30:00+00:30"
  )
    return "";
  let pDate = d instanceof Date ? d : new Date(d);
  if (pDate) {
    try {
      const locale = getLang();
      if (options) {
        return new Intl.DateTimeFormat(locale || "default", options).format(
          pDate
        );
      }
      return locale
        ? pDate.toLocaleDateString(locale)
        : pDate.toLocaleDateString();
    } catch (e) {
      return pDate.toLocaleDateString();
    }
  }
  return "";
};

export const smartDateParse = da => {
  let d = da instanceof Date ? da : new Date(da);
  return isSameYear(d)
    ? isToday(d)
      ? parseDate(d, DATE_FORMAT_HOURS)
      : parseDate(d, DATE_FORMAT_MONTH)
    : parseDate(d, DATE_FORMAT_DATE);
};

export const date = (...params) => dayjs(...params);

// export const duration = moment.duration

export const getDateTime = dateTime => {
  return dateTime ? date(dateTime).format("YYYY-MM-DD HH:mm") : "";
};

// get years from last year to n+2
export const getCloseYears = (onlyFuture, count) => {
  const currentYear = new Date().getFullYear();
  const afterYearRange = count || 2;
  const beforeYearRange = onlyFuture === true ? 0 : count ? count : 2;
  return map(
    range(currentYear - beforeYearRange, currentYear + afterYearRange + 1),
    y => y
  );
};

export const getYesterdayDateTime = () => {
  let dateNow = new Date();
  dateNow.setDate(dateNow.getDate() - 1);
  return date(dateNow).format("YYYY-MM-DD");
};

export const getLastWeekDateTime = () => {
  let dateNow = new Date();
  dateNow.setDate(dateNow.getDate() - 7);
  return date(dateNow).format("YYYY-MM-DD");
};

export const getLastMonthDateTime = () => {
  let dateNow = new Date();
  dateNow.setMonth(dateNow.getMonth() - 1);
  return date(dateNow).format("YYYY-MM-DD");
};

export const isSameYear = d => {
  if (!d) return false;
  const today = new Date();
  return d.getFullYear() === today.getFullYear();
};

export const isToday = d => {
  if (!d) return false;
  const today = new Date();
  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  );
};

export const getDateFormat = (date= null,format= '') => {
  if (!format) return false;
  const finalDate = dayjs(date).format(format);
  return finalDate;
};

export const formatDate = (date = null, format = 'DD/MM/YYYY') => {
  if (!date) {
    return '';
  }

  return dayjs(date).format(format);
};
