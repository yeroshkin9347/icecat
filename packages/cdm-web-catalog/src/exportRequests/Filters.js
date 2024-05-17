import React from "react";
import get from "lodash/get";
import find from "lodash/find";
import {
  Input,
  Row,
  Col,
  Label,
  Button,
  VirtualizedSelect,
} from "cdm-ui-components";
import { defaultFilters } from "./models";
import withUser from "cdm-shared/redux/hoc/withUser";
import { withLocalization } from "common/redux/hoc/withLocalization";
import { DatePicker } from "@mui/lab";
import TextField from '@mui/material/TextField';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import dayjs from "dayjs";
import { getDatePickerFormatByLocale } from "cdm-shared/redux/localization";

const matchingStatusOptions = [
  { label: "exportRequests.filters.matched", value: 'true' },
  { label: "exportRequests.filters.notMatched", value: 'false' },
];

const sendingStatusOptions = [
  { label: "exportRequests.filters.sent", value: 'true' },
  { label: "exportRequests.filters.notSent", value: 'false' },
];

const Filters = ({ filters, currentParsedLocaleCode, translate, onChange }) => {
  const datePickerFormat = getDatePickerFormatByLocale();

  const onChangeFilter = (key, value) => {
    onChange((filters) => ({
      ...filters,
      [key]: value,
    }));
  };

  return (
    <>
      <Row>
        {/* Requested from */}
        <Col col>
          <Label>{translate("exportRequests.filters.requestedFrom")}</Label>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              locale={currentParsedLocaleCode}
              inputFormat={datePickerFormat}
              block
              value={get(filters, "requestedFrom")}
              onChange={d => onChangeFilter("requestedFrom", d ? dayjs(d).format("YYYY-MM-DD") : null)}
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

        {/* Requested to */}
        <Col col>
          <Label>{translate("exportRequests.filters.requestedTo")}</Label>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              locale={currentParsedLocaleCode}
              inputFormat={datePickerFormat}
              block
              value={get(filters, "requestedTo")}
              onChange={d => onChangeFilter("requestedTo", d ? dayjs(d).format("YYYY-MM-DD") : null)}
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

        {/* Matching status */}
        <Col col>
          <Label>{translate("exportRequests.filters.matchingStatus")}</Label>
          <VirtualizedSelect
            key={translate("exportRequests.filters.matchingStatus")}
            getOptionLabel={o => translate(o.label)}
            getOptionValue={o => o.value}
            placeholder=""
            closeMenuOnSelect
            isClearable
            options={matchingStatusOptions}
            value={find(matchingStatusOptions, option => option.value === get(filters, "matchingStatus")) || null}
            onChange={val => onChangeFilter("matchingStatus", val?.value || null)}
            classNamePrefix="cde-select"
            className="cde-select"
          />
        </Col>

        {/*/!* Sending status *!/*/}
        {/*<Col col>*/}
        {/*  <Label>{translate("exportRequests.filters.sendingStatus")}</Label>*/}
        {/*  <VirtualizedSelect*/}
        {/*    key={translate("exportRequests.filters.sendingStatus")}*/}
        {/*    getOptionLabel={o => translate(o.label)}*/}
        {/*    getOptionValue={o => o.value}*/}
        {/*    placeholder=""*/}
        {/*    closeMenuOnSelect*/}
        {/*    options={sendingStatusOptions}*/}
        {/*    value={find(sendingStatusOptions, option => option.value === get(filters, "sendingStatus")) || null}*/}
        {/*    onChange={val => onChangeFilter("sendingStatus", val ? val.value : null)}*/}
        {/*  />*/}
        {/*</Col>*/}

        {/*/!* Sent from *!/*/}
        {/*<Col col>*/}
        {/*  <Label>{translate("exportRequests.filters.sentFrom")}</Label>*/}
        {/*  <DatePicker*/}
        {/*    locale={currentParsedLocaleCode}*/}
        {/*    block*/}
        {/*    value={get(filters, "sentFrom")}*/}
        {/*    onChange={d => onChangeFilter("sentFrom", d ? d.format("YYYY-MM-DD") : null)}*/}
        {/*  />*/}
        {/*</Col>*/}

        {/*/!* Sent to *!/*/}
        {/*<Col col>*/}
        {/*  <Label>{translate("exportRequests.filters.sentTo")}</Label>*/}
        {/*  <DatePicker*/}
        {/*    locale={currentParsedLocaleCode}*/}
        {/*    block*/}
        {/*    value={get(filters, "sentTo")}*/}
        {/*    onChange={d => onChangeFilter("sentTo", d ? d.format("YYYY-MM-DD") : null)}*/}
        {/*  />*/}
        {/*</Col>*/}

        {/* Requested GTIN */}
        <Col col>
          <Label>{translate("exportRequests.filters.requestedGtin")}</Label>
          <Input
            block
            value={get(filters, "requestedGtin") || ""}
            onChange={e => onChangeFilter("requestedGtin", e.target.value)}
          />
        </Col>

        {/* Remove filters */}
        <Col col>
          <Label block>&nbsp;</Label>
          <Button
            secondary
            small
            block
            onClick={() => onChange(defaultFilters)}
          >
            {translate("exportRequests.filters.clear")}
          </Button>
        </Col>
      </Row>
    </>
  );
};

export default withUser(withLocalization(Filters));
