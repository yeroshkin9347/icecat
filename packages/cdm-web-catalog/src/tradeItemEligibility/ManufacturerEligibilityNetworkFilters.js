import React, {
  useCallback,
  useState,
  useMemo,
  useEffect,
  useRef
} from "react";
import find from "lodash/find";
import get from "lodash/get";
import {
  Row,
  Col,
  Label,
  Select,
  Input,
  VirtualizedSelect
} from "cdm-ui-components";
import { TRADE_ITEM_ELIGIBILITY_STATUSES } from "./reducer";
import { getPreComputingActionsForManufacturer } from "cdm-shared/services/export";
import { getRetailersForManufacturer } from "cdm-shared/services/retailer";
import { getConnectors } from "cdm-shared/services/subscription";
import { getCollectionsForManufacturer } from "cdm-shared/services/collection";

const ManufacturerEligibilityNetworkFilters = ({
  filters,
  manufacturerId,
  // functions
  dispatch,
  translate,
  currentLocaleCode
}) => {
  // refs
  const translateFn = useRef(translate);

  // state
  const [retailers, setRetailers] = useState([]);
  const [connectors, setConnectors] = useState([]);
  const [exportActions, setExportActions] = useState([]);
  const [collections, setCollections] = useState([]);

  // memoized functions
  const selectedRetailer = useMemo(
    () =>
      filters.retailerId
        ? find(retailers, m => get(m, "id") === filters.retailerId)
        : null,
    [retailers, filters.retailerId]
  );
  const selectedConnector = useMemo(
    () =>
      filters.connectorId
        ? find(connectors, m => get(m, "connectorId") === filters.connectorId)
        : null,
    [connectors, filters.connectorId]
  );
  const selectedExportAction = useMemo(
    () =>
      filters.exportActionId
        ? find(exportActions, m => get(m, "id") === filters.exportActionId)
        : null,
    [exportActions, filters.exportActionId]
  );
  const selectedCollection = useMemo(
    () =>
      filters.collectionId
      ? find(collections, m => get(m, "id") === filters.collectionId)
      : null,
      [collections, filters.collectionId]
  );

  const translateEnum = useCallback(
    val => translate(`tradeItemEligibility.common.${val}`),
    [translate]
  );

  // on translate fn changed
  useEffect(() => {
    translateFn.current = translate;
  }, [translate]);

  // on component mount
  useEffect(() => {
    // get all retailers
    getRetailersForManufacturer().then(res =>
      setRetailers((get(res, "data") || []).sort((a, b) => a.name.localeCompare(b.name)))
    );
    //get all connectors
    getConnectors(currentLocaleCode).then(res =>
      {
        const connectors = get(res, "data").map(c => c.values);
        const connectorsList = [].concat(...connectors);
        setConnectors((connectorsList || [])
          .filter(item => item.connectorName)
          .sort((a, b) => a.connectorName.localeCompare(b.connectorName)));
      }
    );
    // get all collections for manufacturer
    getCollectionsForManufacturer().then(res => {
      setCollections((get(res, "data") || []).sort((a, b) => a.name.localeCompare(b.name)));
    });
    // get all precomputing export actions
    getPreComputingActionsForManufacturer().then(res =>
      setExportActions((get(res, "data") || []).sort((a, b) => a.name.localeCompare(b.name)))
    );
  }, [manufacturerId]);

  return (
    <>
      <Row>
        {/* tradeItemEligibilityStatus */}
        <Col col={2}>
          <Label block>
            {translate(
              "tradeItemEligibility.common.tradeItemEligibilityStatus"
            )}
          </Label>
          <Select
            hideSelectedOptions={true}
            isClearable={true}
            value={filters.tradeItemEligibilityStatus}
            onChange={values =>
              dispatch({
                type: "setFilter",
                key: "tradeItemEligibilityStatus",
                value: values || []
              })
            }
            simpleValue
            getOptionLabel={translateEnum}
            isMulti
            options={TRADE_ITEM_ELIGIBILITY_STATUSES}
            closeMenuOnSelect={false}
            classNamePrefix="cde-select"
            className="cde-select"
          />
        </Col>

        {/* retailerId */}
        <Col col={2}>
          <Label block>
            {translate("tradeItemEligibility.common.retailerId")}
          </Label>
          <VirtualizedSelect
            isClearable={true}
            value={selectedRetailer}
            onChange={o =>
              dispatch({
                type: "setFilter",
                key: "retailerId",
                value: o ? get(o, "id") : null
              })
            }
            getOptionValue={o => get(o, "id")}
            getOptionLabel={o => get(o, "name")}
            options={retailers}
            classNamePrefix="cde-select"
            className="cde-select"
          />
        </Col>

        {/* connectorId */}
        <Col col={2}>
          <Label block>
            {translate("tradeItemEligibility.common.connectorId")}
          </Label>
          <VirtualizedSelect
            isClearable={true}
            value={selectedConnector}
            onChange={o =>
              dispatch({
                type: "setFilter",
                key: "connectorId",
                value: o ? get(o, "id") : null
              })
            }

            getOptionValue={o => get(o, "connectorId")}
            getOptionLabel={o => get(o, "connectorName")}
            options={connectors}
            classNamePrefix="cde-select"
            className="cde-select"
          />
        </Col>

        {/* exportActionId */}
        <Col col={2}>
          <Label block>
            {translate("tradeItemEligibility.common.exportActionId")}
          </Label>
          <VirtualizedSelect
            isClearable={true}
            value={selectedExportAction}
            onChange={o =>
              dispatch({
                type: "setFilter",
                key: "exportActionId",
                value: o ? get(o, "id") : null
              })
            }
            getOptionValue={o => get(o, "id")}
            getOptionLabel={o => get(o, "name")}
            options={exportActions}
            classNamePrefix="cde-select"
            className="cde-select"
          />
        </Col>

        {/* gtin */}
        <Col col={1}>
          <Label block>{translate("tradeItemEligibility.common.gtin")}</Label>
          <Input
            block
            type="text"
            value={filters.gtin || ""}
            onChange={e =>
              dispatch({
                type: "setFilter",
                key: "gtin",
                value: e.currentTarget.value || null
              })
            }
          />
        </Col>

        {/* tradeItemManufacturerCode */}
        <Col col={1}>
          <Label block>
            {translate("tradeItemEligibility.common.tradeItemManufacturerCode")}
          </Label>
          <Input
            block
            type="text"
            value={filters.tradeItemManufacturerCode || ""}
            onChange={e =>
              dispatch({
                type: "setFilter",
                key: "tradeItemManufacturerCode",
                value: e.currentTarget.value || null
              })
            }
          />
        </Col>

        {/* Actions */}
        <Col col={2}>
          <Label block>
            {translate("tradeItemEligibility.common.collection")}
          </Label>
          <VirtualizedSelect
            hideSelectedOptions={true}
            value={selectedCollection}
            onChange={o =>
              dispatch({
                type: "setFilter",
                key: "collectionId",
                value: o ? get(o, "id ") : null
              })
            }
            getOptionValue={o => get(o, "id")}
            getOptionLabel={o => get(o, "name")}
            options={collections}
            isClearable={true}
            classNamePrefix="cde-select"
            className="cde-select"
          />
        </Col>
      </Row>
    </>
  );
};

export default ManufacturerEligibilityNetworkFilters;
