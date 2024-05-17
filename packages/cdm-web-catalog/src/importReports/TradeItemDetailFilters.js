import React, { Component } from "react";
import dotProps from "dot-prop-immutable";
import get from "lodash/get";
import find from "lodash/find";
import {
  Row,
  Col,
  Label,
  Button,
  Select,
  Text,
  VirtualizedSelect
} from "cdm-ui-components";
import { importTradeItemStatusDefaultFilters } from "./models";
import { withLocalization } from "common/redux/hoc/withLocalization";
import { getStatuses } from "./utils";
import { getIconForStatus } from "./Status";
import {
  getPropertyGroups,
  getByTradeItemCategoryAndGroup
} from "cdm-shared/services/tradeItemProperties";

class TradeItemDetailFilters extends Component {
  constructor(props) {
    super(props);
    this.state = {
      statuses: getStatuses(),
      groups: [],
      currentGroup: null,
      tradeItemProperties: [],
      tradeItemTitle: null,
      tradeItemGtin: null,
      tradeItemRef: null
    };
    this.updateFilter = this.updateFilter.bind(this);
  }

  componentDidMount() {
    getPropertyGroups().then(res => this.setState({ groups: res.data }));
    this.setGroup("Marketing");
  }

  setGroup(group) {
    const { importJob } = this.props;

    this.setState({ currentGroup: group });

    if (group === null) {
      this.setState({ tradeItemProperties: [] });
    } else {
      getByTradeItemCategoryAndGroup(
        get(importJob, "taxonomyId"),
        get(importJob, "tradeItemCategory.code"),
        group
      ).then(res =>
        this.setState({ tradeItemProperties: res.data })
      );
    }
  }

  updateFilter(key, value) {
    const { filters, importJob } = this.props;

    const { onSubmit } = this.props;

    let v = value;

    if (key === "tradeItemProperty" && value !== null) {
      const { currentGroup } = this.state;
      v = {
        tradeItemPropertyId: value.id,
        scope: get(importJob, "scope"),
        group: currentGroup
      };
    }

    onSubmit(dotProps.set(filters, `${key}`, v));
  }

  render() {
    const { statuses, groups, currentGroup, tradeItemProperties } = this.state;

    const { filters } = this.props;

    const { onSubmit, translate } = this.props;

    return (
      <>
        <Row>
          {/* Group */}
          <Col col>
            <Label>{translate("importReports.filters.group")}</Label>
            <Select
              hideSelectedOptions={true}
              simpleValue
              placeholder=""
              value={currentGroup}
              onChange={group => this.setGroup(group ? group : null)}
              options={groups}
              classNamePrefix="cde-select"
              className="cde-select"
            />
          </Col>

          {/* Trade item properties */}
          <Col col>
            <Label>{translate("importReports.filters.property")}</Label>
            <VirtualizedSelect
              isClearable={true}
              getOptionLabel={o =>
                translate(`tradeItemProperties.properties.${get(o, "code")}`)
              }
              getOptionValue={o => o.id}
              placeholder=""
              value={
                get(filters, "tradeItemProperty") === null
                  ? null
                  : find(
                      tradeItemProperties,
                      s => s.id === get(filters, "tradeItemProperty")
                    )
              }
              onChange={val =>
                this.updateFilter("tradeItemProperty", val ? val : null)
              }
              options={tradeItemProperties}
              classNamePrefix="cde-select"
              className="cde-select"
            />
          </Col>

          {/* Statuses */}
          <Col col>
            <Label>{translate("importReports.filters.status")}</Label>
            <Select
              hideSelectedOptions={true}
              isClearable={true}
              getOptionLabel={o => (
                <>
                  {getIconForStatus(o.value)} &nbsp;
                  <Text
                    style={{ verticalAlign: "top", paddingTop: "3px" }}
                    inline
                  >
                    {translate(`importReports.filters.${o.label}`)}
                  </Text>
                </>
              )}
              getOptionValue={o => o.value}
              placeholder=""
              value={find(statuses, s => s.value === get(filters, "status"))}
              onChange={val =>
                this.updateFilter("status", val ? val.value : null)
              }
              options={statuses}
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
              onClick={e => onSubmit(importTradeItemStatusDefaultFilters())}
            >
              {translate("importReports.filters.clear")}
            </Button>
          </Col>
        </Row>
      </>
    );
  }
}

export default withLocalization(TradeItemDetailFilters);
