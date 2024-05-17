import { getTaxonomies } from "cdm-shared/services/taxonomy";
import { Button, Loader } from "cdm-ui-components";
import {
  Col,
  Container,
  H5,
  Input,
  Label,
  Row,
  VirtualizedSelect,
} from "cdm-ui-components";
import { get } from "lodash";
import React, { useEffect, useState } from "react";
import { getAllTradeItemCategories } from "cdm-shared/services/tradeItemCategories";
import { getLang } from "cdm-shared/redux/localization";
import { withLocalization } from "common/redux/hoc/withLocalization";
import withUser from "cdm-shared/redux/hoc/withUser";

const CollectionMatrixMappingNew = ({ onSave, onClose, user, translate }) => {
  const [taxonomies, setTaxonomies] = useState([]);
  const [categoryList, setCategoryList] = useState([]);

  const [mappingTitle, setMappingTitle] = useState("");
  const [taxonomy, setTaxonomy] = useState(null);
  const [category, setCategory] = useState(null);

  const [loading, setLoading] = useState(false);

  const onSaveHandler = async () => {
    if (onSave) {
      setLoading(true);
      await onSave({
        mappingTitle,
        taxonomy,
        category,
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    const currentLocaleCode = getLang() || "fr-FR";

    getTaxonomies().then((res) => {
      setTaxonomies(get(res, "data", []));
    });

    getAllTradeItemCategories(currentLocaleCode)
      .then((res) => {
        setCategoryList(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <Container
      style={{
        height: "400px",
        justifyContent: "space-between",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Row>
        <Col>
          <H5>{translate("collections.createNewMapping")}</H5>
          <Label block>{translate("collections.mappingName")}*</Label>
          <Input
            value={mappingTitle}
            onChange={(e) => {
              setMappingTitle(e.target.value);
            }}
            block
          />
          <br />
          <Label block>{translate("collections.taxonomy")}*</Label>
          <VirtualizedSelect
            simpleValue
            placeholder=""
            isClearable
            value={taxonomy}
            onChange={setTaxonomy}
            options={taxonomies}
            getOptionLabel={(o) => o.name}
            getOptionValue={(o) => o.id}
            classNamePrefix="cde-select"
            className="cde-select react-select-full-height"
          />
          <br />
          <Label block>{translate("collections.tradeItemCategory")}*</Label>
          <VirtualizedSelect
            simpleValue
            placeholder=""
            isClearable
            value={category}
            onChange={setCategory}
            options={categoryList}
            getOptionLabel={(o) => o.name}
            getOptionValue={(o) => o.id}
            classNamePrefix="cde-select"
            className="cde-select react-select-full-height"
          />
          <br />
        </Col>
      </Row>

      <Row style={{ justifyContent: "flex-end", alignItems: "center" }}>
        <Button small onClick={onClose}>
          {translate("collections.close")}
        </Button>
        {loading ? (
          <Loader />
        ) : (
          <Button small onClick={onSaveHandler} primary shadow>
            {translate("collections.save")}
          </Button>
        )}
      </Row>
    </Container>
  );
};
export default withUser(
  withLocalization(CollectionMatrixMappingNew)
);
