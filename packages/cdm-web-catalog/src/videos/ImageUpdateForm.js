import React, {useCallback, useEffect, useMemo, useState} from "react";
import styled from "styled-components";
import { Button, Col, Input, Label, Row } from "cdm-ui-components";
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import {withLocalization} from "common/redux/hoc/withLocalization";
import {PageTitle} from "cdm-shared/component/Banner";
import {
  deleteResourceForUser,
  getFacingTypes,
  getPlungeAngles,
  updateImageResourceForUser,
} from "cdm-shared/services/resource";
import { getAllLanguages } from "cdm-shared/component/tradeItemCrud/api";
import TradeItemSelector from "cdm-shared/component/tradeitem/TradeItemSelector";
import ProductsTable from "cdm-shared/component/product/ProductsTable";
import { VirtualizedAutocomplete } from "cdm-shared/component/styled/form-controls/StyledAutocomplete";
import { getImageMetadataById } from "cdm-shared/services/videos";
import { getTradeItemsByIds } from "cdm-shared/services/product";
import useNotifications from "cdm-shared/hook/useNotifications";
import get from "lodash/get";
import {IMAGE_CATEGORIES} from "./categories";
import {getLinkedRetailers} from "cdm-shared/services/subscription";
import {Delete as DeleteIcon} from '@mui/icons-material';

