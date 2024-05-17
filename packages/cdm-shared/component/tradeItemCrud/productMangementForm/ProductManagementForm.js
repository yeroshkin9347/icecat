import React, {useEffect} from "react";
import get from "lodash/get";
import reduce from "lodash/reduce";
import {
  Container as Content,
  Text,
  Zone
} from "cdm-ui-components";
import styled, { css } from "styled-components";
import {getTradeItemGroupCurrentItem, KEYED_PROPERTIES_GROUPS, LAYOUT_GROUP_CONFIGURATION} from "../manager";
import CategoryAutocomplete from "./CategoryAutocomplete";
import ManufacturerAutocomplete from "./ManufacturerAutocomplete";
import TaxonomyAutocomplete from "./TaxomonyAutocomplete";
import ChannelManagement from "../channelManagement/ChannelManagement";
import CollectionManagement from "../collectionManangement/CollectionManangement";
import Translations from "../translations/Translations";
import VariantManagement from "../variantManagement/VariantManagement";
import IdentityManagement from "../identityManagement/IdentityManagement";
import EnrichmentMatched from "../EnrichmentMatched";
import LastActions from "../lastActions/LastActions";
import {
  getAllTargetMarkets,
  getEditions,
  getEditionsCMS,
  getPlatforms,
  getPlatformsCMS
} from "../api";
import {isManufacturer} from "../../../redux/hoc/withAuth";
import {useTradeItemContext} from "../store/TradeItemProvider";
import {usePropertyGroupContext} from "../store/PropertyGroupProvider";
import {useTargetMarketContext} from "../store/TargetMarketProvider";
import {useRetailerContext} from "../store/RetailerProvider";
import {useEditionContext} from "../store/EditionProvider";
import {usePlatformContext} from "../store/PlatformProvider";
import {getAllRetailers} from "../../../services/retailer";

const ContextualZone = styled(Zone)`
  padding: 1.5em;
  // box-shadow: rgba(32, 33, 36, 0.28) 0px 1px 6px 0px;
  border-radius: 0.5em;
  margin-bottom: 16px;

  ${(props) =>
    props.light &&
    css`
      background-color: #f5f5f5 !important;
    `}
`;

