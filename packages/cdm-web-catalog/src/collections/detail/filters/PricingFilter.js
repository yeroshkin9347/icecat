import React, { useEffect, useState } from "react";
import { Label, Input, VirtualizedSelect, Row, Col } from "cdm-ui-components";
import useInputTextDebounce from "cdm-shared/hook/useInputTextDebounce";
import { getRetailersAllLight } from "cdm-shared/services/retailer";

const CollectionPriceFilters = ({
  translate,
  filters = {},
  setFilterField,
}) => {
  const [gtin, gtinDebounced, setGtin] = useInputTextDebounce();
  const [manufacturerRef, manufacturerRefDebounced, setManufacturerRef] =
    useInputTextDebounce();
  const [retailers, setRetailers] = useState([]);

  useEffect(() => {
    setFilterField("gtin", gtinDebounced);
  }, [gtinDebounced]);

  useEffect(() => {
    setFilterField("manufacturerCode", manufacturerRef);
  }, [manufacturerRefDebounced]);

  useEffect(() => {
    getRetailersAllLight().then((res) => {
      if (res.status === 200) {
        setRetailers(res.data);
      }
    });
  }, []);

  return (
    <Row>
      {/* gtin */}
      <Col col={3}>
        <Label block>{translate("collections.filters.gtin")}</Label>
        <Input onChange={(e) => setGtin(e.target.value)} value={gtin} block />
      </Col>
      {/* title */}

      <Col col={3}>
        <Label block>{translate("collections.filters.manufacturerRef")}</Label>
        <Input
          value={manufacturerRef}
          onChange={(e) => setManufacturerRef(e.target.value)}
          block
        />
      </Col>

      {/* Retailers */}
      <Col col={3}>
        <Label block>{translate("collections.filters.retailers")}</Label>
        <VirtualizedSelect
          simpleValue
          placeholder=""
          isClearable
          isMulti
          value={filters.retailerCode}
          onChange={(val) => setFilterField("retailerCodes", val)}
          options={retailers}
          getOptionLabel={(option) => option.name}
          getOptionValue={(option) => option.code}
          classNamePrefix="cde-select"
          className="cde-select react-select-full-height"
        />
      </Col>

      <Col col={3}>
        <div
          style={{
            display: "inline-flex",
            flexDirection: "column",
            alignItems: "center",
            height: "100%",
          }}
        >
          <Label htmlFor="incomplete-pricing" block>
            Incomplete pricing
          </Label>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "100%",
            }}
          >
            <Input
              id="incomplete-pricing"
              type="checkbox"
              checked={filters.incompletePricing}
              onChange={(e) => {
                setFilterField("incompletePricing", e.target.checked);
              }}
              style={{ height: "20px", width: "20px" }}
            />
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default CollectionPriceFilters;
