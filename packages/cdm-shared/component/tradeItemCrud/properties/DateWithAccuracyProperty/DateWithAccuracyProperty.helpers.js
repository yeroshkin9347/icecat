import { fr, enGB, it } from "date-fns/locale";
import moment from "moment";

export const getLocaleConfig = (locale) => {
  switch (locale) {
    case "fr":
    case "fr-FR":
      return fr;
    case "it":
    case "it-IT":
      return it;
    case "en":
    case "en-GB":
    default:
      return enGB;
  }
};

export const getDateByAccuracy = (_date, accuracyCode) => {
  const date = _date || undefined;
  switch (accuracyCode) {
    case "Week":
      return moment(date).endOf("isoWeek").toJSON();
    case "Month":
      return moment(date).endOf("month").toJSON();
    case "Quarter":
      return moment(date).endOf("quarter").toJSON();
    case "Semester":
      // setDate(moment(date).endOf('quarter'));
      break;
    case "Year":
      return moment(date).endOf("year").toJSON();
    default:
      return moment(date).toJSON();
  }
};

export const getSemesterDate = (yearInDate, semester) => {
  return moment(yearInDate)
    .set("quarter", semester === "S1" ? "2" : "4")
    .endOf("quarter")
    .toJSON();
};

export const getSemesterByDate = (date) => {
  const quarter = moment(date).quarter();
  return quarter < 3 ? "S1" : "S2";
};
