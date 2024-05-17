import {
  duplicateCollection,
  getEmptyCollectionsPricing,
} from "cdm-shared/services/collection";
import { Button, Label, Loader, VirtualizedSelect } from "cdm-ui-components";
import { withLocalization } from "common/redux/hoc/withLocalization";
import { get } from "lodash";
import React, { useEffect, useState } from "react";
import "./index.css";
import styled from "styled-components";
import { ModalTitleStyled } from "cdm-shared/component/styled/modal/ModalStyled";

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
`;

const CollectionDuplication = ({ collection, onClose, translate }) => {
  const [collections, setCollections] = useState([]);
  const [destinationCollection, setDestinationCollection] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingEmptyCollection, setLoadingEmptyCollection] = useState(false);

  const duplicate = () => {
    if (collection && destinationCollection) {
      setLoading(true);
      duplicateCollection(
        get(collection, "id"),
        get(destinationCollection, "id")
      )
        .then((res) => {
          if (res.status === 200) {
            onClose();
          }
        })
        .finally(() => setLoading(false));
    }
  };

  useEffect(() => {
    setLoadingEmptyCollection(true);
    getEmptyCollectionsPricing()
      .then((res) => {
        setCollections(res.data);
        setLoadingEmptyCollection(false);
      })
      .catch((err) => setLoadingEmptyCollection(false));
  }, []);

  return (
    <div
      div={{
        minHeight: "180px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <ModalTitleStyled>
        {translate("collections.duplicateCollection")}
      </ModalTitleStyled>
      <div>
        <Label block>{translate("collections.destinationCollection")}</Label>
        {loadingEmptyCollection ? (
          <LoadingWrapper>
            <Loader />
          </LoadingWrapper>
        ) : (
          <VirtualizedSelect
            simpleValue
            placeholder=""
            isClearable
            value={destinationCollection}
            onChange={(val) => setDestinationCollection(val)}
            options={collections}
            getOptionLabel={(option) => option.collectionName}
            getOptionValue={(option) => option.collectionCode}
            classNamePrefix="cde-select"
            className="cde-select"
          />
        )}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          marginTop: "40px",
        }}
      >
        <Button onClick={onClose} small>
          {translate("collections.cancel")}
        </Button>
        {loading ? (
          <Loader />
        ) : (
          <Button
            onClick={duplicate}
            disabled={!destinationCollection}
            primary
            small
          >
            {translate("collections.duplicate")}
          </Button>
        )}
      </div>
    </div>
  );
};

export default withLocalization(CollectionDuplication);