const ProductManagementForm = ({
  user,
  isAdmin,
  currentLocaleCode,
}) => {
  const {
    tradeItem,
    isEditable,
    setTradeItemValue,
    selectedGroupItemIndex,
  } = useTradeItemContext();

  const {
    groupSelected,
    currentGroupKey,
  } = usePropertyGroupContext();

  const {
    setFetchingTargetMarkets,
    setTargetMarkets,
  } = useTargetMarketContext();

  const {
    setFetchingRetailers,
    setRetailers,
  } = useRetailerContext();

  const {
    setFetchingEdition,
    setEdition,
  } = useEditionContext();

  const {
    setFetchingPlatform,
    setPlatform,
  } = usePlatformContext();

  const isIceCatTaxonomy = tradeItem.taxonomyId === 'b7021c08-b322-4aef-87a9-a56e1a86a38c';
  const tradeItemCategory = get(tradeItem, 'tradeItemCategory', {});
  const manufacturer = get(tradeItem, 'manufacturer', {});
  const taxonomyId = get(tradeItem, 'taxonomyId');
  const translationValueKey = `${getTradeItemGroupCurrentItem(currentGroupKey, selectedGroupItemIndex)}.translations`;

  useEffect(() => {
    // load target markets
    setFetchingTargetMarkets(true);
    getAllTargetMarkets()
      .then(res => {
        setTargetMarkets(
          reduce(
            get(res, "data", []),
            (result, value, key) => {
              result[get(value, "id")] = get(value, "name");
              return result;
            },
            {}
          )
        );
        setFetchingTargetMarkets(false);
      })
      .catch(err => setFetchingTargetMarkets(false));
  }, []);

  useEffect(() => {
    // load retailers
    setFetchingRetailers(true);
    getAllRetailers()
      .then(res => {
        setRetailers(
          reduce(
            get(res, "data", []),
            (result, value, key) => {
              result[get(value, "id")] = get(value, "name");
              return result;
            },
            {}
          )
        );
        setFetchingRetailers(false);
      })
      .catch(err => setFetchingRetailers(false));
  }, []);

  useEffect(() => {
    // load edition
    setFetchingEdition(true);
    const lang = currentLocaleCode || 'en-GB';
    const getEditionsApi = isAdmin ? getEditionsCMS : getEditions
    getEditionsApi()
      .then((res) => {
        const formattedRes = res.data.values.map((value) => ({
          label: value.values[lang] || value.code,
          value: value.code,
        }));
        setEdition(formattedRes);
        setFetchingEdition(false);
      })
      .catch((err) => {
        setFetchingEdition(false);
      });
  }, [currentLocaleCode]);

  useEffect(() => {
    // load platform
    setFetchingPlatform(true);
    const lang = currentLocaleCode || 'en-GB';
    const getPlatformsApi = isAdmin ? getPlatformsCMS : getPlatforms
    getPlatformsApi()
      .then((res) => {
        const formattedRes = res.data.values.map((value) => ({
          label: value.values[lang] || value.code,
          value: value.code,
        }));
        setPlatform(formattedRes);
        setFetchingPlatform(false);
      })
      .catch((err) => {
        setFetchingPlatform(false);
      });
  }, [currentLocaleCode]);

  const onSelectManufacturer = (manufacturer) => {
    setTradeItemValue('manufacturer', {
      manufacturerId: manufacturer.id,
      name: manufacturer.name,
    });
  };

  const onSelectTaxonomy = (taxonomy) => {
    setTradeItemValue('taxonomyId', taxonomy.id);
  };

  const onSelectCategory = (categoryCode) => {
    setTradeItemValue('tradeItemCategory', {
      code: categoryCode,
      discriminator: 'TradeItemCategoryViewModel',
    });
  };

  return (
    <div>
      {!isManufacturer(user) && (
        <ContextualZone>
          <Text bold>
            Manufacturer
          </Text>
          <Content fluid style={{ padding: 0, marginTop: 20 }}>
            <ManufacturerAutocomplete
              value={manufacturer.manufacturerId}
              isAdmin={isAdmin}
              onChange={onSelectManufacturer}
            />
          </Content>
        </ContextualZone>
      )}

      <ContextualZone>
        <Text bold>
          Taxonomy
        </Text>
        <Content fluid style={{ padding: 0, marginTop: 20 }}>
          <TaxonomyAutocomplete
            value={taxonomyId}
            onChange={onSelectTaxonomy}
          />
        </Content>
      </ContextualZone>

      <ContextualZone>
        <Text bold>
          Category
        </Text>
        <Content fluid style={{ padding: 0, marginTop: 20 }}>
          <CategoryAutocomplete
            value={tradeItemCategory.code}
            isAdmin={isAdmin}
            localeCode={currentLocaleCode}
            onChange={onSelectCategory}
          />
        </Content>
      </ContextualZone>

      {/* Channels */}
      {get(
        LAYOUT_GROUP_CONFIGURATION,
        `${groupSelected}.showChannels`,
        false
      ) && (
        <ChannelManagement />
      )}

      {currentGroupKey === KEYED_PROPERTIES_GROUPS.PRICING &&
        <CollectionManagement />
      }

      {/* Translations */}
      {get(
        LAYOUT_GROUP_CONFIGURATION,
        `${groupSelected}.showTranslations`,
        false
      ) && (
        <Translations translationValueKey={translationValueKey} />
      )}

      {/* Distribution status */}
      {/* <DistributionStatus /> */}

      {/* Variant Management */}
      {isEditable && isIceCatTaxonomy && (
        <VariantManagement />
      )}

      {/* Identity Management */}
      <IdentityManagement />

      {isAdmin && <EnrichmentMatched />}

      {/* Latest actions */}
      <LastActions />
    </div>
  );
}

export default ProductManagementForm;
