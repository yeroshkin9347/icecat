import React, {useEffect, useMemo, useState} from "react";
import styled from "styled-components";
import {Tab, Tabs} from "@mui/material";
import {Button, Col, Input, Label, Loader, Margin, Row} from "cdm-ui-components";
import get from "lodash/get";
import {withLocalization} from "common/redux/hoc/withLocalization";
import {PageTitle} from "cdm-shared/component/Banner";
import ProductsTable from "cdm-shared/component/product/ProductsTable";
import {ModalStyled} from "cdm-shared/component/styled/modal/ModalStyled";
import LoaderOverlay from "cdm-shared/component/LoaderOverlay";
import {getTradeItemsByIds} from "cdm-shared/services/product";
import {getIcecatContentToken} from "cdm-shared/redux/hoc/withAuth";
import {
  getRetailerDocumentMetadataById,
  getRetailerImageMetadataById,
  getRetailerVideoMetadataById,
} from "cdm-shared/services/videos";
import DocumentIcon from "./DocumentIcon";
import TradeItemSelector from "cdm-shared/component/tradeitem/TradeItemSelector";

const VideoContainer = styled.div`
  position: relative;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
`;

const VideoLoader = styled.div`
  position: absolute;
`;

const ImagePreview = styled.div`
  width: 100%;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  
  img {
    max-width: 100%;
    max-height: 100%;
    border: 1px solid #E8EAED;
    border-radius: 4px;
  }
`;

