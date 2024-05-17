import React from "react";
import DatePicker from "@mui/lab/DatePicker";
import TextField from "@mui/material/TextField";
import { useGridApiContext } from "@mui/x-data-grid-premium";
import { isString } from "lodash";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterMoment from "@mui/lab/AdapterMoment";
import { getLang } from "cdm-shared/redux/localization";
import moment from "moment";
import classNames from "classnames";

export const getPriceDateFormatByLang = () => {
  return "DD/MM/YYYY";
};

const PriceDateEditComponent = ({ value, onChange, ...props }) => {
  const { id, field, property } = props;
  const apiRef = useGridApiContext();

  const formattedValue = value
    ? isString(value)
      ? moment(value, getPriceDateFormatByLang())
      : value
    : null;

  const handleValueChange = (newValue) => {
    apiRef.current.setEditCellValue({
      id,
      field,
      value: newValue,
    });
    onChange(id, field, newValue);
  };

  return (
    <div style={{ minWidth: "100%" }}>
      <LocalizationProvider dateAdapter={AdapterMoment} locale={getLang()}>
        <DatePicker
          readOnly={property?.isReadOnly}
          value={formattedValue}
          onChange={handleValueChange}
          block
          inputFormat={getPriceDateFormatByLang()}
          renderInput={(params) => (
            <TextField
              className={classNames("form-field", formattedValue ? "filled" : (property?.nullable ? "nullable-empty" : "empty"))}
              {...params}
              size="small"
              hiddenLabel
              fullWidth
            />
          )}
        />
      </LocalizationProvider>
    </div>
  );
};

export default PriceDateEditComponent;
