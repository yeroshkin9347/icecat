import {
  Button,
  Label,
  Margin,
  Row,
  Text,
  UploadZone,
  VirtualizedSelect,
} from "cdm-ui-components";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { getMappingById } from "cdm-shared/services/maxtrixMapping";
import { get, join } from "lodash";
import "./index.css";
import { getManufacturerEntitiesByManufacturerIdCatalog } from "cdm-shared/services/manufacturer";
import withUser, { getManufacturerId } from "cdm-shared/redux/hoc/withUser";
import { importCollectionPricing } from "cdm-shared/services/collection";
import Dropzone from "react-dropzone";
import ManufacturerEntityNew from "./ManufacturerEntityNew";
import ButtonMui from "@mui/material/Button";
import { IMPORT_FILE_TYPES_ACCEPTED } from "cdm-shared/constants/importCollection";
import { withLocalization } from "common/redux/hoc/withLocalization";
import LoaderOverlay from "cdm-shared/component/LoaderOverlay";
import { PRIMARY } from "cdm-shared/component/color";
import {
  ModalStyled,
  ModalTitleStyled,
} from "cdm-shared/component/styled/modal/ModalStyled";
import styled from "styled-components";
import CollectionImportStarted from "./CollectionImportStarted";

const Container = styled.div`
  padding-bottom: 40px;
`;

const StickyFooterRow = styled(Row)`
  position: absolute;
  width: 100%;
  bottom: 0;
  right: 0;
  z-index: 1000;
  display: flex;
  justify-content: flex-end;
  margin: 0;
  padding-bottom: 2rem;
  padding-right: 2rem;
  background-color: #fff;
`;

const FlexSpaceBetween = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CloseButton = styled(Button)`
  margin-right: 0;
`;

export const isStandardMapping = (mapping) =>
  get(mapping, "discriminator", null) === "StandardMappingViewModel";

