import React, { useCallback, useEffect, useMemo, useState } from "react";
import get from "lodash/get";
import styled from "styled-components";
import { Button, Col, Input, Label, Row } from "cdm-ui-components";
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import {Delete as DeleteIcon} from '@mui/icons-material';
import { withLocalization } from "common/redux/hoc/withLocalization";
import { PageTitle } from "cdm-shared/component/Banner";
import {
  deleteResourceForUser,
  updateDocumentResourceForUser
} from "cdm-shared/services/resource";
import { getAllLanguages } from "cdm-shared/component/tradeItemCrud/api";
import TradeItemSelector from "cdm-shared/component/tradeitem/TradeItemSelector";
import ProductsTable from "cdm-shared/component/product/ProductsTable";
import { VirtualizedAutocomplete } from "cdm-shared/component/styled/form-controls/StyledAutocomplete";
import { getDocumentMetadataById } from "cdm-shared/services/videos";
import { getTradeItemsByIds } from "cdm-shared/services/product";
import useNotifications from "cdm-shared/hook/useNotifications";
import {DOCUMENT_CATEGORIES} from "./categories";
import {getLinkedRetailers} from "cdm-shared/services/subscription";

const FormWrapper = styled(Box)`
  overflow-y: auto;
  display: ${(props) => props.show ? 'flex' : 'none'};
  flex-direction: column;
  gap: 15px;
`;

const FormField = styled.div`
  label {
    color: ${props => (props.error ? '#ff4c52' : 'inherit')};
    white-space: nowrap;
  }
  & > input,
  & > .cde-select > div {
    border: ${props => (props.error ? '1px solid #ff4c52 !important' : '0')};
  }
`;

const productsTableColumns = ['manufacturerName', 'gtin', 'tradeItemManufacturerCode', 'title', 'category', 'languageAvailable'];
const productsTableActions = ["remove"];

const MIN_FORM_HEIGHT = 440;

