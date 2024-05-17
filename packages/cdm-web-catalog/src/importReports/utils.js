import reduce from "lodash/reduce";
import indexOf from "lodash/indexOf";
import map from "lodash/map";
import get from "lodash/get";

export const getReducedRetailers = reducable =>
  reduce(
    reducable,
    (res, val) => {
      map(get(val, "tradeItemRetailerReports"), r => {
        if (indexOf(res, get(r, "retailer.name")) === -1)
          res.push(get(r, "retailer.name"));
      });
      return res;
    },
    []
  );

export const getStatuses = () => [
  { value: "Blocked", label: "Blocked" },
  { value: "Warning", label: "Warning" },
  { value: "Ok", label: "Ok" }
];

export const getErrorLineColor = () => "rgb(255, 250, 238)";
