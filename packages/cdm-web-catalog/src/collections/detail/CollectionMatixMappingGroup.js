import { Button, Label, VirtualizedSelect } from "cdm-ui-components";
import React, { useEffect, useMemo, useState } from "react";
import CollectionMatixMappingForm from "./CollectionMatixMappingForm";
import { cloneDeep, filter, flattenDeep, get, groupBy, map } from "lodash";
import AutoMappingTable from "./AutoMappingTable";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { withLocalization } from "common/redux/hoc/withLocalization";
import { priceProperties } from "./constants/priceProperties";

const styleModal = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "8px",
};

const CollectionMatixMappingGroup = ({
  selectedMappingData,
  mappingGroups,
  mappingGroup,
  matrixAnalysis,
  onChangeMappingTabData,
  translate,
}) => {
  const [selectedMappingTab, setSelectedMappingTab] = useState(null);
  const [autoMappingVisible, setAutoMappingVisible] = useState(false);
  const sheetOptions = matrixAnalysis ? matrixAnalysis.file.sheets : [];

  useEffect(() => {
    if (!selectedMappingTab) {
      setSelectedMappingTab(get(sheetOptions, "0"));
    }
  }, [selectedMappingTab, sheetOptions]);

  const selectedMappingTabData = useMemo(() => {
    const mappingTabs = get(mappingGroup, "mappingTabs", []);
    if (selectedMappingTab) {
      const mappingTab = mappingTabs.find(
        (m) => m.sheetIndex === selectedMappingTab.sheetIndex
      );
      if (mappingTab) {
        return mappingTab;
      }
      return {
        id: null,
        mappingColumns: [],
        sheetIndex: selectedMappingTab.sheetIndex,
      };
    }

    return null;
  }, [mappingGroup, selectedMappingTab]);

  const onSave = (mapping) => {
    const existingMappingIdx = selectedMappingTabData.mappingColumns.findIndex(
      (m) => m.productIdentifier === mapping.productIdentifier
    );

    const newMappingTabData = cloneDeep(selectedMappingTabData);

    if (existingMappingIdx > -1) {
      newMappingTabData.mappingColumns[existingMappingIdx] = mapping;
    } else {
      newMappingTabData.mappingColumns = [
        ...newMappingTabData.mappingColumns,
        mapping,
      ];
    }
    onChangeMappingTabData(newMappingTabData);
  };

  const onDeleteMapping = (mapping) => {
    const newMappingTabData = cloneDeep(selectedMappingTabData);
    newMappingTabData.mappingColumns = newMappingTabData.mappingColumns.filter(
      (m) => m.productIdentifier !== mapping.productIdentifier
    );
    onChangeMappingTabData(newMappingTabData);
  };

  const onDeleteAllHandler = () => {
    const newMappingTabData = cloneDeep(selectedMappingTabData);
    newMappingTabData.mappingColumns = [];
    onChangeMappingTabData(newMappingTabData);
  };

  const prepareColumnsMapping = (tradeItemPropertiesMapping) => {
    return filter(
      map(tradeItemPropertiesMapping, (m) => {
        const propertyCode = get(m, "property.code");
        if (!propertyCode) return null;
        return {
          fileColumnIdentifier: get(m, "columnIdentifier"),
          fileColumnName: get(m, "columnName"),
          productIdentifier: propertyCode,
          mapName: propertyCode,
          mode: "Basic",
          code: null,
          transformer: null,
        };
      })
    );
  };

  return (
    <>
      <Label block>Sheet</Label>
      <div style={{ display: "flex" }}>
        <div className="select-mapping-tab">
          <VirtualizedSelect
            simpleValue
            placeholder=""
            isClearable
            value={selectedMappingTab}
            onChange={(val) => setSelectedMappingTab(val)}
            options={sheetOptions}
            getOptionLabel={(o) => get(o, "sheetName")}
            getOptionValue={(o) => get(o, "sheetIndex")}
            classNamePrefix="cde-select"
            className="cde-select react-select-full-height"
          />
        </div>

        <Button
          small
          primary
          onClick={() => setAutoMappingVisible(true)}
          style={{ marginRight: 0 }}
        >
          {translate("collections.autoMap")}
        </Button>
      </div>
      <br />
      {selectedMappingTabData && (
        <CollectionMatixMappingForm
          selectedMappingData={selectedMappingData}
          mappingTab={selectedMappingTabData}
          matrixAnalysis={matrixAnalysis}
          sheet={selectedMappingTab}
          onSave={onSave}
          onDelete={onDeleteMapping}
          onDeleteAll={onDeleteAllHandler}
        />
      )}

      <Modal
        md
        open={autoMappingVisible}
        style={{ zIndex: 99999, borderRadius: 4 }}
      >
        <Box sx={styleModal}>
          {autoMappingVisible && (
            <AutoMappingTable
              onAutoMap={(tradeItemPropertiesMapping) => {
                const newMappingTabData = cloneDeep(selectedMappingTabData);
                newMappingTabData.mappingColumns = prepareColumnsMapping(
                  tradeItemPropertiesMapping
                );
                onChangeMappingTabData(newMappingTabData);
                setAutoMappingVisible(false);
              }}
              onCancel={() => setAutoMappingVisible(false)}
              groupIndex={0}
              tabIndex={selectedMappingTab.sheetIndex}
              tabName={selectedMappingTab.sheetName}
              columns={selectedMappingTab.columns}
              tradeItemProperties={priceProperties.map((p) => ({
                code: p,
              }))}
              mappedColumns={groupBy(
                flattenDeep(
                  map(mappingGroups, (group) =>
                    map(get(group, "mappingTabs"), (sheet) =>
                      map(get(sheet, "mappingColumns", []), (col) => {
                        return {
                          groupIndex: group.groupIndex,
                          groupName: group.groupName,
                          sheetIndex: sheet.sheetIndex,
                          ...col,
                        };
                      })
                    )
                  )
                ),
                (o) => get(o, "fileColumnIdentifier")
              )}
            />
          )}
        </Box>
      </Modal>
    </>
  );
};

export default withLocalization(CollectionMatixMappingGroup);
