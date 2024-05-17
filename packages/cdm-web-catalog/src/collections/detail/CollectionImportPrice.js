import React, { useState } from "react";
import { get, join } from "lodash";
import Dropzone from "react-dropzone";
import { IMPORT_FILE_TYPES_ACCEPTED } from "cdm-shared/constants/importCollection";
import {
  UploadZone,
  Loader,
  Text,
  Row,
  Button,
  Container,
} from "cdm-ui-components";
import {
  getUpdatedImportManufacturerEntityId,
  importCollectionPricing,
} from "cdm-shared/services/collection";
import ButtonMui from "@mui/material/Button";
import { withLocalization } from "common/redux/hoc/withLocalization";
import { getImportJob } from "cdm-shared/services/import";
import { isImportJobDone } from "collections/helpers";
import withUser from "cdm-shared/redux/hoc/withUser";

const CollectionImportPrice = ({
  collection,
  user,
  onSuccess,
  onClose,
  translate,
}) => {
  const [loading, setLoading] = useState(false);
  const [importFile, setImportFile] = useState(null);
  const fileName = get(importFile, "name", "");

  const isMatchedFileName = () => {
    const collectionName = get(collection, "name", "");
    const manufacturerName = get(user, "organization_name", "");
    return (
      fileName.includes(collectionName) && fileName.includes(manufacturerName)
    );
  };

  const importWatch = (importJobId) => {
    getImportJob(importJobId).then((res) => {
      const importJobData = get(res, "data");
      if (isImportJobDone(importJobData)) {
        setTimeout(() => {
          setLoading(false);
          onSuccess && onSuccess();
        }, 3000);
      } else {
        setTimeout(() => {
          importWatch(importJobId);
        }, 1000);
      }
    });
  };

  const onUpload = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setLoading(true);
    getUpdatedImportManufacturerEntityId()
      .then(async (res) => {
        const manufacturerEntityId = get(res, "data");
        if (manufacturerEntityId) {
          return importCollectionPricing(
            get(collection, "code"),
            manufacturerEntityId,
            importFile
          ).then((res) => {
            if (res.status === 200) {
              const importJobId = get(res, "data");
              importWatch(importJobId);
            } else {
              setLoading(false);
            }
          });
        }
      })
      .catch(() => setLoading(false));
  };

  return (
    <Container>
      {loading ? (
        <Row
          style={{
            height: "150px",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <Text primary style={{ marginBottom: "16px" }}>
            {translate("collections.importing")}...
          </Text>
          <Loader />
        </Row>
      ) : (
        <Dropzone
          onDrop={(accepted, rejected) =>
            setImportFile(get(accepted, "[0]", null))
          }
          maxSize={100000000} // 100Mo
          accept={join(IMPORT_FILE_TYPES_ACCEPTED, ", ")}
        >
          {({ getRootProps, getInputProps, isDragActive, isDragReject }) => {
            return (
              <UploadZone
                style={{
                  height: "150px",
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

                {!importFile && <p>{translate("collections.dragAndDrop")}</p>}

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
                    <ButtonMui
                      onClick={onUpload}
                      sx={{ "text-transform": "none" }}
                      variant="contained"
                    >
                      {translate("collections.runTheImport")}
                    </ButtonMui>
                  </>
                )}
              </UploadZone>
            );
          }}
        </Dropzone>
      )}

      {!!fileName && !isMatchedFileName() && (
        <Text danger center>
          {translate("collections.runTheImportWarn")}
        </Text>
      )}

      <Row
        style={{
          justifyContent: "flex-end",
          alignItems: "center",
          marginTop: "50px",
        }}
      >
        <Button onClick={onClose} small>
          Close
        </Button>
      </Row>
    </Container>
  );
};

export default withUser(withLocalization(CollectionImportPrice));
