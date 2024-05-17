import React from "react";
import get from "lodash/get";
import reduce from "lodash/reduce";
import isEmpty from "lodash/isEmpty";
import flatten from "lodash/flatten";
import uniqBy from "lodash/uniqBy";
import isEqual from "lodash/isEqual";
import isNull from "lodash/isNull";
import {
  Row,
  Col,
  Padding,
} from "cdm-ui-components";
import { Container } from "styled-bootstrap-grid";
import withUser from "cdm-shared/redux/hoc/withUser";
import { paramObject } from "cdm-shared/utils/url";
import EditProperties from "./EditProperties";
import Images from "./media/Images";
import Documents from "./media/Documents";
import ProductManagementForm from "./productMangementForm/ProductManagementForm";
import TranslationsRow from "./translations/TranslationsRow";
import ImageViewer from "../ImageViewer";
import {
  LAYOUT_GROUP_CONFIGURATION,
  getTradeItemGroupCurrentItem,
  KEYED_PROPERTIES_GROUPS,
} from "./manager";
import { withGroupLocalContext } from "./store/PropertyGroupProvider";
import { withTargetMarketsLocalContext } from "./store/TargetMarketProvider";
import { withRetailersLocalContext } from "./store/RetailerProvider";
import { withEditionLocalContext } from "./store/EditionProvider";
import { withPlatformLocalContext } from "./store/PlatformProvider";
import { withTranslationsLocalContext } from "./store/TranslationProvider";
import { withTradeItemLocalContext } from "./store/TradeItemProvider";
import { getTradeItemsCms, getTradeItemsForManufacturer } from "../../services/product";

class Edit extends React.Component {
  constructor() {
    super();
    this.state = { selectedImage: null, isInitiatedSelectedVariantIndex: false };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { tradeItem, selectedVariantIndex } = nextProps;

    const {
      setSelectedVariantIndex,
      initiatedVariantId,
    } = this.props;

    const urlFilters = paramObject();
    const variantIdUrlParam = urlFilters && urlFilters.variantId;

    if (isNull(selectedVariantIndex) && !isEqual(this.props.tradeItem, tradeItem) && !this.state.isInitiatedSelectedVariantIndex) {
      if ((variantIdUrlParam || initiatedVariantId) && tradeItem && tradeItem.variantDefinitions && tradeItem.variantDefinitions.length) {
        this.setState({ isInitiatedSelectedVariantIndex: true });
        setSelectedVariantIndex(tradeItem.variantDefinitions.findIndex(variant => variant.tradeItemId === (variantIdUrlParam || initiatedVariantId)));
      }
    }
  }

  componentDidMount() {
    const { tradeItem, selectedGroupItemIndex } = this.props;

    const {
      setTradeItemValue,
      setIsLoadedVariantsInit,
      isAdmin
    } = this.props;



    const variants = get(tradeItem, 'variantDefinitions', []);

    const getTradeItemVariants = isAdmin ? getTradeItemsCms : getTradeItemsForManufacturer;

    getTradeItemVariants(variants.map((variant) => variant.tradeItemId))
      .then(res => {
        const valuesKey = `${getTradeItemGroupCurrentItem(KEYED_PROPERTIES_GROUPS["IMAGES"], selectedGroupItemIndex)}.values`;
        const files = reduce(
          res,
          (total, variantTradeItem) => {
            const imageResourceMetadatas = get(variantTradeItem, `data.${KEYED_PROPERTIES_GROUPS["IMAGES"]}`, []);
            const images = flatten(imageResourceMetadatas.map(imageResourceMetadata => get(imageResourceMetadata, 'values')));
            total = [
              ...total,
              ...images.map((image) => ({
                ...image,
                variantId: get(variantTradeItem, 'data.tradeItemId'),
              }))
            ];
            return total;
          },
          []
        );
        const result = uniqBy(
          [...get(tradeItem, valuesKey, []), ...files],
          f => f.id
        );
        setTradeItemValue(valuesKey, result);
        setIsLoadedVariantsInit(true);
      })
  }

