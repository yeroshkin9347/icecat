//taxonomies
export const getTaxonomiesSelector = (state) =>
  state.transformation.taxonomies.results;
export const areTaxonomiesLoadingSelector = (state) =>
  state.transformation.taxonomies.isFetching;

//trade items categories
export const getTradeItemCategoriesSelector = (state) =>
  state.transformation.tradeItemCategories.results;
export const areTradeItemCategoriesLoadingSelector = (state) =>
  state.transformation.tradeItemCategories.isFetching;

export const getTransformationsSelector = (state) =>
  state.transformation.transformationSet.transformations;

export const selectedTransformation = (state) =>
  state.transformation.selectedTransformation;

export const actionSetSelector = (state) => {
  const transformationIndex = state.transformation.selectedTransformation;
  const actionSetIndex = state.transformation.selectedActionSet;
  const transformations =
    state.transformation.transformationSet.transformations;
  if (actionSetIndex === -1 || transformationIndex === -1) return null;
  return transformations[transformationIndex].orderedConditionalActionSets[
    actionSetIndex
  ];
};
export const getTradeItemTransformationSelector = (state) =>
  state.transformation.transformationSet;

export const getPropertyGroupsSelector = (state) =>
  state.transformation.get_property_groups;

export const getSelectedTransformSelector = (state) => {
  const transformIndex = state.transformation.selectedTransformation;
  return transformIndex > -1
    ? state.transformation.transformationSet.transformations[transformIndex]
    : null;
};

export const getSelectedTransformIndexSelector = (state) =>
  state.transformation.selectedTransformation;
export const getSelectedActionSetIndexSelector = (state) =>
  state.transformation.selectedActionSet;
export const getSelectedActionIndexSelector = (state) =>
  state.transformation.selectedActionIndex;

export const getActionSetDataSelector = (state) =>
  state.transformation.action_set_data;
export const getOrderedParametrizedActionsSelector = (state) => {
  const transSetIdx = state.transformation.transformation_set_index;
  const actionSetIdx = state.transformation.action_set_index;
  if (transSetIdx > -1 && actionSetIdx > -1) {
    return state.transformation.transformation_set_data[transSetIdx]
      .orderedConditionalActionSets[actionSetIdx];
  } else {
    return [];
  }
};
export const setOrderedParametrizedActionsSelector = (data) => (state) => {
  if (state.transformation_set_index > -1 && state.action_set_index > -1) {
    return (state.transformation.transformation_set_data[
      transformation_set_index
    ].orderedConditionalActionSets[
      action_set_index
    ].orderedParametrizedActions = data);
  } else {
    return [];
  }
};
export const getActionSelector = (state) => state.transformation.action;
export const getTransformationSet = (state) =>
  state.transformation.transformationSet;

export const getActionDefinitionsSelecter = (state) =>
  state.transformation.get_action_definitions;
export const getActionDefinitionSelecter = (state) => {
  return state.transformation.action
    ? find(
        state.transformation.get_action_definitions,
        (d) => d.id === state.transformation.action.builtInActionDefinitionId
      )
    : null;
};
export const businessRulesSetsSelecter = (state) =>
  state.transformation.businessRuleSets;
export const getTradeItemsPropertiesSelecter = (state) =>
  state.transformation.tradeItemsProperties.results;

export const getTradeItemsPropertiesSelector = (state) => {
  const transSetIdx = state.transformation.transformation_set_index;
  const actionSetIdx = state.transformation.action_set_index;
  if (transSetIdx > -1 && actionSetIdx > -1) {
    if (
      state.transformation.transformation_set_data[transSetIdx]
        .orderedConditionalActionSets[actionSetIdx].actionSet.sourcePropertyCode
    ) {
      return state.transformation.transformation_set_data[transSetIdx]
        .orderedConditionalActionSets[actionSetIdx].actionSet
        .sourcePropertyCode;
    }
  }
  return [];
};

export const propertyGroupLoaderSelecter = (state) =>
  state.transformation.property_group_loader;
export const playgroundTradeItemIdSelecter = (state) =>
  state.transformation.tradeItemId;
export const transformationSetPlaygroundResultSelecter = (state) =>
  state.transformation.transformation_set_playground_result;
export const errorMessageSelector = (state) =>
  state.transformation.error_message;
