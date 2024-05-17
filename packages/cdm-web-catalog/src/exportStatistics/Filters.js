import React, { Component } from "react";
import dotProps from "dot-prop-immutable";
import get from "lodash/get";
import find from "lodash/find";
import filter from "lodash/filter";
import map from "lodash/map";
import {
  Input,
  Row,
  Col,
  Label,
  Button,
  VirtualizedSelect,
  Margin
} from "cdm-ui-components";
import { defaultFilters } from "./models";
import withUser from "cdm-shared/redux/hoc/withUser";
import { withLocalization } from "common/redux/hoc/withLocalization";
import {
  getExportedRetailersForManufacturer,
  getExportActionsForManufacturer
} from "cdm-shared/services/statistics";
import { getManufacturerId } from "cdm-shared/redux/hoc/withUser";
import { DatePicker } from "@mui/lab";
import TextField from '@mui/material/TextField';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import dayjs from "dayjs";
import { getDatePickerFormatByLocale } from "cdm-shared/redux/localization";

class Filters extends Component {
  constructor(props) {
    super(props);
    this.state = {
      retailers: [],
      exportActions: []
    };
    this.updateFilter = this.updateFilter.bind(this);
  }

  componentDidMount() {
    const manufacturerId = getManufacturerId(this.props.getCurrentUser());
    getExportedRetailersForManufacturer(manufacturerId).then(res =>
      this.setState({
        retailers: map(get(res, "data", []), (r, k) =>
          Object.assign({}, { id: r.retailerId, name: r.retailerName })
        ).sort((a, b) => a.name.localeCompare(b.name))
      })
    );
    getExportActionsForManufacturer().then(res =>
      this.setState({
        exportActions: get(res, "data", []).sort((a, b) => a.name.localeCompare(b.name))
      })
    );
  }

  updateFilter(key, value) {
    const { filters, groupByTradeItem } = this.props;

    const { onSubmit } = this.props;

    onSubmit(dotProps.set(filters, `${key}`, value), groupByTradeItem);
  }

  render() {
    const { retailers, exportActions } = this.state;

    const { filters, groupByTradeItem, user } = this.props;

    const { onSubmit, translate, currentParsedLocaleCode } = this.props;

    const inputFormat = getDatePickerFormatByLocale();

    return (
      <>
        <Row>
          {/* Date from */}
          <Col col>
            <Label>{translate("exportStatistics.filters.exportedFrom")}</Label>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                locale={currentParsedLocaleCode}
                inputFormat={inputFormat}
                onChange={d =>
                  this.updateFilter(
                    "exportedTimestampFrom",
                    d ? dayjs(d).format("YYYY-MM-DD") : null
                  )
                }
                value={get(filters, "exportedTimestampFrom")}
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

          {/* Date to */}
          <Col col>
            <Label>{translate("exportStatistics.filters.exportedTo")}</Label>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                locale={currentParsedLocaleCode}
                inputFormat={inputFormat}
                onChange={d =>
                  this.updateFilter(
                    "exportedTimestampTo",
                    d ? dayjs(d).format("YYYY-MM-DD") : null
                  )
                }
                value={get(filters, "exportedTimestampTo")}
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

          {/* Gtin */}
          <Col col>
            <Label>{translate("exportStatistics.filters.gtin")}</Label>
            <Input
              value={get(filters, "gtin") || ""}
              onChange={e => this.updateFilter("gtin", e.target.value)}
              block
            />
          </Col>

          {/* Retailers */}
          <Col col>
            <Label>{translate("exportStatistics.filters.retailers")}</Label>
            <VirtualizedSelect
              getOptionLabel={o => o.name}
              getOptionValue={o => o.id}
              isMulti
              placeholder=""
              closeMenuOnSelect={false}
              value={filter(retailers, ret =>
                find(get(filters, "retailerIds", []), id => ret.id === id)
              )}
              onChange={val =>
                this.updateFilter(
                  "retailerIds",
                  val ? map(val, v => v.id) : null
                )
              }
              options={retailers}
              classNamePrefix="cde-select"
              className="cde-select"
            />
          </Col>

          {/* Actions */}
          <Col col>
            <Label>{translate("exportStatistics.filters.actions")}</Label>
            <VirtualizedSelect
              getOptionLabel={o => o.name}
              getOptionValue={o => o.id}
              isMulti
              placeholder=""
              closeMenuOnSelect={false}
              value={filter(exportActions, ret =>
                find(
                  get(filters, "exportPreComputedTradeItemActionIds", []),
                  id => ret.id === id
                )
              )}
              onChange={val =>
                this.updateFilter(
                  "exportPreComputedTradeItemActionIds",
                  val ? map(val, v => v.id) : null
                )
              }
              options={exportActions}
              classNamePrefix="cde-select"
              className="cde-select"
            />
          </Col>

          {/* Remove filters */}
          <Col col>
            <Label block>&nbsp;</Label>
            <Button
              secondary
              small
              block
              onClick={e => onSubmit(defaultFilters(user), false)}
            >
              {translate("exportStatistics.filters.clear")}
            </Button>
          </Col>
        </Row>

        <Margin bottom={4} />

        <Row>
          {/* Group by trade item */}
          <Col col>
            <Label htmlFor="group-by-trade-item">
              {translate("exportStatistics.filters.groupByProduct")}
            </Label>
            &nbsp;&nbsp;
            <Input
              id="group-by-trade-item"
              type="checkbox"
              checked={groupByTradeItem}
              onChange={e => onSubmit(filters, !!e.target.checked)}
            />
          </Col>
        </Row>
      </>
    );
  }
}

export default withUser(withLocalization(Filters));
