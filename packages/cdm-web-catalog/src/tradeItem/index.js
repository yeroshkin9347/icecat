import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import dotProps from "dot-prop-immutable";
// import ScrollableAnchor, { goToAnchor } from 'react-scrollable-anchor'
import Sticky from "react-stickynode";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import map from "lodash/map";
import {
  Row,
  Col,
  Padding,
  Margin,
  Container,
} from "cdm-ui-components";
import { withLocalization } from "common/redux/hoc/withLocalization";
import {
  allowVideos,
  allowPdf,
  allowViewPricing,
  isRetailer,
} from "cdm-shared/redux/hoc/withAuth";
import TradeItemBanner from "./TradeItemBanner";
import Logistic from "./Logistic";
import Pricing from "./Pricing";
import ImagesThumbsRow from "./ImagesThumbsRow";
import InterSectionBanner from "./InterSectionBanner";
import Images from "./Images";
import Videos from "./Videos";
import Documents from "./Documents";
import TradeItemChildren from "./TradeItemChildren";
import Gallery from "cdm-shared/component/Gallery";
import { getGalleryModel } from "./models";
import PdfExportActionPicker from "../exportation/PdfExportActionPicker";
import GeneralInformation from "./GeneralInformation";
import withUser from "cdm-shared/redux/hoc/withUser";
import { getInitialState, reducer } from "../catalog/reducer";
import { paramObject } from "cdm-shared/utils/url";
import { StateProvider } from "cdm-shared/hook/useStateValue";
import { Toast } from "cdm-ui-components";
import Variants from "./Variants";
import LoaderOverlay from "cdm-shared/component/LoaderOverlay";
import { getTradeItem } from "cdm-shared/component/tradeItemCrud/api";
import { getImageResourceMetadatasFromTradeItem } from "./utils";
import ActionBar from "styled-components/action-bar/ActionBar";
import { Breadcrumbs, Typography } from "@mui/material";
import { formatEan } from "cdm-shared/utils/format";
import { Link } from "react-router-dom/cjs/react-router-dom";
import { compact } from "lodash";
import { MENU_MAIN_HEIGHT_NUMBER } from '../menu/index';
import { ModalStyled } from "cdm-shared/component/styled/modal/ModalStyled";
import TradeItemActions from './TradeItemActions';
import styled from "styled-components";
import { ZoneStyled } from "styled-components/zone/ZoneStyled";

const ActionBarWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex: 1;
  padding-right: 18px;
`;

const ColNoPadding = styled(Col)`
  padding-left: 0;
  padding-right: 0;
`;

const TradeItemActionsWrapper = styled.div`
  display: flex;
`;

const MediaWrapper = styled(Padding)`
  padding-left: 3rem;
  padding-right: 3rem;
