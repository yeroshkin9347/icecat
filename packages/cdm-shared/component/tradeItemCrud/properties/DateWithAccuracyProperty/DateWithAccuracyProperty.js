import React, { useState, useEffect, forwardRef } from "react";
import TextField from "@mui/material/TextField";
import DatePicker from "react-datepicker";
import { useDebounce } from "../useDebounce";
import Autocomplete, { autocompleteClasses } from "@mui/material/Autocomplete";
import Popper from "@mui/material/Popper";
import { styled } from "@mui/material/styles";
import { get } from "lodash";
import { Col, Row } from "cdm-ui-components";
import { PropertyListboxComponent } from "../FixedValueProperty";
import {getDatePickerFormatByLocale, getLang} from "../../../../redux/localization";
import * as env from "cdm-shared/environment";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import {
  accuracyOptions,
  semesterOptions,
} from "./DateWithAccuracyProperty.constants";
import {
  getDateByAccuracy,
  getLocaleConfig,
  getSemesterByDate,
  getSemesterDate,
} from "./DateWithAccuracyProperty.helpers";
import { renderFixedValue } from "../utils";

const StyledPopper = styled(Popper)({
  [`& .${autocompleteClasses.listbox}`]: {
    boxSizing: "border-box",
    "& ul": {
      padding: 2,
      margin: 2,
    },
  },
  "&": {
    zIndex: 9999,
  },
});

const SemesterPicker = ({ semesterAndYear, onChange }) => {
  const [semester, setSemester] = useState(
    semesterOptions.find((o) => o.code === get(semesterAndYear, "semester"))
  );
  const [open, setOpen] = useState(false);

  const CustomInput = forwardRef(({ value, onClick }, ref) => (
    <TextField
      value={value}
      onClick={onClick}
      className="form-field"
      size="small"
      hiddenLabel
      fullWidth
    />
  ));

  const MyContainer = ({ children }) => {
    return (
      <div style={{ padding: "16px", background: "#fff", width: 200 }}>
        {children}
      </div>
    );
  };

  return (
    <>
      <Col col={3} style={{ paddingRight: 0 }}>
        <DatePicker
          selected={semesterAndYear.yearInDate}
          onChange={(date) =>
            onChange({
              ...semesterAndYear,
              yearInDate: date,
            })
          }
          customInput={<CustomInput />}
          showYearPicker={true}
          dateFormat={"yyyy"}
          calendarContainer={MyContainer}
        />
      </Col>
      <Col col={3} style={{ paddingRight: 0, paddingLeft: 4 }}>
        <Autocomplete
          disablePortal
          disableClearable
          autoComplete={false}
          includeInputInList={false}
          id="virtualize-demo"
          disableListWrap
          PopperComponent={StyledPopper}
          ListboxComponent={PropertyListboxComponent}
          open={open}
          onOpen={() => {
            setOpen(true);
          }}
          onClose={() => {
            setOpen(false);
          }}
          options={semesterOptions}
          value={semester}
          onChange={(e, v) => {
            setSemester(v);
            onChange({
              ...semesterAndYear,
              semester: v.code,
            });
          }}
          getOptionLabel={(o) => o.code}
          renderInput={(params) => (
            <TextField
              {...params}
              InputProps={{
                ...params.InputProps,
                style: {
                  paddingTop: 0,
                  paddingBottom: 0,
                },
                endAdornment: (
                  <React.Fragment>
                    {params.InputProps.endAdornment}
                  </React.Fragment>
                ),
              }}
              className="form-field"
              size="small"
              hiddenLabel
              fullWidth
            />
          )}
          renderOption={(props, option) => [props, option]}
          renderGroup={(params) => params}
        />
      </Col>
    </>
  );
};

