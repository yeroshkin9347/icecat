import React, {useCallback, useEffect, useMemo, useState} from "react";
import styled from "styled-components";
import get from "lodash/get";
import {IconButton} from '@mui/material';
import {Delete as DeleteIcon} from '@mui/icons-material';
import {Button, Col, Input, Label, Margin, Row} from "cdm-ui-components";
import {withLocalization} from "common/redux/hoc/withLocalization";
import {PageTitle} from "cdm-shared/component/Banner";
import {
  getFacingTypes,
  getPlungeAngles,
} from "cdm-shared/services/resource";
import {getAllLanguages} from "cdm-shared/component/tradeItemCrud/api";
import TradeItemSelector from "cdm-shared/component/tradeitem/TradeItemSelector";
import ProductsTable from "cdm-shared/component/product/ProductsTable";
import {VirtualizedAutocomplete} from "cdm-shared/component/styled/form-controls/StyledAutocomplete";
import {IMAGE_CATEGORIES} from "./categories";
import { getLinkedRetailers } from "cdm-shared/services/subscription";

const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const ImagePreview = styled.div`
  width: 100%;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  img {
    max-width: 100%;
    max-height: 100%;
    border: 1px solid #E8EAED;
    border-radius: 4px;
  }
`;

const FormField = styled.div`
  label {
    color: ${props => (props.error ? '#ff4c52' : 'inherit')};
  }
  & > input,
  & > .cde-select > div {
    border: ${props => (props.error ? '1px solid #ff4c52 !important' : '0')};
  }
`;

const productsTableColumns = ['manufacturerName', 'gtin', 'tradeItemManufacturerCode', 'title', 'category', 'languageAvailable'];
const productsTableActions = ["remove"];

