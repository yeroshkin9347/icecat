import React, {useEffect, useState} from "react";
import {get, isEmpty, isEqual, orderBy, reduce, uniq, isNil} from "lodash";
import {useTradeItemContext} from "./store/TradeItemProvider";
import {useTradeItemPropertiesContext, withTradeItemPropertiesLocalContext} from "./store/TradeItemPropertiesProvider";
import {usePropertyGroupContext} from "./store/PropertyGroupProvider";
import {
  saveTradeItemProperties,
  getAllPropertyFamilyByIds,
} from "./api";
import { getTradeItemPropertiesApiHelper } from './helpers';
import {useValuesGroupContext, withValuesGroupsLocalContext} from "./store/ValuesGroupProvider";
import { withLocalization } from "common/redux/hoc/withLocalization";
import { getTradeItemPropertyKey } from "./manager";
import {
  getCalculatedValues,
  getCalculatedValuesCMS,
  getValuesGroupByValueCodeCMSRequest
} from "../../services/tradeItemProperties";
import { getValuesGroupByValueCodeRequest } from "../../services/tradeItemProperties"
import LoaderOverlay from "../LoaderOverlay";
import PropertiesForm from "./PropertiesForm";
import { withTranslationsLocalContext } from "./store/TranslationProvider";

const EditProperties = ({
  user,
  isAdmin,
  propertiesGroup,
  valuesKey,
  localeCode,
  getTranslationSelectedIndex,
  isLoadedVariantsInit,
}) => {
  const translationSelectedIndex = getTranslationSelectedIndex();
  const [propertiesEdit, setPropertiesEdit] = useState([]);
  const [propertyFamilies, setPropertyFamilies] = useState([]);
  const [propertyFamilyIds, setPropertyFamilyIds] = useState([]);
  const [valuesGroupValue, setValuesGroupValue] = useState([]);

  const {
    tradeItem,
    isDuplicatingChannel,
    isEditable,
    selectedGroupItemIndex,
    selectedVariantIndex,
    setIsDuplicatingChannel,
    setTradeItemValue,
  } = useTradeItemContext();

  const {
    isFetchingTradeItemProperties,
    isFetchingTradeItemPropertyFamilies,
    setTradeItemProperties,
    setFetchingTradeItemProperties,
    setFetchingTradeItemPropertyFamilies,
    setCalculatedValue,
    SetValueChanged,
    setCompositionValue,
    resetTradeItemProperties,
  } = useTradeItemPropertiesContext();

  const {
    groupSelected,
  } = usePropertyGroupContext();

  const {
    valuesGroups,
    isFetchingValuesGroups,
    setFetchingValuesGroups,
    saveValueGroupWithKey,
    resetValuesGroups,
  } = useValuesGroupContext();

  const { taxonomyId, tradeItemCategory } = tradeItem;
  const tradeItemCategoryCode = tradeItemCategory?.code;

  useEffect(() => {
    if (!tradeItemCategoryCode) {
      setIsDuplicatingChannel(false);
      return;
    }

    setFetchingTradeItemProperties(true);
    const getTradeItemPropertiesApi = getTradeItemPropertiesApiHelper(isAdmin, user);
    getTradeItemPropertiesApi(taxonomyId, tradeItemCategoryCode, propertiesGroup, localeCode)
      .then((res) => {
        let properties = get(res, "data", []);
        saveTradeItemProperties(taxonomyId, tradeItemCategoryCode, propertiesGroup, properties);
        if (translationSelectedIndex !== -1) {
          properties = properties.filter(item => item.localizable);
        }

        setPropertiesEdit((prev) => (
          isEqual(prev, properties) ? prev : properties
        ));

        const familyIds = uniq(
          properties.map((item) => item.propertyFamilyId).filter((id) => !!id)
        ).sort();
        setPropertyFamilyIds((prev) => (
          isEqual(prev, familyIds) ? prev : familyIds
        ));

        // keep all of the group's trade item properties in memory
        setTradeItemProperties(properties);
        setFetchingTradeItemProperties(false);
      })
      .finally(() => {
        setFetchingTradeItemProperties(false);
        setIsDuplicatingChannel(false);
      });
  }, [taxonomyId, tradeItemCategoryCode, propertiesGroup, localeCode, valuesKey]);

  useEffect(() => {
    if (!propertyFamilyIds.length) {
      setPropertiesEdit([]);
      setPropertyFamilies([]);
      setFetchingTradeItemPropertyFamilies(false);
      return;
    }

    setFetchingTradeItemPropertyFamilies(true);
    getAllPropertyFamilyByIds(propertyFamilyIds)
      .then(({ data: propertyFamilies }) => {
        propertyFamilies = orderBy(propertyFamilies, p => p.displayIndex, "desc");

        // fetch the group values and set the properties
        setPropertyFamilies(propertyFamilies);
      })
      .finally(() => {
        setFetchingTradeItemPropertyFamilies(false);
      });
  }, [propertyFamilyIds]);

  useEffect(() => {
    const selectedMarketingGroupData = tradeItem.marketing[selectedGroupItemIndex];
    const valuesGroupValueRequestDefinitions = reduce(
      propertiesEdit,
      (result, property) => {
        if (
          (get(property, "valuesGroupId", null) &&
            !get(
              valuesGroups,
              `[${get(property, "valuesGroupId", null)}]`,
              null
            ) &&
            selectedMarketingGroupData && selectedMarketingGroupData.values &&
            !isEmpty(selectedMarketingGroupData.values[property.code])) ||
          property.discriminator === "CompositeProductPropertyForFormViewModel"
        ) {
          result.push({
            propertyCode: property.code,
            valueCodes: Array.isArray(selectedMarketingGroupData.values[property.code])
              ? selectedMarketingGroupData.values[property.code]
              : [selectedMarketingGroupData.values[property.code]],
          });
        }

        return result;
      },
      []
    );
    setValuesGroupValue((prev) => (
      isEqual(prev, valuesGroupValueRequestDefinitions) ? prev : valuesGroupValueRequestDefinitions
    ));
  }, [selectedGroupItemIndex, propertiesEdit]);

  useEffect(() => {
    if (!valuesGroupValue.length) {
      setFetchingValuesGroups(false);
      return;
    }

    const valuesGroupRequest = {
      taxonomyId,
      valuesGroupValueRequestDefinitions: valuesGroupValue
    };

    const getValuesGroupByValueCodeRequestApi =
      isAdmin
        ? getValuesGroupByValueCodeCMSRequest(valuesGroupRequest, get(tradeItem, 'manufacturer.manufacturerId'))
        : getValuesGroupByValueCodeRequest(valuesGroupRequest);

    setFetchingValuesGroups(true);
    getValuesGroupByValueCodeRequestApi
      .then(res2 => {
        saveValueGroupWithKey(res2.data)
      })
      .finally(() => {
        setFetchingValuesGroups(false);
      });
  }, [valuesGroupValue]);

  useEffect(() => {
    if (!isLoadedVariantsInit) return;
    const newTradeItem = isEmpty(
      (tradeItem.imageResourceMetadatas[selectedGroupItemIndex] || {}).values
    )
      ? { ...tradeItem, imageResourceMetadatas: [] }
      : tradeItem;

    if (!tradeItem.tradeItemId) {
      return;
    }

    const selectedMarketingGroupData = tradeItem.marketing[selectedGroupItemIndex];
    const queryParams = {
      retailerIds: get(selectedMarketingGroupData, "channels.0.retailerIds", []),
      targetMarketIds: get(selectedMarketingGroupData, "channels.0.targetMarketIds", []),
      startDate: get(selectedMarketingGroupData, "channels.0.startDate", null),
      endDate: get(selectedMarketingGroupData, "channels.0.endDate", null),
    }

    // remove null or empty values from queryParams
    Object.keys(queryParams).forEach(key => {
      if (isEmpty(queryParams[key])) {
        delete queryParams[key];
      }
    });

    const getCalculatedValuesApi = isAdmin ? getCalculatedValuesCMS : getCalculatedValues //

    getCalculatedValuesApi(
      tradeItem.tradeItemId,
      groupSelected,
      newTradeItem,
      queryParams
    ).then((res) => {
      if (isEmpty(res.data)) {
        return;
      }
      setCalculatedValue(res.data);
      SetValueChanged(res.data);
      setCompositionValue(res.data);
    });
  }, [tradeItem, isLoadedVariantsInit]);

  useEffect(() => {
    return () => {
      resetTradeItemProperties();
      resetValuesGroups();
    };
  }, []);

  const getTradeItemPropertyValue = (propertyCode) => {
    const value = get(
      tradeItem,
      getTradeItemPropertyKey(valuesKey, propertyCode),
    );

    if (!isNil(value)) {
      return value;
    }

    if (selectedVariantIndex !== null) {
      const variants = get(tradeItem, "variantDefinitions", []);
      const selectedVariant = variants[selectedVariantIndex];
      const variantValues = get(tradeItem, `${valuesKey.split("variantValues")[0]}variantValues`, []);
      let selectedVariantValueIndex = variantValues.findIndex(variantValue => variantValue.tradeItemId === selectedVariant.tradeItemId);

      const getValueFromParentTradeItemId = (parentTradeItemId) => {
        const parentVariant = variants.find(variant => variant.tradeItemId === parentTradeItemId);
        if (parentVariant) {
          let parentVariantValuesIndex = variantValues.findIndex(variantValue => variantValue.tradeItemId === parentTradeItemId);
          if (parentVariantValuesIndex !== -1) {
            const parentValuesKey = valuesKey.replace(`.variantValues.${selectedVariantValueIndex}`, `.variantValues.${parentVariantValuesIndex}`);
            const parentValue = get(
              tradeItem,
              getTradeItemPropertyKey(parentValuesKey, propertyCode),
              null
            );
            if (parentValue) {
              return parentValue;
            }
          }
        } else if (parentTradeItemId === tradeItem.tradeItemId) {
          const masterValuesKey = valuesKey.replace(`.variantValues.${selectedVariantValueIndex}`, "");
          const masterValue = get(
            tradeItem,
            getTradeItemPropertyKey(masterValuesKey, propertyCode),
            null
          );
          if (masterValue) {
            return masterValue;
          }
        }
      }
      if (selectedVariant && selectedVariant.options["8410"] && selectedVariant.parentsTradeItemIds && selectedVariant.parentsTradeItemIds.length && selectedVariantValueIndex !== -1) {
        const parentTradeItemId = selectedVariant.parentsTradeItemIds[0];
        const parentValue = getValueFromParentTradeItemId(parentTradeItemId);
        if (parentValue) {
          return parentValue;
        } else {
          const parentVariantData = variants.find(variant => variant.tradeItemId === parentTradeItemId);
          if (parentVariantData && parentVariantData.parentsTradeItemIds && parentVariantData.parentsTradeItemIds.length) {
            const parentParentValue = getValueFromParentTradeItemId(parentVariantData.parentsTradeItemIds[0]);
            if (parentParentValue) {
              return parentParentValue;
            }
          }
        } 
      }
      const masterValuesKey = valuesKey.replace(`.variantValues.${selectedVariantValueIndex}`, "");
      const masterValue = get(
        tradeItem,
        getTradeItemPropertyKey(masterValuesKey, propertyCode),
        null
      );
      if (masterValue) {
        return masterValue;
      }
    }

    return null;
  };

  const onChangeFormValue = (property, newVal) => {
    setTradeItemValue(
      getTradeItemPropertyKey(valuesKey, property.code),
      newVal
    );
  };

  // show loader when fetching properties
  // when a rendering occurs too
  if (isFetchingTradeItemProperties || isFetchingValuesGroups || isFetchingTradeItemPropertyFamilies || isDuplicatingChannel) {
    return (
      <LoaderOverlay />
    );
  }

  return (
    <PropertiesForm
      properties={propertiesEdit}
      propertyFamilies={propertyFamilies}
      currentLocaleCode={localeCode}
      isEditable={isEditable}
      getTradeItemPropertyValue={getTradeItemPropertyValue}
      onChangeFormValue={onChangeFormValue}
      tradeItemCategoryCode={get(tradeItem, 'tradeItemCategory.code')}
      manufacturerId={get(tradeItem, 'manufacturer.manufacturerId')}
    />
  );
}

export default withLocalization(
  withValuesGroupsLocalContext(
    withTradeItemPropertiesLocalContext(
      withTranslationsLocalContext(
        EditProperties
      )
    )
  )
);
