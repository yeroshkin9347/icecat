import React, { useEffect, useMemo } from "react";
import get from "lodash/get";
import ContextualZone from "../ContextualZone";
import { Text, Container, Margin } from "cdm-ui-components";
import { withLocalization } from "common/redux/hoc/withLocalization";
import { withTradeItemLocalContext } from "../store/TradeItemProvider";
import { withGroupLocalContext } from "../store/PropertyGroupProvider";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { getCollections } from "cdm-shared/services/collection";
import './CollectionManagement.css';

const CollectionManagement = ({
  tradeItem,
  selectedGroupItemIndex,
  setTradeItemValue,
  translate,
}) => {
  const valueKey = `catalogPrices.${selectedGroupItemIndex}.collectionIds`;

  const [collections, setCollections] = React.useState([]);

  const selectedCollections = useMemo(() => {
    const selectedCollectionIds = get(tradeItem, valueKey) || [];

    return collections.filter((collection) => {
      return selectedCollectionIds.includes(collection.id);
    });
  }, [collections, tradeItem, valueKey]);

  const fetchCollections = async () => {
    getCollections().then((res) => {
      const collections = res.data;
      setCollections(collections);
    });
  };

  const onUpdateCollectionsForTradeItem = (selectedCollectionIds) => {
    setTradeItemValue(valueKey, selectedCollectionIds);
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  return (
    <>
      <ContextualZone>
        <Text bold>{translate("tradeItemCrud.collection.title")}</Text>

        <Container fluid style={{ padding: "0 0 0 0" }}>
          <Margin top={4} />
          <Autocomplete
            className="collection-management-autocomplete"
            multiple
            autoComplete
            includeInputInList
            value={selectedCollections || []}
            onChange={(e, v) => {
              const selectedCollectionIds = v.map(
                (collection) => collection.id
              );
              onUpdateCollectionsForTradeItem(selectedCollectionIds);
            }}
            getOptionLabel={(o) => o.name || ""}
            options={collections || []}
            renderInput={(params) => (
              <TextField
                {...params}
                className="form-field"
                size="small"
                hiddenLabel
                fullWidth
              />
            )}
          />
        </Container>
      </ContextualZone>
    </>
  );
};

export default withLocalization(
  withGroupLocalContext(withTradeItemLocalContext(CollectionManagement))
);
