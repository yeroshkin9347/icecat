import React, { useState, useEffect } from "react";
import dotProps from "dot-prop-immutable";
import get from "lodash/get";
import {
  Input,
  Row,
  Col,
  Label,
  Button,
  Padding,
  VirtualizedSelect,
} from "cdm-ui-components";
import withUser from "cdm-shared/redux/hoc/withUser";
import { withLocalization } from "common/redux/hoc/withLocalization";
import { TextField } from "@mui/material";
import DatePicker from "@mui/lab/DatePicker";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";

const VideoAdvancedFilters = ({
  filters: initialFilters,
  defaultFilters,
  reload,
  categoryOptions,
  censorOptions,
  languageOptions,
  onUpdate,
  onCancel,
  translate,
}) => {
  const [filters, setFilters] = useState(initialFilters);

  useEffect(() => {
    if (reload === true) {
      setFilters(initialFilters);
    }
  }, [reload, initialFilters]);

  const updateFilter = (key, value) => {
    setFilters((prevFilters) => dotProps.set(prevFilters, `${key}`, value));
  };

  const onApplyHandler = () => {
    onUpdate(filters);
  };

  const onReset = () => {
    setFilters(defaultFilters);
  };

  return (
    <>
      <Row>
        {/* Common filters */}
        <Col col={6}>
          {/* title */}
          <Label block>{translate("catalog.filters.title")}</Label>
          <Input
            onChange={(e) => updateFilter("title", e.target.value)}
            value={get(filters, "title") || ""}
            block
          />
          <br />
          {/* fileName */}
          <Label block>{translate("video.filter.fileName")}</Label>
          <Input
            onChange={(e) => updateFilter("fileName", e.target.value)}
            value={get(filters, "fileName") || ""}
            block
          />
          <br />
          {/* gtin */}
          <Label block>{translate("catalog.filters.gtin")}</Label>
          <Input
            onChange={(e) => updateFilter("gtin", e.target.value)}
            value={get(filters, "gtin") || ""}
            block
          />
          <br />
          {/* category */}
          <Label block>{translate("video.filter.category")}</Label>
          <VirtualizedSelect
            simpleValue
            isMulti
            placeholder=""
            closeMenuOnSelect={false}
            value={get(filters, "category") || []}
            onChange={(v) => {
              updateFilter("category", v);
            }}
            options={categoryOptions}
            classNamePrefix="cde-select"
            className="cde-select"
          />

          <br />
          {/* languagues */}
          <Label block>{translate("video.filter.language")}</Label>
          <VirtualizedSelect
            simpleValue
            isMulti
            placeholder=""
            closeMenuOnSelect={false}
            value={get(filters, "languages") || []}
            onChange={(v) => {
              updateFilter("languages", v);
            }}
            options={languageOptions}
            classNamePrefix="cde-select"
            className="cde-select"
          />
          <br />

          {/* widthMin */}
          <Label block>{translate("video.filter.widthMin")}</Label>
          <Input
            type="number"
            min="0"
            onChange={(e) => updateFilter("widthMin", e.target.value)}
            value={get(filters, "widthMin") || ""}
            block
          />
          <br />
          {/* widthMax */}
          <Label block>{translate("video.filter.widthMax")}</Label>
          <Input
            type="number"
            min="0"
            onChange={(e) => updateFilter("widthMax", e.target.value)}
            value={get(filters, "widthMax") || ""}
            block
          />
          <br />
          {/* heightMin */}
          <Label block>{translate("video.filter.heightMin")}</Label>
          <Input
            type="number"
            min="0"
            onChange={(e) => updateFilter("heightMin", e.target.value)}
            value={get(filters, "heightMin") || ""}
            block
          />
          <br />
          {/* heightMax */}
          <Label block>{translate("video.filter.heightMax")}</Label>
          <Input
            type="number"
            min="0"
            onChange={(e) => updateFilter("heightMax", e.target.value)}
            value={get(filters, "heightMax") || ""}
            block
          />
          <br />
        </Col>
        <Col col={6}>
          {/* retailerSku */}
          <Label block>{translate("catalog.filters.retailerSku")}</Label>
          <Input
            onChange={(e) => updateFilter("retailerSku", e.target.value)}
            value={get(filters, "retailerSku") || ""}
            block
          />
          <br />
          {/* tradeItemMpns */}
          <Label block>{translate("video.filter.tradeItemMpns")}</Label>
          <Input
            onChange={(e) => updateFilter("tradeItemMpns", e.target.value)}
            value={get(filters, "tradeItemMpns") || ""}
            block
          />
          <br />
          {/* tradeItemId */}
          <Label block>{translate("catalog.filters.tradeItemId")}</Label>
          <Input
            onChange={(e) => updateFilter("tradeItemId", e.target.value)}
            value={get(filters, "tradeItemId") || ""}
            block
          />
          <br />
          {/* censors  */}
          <Label block>{translate("video.filter.censor")}</Label>
          <VirtualizedSelect
            simpleValue
            isMulti
            placeholder=""
            closeMenuOnSelect={false}
            value={get(filters, "censor") || []}
            onChange={(v) => {
              updateFilter("censor", v);
            }}
            options={censorOptions}
            classNamePrefix="cde-select"
            className="cde-select"
          />
          <br />

          {/* retailerId  */}
          <Label block>{translate("video.filter.retailerId")}</Label>
          <Input
            onChange={(e) => updateFilter("retailerId", e.target.value)}
            value={get(filters, "retailerId") || ""}
            block
          />
          <br />

          {/* manufacturerIds  */}
          <Label block>{translate("video.filter.manufacturerId")}</Label>
          <Input
            onChange={(e) => updateFilter("manufacturerId", e.target.value)}
            value={get(filters, "manufacturerId") || ""}
            block
          />
          <br />

          {/* updatedDateStart */}
          <Label block>{translate("catalog.filters.updatedDateStart")}</Label>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              onChange={(e) => updateFilter("updatedDateStart", e)}
              value={get(filters, "updatedDateStart") || ""}
              inputFormat={"dd/MM/yyyy"}
              block
              PopperProps={{
                disablePortal: true,
                style: {
                  zIndex: 9999,
                },
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  className="form-field date-picker-input"
                  variant="filled"
                  size="small"
                  hiddenLabel
                  fullWidth
                />
              )}
            />
          </LocalizationProvider>
          <br />
          <br />
          {/* updatedDateEnd */}
          <Label block>{translate("catalog.filters.updatedDateEnd")}</Label>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              onChange={(e) => updateFilter("updatedDateEnd", e)}
              value={get(filters, "updatedDateEnd") || ""}
              inputFormat={"dd/MM/yyyy"}
              block
              PopperProps={{
                disablePortal: true,
                style: {
                  zIndex: 9999,
                },
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  className="form-field date-picker-input"
                  variant="filled"
                  size="small"
                  hiddenLabel
                  fullWidth
                />
              )}
            />
          </LocalizationProvider>
          <br />
        </Col>
      </Row>

      {/* Filters actions */}
      <Padding top={4}>
        <Row>
          <Col col>
            <Button onClick={(e) => onReset()} secondary>
              {translate("catalog.filters.clearFilters")}
            </Button>
          </Col>
          <Col right col>
            <Button onClick={(e) => onCancel()} light>
              {translate("catalog.filters.cancel")}
            </Button>
            <Button onClick={onApplyHandler} primary shadow>
              {translate("catalog.filters.apply")}
            </Button>
          </Col>
        </Row>
      </Padding>
    </>
  );
};

export default withUser(withLocalization(VideoAdvancedFilters));
