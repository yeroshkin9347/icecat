import React, { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { Button, Input, Label, Row, Col, Loader } from "cdm-ui-components";
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import {Delete as DeleteIcon} from '@mui/icons-material';
import compact from "lodash/compact";
import find from "lodash/find";
import get from "lodash/get";
import isArray from "lodash/isArray";
import isObject from "lodash/isObject";
import { withLocalization } from "common/redux/hoc/withLocalization";
import { PageTitle } from "cdm-shared/component/Banner";
import TradeItemSelector from "cdm-shared/component/tradeitem/TradeItemSelector";
import ProductsTable from "cdm-shared/component/product/ProductsTable";
import { getTradeItemsByIds } from "cdm-shared/services/product";
import { getVideoMetadataById } from "cdm-shared/services/videos";
import {
  deleteResourceForUser,
  updateVideoResourceForUser
} from "cdm-shared/services/resource";
import useNotifications from "cdm-shared/hook/useNotifications";
import useLocalization from "cdm-shared/hook/useLocalization";
import { VIDEO_CATEGORIES, VIDEO_CENSORS } from "./categories";
import { getAllLanguages } from "cdm-shared/component/tradeItemCrud/api";
import {getLinkedRetailers} from "cdm-shared/services/subscription";
import {VirtualizedAutocomplete} from "cdm-shared/component/styled/form-controls/StyledAutocomplete";

const FormWrapper = styled(Box)`
  overflow-y: auto;
  display: ${(props) => props.show ? 'flex' : 'none'};
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

const VideoContainer = styled.div`
  position: relative;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
`;

const VideoLoader = styled.div`
  position: absolute;
`;

const productsTableColumns = ['manufacturerName', 'gtin', 'tradeItemManufacturerCode', 'title', 'category', 'languageAvailable'];
const productsTableActions = ["remove"];

const MIN_FORM_HEIGHT = 530;

const VideoUpdateForm = ({ id, actions, translate, setLoading, onDelete, onClose }) => {
  const [, notify] = useNotifications();
  const [currentLocaleCode] = useLocalization();

  const [video, setVideo] = useState({});
  const [videoWithMetadata, setVideoWithMetadata] = useState({});
  const [categoryOptions] = useState(VIDEO_CATEGORIES);
  const [censorOptions] = useState(VIDEO_CENSORS);
  const [languageOptions, setLanguageOptions] = useState([]);
  const [retailerOptions, setRetailerOptions] = useState([]);
  const [dirty, setDirty] = useState(false);

  const [languageCodes, setLanguageCodes] = useState([]);
  const [videoCategories, setVideoCategories] = useState([]);
  const [censors, setCensors] = useState([]);
  const [authorizedRetailers, setAuthorizedRetailers] = useState([]);
  const [tradeItems, setTradeItems] = useState([]);
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  const [wrapperHeight, setWrapperHeight] = useState(MIN_FORM_HEIGHT);

  const previewUrl = useMemo(() => {
    const externalId = get(videoWithMetadata, "externalId");
    if (externalId) {
      return (
        `https://video.cedemo.com/i/?prefer=html5&clID=4&div=cedemoPlayer&h=100%&noJQ=0&codeType=video&code=${
          externalId
        }&w=100%&ratio=1.87&plType=VerticalList`
      );
    }

    return '';
  }, [videoWithMetadata]);

  const tradeItemIds = useMemo(
    () => tradeItems.map((item) => item.tradeItemId),
    [tradeItems]
  );

  const errors = useMemo(() => {
    const messages = {};
    if (!videoCategories?.length) {
      messages.categories = 'Required';
    }
    return messages;
  }, [videoCategories]);

  useEffect(() => {
    if (id) {
      setLoading(true);
      getVideoMetadataById(id).then(async (res) => {
        const videoMetaData = res.data;
        setVideoWithMetadata(videoMetaData);

        setVideo({
          title: videoMetaData.title,
          index: videoMetaData.index,
          notDefinitive: videoMetaData.notDefinitive ?? false,
          notExportable: videoMetaData.notExportable ?? false,
          old: videoMetaData.old,
        });
        setLanguageCodes(videoMetaData.languageCodes || []);
        setVideoCategories(videoMetaData.videoCategories || []);
        setCensors(videoMetaData.censors || []);
        setAuthorizedRetailers(videoMetaData.authorizedRetailers || []);

        if (videoMetaData.tradeItemIds?.length) {
          await getTradeItemsByIds(videoMetaData.tradeItemIds, currentLocaleCode)
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

      getLinkedRetailers().then((res) => {
        setRetailerOptions(res.data);
      });
    }
  }, [currentLocaleCode, id, setLoading]);

  useEffect(() => {
    if (video && video.censors && censorOptions) {
      setCensors(
        compact(
          (video.censors || []).map((censor) => {
            const opt = find(censorOptions, { value: censor });
            return opt ? opt : { value: censor, label: censor };
          })
        )
      );
    }
  }, [video, censorOptions]);

  useEffect(() => {
    setWrapperHeight(Math.min(window.innerHeight * 0.95 - 70 - 620, MIN_FORM_HEIGHT));
    const handleResize = () => {
      setWrapperHeight(Math.min(window.innerHeight * 0.95 - 70 - 620, MIN_FORM_HEIGHT));
    }
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const notifyResult = useCallback((title, description, type = "success") => {
    notify({
      title: translate(title),
      body: translate(...(Array.isArray(description) ? description : [description])),
      severity: type,
      dismissAfter: 3000,
    });
  }, [notify, translate]);

  const onUpdateField = (property, value) => {
    setVideo({
      ...video,
      [property]: isArray(value) ? [...value] : value,
    });
  };

  const onSave = () => {
    setDirty(true);
    if (Object.keys(errors).length) {
      return;
    }

    setLoading(true);
    updateVideoResourceForUser({
      ...video,
      metadataId: id,
      title: video.title,
      index: video.index,
      videoCensors: censors,
      languageCodes,
      exclusiveRetailerIds: (authorizedRetailers || []).map((retailer) =>
        isObject(retailer) ? retailer.id : retailer
      ),
      videoCategories,
      tradeItemIds: (tradeItems || []).map((tradeItem) =>
        isObject(tradeItem) ? tradeItem.tradeItemId : tradeItem
      ),
      notDefinitive: video.notDefinitive,
      notExportable: video.notExportable,
      old: video.old
    })
      .then(() => {
        notifyResult("video.toast.updateVideo", "video.toast.updateVideoSuccess");
        onClose({
          title: video.title,
          categories: videoCategories,
          languageCodes,
        });
      })
      .catch(() => {
        notifyResult("video.toast.updateVideo", "video.toast.updateVideoFailed", "error");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onDeleteVideo = () => {
    if (!window.confirm(translate("video.form.videoDeleteConfirmation"))) return;

    setLoading(true);
    deleteResourceForUser(id).then(() => {
      notifyResult("video.toast.deleteVideo", ["video.toast.deleteVideoSuccess", { title: videoWithMetadata.title || "" }]);
      onDelete();
    })
    .catch(() => {
      notifyResult("video.toast.deleteVideo", "video.toast.deleteVideoFailed", "error");
    })
    .finally(() => {
      setLoading(false);
    });
  };

  const onCancel = () => {
    onClose && onClose()
  };

  const onSelectTradeItem = useCallback((tradeItem) => {
    setTradeItems((prev) => [...prev, tradeItem]);
  }, []);

  const onDeselectTradeItem = useCallback((tradeItem) => {
    setTradeItems((prev) =>
      prev.filter((item) => item.tradeItemId !== tradeItem.tradeItemId)
    );
  }, []);

  return (
    <Box minHeight="100%" display="flex" flexDirection="column">
      <PageTitle>{video.title}</PageTitle>
      <br/>

      <Box marginBottom={5}>
        <VideoContainer>
          <VideoLoader>
            <Loader/>
          </VideoLoader>
          <iframe
            title={get(video, "title")}
            width={600}
            height={350}
            frameBorder={0}
            src={previewUrl}
            style={{position: 'relative'}}
          />
        </VideoContainer>
        <br/>

        <Box sx={{borderBottom: 1, borderColor: 'divider', marginBottom: 2}}>
          <Tabs
            value={selectedTabIndex}
            onChange={(_, index) => setSelectedTabIndex(index)}
          >
            <Tab value={0} label={translate("video.modalTabs.information")}/>
            <Tab value={1} label={translate("video.modalTabs.tradeItems")}/>
            <Tab value={2} label={translate("video.modalTabs.links")}/>
          </Tabs>
        </Box>

        <FormWrapper height={wrapperHeight} show={selectedTabIndex === 0}>
          <FormField>
            <Label block>{translate("video.form.title")}</Label>
            <Input
              onChange={(e) => onUpdateField("title", e.target.value)}
              value={video.title}
              block
            />
          </FormField>

          <FormField error={dirty && errors.index}>
            <Label block>{translate("video.form.index")}</Label>
            <Input
              block
              type="number"
              value={video.index ?? ''}
              onChange={(e) => onUpdateField("index", +e.target.value)}
            />
          </FormField>

          <FormField>
            <Label block>{translate("video.form.languages")}</Label>
            <VirtualizedAutocomplete
              size="small"
              multiple
              options={languageOptions}
              value={languageCodes}
              onChange={(_, value) => setLanguageCodes(value)}
            />
          </FormField>

          <FormField error={dirty && errors.categories}>
            <Label block>{translate("video.form.categories")}</Label>
            <VirtualizedAutocomplete
              size="small"
              multiple
              options={categoryOptions}
              value={videoCategories}
              onChange={(_, value) => setVideoCategories(value)}
            />
          </FormField>

          <FormField error={dirty && errors.categories}>
            <Label block>{translate("video.form.videoCensors")}</Label>
            <VirtualizedAutocomplete
              size="small"
              multiple
              options={censorOptions}
              value={censors}
              onChange={(_, value) => setCensors(value)}
            />
          </FormField>

          <FormField error={dirty && errors.categories}>
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

          <Box display="flex">
            <Box flex={1}>
              <div className="whitespace-nowrap">
                <Input
                  id="not-definitive"
                  type="checkbox"
                  checked={video.notDefinitive || false}
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
                  checked={video.notExportable || false}
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
                  checked={video.old || false}
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
            panelStyle={{width: 'calc(100vw - 2rem)', maxWidth: '70rem'}}
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
                <DeleteIcon fontSize="inherit"/>
              </IconButton>
            }
            onRemoveRow={onDeselectTradeItem}
          />
        </FormWrapper>

        <FormWrapper height={wrapperHeight} show={selectedTabIndex === 2}>
          <a href={videoWithMetadata.publicUrl}>{videoWithMetadata.publicUrl}</a>
        </FormWrapper>

        {actions && (
          actions({onSubmit: onSave})
        )}
      </Box>

      <Row right style={{ marginTop: "auto" }}>
        <Col col left>
          <Button onClick={onDeleteVideo} small danger>
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
};

export default withLocalization(VideoUpdateForm);
