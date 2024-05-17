import React, { useEffect, useMemo, useState } from "react";

import {
  Button,
  Col,
  Label,
  Padding,
  Row,
  Text,
  VirtualizedSelect,
} from "cdm-ui-components";
import { get } from "lodash";
import styled from "styled-components";
import { TradeItemTransformationWrapper } from "cdm-shared/component/matrixMapping/transformers/index";
import { withLocalization } from "common/redux/hoc/withLocalization";
import { getValuesByPropertyCode } from "cdm-shared/services/tradeItemProperties";
import { priceProperties } from "./constants/priceProperties";
import { IconButton } from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";

const StyledPropertyText = styled.div`
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden !important;
  text-overflow: ellipsis;
  text-align: left;
`;

const CollectionMatixMappingForm = ({
  selectedMappingData,
  mappingTab = {},
  sheet = {},
  onSave,
  onDelete,
  translate,
}) => {
  const [visibleForm, setVisibleForm] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [selectedColumn, setSelectedColumn] = useState(null);
  const [transformer, setTransformer] = useState(null);
  const [tradeItemProperty, setTradeItemProperty] = useState(null);

  const taxonomyId = useMemo(() => {
    if (selectedMappingData) {
      return selectedMappingData.taxonomyId;
    }
    return null;
  }, [selectedMappingData]);

  let columns = [];
  if (sheet) {
    columns = (sheet.columns || []).sort ((a, b) => {
      if (a.columnName < b.columnName) {
        return -1;
      }
      if (a.columnName > b.columnName) {
        return 1;
      }
      return 0;
    });
  }

  const mappingColumns = mappingTab ? mappingTab.mappingColumns : [];

  const onMappingClick = (mapping) => {
    setVisibleForm(true);
    setSelectedProperty(mapping.productIdentifier);
    setSelectedColumn({
      columnIdentifier: mapping.fileColumnIdentifier,
      columnName: mapping.fileColumnName,
    });
    setTransformer(mapping.transformer);
  };

  const onAddNewMapping = () => {
    setVisibleForm(true);
    resetForm();
  };

  const resetForm = () => {
    setSelectedProperty(null);
    setSelectedColumn(null);
    setTransformer(null);
    setTradeItemProperty(null);
  };

  useEffect(() => {
    if (selectedProperty && selectedColumn) {
      const newMapping = {
        productIdentifier: selectedProperty,
        fileColumnIdentifier: selectedColumn.columnIdentifier,
        fileColumnName: selectedColumn.columnName,
        mapName: selectedProperty,
        mode: "Basic",
        transformer,
      };
      onSave(newMapping);
    }
  }, [selectedProperty, selectedColumn, transformer]);

  useEffect(() => {
    setTradeItemProperty(null);
    if (selectedProperty && taxonomyId) {
      getValuesByPropertyCode(taxonomyId, selectedProperty).then((res) => {
        setTradeItemProperty(res.data);
      });
    }
  }, [taxonomyId, selectedProperty]);

  return (
    <div>
      <div>
        <Row>
          <Col col={4}>
            <Button small primary className="mb-2" onClick={onAddNewMapping}>
              + {translate("collections.newMaping")}
            </Button>
            <Padding bottom={2} />
            {(mappingColumns || []).map((mapping) => (
              <div
                key={mapping.productIdentifier}
                className="mb-3"
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <IconButton
                  color="error"
                  size="large"
                  aria-label="Delete property"
                  sx={{
                    padding: 0.5,
                  }}
                  className="mr-2"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onDelete(mapping);
                    resetForm();
                    setVisibleForm(false);
                  }}
                >
                  <DeleteIcon fontSize="medium" />
                </IconButton>

                <Button
                  small
                  secondary={mapping.productIdentifier === selectedProperty}
                  light={mapping.productIdentifier !== selectedProperty}
                  onClick={() => onMappingClick(mapping)}
                  style={{ display: "flex", flex: 1 }}
                >
                  <StyledPropertyText>{mapping.mapName}</StyledPropertyText>
                </Button>
              </div>
            ))}
          </Col>
          {visibleForm && (
            <Col col={8}>
              <Label block>{translate("collections.property")}</Label>
              <VirtualizedSelect
                simpleValue
                placeholder=""
                isClearable
                value={selectedProperty}
                onChange={(val) => {
                  const existingMapping = mappingColumns.find(
                    (m) => m.productIdentifier === val
                  );
                  if (existingMapping) {
                    onMappingClick(existingMapping);
                  } else {
                    setSelectedProperty(val);
                    setTransformer(null);
                    setSelectedColumn(null);
                    setTradeItemProperty(null);
                  }
                }}
                options={priceProperties}
                classNamePrefix="cde-select"
                className="cde-select react-select-full-height"
                menuPlacement="top"
              />
              <br />
              <Label block>{translate("collections.collumn")}</Label>
              <VirtualizedSelect
                simpleValue
                placeholder=""
                isClearable
                value={selectedColumn}
                onChange={(val) => setSelectedColumn(val)}
                options={columns}
                getOptionLabel={(o) =>
                  `(${get(o, "columnIdentifier")}) ${get(o, "columnName")}`
                }
                classNamePrefix="cde-select"
                className="cde-select react-select-full-height"
                menuPlacement="top"
              />
              <br />
              <Label block>{translate("collections.transformations")}</Label>
              <div style={{ marginBottom: "20px" }}>
                {tradeItemProperty ? (
                  <TradeItemTransformationWrapper
                    tradeItemProperty={tradeItemProperty}
                    value={transformer}
                    onChange={(transformer) => setTransformer(transformer)}
                  />
                ) : (
                  <>
                    <Text gray italic small>
                      {translate("collections.selectPropertyForTransformation")}
                    </Text>
                  </>
                )}
              </div>
              <br />
            </Col>
          )}
        </Row>
      </div>
    </div>
  );
};

export default withLocalization(CollectionMatixMappingForm);