  getValuesKey = () => {
    const {
      groupSelected,
      currentGroupKey,
      selectedGroupItemIndex,
      selectedVariantIndex,
      tradeItem,
      setTradeItemValue,
    } = this.props;
    const { getTranslationSelectedIndex } = this.props;
    const translationSelectedIndex = getTranslationSelectedIndex();
    const variants = get(tradeItem, "variantDefinitions", []);
    const selectedVariant = variants[selectedVariantIndex];

    let valuesKey = getTradeItemGroupCurrentItem(
      currentGroupKey,
      selectedGroupItemIndex
    );
    if (
      get(
        LAYOUT_GROUP_CONFIGURATION,
        `${groupSelected}.showPropertiesEdit`,
        false
      )
    ) {
      if (translationSelectedIndex !== -1) {
        valuesKey += `.translations.${translationSelectedIndex}`;
      }
      if (selectedVariantIndex !== null && selectedVariant) {
        let variantValues = get(tradeItem, `${valuesKey}.variantValues`, []);
        if (isEmpty(variantValues) && !isEmpty(variants)) {
          const newVariantValues = variants.map(variant => ({
            values: {},
            tradeItemId: variant.tradeItemId,
          }));
          setTradeItemValue(
            `${valuesKey}.variantValues`,
            newVariantValues
          );
          const selectedVariantValueIndex = newVariantValues.findIndex(
            (variantValue) =>
              variantValue.tradeItemId === selectedVariant.tradeItemId
          );
          valuesKey += `.variantValues.${selectedVariantValueIndex}`;
        } else {
          let selectedVariantValueIndex = variantValues.findIndex(
            (variantValue) =>
              variantValue.tradeItemId === selectedVariant.tradeItemId
          );
          if (selectedVariantValueIndex === -1) {
            selectedVariantValueIndex = variantValues.length;
            setTradeItemValue(
              `${valuesKey}.variantValues.${selectedVariantValueIndex}`,
              {
                values: {},
                tradeItemId: selectedVariant.tradeItemId,
              }
            );
          }
          valuesKey += `.variantValues.${selectedVariantValueIndex}`;
        }
      }
    }
    valuesKey += ".values";
    return valuesKey;
  };

  render() {
    const {
      groupSelected,
      currentGroupKey,
      selectedGroupItemIndex,
      user,
      isAdmin,
      currentLocaleCode,
      isLoadedVariantsInit,
    } = this.props;
    const { getTranslationSelectedIndex } = this.props;
    const { selectedImage } = this.state;
    const translationSelectedIndex = getTranslationSelectedIndex();

    const valuesKey = this.getValuesKey();
    const translationValueKey = `${getTradeItemGroupCurrentItem(currentGroupKey, selectedGroupItemIndex)}.translations`;

    return (
      <Padding>
        <Container fluid>
          <Row>
            <Col col={8} style={{ backgroundColor: "#FFF", borderRadius: "0.5em" }}>
              {/* Show properties */}
              {get(
                LAYOUT_GROUP_CONFIGURATION,
                `${groupSelected}.showPropertiesEdit`,
                false
              ) && (
                  <>
                    {translationSelectedIndex !== -1 && (
                      <TranslationsRow translationValueKey={translationValueKey} />
                    )}
                    <EditProperties
                      propertiesGroup={groupSelected}
                      valuesKey={valuesKey}
                      user={user}
                      isAdmin={isAdmin}
                      localeCode={currentLocaleCode}
                      isLoadedVariantsInit={isLoadedVariantsInit}
                    />
                  </>
                )}

              {/* Pricing */}
              {/* {groupSelected === 'Pricing' && <Pricing />} */}

              {/* Images */}
              {groupSelected === "IMAGES" && <Images onSelectImage={(file) => this.setState({ selectedImage: file })} />}
              <ImageViewer
                image={get(selectedImage, 'publicUrl')}
                opened={!!selectedImage}
                onClose={() =>
                  this.setState({ selectedImage: null })
                }
              />

              {/* Documents */}
              {groupSelected === "DOCUMENTS" && <Documents />}
            </Col>
            <Col col={4} style={{ paddingRight: 0 }}>
              <ProductManagementForm
                user={user}
                isAdmin={isAdmin}
                localeCode={currentLocaleCode}
              />
            </Col>
          </Row>
        </Container>
      </Padding>
    );
  }
}

export default withPlatformLocalContext(
  withEditionLocalContext(
    withRetailersLocalContext(
      withTargetMarketsLocalContext(
        withGroupLocalContext(
          withTranslationsLocalContext(
            withTradeItemLocalContext(withUser(Edit))
          )
        )
      )
    )
  )
);