const ImageUploadForm = ({
  file,
  translate,
  onSubmit,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    title: file.name,
  });
  const [languageOptions, setLanguageOptions] = useState([]);
  const [facingTypeOptions, setFacingTypeOptions] = useState([]);
  const [plungeAngleOptions, setPlungeAngleOptions] = useState([]);
  const [tradeItems, setTradeItems] = useState([]);
  const [dirty, setDirty] = useState(false);
  const [exclusiveRetailers, setExclusiveRetailers] = useState([]);
  const [retailerOptions, setRetailerOptions] = useState([]);

  const url = useMemo(() => URL.createObjectURL(file), [file]);

  const tradeItemIds = useMemo(
    () => tradeItems.map((item) => item.tradeItemId),
    [tradeItems]
  );

  const errors = useMemo(() => {
    const messages = {};
    if (!formData.category) {
      messages.category = 'Required';
    }
    return messages;
  }, [formData]);

  useEffect(() => {
    getAllLanguages().then((res) => {
      setLanguageOptions(res);
    });

    getFacingTypes().then((res) => {
      setFacingTypeOptions(res.data);
    });

    getPlungeAngles().then((res) => {
      setPlungeAngleOptions(res.data);
    });

    getLinkedRetailers().then((res) => {
      setRetailerOptions(res.data);
    });
  }, []);

  const onUpdateField = useCallback((field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const onSelectTradeItem = useCallback((tradeItem) => {
    setTradeItems((prev) => [...prev, tradeItem]);
  }, []);

  const onDeselectTradeItem = useCallback((tradeItem) => {
    setTradeItems((prev) =>
      prev.filter((item) => item.tradeItemId !== tradeItem.tradeItemId)
    );
  }, []);

  const onSave = () => {
    setDirty(true);
    if (Object.keys(errors).length) {
      return;
    }

    const data = {
      TradeItemIds: tradeItemIds,
      Title: formData.title,
      FileName: file.name,
      Index: formData.index,
      ImageCategory: formData.category,
      LanguageCodes: formData.languageCodes,
      NotDefinitive: formData.notDefinitive ?? false,
      NotExportable: formData.notExportable ?? false,
      Old: formData.old ?? false,
      FacingType: formData.facingType,
      PlungeAngle: formData.plungeAngle,
      ExclusiveRetailerIds: exclusiveRetailers.map((item) => item.retailerId),
    };
    onSubmit(data);
  };

  return (
    <FormWrapper>
      <PageTitle>{translate('video.form.uploadImage')}</PageTitle>

      <ImagePreview>
        <img src={url} alt=""/>
      </ImagePreview>

      <FormField error={dirty && errors.title}>
        <Label block>{translate("video.form.title")}</Label>
        <Input
          block
          value={formData.title ?? ''}
          onChange={(e) => onUpdateField("title", e.target.value)}
        />
      </FormField>

      <FormField error={dirty && errors.index}>
        <Label block>{translate("video.form.index")}</Label>
        <Input
          block
          type="number"
          value={formData.index ?? ''}
          onChange={(e) => onUpdateField("index", e.target.value)}
        />
      </FormField>

      <FormField error={dirty && errors.category}>
        <Label block>{translate("video.form.category")}</Label>
        <VirtualizedAutocomplete
          size="small"
          options={IMAGE_CATEGORIES}
          getOptionLabel={(option) => translate(`video.meta.categories.${option}`)}
          value={formData.category ?? ''}
          error={dirty && errors.category}
          onChange={(_, value) => onUpdateField("category", value)}
        />
      </FormField>

      <FormField error={dirty && errors.languageCodes}>
        <Label block>{translate("video.form.languages")}</Label>
        <VirtualizedAutocomplete
          size="small"
          multiple
          disableCloseOnSelect
          options={languageOptions}
          value={formData.languageCodes ?? []}
          onChange={(_, value) => onUpdateField("languageCodes", value)}
        />
      </FormField>

      <FormField error={dirty && errors.facingType}>
        <Label block>{translate("video.form.facingType")}</Label>
        <VirtualizedAutocomplete
          size="small"
          options={facingTypeOptions}
          getOptionLabel={(option) => translate(`video.meta.facingTypes.${option}`)}
          value={formData.facingType ?? ''}
          onChange={(_, value) => onUpdateField("facingType", value)}
        />
      </FormField>

      <FormField error={dirty && errors.plungeAngle}>
        <Label block>{translate("video.form.plungeAngle")}</Label>
        <VirtualizedAutocomplete
          size="small"
          options={plungeAngleOptions}
          getOptionLabel={(option) => translate(`video.meta.plungeAngles.${option}`)}
          value={formData.plungeAngle ?? ''}
          onChange={(_, value) => onUpdateField("plungeAngle", value)}
        />
      </FormField>

      <FormField error={dirty && errors.retailer}>
        <Label block>{translate("video.form.retailer")}</Label>
        <VirtualizedAutocomplete
          size="small"
          multiple
          options={retailerOptions}
          getOptionValue={(o) => get(o, "retailerId")}
          getOptionLabel={(o) => get(o, "retailerName") || o}
          value={exclusiveRetailers ?? []}
          onChange={(_, value) => setExclusiveRetailers(value)}
        />
      </FormField>

      <Row>
        <Col col={4}>
          <div className="whitespace-nowrap">
            <Input
              id="not-definitive"
              type="checkbox"
              checked={formData.notDefinitive || false}
              onChange={(e) => onUpdateField("notDefinitive", e.target.checked)}
            />
            &nbsp;&nbsp;
            <Label htmlFor="not-definitive">{translate("video.form.notDefinitive")}</Label>
          </div>
        </Col>
        <Col col={4}>
          <div className="whitespace-nowrap">
            <Input
              id="not-exportable"
              type="checkbox"
              checked={formData.notExportable || false}
              onChange={(e) => onUpdateField("notExportable", e.target.checked)}
            />
            &nbsp;&nbsp;
            <Label htmlFor="not-exportable">{translate("video.form.notExportable")}</Label>
          </div>
        </Col>
        <Col col={4}>
          <div className="whitespace-nowrap">
            <Input
              id="old-checkbox"
              type="checkbox"
              checked={formData.old || false}
              onChange={(e) => onUpdateField("old", e.target.checked)}
            />
            &nbsp;&nbsp;
            <Label htmlFor="old-checkbox">{translate("video.form.old")}</Label>
          </div>
        </Col>
      </Row>

      <FormField>
        <Label block>{translate("video.form.tradeItems")}</Label>
        <TradeItemSelector
          mode="multi-select"
          searchable={false}
          placeholder={translate("video.form.tradeItemsPlaceholder")}
          selectedIds={tradeItemIds}
          onTradeItemSelected={onSelectTradeItem}
          onTradeItemDeselected={onDeselectTradeItem}
          panelStyle={{ width: 'calc(100vw - 2rem)', maxWidth: '70rem' }}
        />
        <Margin top={2} />
        <ProductsTable
          products={tradeItems}
          visibleColumns={productsTableColumns}
          actions={productsTableActions}
          removeButton={
            <IconButton
              color="error"
              size="large"
              aria-label="Remove"
              sx={{
                padding: 0.5,
              }}
            >
              <DeleteIcon fontSize="inherit" />
            </IconButton>
          }
          onRemoveRow={onDeselectTradeItem}
        />
      </FormField>

      <Row right style={{ marginTop: "30px"}}>
        <Col col right>
          <Button type="button" small light onClick={onClose}>
            {translate("video.form.cancel")}
          </Button>
          <Button small primary style={{ marginRight: "0" }} onClick={onSave}>
            {translate("video.form.upload")}
          </Button>
        </Col>
      </Row>
    </FormWrapper>
  );
}
export default withLocalization(ImageUploadForm);
