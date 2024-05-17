import React from "react";
import { Box, TextField } from "@mui/material";
import { getDatePickerFormatByLocale } from "../redux/localization";
import DatePicker from "@mui/lab/DatePicker";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";

class DateRangePicker extends React.Component {
  render() {
    const { locale, startDate, endDate, onStartDateChange, onEndDateChange } =
      this.props;

    const datePickerFormat = getDatePickerFormatByLocale();

    return (
      <Box
        display="flex"
        alignItems="center"
        sx={{
          gap: {
            xs: 1,
            sm: 2,
          },
        }}
      >
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            locale={locale}
            onChange={onStartDateChange}
            value={startDate}
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
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            locale={locale}
            onChange={onEndDateChange}
            value={endDate}
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
      </Box>
    );
  }
}

export default DateRangePicker;
