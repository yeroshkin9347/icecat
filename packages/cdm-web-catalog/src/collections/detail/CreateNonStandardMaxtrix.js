import React, { useEffect, useState } from "react";
import {
  UploadZone,
  Container,
  Row,
  H5,
  Button,
  Text,
  Loader,
} from "cdm-ui-components";
import Dropzone from "react-dropzone";
import { get, join } from "lodash";
import PriceMatrixAnalysisForm from "./PriceMatrixAnalysisForm";
import {
  createNonStandardMapping,
  uploadFilePriceMaxtrixMapping,
} from "cdm-shared/services/maxtrixMapping";
import CollectionMatrixMappingNew from "collections/CollectionMatrixMappingNew";
import withUser, { getManufacturerId } from "cdm-shared/redux/hoc/withUser";
import { IMPORT_FILE_TYPES_ACCEPTED } from "cdm-shared/constants/importCollection";
import { withLocalization } from "common/redux/hoc/withLocalization";
import { ModalStyled } from "cdm-shared/component/styled/modal/ModalStyled";

const CreateNonStandardMaxtrix = ({
  visible,
  importFile,
  user,
  onClose,
  onCreateSuccess,
  translate,
}) => {
  const [file, setFile] = useState(null);
  const [visibleUploadFile, setVisibleUploadFile] = useState(true);
  const [matrixAnalysisModalVisible, setMatrixAnalysisModalVisible] =
    useState(false);
  const [matrixAnalysis, setMatrixAnalysis] = useState(null);
  const [newMatrixMappingVisible, setNewMatrixMappingVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const onUpload = (file) => {
    setLoading(true);
    uploadFilePriceMaxtrixMapping(file)
      .then((res) => {
        setMatrixAnalysis(res.data);
        setMatrixAnalysisModalVisible(true);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (importFile) {
      setFile(importFile);
      onUpload(importFile);
      setMatrixAnalysisModalVisible(true);
      setVisibleUploadFile(false);
    } else {
      setVisibleUploadFile(true);
    }
  }, [visible, importFile]);

  const onSaveMaxtrixAnalysis = (matrixAnalysis) => {
    setMatrixAnalysis(matrixAnalysis);
    setMatrixAnalysisModalVisible(false);
    onCreateSuccess && onCreateSuccess(matrixAnalysis);
  };

  const onSaveMaxtrixMappingHandler = async ({
    mappingTitle,
    taxonomy,
    category,
  }) => {
    return createNonStandardMapping({
      manufacturerId: getManufacturerId(user),
      matrixAnalysisId: get(matrixAnalysis, "id"),
      mappingTitle,
      taxonomyId: get(taxonomy, "id"),
      discriminator: "NonStandardMappingViewModel",
      tradeItemCategory: {
        discriminator: "TradeItemCategoryViewModel",
      },
      mappingGroups: [
        {
          groupIndex: 0,
          groupName: "PRICING",
          mappingTabs: [],
          sheet: 0,
        },
      ],
    }).then((res) => {
      onCreateSuccess && onCreateSuccess(res.data);
      setNewMatrixMappingVisible(false);
    });
  };

  return (
    <>
      {visibleUploadFile && (
        <ModalStyled md>
          <Container>
            <H5>{translate("collections.uploadMatrix")}</H5>

            <Dropzone
              onDrop={(accepted, rejected) =>
                setFile(get(accepted, "[0]", null))
              }
              maxSize={100000000} // 100Mo
              accept={join(IMPORT_FILE_TYPES_ACCEPTED, ", ")}
              disabled={loading}
            >
              {({
                getRootProps,
                getInputProps,
                isDragActive,
                isDragAccept,
                isDragReject,
                acceptedFiles,
              }) => {
                return (
                  <UploadZone
                    style={{
                      height: "200px",
                      marginBottom: "20px",
                      justifyContent: "center",
                      alignItems: "center",
                      display: "flex",
                    }}
                    borderRadius
                    isDragActive={isDragActive}
                    isDragReject={isDragReject}
                    {...getRootProps()}
                  >
                    <input {...getInputProps()} />

                    {!file && <p>{translate("collections.dragAndDrop")}</p>}

                    {!!file && (
                      <div>
                        {get(file, "name")}
                        <br />
                        <Text small>
                          (
                          {Math.round((100 * get(file, "size", 0)) / 1000000) /
                            100}{" "}
                          MB)
                        </Text>
                      </div>
                    )}
                  </UploadZone>
                );
              }}
            </Dropzone>

            <Row style={{ justifyContent: loading ? "center" : "flex-end" }}>
              {loading ? (
                <Loader />
              ) : (
                <>
                  {!!file && (
                    <Button onClick={() => onUpload(file)} primary shadow>
                      {translate("collections.upload")}
                    </Button>
                  )}
                  <Button onClick={onClose}>
                    {translate("collections.close")}
                  </Button>
                </>
              )}
            </Row>
          </Container>
        </ModalStyled>
      )}
      {matrixAnalysisModalVisible && (
        <ModalStyled md>
          <PriceMatrixAnalysisForm
            loading={loading}
            matrixAnalysis={matrixAnalysis}
            onSaveSuccess={onSaveMaxtrixAnalysis}
            onClose={() => {
              setMatrixAnalysisModalVisible(false);
              onClose();
            }}
          />
        </ModalStyled>
      )}

      {newMatrixMappingVisible && (
        <ModalStyled sm style={{ overflow: "visible" }}>
          <CollectionMatrixMappingNew
            onClose={() => {
              setNewMatrixMappingVisible(false);
              onClose();
            }}
            onSave={onSaveMaxtrixMappingHandler}
          />
        </ModalStyled>
      )}
    </>
  );
};

export default withUser(withLocalization(CreateNonStandardMaxtrix));
