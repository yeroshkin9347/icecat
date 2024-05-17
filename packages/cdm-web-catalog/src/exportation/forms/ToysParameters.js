import React, { useMemo } from "react";
import map from "lodash/map";
import get from "lodash/get";
import reduce from "lodash/reduce";
import dotProps from "dot-prop-immutable";
import { DropdownButton, Button, Col, Label } from "cdm-ui-components";
import { withLocalization } from "common/redux/hoc/withLocalization";
import { getCloseYears } from "cdm-shared/utils/date";
import { Row } from "styled-bootstrap-grid";
import DatePicker from "@mui/lab/DatePicker";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import TextField from "@mui/material/TextField";
import dayjs from "dayjs";
import { getDatePickerFormatByLocale } from "cdm-shared/redux/localization";

// PeriodStart: used for pricing exportation
// PeriodEnd: used for pricing exportation
const ToysParameters = ({
  values,
  currentParsedLocaleCode,
  // functions
  onChange,
  translate,
}) => {
  const datePickerFormat = getDatePickerFormatByLocale();

  // generate years for pricing period
  const years = useMemo(() => {
    const ys = getCloseYears(true, 3);
    return reduce(
      ys,
      (results, year) => {
        return [
          ...results,
          // permanent
          {
            key: `permanent-${year}`,
            PeriodStart: `${year}-01-01`,
            PeriodEnd: `${year}-09-30`,
            label: translate("export.toysFilters.permanent", { year }),
            year,
          },
          // end of year
          {
            key: `eoy-${year}`,
            PeriodStart: `${year}-10-01`,
            PeriodEnd: `${year}-12-31`,
            label: translate("export.toysFilters.endOfYear", { year }),
            year,
          },
        ];
      },
      []
    );
  }, [translate]);

  return (
    <>
      <Row>
        {/* period date start */}
        <Col col>
          <Label block>&nbsp;</Label>
          {/* Year helper */}
          <DropdownButton
            light
            small
            appendTo={() => document.body}
            title={translate("export.toysFilters.period")}
            block
          >
            {map(years, (y) => (
              <Button
                noMargin
                style={{ display: "block" }}
                small
                key={`year-filter-export-${y.key}`}
                default
                onClick={() =>
                  onChange({
                    ...values,
                    PeriodStart: y.PeriodStart,
                    PeriodEnd: y.PeriodEnd,
                  })
                }
              >
                {y.label}
              </Button>
            ))}
          </DropdownButton>
        </Col>

        {/* period date start */}
        <Col col>
          <Label block>{translate("export.toysFilters.periodDateStart")}</Label>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              onChange={(d) =>
                onChange(
                  dotProps.set(
                    values,
                    "PeriodStart",
                    d ? dayjs(d).format("YYYY-MM-DD") : null
                  )
                )
              }
              value={get(values, "PeriodStart") || null}
              locale={currentParsedLocaleCode}
              inputFormat={datePickerFormat}
              block
              PopperProps={{
                style: {
                  zIndex: 9999,
                },
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  className="form-field"
                  variant="filled"
                  size="small"
                  hiddenLabel
                  fullWidth
                />
              )}
            />
          </LocalizationProvider>
        </Col>

        {/* period date end */}
        <Col col>
          <Label block>{translate("export.toysFilters.periodDateEnd")}</Label>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              onChange={(d) =>
                onChange(
                  dotProps.set(
                    values,
                    "PeriodEnd",
                    d ? dayjs(d).format("YYYY-MM-DD") : null
                  )
                )
              }
              value={get(values, "PeriodEnd") || null}
              locale={currentParsedLocaleCode}
              inputFormat={datePickerFormat}
              block
              PopperProps={{
                style: {
                  zIndex: 9999,
                },
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  className="form-field"
                  variant="filled"
                  size="small"
                  hiddenLabel
                  fullWidth
                />
              )}
            />
          </LocalizationProvider>
        </Col>
      </Row>
    </>
  );
};

export default withLocalization(ToysParameters);