const DateWithAccuracyProperty = (props) => {
  const { property, value, onChange } = props;
  const [date, setDate] = useState(get(value, "dateTimeOffset"));
  const debouncedDateValue = useDebounce(date, 1000);

  const [open, setOpen] = useState(false);
  const [accuracy, setAccuracy] = useState(
    accuracyOptions.find((acc) => acc.code === get(value, "accuracy")) || null
  );
  const accuracyCode = get(accuracy, "code");
  const locale = getLang() || env.CDM_DEFAULT_LANG;

  const [startDate, setStartDate] = useState(
    get(value, "dateTimeOffset")
      ? moment(
          get(value, "accuracy") === "Semester"
            ? getSemesterDate(
                get(value, "dateTimeOffset"),
                get(value, "accuracy")
              )
            : getDateByAccuracy(
                get(value, "dateTimeOffset"),
                get(value, "accuracy")
              )
        ).toDate()
      : null
  );

  const [semesterAndYear, setSemesterAndYear] = useState({
    semester: getSemesterByDate(get(value, "dateTimeOffset")),
    yearInDate: moment(get(value, "dateTimeOffset")).toDate(),
  });

  const handleChange = (value) => {
    onChange(value);
  };

  useEffect(() => {
    if (debouncedDateValue !== get(value, "dateTimeOffset")) {
      handleChange({
        accuracy: value ? value.accuracy : null,
        dateTimeOffset: debouncedDateValue,
      });
    }
  }, [debouncedDateValue]);

  let datePickerParams = {};
  switch (accuracyCode) {
    case "Month":
      datePickerParams = {
        showMonthYearPicker: true,
        dateFormat: "MM/yyyy",
      };
      break;
    case "Year":
      datePickerParams = {
        showYearPicker: true,
        dateFormat: "yyyy",
      };
      break;
    case "Quarter":
      datePickerParams = {
        showQuarterYearPicker: true,
        dateFormat: "yyyy, QQQ",
      };
      break;
  }

  const CustomInput = forwardRef(({ value, onClick }, ref) => (
    <TextField
      value={value}
      onClick={onClick}
      className="form-field"
      size="small"
      hiddenLabel
      fullWidth
    />
  ));

  const onChangeAccuracy = (v) => {
    setAccuracy(v);
    const dateTimeOffset =
      get(v, "code") === "Semester"
        ? getSemesterDate(semesterAndYear.yearInDate, semesterAndYear.semester)
        : getDateByAccuracy(startDate, get(v, "code"));
    setStartDate(moment(dateTimeOffset || undefined).toDate());
    handleChange({
      dateTimeOffset,
      accuracy: get(v, "code"),
    });
  };

  const onChangeSenester = (_semesterAndYear) => {
    setSemesterAndYear(_semesterAndYear);
    const { semester, yearInDate } = _semesterAndYear;
    setDate(getSemesterDate(yearInDate, semester));
  };

  const onChangeDate = (date) => {
    if (date) {
      if (!accuracy) {
        onChangeAccuracy(accuracyOptions.find((a) => a.code === "Day"));
      }
      setStartDate(date);
      setDate(getDateByAccuracy(date, accuracyCode));
    } else {
      setAccuracy(null);
      setStartDate(null);
      handleChange(null);
    }
  };

  const isWeekday = (date) => {
    const day = moment(date).isoWeekday();
    return day === 7;
  };

  return (
    <Row alignItems="center">
      {accuracyCode === "Semester" ? (
        <SemesterPicker
          semesterAndYear={semesterAndYear}
          onChange={(val) => onChangeSenester(val)}
        />
      ) : (
        <Col col={6} style={{ paddingRight: 0 }}>
          <DatePicker
            selected={startDate}
            onChange={(date) => onChangeDate(date)}
            customInput={<CustomInput />}
            locale={getLocaleConfig(locale)}
            dateFormat={getDatePickerFormatByLocale()}
            filterDate={accuracyCode === "Week" ? isWeekday : undefined}
            isClearable
            {...datePickerParams}
          />
        </Col>
      )}
      <Col col={6} style={{ paddingLeft: 4 }}>
        <Autocomplete
          disablePortal
          disableClearable
          autoComplete
          includeInputInList
          id="virtualize-demo"
          disableListWrap
          PopperComponent={StyledPopper}
          ListboxComponent={PropertyListboxComponent}
          open={open}
          onOpen={() => {
            setOpen(true);
          }}
          onClose={() => {
            setOpen(false);
          }}
          options={accuracyOptions}
          value={accuracy}
          onChange={(e, v) => {
            v && onChangeAccuracy(v);
          }}
          getOptionLabel={(o) => renderFixedValue(o, locale)}
          renderInput={(params) => (
            <TextField
              className="form-field"
              {...params}
              InputProps={{
                ...params.InputProps,
                style: {
                  paddingTop: 0,
                  paddingBottom: 0,
                },
                endAdornment: (
                  <React.Fragment>
                    {params.InputProps.endAdornment}
                  </React.Fragment>
                ),
              }}
              size="small"
              hiddenLabel
              fullWidth
            />
          )}
          renderOption={(props, option) => [props, option]}
          renderGroup={(params) => params}
        />
      </Col>
    </Row>
  );
};
export default React.memo(DateWithAccuracyProperty);