`;

function init(state) {
  const urlFilters = paramObject();
  const filters = isEmpty(urlFilters)
    ? state.filters
    : { ...state.filters, ...urlFilters };
  return {
    ...state,
    initialKeywordFromUrl: get(paramObject(), "keyword") || null,
    filters,
  };
}

function TradeItem({
  // common props
  user,
  currentLocaleCode,
  history,
  match,
  // common functions
  translate,
}) {
  return (
    <StateProvider
      initialState={getInitialState()}
      reducer={reducer}
      init={init}
    >
      <TradeItemContent
        user={user}
        currentLocaleCode={currentLocaleCode}
        history={history}
        match={match}
        translate={translate}
      />
    </StateProvider>
  );
}

function TradeItemContent({
  user,
  history,
  match,
  // functions
  translate,
}) {
  const [tradeItem, setTradeItem] = useState(null);
  const [loadingTradeItem, setLoadingTradeItem] = useState(false);
  const [cacheImageMetadata, setCacheImageMetadata] = useState([]);
  const [gallery, setGallery] = useState(getGalleryModel());
  const [showPdfExport, setShowPdfExport] = useState(false);
  const [gtin, setGtin] = useState();
  const [manufacturerCode, setManufacturerCode] = useState();
  const [toast, setToast] = useState(false);
  const [activeLanguage, setActiveLanguage] = useState(match.params.lang);

  useEffect(() => {
    retrieve(match.params.lang, match.params.tradeItemId);
  }, [match]);

  useEffect(() => {
    if (toast) {
      setTimeout(() => setToast(false), 5000);
    }
  }, [toast]);

  const retrieve = (locale, tradeItemId) => {
    setLoadingTradeItem(true);
    return getTradeItem(user)(tradeItemId, locale)
      .then((resStorage) => {
        const tradeItem = { ...get(resStorage, "data", {}) };
        delete tradeItem.marketing;
        delete tradeItem.logistic;
        let newTradeItem = dotProps.set(
          tradeItem,
          "marketing.values",
          get(resStorage, "data.marketing.0.values")
        );
        newTradeItem = dotProps.set(
          newTradeItem,
          "marketing.translations",
          get(resStorage, "data.marketing.0.translations")
        );
        newTradeItem = dotProps.set(
          newTradeItem,
          "logistic",
          get(resStorage, "data.logistic.0")
        );
        newTradeItem = dotProps.set(
          newTradeItem,
          "catalogPrices",
          get(resStorage, "data.catalogPrices")
        );
        newTradeItem = dotProps.set(
          newTradeItem,
          "children",
          get(resStorage, "data.children")
        );
        newTradeItem = dotProps.set(
          newTradeItem,
          "variantDefinitions",
          get(resStorage, "data.variantDefinitions")
        );

        setTradeItem(newTradeItem);
        setCacheImageMetadata(
          getImageResourceMetadatasFromTradeItem(newTradeItem, isRetailer(user))
        );
        setGtin(newTradeItem.identities[0]?.gtin?.value);
        setManufacturerCode(
          newTradeItem.identities[0]?.tradeItemManufacturerCode
        );
        setLoadingTradeItem(false);

        return tradeItem;
      })
      .catch((err) => {
        console.log(err);
        setLoadingTradeItem(false);
      });
  };

  const changeLocale = (locale) => {
    history.push(`/product/${locale}/${get(tradeItem, "tradeItemId")}`);
    setActiveLanguage(locale);
  };

  const selectImage = (imageIndex) => {
    setGallery(
      Object.assign({}, gallery, {
        opened: true,
        imageIndex,
      })
    );
  };

  return (
    <>
      {/* Banner */}
      {loadingTradeItem && <LoaderOverlay />}

      <Sticky top={MENU_MAIN_HEIGHT_NUMBER} innerZ={100}>
        <ActionBar showProductSearch containerStyle={{ alignItems: 'center', height: 'auto' }}>
          <ActionBarWrapper>
            <Breadcrumbs aria-label="breadcrumb">
              <Link to="/">
                {translate("header.nav.home")}
              </Link>
              <Link to="/catalog">
                {translate("header.nav.catalog")}
              </Link>
              <Typography color="text.primary">
                {compact([formatEan(gtin), manufacturerCode, get(tradeItem, "marketing.values.title", "")]).join(" / ")}
              </Typography>
            </Breadcrumbs>

            <TradeItemActionsWrapper>
              <TradeItemActions tradeItem={tradeItem} onExportPdf={() => setShowPdfExport(true)} />
            </TradeItemActionsWrapper>

          </ActionBarWrapper>
        </ActionBar>
      </Sticky>

      <TradeItemBanner
        tradeItem={tradeItem}
        translate={translate}
        activeLanguage={activeLanguage}
        changeActiveLanguage={(locale) => changeLocale(locale)}
        gtin={gtin}
        manufacturerCode={manufacturerCode}
        user={user}
        onExportPdf={() => setShowPdfExport(true)}
      />

      {/* Main zone */}
      <ZoneStyled
        transparent
        noShadow
        responsive
      >
        {/* Thumbs */}
        <ImagesThumbsRow
          tradeItemId={match.params.tradeItemId}
          tradeItem={tradeItem}
          user={user}
          translate={translate}
          onImageSelected={(imageIndex) => selectImage(imageIndex)}
        />
      </ZoneStyled>

      {/* Split content into two columns */}
      {/* Reminder on the left */}
      <Container fluid>
        <Row>
          {/* Infos */}
          <ColNoPadding col={12}>
            <Padding top={5} />

            {!!tradeItem && !isEmpty(tradeItem.variantDefinitions) && (
              <Variants
                tradeItem={tradeItem}
                translate={translate}
                lang={match.params.lang}
              />
            )}

            {/* Marketing */}
            <GeneralInformation tradeItem={tradeItem} translate={translate} />

            {/* Logistic */}
            <Logistic tradeItem={tradeItem} translate={translate} user={user} />

            {/* Pricing */}
            {allowViewPricing(user) && (
              <Pricing tradeItem={tradeItem} translate={translate} />
            )}

            {/* Trade item children */}
            <TradeItemChildren
              tradeItem={tradeItem}
              translate={translate}
              currentLanguageCode={match.params.lang}
            />

            <Margin bottom={7} />

            {/* Intersection */}
            <InterSectionBanner
              style={{
                paddingBottom: "8em",
              }}
            >
              {/* Media */}
              <MediaWrapper id="images-ref">
                {/* Images */}
                <Row>
                  <ColNoPadding col style={{ marginTop: "-5em" }}>
                    <Images
                      tradeItem={tradeItem}
                      translate={translate}
                      onImageSelected={(imageIndex) => selectImage(imageIndex)}
                    />
                  </ColNoPadding>
                </Row>

                {/* Videos */}
                {allowVideos(user) && (
                  <Row>
                    <ColNoPadding col>
                      <Margin top={5} />

                      <Videos tradeItem={tradeItem} translate={translate} />
                    </ColNoPadding>
                  </Row>
                )}

                {/* Documents */}
                <Row>
                  <ColNoPadding col>
                    <Margin top={5} />

                    <Documents tradeItem={tradeItem} translate={translate} />
                  </ColNoPadding>
                </Row>
              </MediaWrapper>
            </InterSectionBanner>

            <Padding top={6} />

            {/* Gallery */}
            {!isEmpty(cacheImageMetadata) && (
              <Gallery
                images={map(cacheImageMetadata, (img) => get(img, "publicUrl"))}
                opened={gallery.opened}
                imageIndex={gallery.imageIndex}
                goToImage={(imageIndex) =>
                  setGallery(dotProps.set(gallery, "imageIndex", imageIndex))
                }
                onClose={() =>
                  setGallery(dotProps.set(gallery, "opened", false))
                }
              />
            )}

            {/* Get pdf */}
            {allowPdf(user) && showPdfExport && (
              <ModalStyled sm>
                <PdfExportActionPicker
                  tradeItemId={get(tradeItem, "tradeItemId", null)}
                  scope={get(tradeItem, "tradeItemId", null)}
                  gtin={gtin}
                  manufacturerExternalId={get(user, "externalManufacturerId")}
                  langCode={get(tradeItem, "languageCode")}
                  onSuccess={() => setShowPdfExport(false)}
                  onCancel={() => setShowPdfExport(false)}
                  setToast={() => setToast(true)}
                />
              </ModalStyled>
            )}
          </ColNoPadding>
        </Row>
      </Container>
      {toast && (
        <Toast
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            zIndex: 3002,
          }}
          danger
        >
          {translate("export.pdf.tradeItemNotAvailable")}
        </Toast>
      )}
    </>
  );
}

export default withRouter(
  withUser(
    withLocalization(TradeItem)
  )
);
