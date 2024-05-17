import React, { Component } from "react";
import dotProps from "dot-prop-immutable";
import get from "lodash/get";
import find from "lodash/find";
import {
  Input,
  Row,
  Col,
  Label,
  Button,
  Select,
  Text
} from "cdm-ui-components";
import { importDetailDefaultFilters } from "./models";
import { withLocalization } from "common/redux/hoc/withLocalization";
import { getStatuses } from "./utils";
import { getIconForStatus } from "./Status";
import Textarea from "styled-components/textarea";

class ImportDetailFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      statuses: getStatuses()
    };
    this.updateFilter = this.updateFilter.bind(this);
  }

  updateFilter(key, value) {
    const { filters } = this.props;

    const { onSubmit } = this.props;

    onSubmit(dotProps.set(filters, `${key}`, value));
  }

  render() {
    const { statuses } = this.state;

    const { filters } = this.props;

    const { onSubmit, translate } = this.props;

    return (
      <>
        <Row>
          {/* Gtin */}
          <Col col>
            <Label>{translate("importReports.filters.gtin")}</Label>
            <Textarea
              value={get(filters, "gtins") || ""}
              onChange={e => this.updateFilter("gtins", e.target.value)}
              rows={1}
              block
            />
          </Col>

          {/* Title */}
          <Col col>
            <Label>{translate("importReports.filters.title")}</Label>
            <Input
              value={get(filters, "title") || ""}
              onChange={e => this.updateFilter("title", e.target.value)}
              block
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
              onClick={e => onSubmit(importDetailDefaultFilters())}
            >
              {translate("importReports.filters.clear")}
            </Button>
          </Col>
        </Row>
      </>
    );
  }
}

export default withLocalization(ImportDetailFilter);
