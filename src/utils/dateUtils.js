import moment from "moment";
import "moment/locale/es";

export function getISOStrFromDate(date) {
  return moment(date).toISOString();
}
