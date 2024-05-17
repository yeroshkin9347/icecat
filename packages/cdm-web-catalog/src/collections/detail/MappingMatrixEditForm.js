import React from "react";
import { Row, Col } from "cdm-ui-components";
import CollectionMatixMappingGroup from "./CollectionMatixMappingGroup";

const MappingMatrixEditForm = ({
  selectedMappingData,
  onChangeMappingTabData,
  matrixAnalysis,

  selectedMappingGroup,
}) => {
  const onChangeMappingTabDataHandler = (mappingGroup) => {
    onChangeMappingTabData(mappingGroup);
  };

  return (
    <Row>
      <Col col={12}>
        <>
          {!!selectedMappingData && (
            <>
              <CollectionMatixMappingGroup
                selectedMappingData={selectedMappingData}
                mappingGroups={selectedMappingData.mappingGroups}
                matrixAnalysis={matrixAnalysis}
                mappingGroup={selectedMappingGroup}
                onChangeMappingTabData={onChangeMappingTabDataHandler}
              />
            </>
          )}
        </>
      </Col>
    </Row>
  );
};

export default MappingMatrixEditForm;
