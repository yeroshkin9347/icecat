import React, { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import get from "lodash/get";
import { Button, Col, Input, Label, Margin, Row, VirtualizedSelect } from "cdm-ui-components";
import { withLocalization } from "common/redux/hoc/withLocalization";
import { PageTitle } from "cdm-shared/component/Banner";
import { getAllLanguages } from "cdm-shared/component/tradeItemCrud/api";
import TradeItemSelector from "cdm-shared/component/tradeitem/TradeItemSelector";
import ProductsTable from "cdm-shared/component/product/ProductsTable";
import { getTradeItemsCms } from "cdm-shared/services/product";
import {DOCUMENT_CATEGORIES} from "./categories";
import {VirtualizedAutocomplete} from "cdm-shared/component/styled/form-controls/StyledAutocomplete";
import {getLinkedRetailers} from "cdm-shared/services/subscription";
import {IconButton} from '@mui/material';
import {Delete as DeleteIcon} from '@mui/icons-material';

const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
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

const DocumentUploadForm = ({
  file,
  translate,
  onSave,
  onClose,
}) => {
  const [formData, setFormData] = useState({ Title: file.name, FileName: file.name });
  const [categoryOptions] = useState(DOCUMENT_CATEGORIES);
  const [languageOptions, setLanguageOptions] = useState([]);
  const [tradeItems, setTradeItems] = useState([]);
  const [exclusiveRetailers, setExclusiveRetailers] = useState([]);
  const [retailerOptions, setRetailerOptions] = useState([]);
  const [dirty, setDirty] = useState(false);

  const errors = useMemo(() => {
    const messages = {};
    if (!formData.DocumentCategory) {
      messages.DocumentCategory = 'Required';
    }
    return messages;
  }, [formData]);

  const tradeItemIds = useMemo(
    () => tradeItems.map((item) => item.tradeItemId),
    [tradeItems]
  );

  useEffect(() => {
    getAllLanguages().then((res) => {
      setLanguageOptions(res);
    });

    getTradeItemsCms([])
      .then((tradeItemsRes) => {
        const tradeItems = tradeItemsRes.map((tradeItemRes) => tradeItemRes.data);
        setTradeItems([...tradeItems]);
      });

    getLinkedRetailers().then((res) => {
      setRetailerOptions(res.data);
    });
  }, []);

  const onUpdateField = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const onSelectTradeItem = useCallback((tradeItem) => {
    setTradeItems((prev) => [...prev, tradeItem]);
  }, []);

  const onDeselectTradeItem = useCallback((tradeItem) => {
    setTradeItems((prev) =>
      prev.filter((item) => item.tradeItemId !== tradeItem.tradeItemId)
    );
  }, []);

  const handleUpload = useCallback(() => {
    setDirty(true);
    if (Object.keys(errors).length) {
      return;
    }

    onSave({
      ...formData,
      TradeItemIds: tradeItemIds,
      ExclusiveRetailerIds: exclusiveRetailers.map((item) => item.retailerId),
    });
  }, [errors, exclusiveRetailers, formData, onSave, tradeItemIds]);

  return (
    <FormWrapper>
      <PageTitle>{translate('video.form.uploadDocument')}</PageTitle>
      <br />

      <FormField>
        <Label>{translate("video.form.title")}</Label>
        <Input
          block
          value={formData.Title ?? ''}
          onChange={(e) => onUpdateField("Title", e.target.value)}
        />
      </FormField>

      <FormField error={dirty && errors.Index}>
        <Label block>{translate("video.form.index")}</Label>
        <Input
          block
          type="number"
          value={formData.Index ?? ''}
          onChange={(e) => onUpdateField("Index", e.target.value)}
        />
      </FormField>

      <FormField error={dirty && errors.DocumentCategory}>
        <Label block>{translate("video.form.category")}</Label>
        <VirtualizedSelect
          className="cde-select react-select-full-height"
          classNamePrefix="cde-select"
          simpleValue
          placeholder=""
          value={formData.DocumentCategory ?? ''}
          options={categoryOptions}
          getOptionLabel={(option) => translate(`video.meta.categories.${option}`)}
          onChange={(e) => onUpdateField("DocumentCategory", e)}
        />
      </FormField>

      <FormField error={dirty && errors.LanguageCodes}>
        <Label block>{translate("video.form.languages")}</Label>
        <VirtualizedAutocomplete
          size="small"
          multiple
          disableCloseOnSelect
          options={languageOptions}
          value={formData.LanguageCodes ?? []}
          onChange={(_, value) => onUpdateField("LanguageCodes", value)}
        />
      </FormField>

      <FormField>
        <Label block>{translate("video.form.retailer")}</Label>
        <VirtualizedAutocomplete
          size="small"
          multiple
          disableCloseOnSelect
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
              checked={formData.NotDefinitive || false}
              onChange={(e) => onUpdateField("NotDefinitive", e.target.checked)}
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
              checked={formData.NotExportable || false}
              onChange={(e) => onUpdateField("NotExportable", e.target.checked)}
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
              checked={formData.Old || false}
              onChange={(e) => onUpdateField("Old", e.target.checked)}
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

      <Row right style={{ marginTop: "30px" }}>
        <Col col right>
          <Button type="button" small light onClick={onClose}>
            {translate("video.form.cancel")}
          </Button>
          <Button small primary style={{ marginRight: "0" }} onClick={handleUpload}>
            {translate("video.form.upload")}
          </Button>
        </Col>
      </Row>
    </FormWrapper>
  );
}
export default withLocalization(DocumentUploadForm);