const DocumentUpdateForm = ({
  id,
  translate,
  currentLocaleCode,
  setLoading,
  onClose,
  onDelete,
}) => {
  const [, notify] = useNotifications();

  const [categoryOptions] = useState(DOCUMENT_CATEGORIES);
  const [languageOptions, setLanguageOptions] = useState([]);
  const [dirty, setDirty] = useState(false);
  const [retailerOptions, setRetailerOptions] = useState([]);
  const [authorizedRetailers, setAuthorizedRetailers] = useState([]);

  const [document, setDocument] = useState({});

  const [documentWithMetadata, setDocumentWithMetadata] = useState({});
  const [tradeItems, setTradeItems] = useState([]);
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  const [wrapperHeight, setWrapperHeight] = useState(MIN_FORM_HEIGHT);

  const tradeItemIds = useMemo(
    () => tradeItems.map((item) => item.tradeItemId),
    [tradeItems]
  );

  const errors = useMemo(() => {
    const messages = {};
    if (!document.category) {
      messages.category = 'Required';
    }
    return messages;
  }, [document]);

  const notifyResult = useCallback((title, description, type = "success") => {
    notify({
      title: translate(title),
      body: translate(...(Array.isArray(description) ? description : [description])),
      severity: type,
      dismissAfter: 3000,
    });
  }, [notify, translate]);

  useEffect(() => {
    getAllLanguages().then((res) => {
      setLanguageOptions(res);
    });

    getLinkedRetailers().then((res) => {
      setRetailerOptions(res.data);
    });

    setWrapperHeight(Math.min(window.innerHeight * 0.95 - 70 - 220, MIN_FORM_HEIGHT));
    const handleResize = () => {
      setWrapperHeight(Math.min(window.innerHeight * 0.95 - 70 - 220, MIN_FORM_HEIGHT));
    }
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (id) {
      setLoading(true);
      getDocumentMetadataById(id).then(async (res) => {
        const documentMetaData = res.data;
        setDocumentWithMetadata(documentMetaData);

        setDocument({
          title: documentMetaData.title,
          category: documentMetaData.documentCategory,
          index: documentMetaData.index,
          languageCodes: documentMetaData.languageCodes,
          tradeItemIds: documentMetaData.tradeItemIds,
          notDefinitive: documentMetaData.notDefinitive ?? false,
          notExportable: documentMetaData.notExportable ?? false,
          old: documentMetaData.old ?? false,
        });

        if (documentMetaData.tradeItemIds?.length) {
          await getTradeItemsByIds(documentMetaData.tradeItemIds, currentLocaleCode)
            .then((res) => {
              setTradeItems(res.data);
            });
        }
      }).finally(() => {
        setLoading(false);
      });

      getAllLanguages().then((res) => {
        setLanguageOptions(res);
      });
    }
  }, [currentLocaleCode, id, setLoading]);

  const onUpdateField = useCallback((field, value) => {
    setDocument((prev) => ({
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

    setLoading(true);
    updateDocumentResourceForUser({
      metadataId: id,
      title: document.title,
      index: document.index,
      documentCategory: document.category,
      languageCodes: document.languageCodes,
      fileName: documentWithMetadata.fileName,
      tradeItemIds: tradeItemIds,
      notDefinitive: document.notDefinitive,
      notExportable: document.notExportable,
      old: document.old,
      exclusiveRetailerIds: authorizedRetailers.map((retailer) => retailer.retailerId),
    })
      .then(() => {
        notifyResult("video.toast.updateDocument", "video.toast.updateDocumentSuccess");
        onClose({
          title: document.title,
          categories: [document.category],
          languageCodes: document.languageCodes,
        });
      })
      .catch(() => {
        notifyResult("video.toast.updateDocument", "video.toast.updateDocumentFailed", "error");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onDeleteDocument = () => {
    if (!window.confirm(translate("video.form.documentDeleteConfirmation"))) return;

    setLoading(true);
    deleteResourceForUser(id).then(() => {
      notifyResult("video.toast.deleteDocument", ["video.toast.deleteDocumentSuccess", { title: documentWithMetadata.title || "" }]);
      onDelete();
    })
    .catch(() => {
      notifyResult("video.toast.deleteDocument", "video.toast.deleteDocumentFailed", "error");
    })
    .finally(() => {
      setLoading(false);
    });
  };

  const onCancel = () => {
    onClose && onClose()
  };

  return (
    <Box minHeight="100%" display="flex" flexDirection="column">
      <PageTitle>{documentWithMetadata.title}</PageTitle>
      <br/>

      <Box marginBottom={5}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', marginBottom: 2 }}>
          <Tabs
            value={selectedTabIndex}
            onChange={(_, index) => setSelectedTabIndex(index)}
          >
            <Tab value={0} label={translate("video.modalTabs.information")} />
            <Tab value={1} label={translate("video.modalTabs.tradeItems")} />
            <Tab value={2} label={translate("video.modalTabs.links")} />
          </Tabs>
        </Box>

        <FormWrapper height={wrapperHeight} show={selectedTabIndex === 0}>
          <FormField error={dirty && errors.title}>
            <Label block>{translate("video.form.title")}</Label>
            <Input
              block
              helperText="123"
              value={document.title ?? ''}
              onChange={(e) => onUpdateField("title", e.target.value)}
            />
          </FormField>

          <FormField error={dirty && errors.Index}>
            <Label block>{translate("video.form.index")}</Label>
            <Input
              block
              type="number"
              value={document.index ?? ''}
              onChange={(e) => onUpdateField("index", +e.target.value)}
            />
          </FormField>

          <FormField error={dirty && errors.category}>
            <Label block>{translate("video.form.category")}</Label>
            <VirtualizedAutocomplete
              size="small"
              options={categoryOptions}
              value={document.category ?? ''}
              getOptionLabel={(option) => translate(`video.meta.categories.${option}`)}
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
              value={document.languageCodes ?? []}
              onChange={(_, value) => onUpdateField("languageCodes", value)}
            />
          </FormField>

          <FormField>
            <Label block>{translate("video.table.retailer")}</Label>
            <VirtualizedAutocomplete
              size="small"
              multiple
              disableCloseOnSelect
              options={retailerOptions}
              getOptionValue={(o) => get(o, "retailerId")}
              getOptionLabel={(o) => get(o, "retailerName") || o}
              value={authorizedRetailers ?? []}
              onChange={(_, value) => setAuthorizedRetailers(value)}
            />
          </FormField>

          <Box display="flex">
            <Box flex={1}>
              <div className="whitespace-nowrap">
                <Input
                  id="not-definitive"
                  type="checkbox"
                  checked={document.notDefinitive || false}
                  onChange={(e) => onUpdateField("notDefinitive", e.target.checked)}
                />
                &nbsp;&nbsp;
                <Label htmlFor="not-definitive">{translate("video.form.notDefinitive")}</Label>
              </div>
            </Box>
            <Box flex={1}>
              <div className="whitespace-nowrap">
                <Input
                  id="not-exportable"
                  type="checkbox"
                  checked={document.notExportable || false}
                  onChange={(e) => onUpdateField("notExportable", e.target.checked)}
                />
                &nbsp;&nbsp;
                <Label htmlFor="not-exportable">{translate("video.form.notExportable")}</Label>
              </div>
            </Box>
            <Box flex={1}>
              <div className="whitespace-nowrap">
                <Input
                  id="old-checkbox"
                  type="checkbox"
                  checked={document.old || false}
                  onChange={(e) => onUpdateField("old", e.target.checked)}
                />
                &nbsp;&nbsp;
                <Label htmlFor="old-checkbox">{translate("video.form.old")}</Label>
              </div>
            </Box>
          </Box>
        </FormWrapper>

        <FormWrapper height={wrapperHeight} show={selectedTabIndex === 1}>
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
        </FormWrapper>

        <FormWrapper height={wrapperHeight} show={selectedTabIndex === 2}>
          <a href={documentWithMetadata.publicUrl}>{documentWithMetadata.publicUrl}</a>
        </FormWrapper>
      </Box>

      <Row right style={{ marginTop: "auto" }}>
        <Col col left>
          <Button onClick={onDeleteDocument} small danger>
            {translate("video.form.delete")}
          </Button>
        </Col>
        <Col col right>
          <Button onClick={onCancel} small light>
            {translate("video.form.cancel")}
          </Button>
          <Button
            onClick={onSave}
            small
            primary
            style={{
              marginRight: "0",
            }}
          >
            {translate("video.form.update")}
          </Button>
        </Col>
      </Row>
    </Box>
  );
}
export default withLocalization(DocumentUpdateForm);