const CollectionMatixMapping = ({
  user,
  collection,
  onClose,
  onImportSuccess,

  translate,
}) => {
  const [selectedMappingId, setSelectedMappingId] = useState(null);
  const [selectedMappingData, setSelectedMappingData] = useState(null);

  const [loadingImport, setLoadingImport] = useState(false);
  const [importSuccess, setImportSuccess] = useState(false);

  const [manufacturerEntityId, setManufacturerEntityId] = useState(null);
  const [manufacturerEntities, setManufacturerEntities] = useState([]);

  const [manufacturerEntityNewVisible, setManufacturerEntityNewVisible] =
    useState(false);

  const [importStarted, setImportStarted] = useState(false);

  const fetchMappingById = useCallback((mappingId) => {
    getMappingById(mappingId).then(async (res) => {
      if (res.status === 200) {
        const mapping = res.data;
        setSelectedMappingData(mapping);
      }
    });
  }, []);

  useEffect(() => {
    if (selectedMappingId) {
      fetchMappingById(selectedMappingId);
    } else {
      setSelectedMappingData(null);
    }
  }, [fetchMappingById, selectedMappingId]);

  useEffect(() => {
    const matrixMappingId = get(
      manufacturerEntityId,
      "importSettings.matrixMappingId"
    );
    setSelectedMappingId(matrixMappingId || null);
  }, [manufacturerEntityId]);

  const fetchManufacturerEntities = useCallback(
    (preSelectedManufacturerEntityId) => {
      getManufacturerEntitiesByManufacturerIdCatalog(
        getManufacturerId(user)
      ).then((res) => {
        if (res.status === 200) {
          const sortedData = (res.data || []).sort((a, b) =>
            a.name.localeCompare(b.name)
          );
          setManufacturerEntities(sortedData);
          if (preSelectedManufacturerEntityId) {
            const preSelectedManufacturerEntity = res.data.find(
              (e) => e.id === preSelectedManufacturerEntityId
            );
            setManufacturerEntityId(preSelectedManufacturerEntity);
          }
        }
      });
    },
    [user]
  );

  useEffect(() => {
    fetchManufacturerEntities();
  }, [fetchManufacturerEntities]);

  const importPrice = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (importFile && collection && manufacturerEntityId) {
      setLoadingImport(true);
      importCollectionPricing(
        get(collection, "code"),
        manufacturerEntityId.id,
        importFile
      )
        .then((res) => {
          if (res.status === 200) {
            setLoadingImport(false);
            setImportSuccess(true);
            setImportStarted(true);
          } else {
            setImportSuccess(false);
          }
        })
        .catch(() => setLoadingImport(false));
    }
  };
  const [importFile, setImportFile] = useState(null);

  const isEnableRunImport = useMemo(() => {
    return !!importFile && !!manufacturerEntityId;
  }, [importFile, manufacturerEntityId]);

  return (
    <>
      {loadingImport && <LoaderOverlay />}

      {importStarted && (
        <ModalStyled sm>
          <CollectionImportStarted />
        </ModalStyled>
      )}

      {!importStarted && (
        <ModalStyled md style={{ overflow: "visible" }}>
          <Container>
            <div>
              <ModalTitleStyled>
                {translate("collections.importPrice")}
              </ModalTitleStyled>

              {loadingImport ? (
                <Row
                  style={{
                    height: "240px",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                  }}
                >
                  <Text primary style={{ marginBottom: "16px" }}>
                    {translate("collections.importing")}...
                  </Text>
                </Row>
              ) : (
                <Dropzone
                  onDrop={(accepted, rejected) =>
                    setImportFile(get(accepted, "[0]", null))
                  }
                  maxSize={100000000} // 100Mo
                  accept={join(IMPORT_FILE_TYPES_ACCEPTED, ", ")}
                >
                  {({
                    getRootProps,
                    getInputProps,
                    isDragActive,
                    isDragReject,
                  }) => {
                    return (
                      <UploadZone
                        style={{
                          height: "180px",
                          marginBottom: "20px",
                          padding: "20px",
                          justifyContent: "center",
                          alignItems: "center",
                          display: "flex",
                          flexDirection: "column",
                        }}
                        borderRadius
                        isDragActive={isDragActive}
                        isDragReject={isDragReject}
                        {...getRootProps()}
                      >
                        <input {...getInputProps()} />

                        {!importFile && (
                          <p>{translate("collections.dragAndDrop")}</p>
                        )}

                        {importFile && !isDragReject && (
                          <>
                            {get(importFile, "name")}
                            <br />
                            <Text small>
                              (
                              {Math.round(
                                (100 * get(importFile, "size", 0)) / 1000000
                              ) / 100}{" "}
                              {"MB"})
                            </Text>
                            <br />
                          </>
                        )}
                      </UploadZone>
                    );
                  }}
                </Dropzone>
              )}

              <Label block>
                {translate("collections.importConfiguration")}*
              </Label>
              <FlexSpaceBetween>
                <div
                  style={{
                    flex: 1,
                    marginRight: "16px",
                    maxWidth: "40%",
                  }}
                >
                  <VirtualizedSelect
                    simpleValue
                    placeholder=""
                    isClearable
                    value={manufacturerEntityId}
                    onChange={setManufacturerEntityId}
                    options={manufacturerEntities}
                    getOptionLabel={(o) => o.name}
                    getOptionValue={(o) => o.id}
                    classNamePrefix="cde-select"
                    className="cde-select react-select-full-height"
                  />
                </div>

                <div style={{ display: "flex" }}>
                  <ButtonMui
                    onClick={importPrice}
                    sx={{ "text-transform": "none" }}
                    variant="contained"
                    disabled={!isEnableRunImport}
                    style={{
                      backgroundColor: !isEnableRunImport ? undefined : PRIMARY,
                    }}
                  >
                    {translate("collections.runTheImport")}
                  </ButtonMui>
                  <Margin left={2} />
                  {manufacturerEntityId ? (
                    <ButtonMui
                      variant="contained"
                      disabled={!manufacturerEntityId}
                      small
                      onClick={() => setManufacturerEntityNewVisible(true)}
                      style={{
                        marginRight: 0,
                        textTransform: "none",
                        backgroundColor: PRIMARY,
                      }}
                    >
                      {translate("collections.editManufaturerEntity")}
                    </ButtonMui>
                  ) : (
                    <ButtonMui
                      variant="contained"
                      disabled={!importFile}
                      small
                      onClick={() => setManufacturerEntityNewVisible(true)}
                      style={{
                        marginRight: 0,
                        textTransform: "none",
                        backgroundColor: !!importFile ? PRIMARY : undefined,
                      }}
                    >
                      {translate("collections.newManufacturerEntity")}
                    </ButtonMui>
                  )}
                </div>
              </FlexSpaceBetween>

              <br />

              {importSuccess && (
                <Text center>{translate("collections.importStarted")}</Text>
              )}

              <br />
            </div>
            <StickyFooterRow>
              <CloseButton small onClick={onClose}>
                {translate("collections.close")}
              </CloseButton>
            </StickyFooterRow>
          </Container>
        </ModalStyled>
      )}

      {manufacturerEntityNewVisible && (
        <ModalStyled md style={{ height: "100%", width: "100%", padding: 0 }}>
          <ManufacturerEntityNew
            importFile={importFile}
            existingManufacturerEntity={manufacturerEntityId}
            existingMatrixMapping={selectedMappingData}
            onSuccess={(createdManufacturerEntityId) => {
              fetchManufacturerEntities(createdManufacturerEntityId);
            }}
            onClose={(_manufacturerEntityId) => {
              fetchManufacturerEntities(_manufacturerEntityId);
              setManufacturerEntityNewVisible(false);
              selectedMappingId && fetchMappingById(selectedMappingId);
            }}
          />
        </ModalStyled>
      )}
    </>
  );
};

export default withUser(withLocalization(CollectionMatixMapping));