const FormWrapper = styled(Box)`
  overflow-y: auto;
  display: ${(props) => props.show ? 'flex' : 'none'};
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

const MIN_FORM_HEIGHT = 680;

const ImageUpdateForm = ({
  id,
  translate,
  currentLocaleCode,
  setLoading,
  onDelete,
  onClose,
}) => {
  const [, notify] = useNotifications();

  const [languageOptions, setLanguageOptions] = useState([]);
  const [facingTypeOptions, setFacingTypeOptions] = useState([]);
  const [plungeAngleOptions, setPlungeAngleOptions] = useState([]);
  const [dirty, setDirty] = useState(false);
  const [retailerOptions, setRetailerOptions] = useState([]);

  const [image, setImage] = useState({});

  const [imageWithMetadata, setImageWithMetadata] = useState({});
  const [authorizedRetailers, setAuthorizedRetailers] = useState([]);
  const [tradeItems, setTradeItems] = useState([]);
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  const [wrapperHeight, setWrapperHeight] = useState(MIN_FORM_HEIGHT);

  const tradeItemIds = useMemo(
    () => tradeItems.map((item) => item.tradeItemId),
    [tradeItems]
  );

  const errors = useMemo(() => {
    const messages = {};
    if (!image.category) {
      messages.category = 'Required';
    }
    return messages;
  }, [image]);

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

  useEffect(() => {
    if (id) {
      setLoading(true);
      getImageMetadataById(id).then(async (res) => {
        const imageMetaData = res.data;
        setImageWithMetadata(imageMetaData);

        setImage({
          title: imageMetaData.title,
          category: imageMetaData.imageCategory,
          index: imageMetaData.index,
          languageCodes: imageMetaData.languageCodes,
          notDefinitive: imageMetaData.notDefinitive ?? false,
          notExportable: imageMetaData.notExportable ?? false,
          old: imageMetaData.old ?? false,
          facingType: imageMetaData.facingType,
          plungeAngle: imageMetaData.plungeAngle,
          tradeItemIds: imageMetaData.tradeItemIds
        });

        if (imageMetaData.tradeItemIds?.length) {
          await getTradeItemsByIds(imageMetaData.tradeItemIds, currentLocaleCode)
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
    setImage((prev) => ({
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

  useEffect(() => {
    setWrapperHeight(Math.min(window.innerHeight * 0.95 - 70 - 470, MIN_FORM_HEIGHT));
    const handleResize = () => {
      setWrapperHeight(Math.min(window.innerHeight * 0.95 - 70 - 470, MIN_FORM_HEIGHT));
    }
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const onSave = () => {
    setDirty(true);
    if (Object.keys(errors).length) {
      return;
    }

    setLoading(true);
    updateImageResourceForUser({
      metadataId: id,
      title: image.title,
      index: image.index,
      imageCategory: image.category,
      languageCodes: image.languageCodes,
      notDefinitive: image.notDefinitive ?? false,
      notExportable: image.notExportable ?? false,
      old: image.old ?? false,
      facingType: image.facingType,
      plungeAngle: image.plungeAngle,
      fileName: imageWithMetadata.fileName,
      exclusiveRetailerIds: authorizedRetailers.map((retailer) => retailer.retailerId),
      tradeItemIds: tradeItemIds
    })
      .then(() => {
        notifyResult("video.toast.updateImage", "video.toast.updateImageSuccess");
        onClose({
          title: image.title,
          categories: [image.category],
          languageCodes: image.languageCodes,
        });
      })
      .catch(() => {
        notifyResult("video.toast.updateImage", "video.toast.updateImageFailed", "error");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onDeleteImage = () => {
    if (!window.confirm(translate("video.form.imageDeleteConfirmation"))) return;

    setLoading(true);
    deleteResourceForUser(id).then(() => {
      notifyResult("video.toast.deleteImage", ["video.toast.deleteImageSuccess", { title: imageWithMetadata.title || "" }]);
      onDelete();
    })
    .catch(() => {
      notifyResult("video.toast.deleteImage", "video.toast.deleteImageFailed", "error");
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
      <PageTitle>{imageWithMetadata.title}</PageTitle>
      <br/>

      <Box marginBottom={5}>
        <ImagePreview>
          <img src={imageWithMetadata.publicUrl} alt=""/>
        </ImagePreview>
        <br/>

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
              value={image.title ?? ''}
              onChange={(e) => onUpdateField("title", e.target.value)}
            />
          </FormField>

          <FormField error={dirty && errors.index}>
            <Label block>{translate("video.form.index")}</Label>
            <Input
              block
              type="number"
              value={image.index ?? ''}
              onChange={(e) => onUpdateField("index", +e.target.value)}
            />
          </FormField>

          <FormField error={dirty && errors.category}>
            <Label block>{translate("video.form.category")}</Label>
            <VirtualizedAutocomplete
              size="small"
              options={IMAGE_CATEGORIES}
              getOptionLabel={(option) => translate(`video.meta.categories.${option}`)}
              value={image.category ?? ''}
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
              value={image.languageCodes ?? []}
              onChange={(_, value) => onUpdateField("languageCodes", value)}
            />
          </FormField>

          <FormField error={dirty && errors.retailer}>
            <Label block>{translate("video.form.retailer")}</Label>
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

          <FormField error={dirty && errors.plungeAngle}>
            <Label block>{translate("video.form.plungeAngle")}</Label>
            <VirtualizedAutocomplete
              size="small"
              options={plungeAngleOptions}
              getOptionLabel={(option) => translate(`video.meta.plungeAngles.${option}`)}
              value={image.plungeAngle ?? ''}
              onChange={(_, value) => onUpdateField("plungeAngle", value)}
            />
          </FormField>

          <FormField error={dirty && errors.facingType}>
            <Label block>{translate("video.form.facingType")}</Label>
            <VirtualizedAutocomplete
              size="small"
              options={facingTypeOptions}
              getOptionLabel={(option) => translate(`video.meta.facingTypes.${option}`)}
              value={image.facingType ?? ''}
              onChange={(_, value) => onUpdateField("facingType", value)}
            />
          </FormField>

          <Box display="flex">
            <Box flex={1}>
              <div className="whitespace-nowrap">
                <Input
                  id="not-definitive"
                  type="checkbox"
                  checked={image.notDefinitive || false}
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
                  checked={image.notExportable || false}
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
                  checked={image.old || false}
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
          <a href={imageWithMetadata.publicUrl}>{imageWithMetadata.publicUrl}</a>
        </FormWrapper>
      </Box>

      <Row right style={{ marginTop: "auto"}}>
        <Col col left>
          <Button onClick={onDeleteImage} small danger>
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
export default withLocalization(ImageUpdateForm);
