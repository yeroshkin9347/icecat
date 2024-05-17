import React, { Component } from "react";
import dotProps from "dot-prop-immutable";
import get from "lodash/get";
import find from "lodash/find";
import filter from "lodash/filter";
import keys from "lodash/keys";
import indexOf from "lodash/indexOf";
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
  getExportActionsForRetailer
} from "cdm-shared/services/statistics";
import { getManufacturerId } from "cdm-shared/redux/hoc/withUser";
import { fullSearch } from "cdm-shared/services/product";
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
      exportActions: [],
      manufacturers: []
    };
    this.updateFilter = this.updateFilter.bind(this);
  }

  componentDidMount() {

    const retailerId = getManufacturerId(this.props.getCurrentUser());

    getExportActionsForRetailer(retailerId).then(res =>
      this.setState({
        exportActions: map(get(res, "data", []), (r, k) =>
          Object.assign({}, { id: k, name: r })
        )
      })
    );

    fullSearch("en-GB")
    .then(res => {
      this.setState({
        manufacturers : get(res, "data.manufacturers")
      });
    });
  }

  updateFilter(key, value) {
    const { filters, groupByTradeItem } = this.props;

    const { onSubmit } = this.props;

    onSubmit(dotProps.set(filters, `${key}`, value), groupByTradeItem);
  }

  render() {
    const { exportActions, manufacturers } = this.state;
    const { filters, groupByTradeItem, user } = this.props;
    const { onSubmit, translate, currentParsedLocaleCode } = this.props;
    const datePickerFormat = getDatePickerFormatByLocale();

    return (
      <>
        <Row>
          {/* Date from */}
          <Col col>
            <Label>{translate("exportStatistics.filters.exportedFrom")}</Label>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                locale={currentParsedLocaleCode}
                inputFormat={datePickerFormat}
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
                inputFormat={datePickerFormat}
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

          {/* Ref */}
          <Col col>
            <Label>{translate("exportStatistics.filters.manufacturerCode")}</Label>
            <Input
              value={get(filters, "tradeItemManufacturerCode") || ""}
              onChange={e =>
                this.updateFilter("tradeItemManufacturerCode", e.target.value)
              }
              block
            />
          </Col>

            <Col col>
              <Label>{translate("exportStatistics.filters.suppliers")}</Label>
              <VirtualizedSelect
                simpleValue
                isMulti
                placeholder=""
                closeMenuOnSelect={false}
                value={filter(
                  keys(manufacturers),
                  m => indexOf(filters.manufacturers, m) !== -1
                )}
                onChange={v =>
                  this.updateFilter(
                    "manufacturers",
                    map(v, r => r)
                  )
                }
                options={keys(manufacturers)}
                classNamePrefix="cde-select"
                className="cde-select"
              />
            </Col>

            <Col col>
              <Label>{translate("exportStatistics.filters.retailerCode")}</Label>
              <Input
              value={get(filters, "tradeItemRetailerCode") || ""}
              onChange={e =>
                this.updateFilter("tradeItemRetailerCode", e.target.value)
              }
              block
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
