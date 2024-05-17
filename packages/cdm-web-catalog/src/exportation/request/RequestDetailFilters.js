import React, { useState, useEffect, useMemo, useCallback } from "react";
import get from "lodash/get";
import find from "lodash/find";
import {
  Row,
  Col,
  Label,
  Select,
  Button,
  Input,
  VirtualizedSelect
} from "cdm-ui-components";
import { MATCHING_STATUS } from "./reducer";
import { getAllManufacturers } from "cdm-shared/services/manufacturer";

const RequestDetailFilters = ({
  filters,
  // functions
  dispatch,
  translate
}) => {
  const [manufacturers, setManufacturers] = useState([]);

  // memoized values
  const selectedManufacturer = useMemo(
    () =>
      filters.manufacturerId
        ? find(manufacturers, m => get(m, "id") === filters.manufacturerId)
        : null,
    [manufacturers, filters.manufacturerId]
  );
  const translateEnum = useCallback(val => translate(`export.enum.${val}`), [
    translate
  ]);

  // on component mount
  useEffect(() => {
    getAllManufacturers().then(res => setManufacturers(get(res, "data") || []));
  }, []);

  return (
    <>
      <Row>
        {/* Gtin */}
        <Col col={2}>
          <Label block>{translate("export.requestdetail.gtin")}</Label>
          <Input
            block
            value={filters.gtin || ""}
            onChange={e =>
              dispatch({
                type: "setFilter",
                key: "gtin",
                value: e.target.value || null
              })
            }
          />
        </Col>

        {/* manufacturerReference */}
        <Col col={2}>
          <Label block>
            {translate("export.requestdetail.manufacturerReference")}
          </Label>
          <Input
            block
            value={filters.manufacturerReference || ""}
            onChange={e =>
              dispatch({
                type: "setFilter",
                key: "manufacturerReference",
                value: e.target.value || null
              })
            }
          />
        </Col>

        {/* manufacturerId */}
        <Col col={3}>
          <Label block>
            {translate("export.requestdetail.manufacturerName")}
          </Label>
          <VirtualizedSelect
            isClearable={true}
            value={selectedManufacturer}
            onChange={o =>
              dispatch({
                type: "setFilter",
                key: "manufacturerId",
                value: o ? get(o, "id") : null
              })
            }
            getOptionValue={o => get(o, "id")}
            getOptionLabel={o => get(o, "name")}
            options={manufacturers}
            classNamePrefix="cde-select"
            className="cde-select"
          />
        </Col>

        {/* matchingStatus */}
        <Col col={2}>
          <Label block>
            {translate("export.requestdetail.matchingStatus")}
          </Label>
          <Select
            isClearable={true}
            value={filters.matchingStatus}
            onChange={values =>
              dispatch({
                type: "setFilter",
                key: "matchingStatus",
                value: values || []
              })
            }
            simpleValue
            getOptionLabel={translateEnum}
            isMulti
            options={MATCHING_STATUS}
            closeMenuOnSelect={false}
          />
        </Col>

        <Col col={3} right>
          <Label block>&nbsp;</Label>

          {/* Clear filter */}
          <Button
            noMargin
            onClick={e => dispatch({ type: "resetFilters" })}
            secondary
            small
          >
            {translate("export.requestdetail.clear")}
          </Button>
        </Col>
      </Row>
    </>
  );
};

export default RequestDetailFilters;