const DocumentPreview = styled.div`
  width: 200px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #E8EAED;
  border-radius: 4px;
  margin: 0 auto 1.5rem;
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

const AssetDetail = ({
  asset,
  assetType,
  user,
  currentLocaleCode,
  translate,
  onClose,
}) => {
  const [metadata, setMetadata] = useState({});
  const [tradeItems, setTradeItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState('info');

  const previewUrl = useMemo(() => {
    let thumbUrl = get(asset, "thumbUrl") || "";
    if (thumbUrl.endsWith("?ContentToken="))
      thumbUrl += getIcecatContentToken(user);
    return thumbUrl;
  }, [user, asset]);

  const videoUrl = useMemo(() => {
    const externalId = get(metadata, 'externalId');
    if (!externalId) {
      return '';
    }
    return `https://video.cedemo.com/i/?prefer=html5&clID=4&div=cedemoPlayer&h=100%&noJQ=0&codeType=video&code=${externalId}&w=100%&ratio=1.87&plType=VerticalList`;
  }, [metadata]);

  const tradeItemIds = useMemo(
    () => tradeItems.map((item) => item.tradeItemId),
    [tradeItems]
  );

  useEffect(() => {
    let getMetadataFn;
    if (assetType === 'video') {
      getMetadataFn = getRetailerVideoMetadataById;
    } else if (assetType === 'image') {
      getMetadataFn = getRetailerImageMetadataById;
    } else if (assetType === 'document') {
      getMetadataFn = getRetailerDocumentMetadataById;
    }

    if (!getMetadataFn) {
      return;
    }
    setLoading(true);
    getMetadataFn(asset.id).then(async (res) => {
      const metadata = res.data;
      setMetadata(metadata);

      if (metadata.tradeItemIds?.length) {
        await getTradeItemsByIds(metadata.tradeItemIds, currentLocaleCode).then((res) => {
          setTradeItems(res.data);
        });
      }
    }).finally(() => {
      setLoading(false);
    });
  }, [asset.id, assetType, currentLocaleCode]);

  return (
    <ModalStyled md onClose={onClose}>
      <PageTitle>{asset.title}</PageTitle>
      <br/>

      {loading ? (
        <div style={{ height: '60vh' }}>
          <LoaderOverlay/>
        </div>
      ) : (
        <>
          {assetType === 'video' && (
            <VideoContainer>
              <VideoLoader>
                <Loader />
              </VideoLoader>
              <iframe
                title={get(asset, "title")}
                width={600}
                height={350}
                frameBorder={0}
                src={videoUrl}
                style={{ position: 'relative' }}
              />
            </VideoContainer>
          )}
          {assetType === 'image' && (
            <ImagePreview>
              <img src={previewUrl} alt="" />
            </ImagePreview>
          )}
          {assetType === 'document' && (
            <DocumentPreview>
              <DocumentIcon asset={asset} size={96} />
            </DocumentPreview>
          )}

          <Tabs value={tab} onChange={(_, value) => setTab(value)}>
            <Tab label={translate("video.form.information")} value="info" />
            <Tab label={translate("video.form.tradeItems")} value="tradeItems" />
            <Tab label={translate("video.form.links")} value="links" />
          </Tabs>
          <br />

          {tab === 'info' && (
            <>
              <Row style={{ rowGap: '1rem' }}>
                <Col col={12}>
                  <FormField>
                    <Label block>{translate("video.form.title")}</Label>
                    <Input
                      block
                      value={get(asset, 'title') ?? ''}
                      disabled
                    />
                  </FormField>
                </Col>

                <Col col={6}>
                  <FormField>
                    <Label block>{translate("video.form.category")}</Label>
                    <Input
                      block
                      value={get(asset, 'categories[0]') ?? ''}
                      disabled
                    />
                  </FormField>
                </Col>

                <Col col={6}>
                  <FormField>
                    <Label block>{translate("video.form.languages")}</Label>
                    <Input
                      block
                      value={get(asset, 'languageCodes')?.join(', ') ?? ''}
                      disabled
                    />
                  </FormField>
                </Col>

                <Col col={6}>
                  <FormField>
                    <Label block>{translate("video.form.retailer")}</Label>
                    <Input
                      block
                      value={get(asset, 'exclusiveRetailers')?.join(', ') ?? ''}
                      disabled
                    />
                  </FormField>
                </Col>

                {assetType === 'video' && (
                  <Col col={6}>
                    <FormField>
                      <Label block>{translate("video.form.rating")}</Label>
                      <Input
                        block
                        value={get(metadata, 'rating') ?? ''}
                        disabled
                      />
                    </FormField>
                  </Col>
                )}

                {assetType === 'image' && (
                  <Col col={6}>
                    <FormField>
                      <Label block>{translate("video.form.plungeAngle")}</Label>
                      <Input
                        block
                        value={get(metadata, 'plungeAngle') ?? ''}
                        disabled
                      />
                    </FormField>
                  </Col>
                )}

                {assetType === 'image' && (
                  <Col col={6}>
                    <FormField>
                      <Label block>{translate("video.form.facingType")}</Label>
                      <Input
                        block
                        value={get(metadata, 'facingType') ?? ''}
                        disabled
                      />
                    </FormField>
                  </Col>
                )}
              </Row>
            </>
          )}

          {tab === 'tradeItems' && (
            <>
              <Label block>{translate("video.form.tradeItems")}</Label>
              <TradeItemSelector
                mode="multi-select"
                searchable={false}
                placeholder={translate("video.form.tradeItemsPlaceholder")}
                selectedIds={tradeItemIds}
                allTradeItems={tradeItems}
                panelStyle={{ width: 'calc(100vw - 2rem)', maxWidth: '70rem' }}
              />
              <Margin top={2} />
              <ProductsTable
                products={tradeItems}
                visibleColumns={productsTableColumns}
              />
            </>
          )}

            {tab === 'links' && (
              <>
                {assetType === 'video' && (
                  <a href={videoUrl} target="_blank" rel="noopener noreferrer">{ asset.fileName }</a>
                )}
                {assetType === 'image' && (
                  <>
                    <div>
                      <a href={previewUrl} target="_blank" rel="noopener noreferrer">{translate('video.form.thumbnail')}</a>
                    </div>
                    {metadata?.publicUrl && (
                      <div>
                        <a href={metadata.publicUrl} target="_blank" rel="noopener noreferrer">{asset.fileName}</a>
                      </div>
                    )}
                  </>
                )}
                {assetType === 'document' && (
                  <a href={asset.publicUrl} target="_blank" rel="noopener noreferrer">{asset.fileName}</a>
                )}
              </>
            )}

          <Row
            right
            style={{marginTop: "30px"}}
          >
            <Col col right>
              <Button
                small
                primary
                onClick={onClose}
              >
                {translate("video.form.close")}
              </Button>
            </Col>
          </Row>
        </>
      )}
    </ModalStyled>
  );
}
export default withLocalization(AssetDetail);
