import * as types from "./type";
import dotProp from "dot-prop-immutable";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import call from "./call";
import { getTaxonomiesCMS } from "cdm-shared/services/taxonomy";
import * as api from "cdm-shared/services/transformationManagement";
import * as processingApi from "cdm-shared/services/transformationProcessing";
import * as utils from "../../../cdm-web-cms/src/transformations/utils";
import move from "lodash-move";

import { getByTaxonomyIdAndTradeItemCategoryCode } from "cdm-shared/services/businessRules";
import { getActionDefinitions } from "cdm-shared/services/transformationManagement";
import { getPropertyGroups } from "cdm-shared/services/tradeItemProperties";
import { getAllTradeItemCategoriesCMS } from "cdm-shared/services/tradeItemCategories";
import * as propertiesApi from "cdm-shared/services/tradeItemProperties";
import * as editSelectors from "cdm-shared/redux/selectors/transformation";

// get taxonomies
export const getTaxonomiesData = () => (dispatch) => {
  return call(dispatch, getTaxonomiesCMS, {
    REQUEST: types.TAXONOMIES_REQUEST,
    FAILURE: types.TAXONOMIES_FAILURE,
  }).then((results) => {
    return dispatch({
      type: types.TAXONOMIES_SUCCESS,
      results,
    });
  });
};

// get trade item categories
export const getTradeItemCategoriesAction = () => (dispatch) => {
  return call(dispatch, getAllTradeItemCategoriesCMS, {
    REQUEST: types.TRADE_ITEM_CATEGORIES_REQUEST,
    FAILURE: types.TRADE_ITEM_CATEGORIES_FAILURE,
  }).then((results) => {
    return dispatch({
      type: types.TRADE_ITEM_CATEGORIES_SUCCESS,
      results,
    });
  });
};

// get property group
export const getPropertyGroupsAction = () => (dispatch) => {
  dispatch(propertyGroupLoaderAction(true));
  return getPropertyGroups()
    .then((res) => {
      dispatch(propertyGroupLoaderAction(false));
      dispatch({
        type: types.GET_PROPERTY_GROUPS,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch(propertyGroupLoaderAction(false));
    });
};

// get action definitions
export const getActionDefinitionsAction = () => (dispatch) => {
  return getActionDefinitions().then((res) => {
    dispatch({
      type: types.GET_ACTION_DEFINITIONS,
      payload: res.data,
    });
  });
};

// get transformation set
export const getTransformationSet = (id) => (dispatch) =>
  api
    .getTransformationSet(id)
    .then((res) => res.data)
    .then((transformationSet) => {
      dispatch(setTransformationSet(transformationSet));
    });

// set transformation set
export const setTransformationSet = (transformationSet) => (dispatch) => {
  return dispatch({
    type: types.TRANSFORMATION_SET_RECEIVE,
    transformationSet,
  });
};

// update transformation set
export const updateTransformationSet = (key, value) => (dispatch) => {
  return dispatch({
    type: types.TRANSFORMATION_SET_UPDATE,
    key,
    value,
  });
};

//update transformation set taxonomy id
export const updateTransformationSetTaxonomyId =
  (taxonomyId) => (dispatch, getState) => {
    dispatch(updateTransformationSet("taxonomyId", taxonomyId));
  };

export const updateTransformationSetTradeItemCategory =
  (tradeItemCategoryCode) => (dispatch, getState) => {
    dispatch(
      updateTransformationSet("tradeItemCategory", {
        code: tradeItemCategoryCode,
      })
    );
  };

//select transformation index
export const selectTransformation = (transformation) => (dispatch) => {
  dispatch({
    type: types.TRANSFORMATION_SET_TRANSFORMATION_SELECTED,
    transformation,
  });
  dispatch(selectActionSet(-1));
  dispatch(resetEditAction());
};

export const initializeSet = (transformationIndex) => (dispatch, getState) => {
  const { transformationSet } = getState().transformation;
  dispatch({
    type: types.TRANSFORMATION_SET_TRANSFORMATION_SELECTED,
    transformation: transformationIndex,
  });
  if (
      transformationSet.transformations[transformationIndex] &&
      transformationSet.transformations[transformationIndex]
          .orderedConditionalActionSets.length > 0
  ) {
    dispatch(selectActionSet(0));
    const { orderedConditionalActionSets } =
        transformationSet.transformations[transformationIndex];
    if (
        orderedConditionalActionSets[0].actionSet.orderedParametrizedActions
            .length > 0
    ) {
      dispatch(selectedActionIndexAction(0));
      const orderedparametarized = actionData(getState);
      dispatch(setOrderedParametrizedActions(orderedparametarized));
      dispatch(editAction(orderedparametarized[0]));
    }
  } else {
    dispatch(selectActionSet(-1));
    dispatch(selectedActionIndexAction(-1));
    dispatch(resetEditAction());
  }
};

const actionData = (getState) => {
  const actionSet = editSelectors.actionSetSelector(getState());
  const actionDefinitionsList = editSelectors.getActionDefinitionsSelecter(
      getState()
  );
  
  const orderedParametrizedActions = get(
      actionSet,
      "actionSet.orderedParametrizedActions"
  );
  if (orderedParametrizedActions && orderedParametrizedActions.length > 0) {
    if (actionDefinitionsList && actionDefinitionsList.length > 0) {
      const finalData = orderedParametrizedActions.map((ordParams) => {
        return {
          ...ordParams,
          ...actionDefinitionsList.filter(
              (actDef) => actDef.id === ordParams.builtInActionDefinitionId
          )[0],
        };
      });
      return finalData;
    }
  }
  return [];
};

export const selectActionSet = (actionSet) => (dispatch) => {
  return dispatch({
    type: types.TRANSFORMATION_SET_ACTION_SET_SELECTED,
    actionSet,
  });
};

export const setAction = () => (dispatch, getState) => {
  const acdata = actionData(getState);
  dispatch(selectedActionIndexAction(0));
  dispatch(editAction(acdata[0]));
  dispatch(setOrderedParametrizedActions(acdata));
};

export const resetEditAction = () => (dispatch) => {
  dispatch({
    type: types.TRANSFORMATION_SET_ACTION_RECEIVED,
    action: null,
  });
  dispatch({
    type: types.TRANSFORMATION_SET_ACTION_INDEX_SELECTED,
    actionIndex: -1,
  });
};

export const deleteTransformation =
  (transformationIndex) => (dispatch, getState) => {
    const state = getState().transformation.transformationSet;
    const reduxtransformationIndex =
        getState().transformation.selectedTransformation;
    if (reduxtransformationIndex === transformationIndex) {
      dispatch(selectTransformation(-1));
    } else {
      if (transformationIndex < reduxtransformationIndex) {
        dispatch(selectTransformation(reduxtransformationIndex - 1));
        dispatch(initializeSet(reduxtransformationIndex - 1));
      }
    }
    const { transformations } = dotProp.delete(
      state,
      `transformations.${transformationIndex}`
    );
    dispatch(updateTransformationSet("transformations", transformations));
  };

export const deleteActionSet = (actionSetIndex) => (dispatch, getState) => {
  const state = getState().transformation.transformationSet;
  const transformationIndex = getState().transformation.selectedTransformation;
  if (transformationIndex === -1) return;
  const { transformations } = dotProp.delete(
    state,
    `transformations.${transformationIndex}.orderedConditionalActionSets.${actionSetIndex}`
  );
  dispatch(updateTransformationSet("transformations", transformations));
  dispatch(editAction(null));
  dispatch(selectActionSet(-1));
};

export const updateTransformation = (key, value) => (dispatch, getState) => {
  const idx = editSelectors.selectedTransformation(getState());
  const transformations = editSelectors.getTransformationsSelector(getState());
  if (idx === -1) return;
  transformations[idx][key] = value;
  dispatch(updateTransformationSet(`transformations`, transformations));
};

export const addNewActionSet = () => (dispatch, getState) => {
  const idx = editSelectors.selectedTransformation(getState());
  const state = getState().transformation.transformationSet;
  if (idx === -1) return;
  const { transformations } = dotProp.set(
    state,
    `transformations.${idx}.orderedConditionalActionSets`,
    (list) =>
      isEmpty(list)
        ? [utils.getDefaultActionSet()]
        : [...list, utils.getDefaultActionSet()]
  );
  dispatch(updateTransformationSet("transformations", transformations));
};

export const updateActionSet = (key, value) => (dispatch, getState) => {
  const transformationIdx = editSelectors.getSelectedTransformIndexSelector(
    getState()
  );
  const actionSetIdx = editSelectors.getSelectedActionSetIndexSelector(
    getState()
  );
  const state = getState().transformation.transformationSet;
  if (transformationIdx === -1 || actionSetIdx === -1) return;
  const { transformations } = dotProp.set(
    state,
    `transformations.${transformationIdx}.orderedConditionalActionSets.${actionSetIdx}.${key}`,
    value
  );
  dispatch(updateTransformationSet("transformations", transformations));
};

export const updateActionSetGroup = (value) => (dispatch, getState) => {
  dispatch(editAction(null));
  dispatch(updateActionSet(`actionSet.propertyGroupId`, value.id));
  const transformationSet = editSelectors.getTransformationSet(getState());
  dispatch(
    getTradeItemPropertiesUpAndDown({
      propertyGroupId: value.id,
      tradeItemCategoryCode: transformationSet.tradeItemCategory.code,
      taxonomyId: transformationSet.taxonomyId,
    })
  );
};

// get trade item properties for scope and group
export const getTradeItemPropertiesUpAndDown =
  ({ taxonomyId, propertyGroupId, tradeItemCategoryCode }) =>
  (dispatch) => {
    return call(
      dispatch,
      () =>
        propertiesApi.getTradeItemPropertiesLightUpAndDownByTaxonomyIdAndPropertyGroupIdAndTradeItemCategoryCode(
          { taxonomyId, propertyGroupId, tradeItemCategoryCode }
        ),
      {
        REQUEST: types.TRADE_ITEMS_PROPERTIES_REQUEST,
        FAILURE: types.TRADE_ITEMS_PROPERTIES_FAILURE,
      }
    ).then((results) => {
      return dispatch({
        type: types.TRADE_ITEMS_PROPERTIES_SUCCESS,
        results,
      });
    });
  };

export const editAction = (data) => (dispatch) => {
  return dispatch({
    type: types.SET_ACTION,
    payload: data,
  });
};

export const deleteAction = (actionIndex) => (dispatch, getState) => {
  const transformationIndex = editSelectors.getSelectedTransformIndexSelector(
    getState()
  );
  const actionSetIndex = editSelectors.getSelectedActionSetIndexSelector(
    getState()
  );
  const state = getState().transformation.transformationSet;

  if (transformationIndex === -1 || actionSetIndex === -1 || actionIndex === -1)
    return;
  const { transformations } = dotProp.delete(
    state,
    `transformations.${transformationIndex}.orderedConditionalActionSets.${actionSetIndex}.actionSet.orderedParametrizedActions.${actionIndex}`
  );
  dispatch(updateTransformationSet("transformations", transformations));
  dispatch(resetEditAction());
};

export const changeAction = (action) => (dispatch, getState) => {
  let newaction = {
    ...editSelectors.getActionSelector(getState()),
    ...action,
  };
  if (action.discriminator === "TemplateActionViewModel") {
    newaction = {
      ...action,
    };
  }
  
  dispatch(editAction(newaction));
};
export const selectedActionIndexAction = (index) => (dispatch) => {
  dispatch({
    type: types.SELECTED_ACTION_INDEX,
    payload: index,
  });
};

export const saveActionSet = () => (dispatch, getState) => {
  const action = editSelectors.getActionSelector(getState());
  const transformationIdx = editSelectors.getSelectedTransformIndexSelector(
    getState()
  );
  const actionSetIdx = editSelectors.getSelectedActionSetIndexSelector(
    getState()
  );
  const selectedActionIndex = editSelectors.getSelectedActionIndexSelector(
    getState()
  );
  const transformation = editSelectors.getTransformationsSelector(getState());
  if (transformationIdx === -1 || actionSetIdx === -1) {
    return;
  }
  if (selectedActionIndex > -1) {
    transformation[transformationIdx].orderedConditionalActionSets[
      actionSetIdx
    ].actionSet.orderedParametrizedActions[0] = action;
  } else {
    transformation[transformationIdx].orderedConditionalActionSets[
      actionSetIdx
    ].actionSet.orderedParametrizedActions.push(action);
  }
  dispatch(updateTransformationSet("transformations", transformation));
  dispatch(editAction(null));
  dispatch(selectedActionIndexAction(-1));
};

export const addNewTransformation = () => (dispatch, getState) => {
  const state = getState().transformation.transformationSet;
  const { transformations } = dotProp.set(state, "transformations", (list) =>
    isEmpty(list)
      ? [utils.getDefaultTransformation()]
      : [...list, utils.getDefaultTransformation()]
  );
  dispatch(updateTransformationSet(`transformations`, transformations));
};

export const resetTaxonomies = () => (dispatch) =>
  dispatch({
    type: types.TAXONOMIES_RESET,
  });

export const resetTradeItemCategories = () => (dispatch) =>
  dispatch({
    type: types.TRADE_ITEM_CATEGORIES_RESET,
  });

export const resetPropertiesGroups = () => (dispatch) =>
  dispatch({
    type: types.GET_PROPERTY_GROUPS,
    payload: [],
  });

export const resetActionsDefinitions = () => (dispatch) =>
  dispatch({
    type: types.GET_ACTION_DEFINITIONS,
    payload: [],
  });

export const resetBusinessRulesSets = () => (dispatch) =>
  dispatch({
    type: types.BUSINESS_SET_RULES,
    payload: [],
  });

export const resetTradeItemProperties = () => (dispatch) =>
  dispatch({
    type: types.TRADE_ITEMS_PROPERTIES_RESET,
  });

export const resetTransformationSet = () => (dispatch) => {
  dispatch({
    type: types.INITIALIZE_TRADE_ITEM_TRANSFORMATION,
  });
};

export const switchTransformations =
  (fromIndex, toIndex) => (dispatch, getState) => {
    const state = getState().transformation.transformationSet;
    const { transformations } = dotProp.set(
      state,
      `transformations`,
      move(dotProp.get(state, `transformations`), fromIndex, toIndex)
    );
    dispatch(updateTransformationSet("transformations", transformations));
    dispatch(selectTransformation(-1));
  };

export const switchActions = (fromIndex, toIndex) => (dispatch, getState) => {
  const state = getState().transformation.transformationSet;
  const transformationIndex = editSelectors.selectedTransformation(getState());
  const actionSetIndex = editSelectors.getSelectedActionSetIndexSelector(
    getState()
  );
  if (transformationIndex === -1 || actionSetIndex === -1) return;
  const { transformations } = dotProp.set(
    state,
    `transformations.${transformationIndex}.orderedConditionalActionSets.${actionSetIndex}.actionSet.orderedParametrizedActions`,
    move(
      dotProp.get(
        state,
        `transformations.${transformationIndex}.orderedConditionalActionSets.${actionSetIndex}.actionSet.orderedParametrizedActions`
      ),
      fromIndex,
      toIndex
    )
  );
  dispatch(updateTransformationSet("transformations", transformations));
};

export const switchActionsSets =
  (fromIndex, toIndex) => (dispatch, getState) => {
    const state = getState().transformation.transformationSet;
    const transformationIndex = editSelectors.selectedTransformation(
      getState()
    );
    if (transformationIndex === -1) return;
    const { transformations } = dotProp.set(
      state,
      `transformations.${transformationIndex}.orderedConditionalActionSets`,
      move(
        dotProp.get(
          state,
          `transformations.${transformationIndex}.orderedConditionalActionSets`
        ),
        fromIndex,
        toIndex
      )
    );
    dispatch(updateTransformationSet("transformations", transformations));
    dispatch(selectActionSet(-1));
    dispatch(resetEditAction());
  };

// set trade item transformation
export const setTradeItemTransformationAction = (data) => (dispatch) => {
  return dispatch({
    type: types.SET_TRADE_ITEM_TRANSFORMATION,
    payload: data,
  });
};

export const selectedActionSetIndexAction = (index) => (dispatch) => {
  return dispatch({
    type: types.SELECTED_ACTION_SET_INDEX,
    payload: index,
  });
};

export const resetTransformationSetAction = () => (dispatch) => {
  return dispatch({
    type: types.GET_TRADE_ITEM_TRANSFORMATION,
    payload: {
      name: "",
      taxonomyId: null,
      tradeItemCategory: {},
      transformations: [],
    },
  });
};

export const postTransformationSetAction = () => (dispatch, getState) => {
  const state = getState().transformation.transformationSet;
  const action = getState().transformation.action;
  let transformationSet;
  const transformationIndex = editSelectors.getSelectedTransformIndexSelector(
      getState()
  );
  const actionSetIndex = editSelectors.getSelectedActionSetIndexSelector(
      getState()
  );
  const actionIndex = editSelectors.getSelectedActionIndexSelector(getState());
  if (action) {
    transformationSet = dotProp.set(
        state,
        `transformations.${transformationIndex}.orderedConditionalActionSets.${actionSetIndex}.actionSet.orderedParametrizedActions.${actionIndex}`,
        action
    );
  } else {
    transformationSet = state;
  }
  return api.createTransformationSet(transformationSet).then((res) => res.data);
};

export const putTransformationSetAction = () => (dispatch, getState) => {
  const state = getState().transformation.transformationSet;
  const action = getState().transformation.action;
  let transformationSet;
  const transformationIndex = editSelectors.getSelectedTransformIndexSelector(
      getState()
  );
  const actionSetIndex = editSelectors.getSelectedActionSetIndexSelector(
      getState()
  );
  const actionIndex = editSelectors.getSelectedActionIndexSelector(getState());
  if (action) {
    transformationSet = dotProp.set(
        state,
        `transformations.${transformationIndex}.orderedConditionalActionSets.${actionSetIndex}.actionSet.orderedParametrizedActions.${actionIndex}`,
        action
    );
  } else {
    transformationSet = state;
  }
  return api.updateTransformationSet(transformationSet.id, transformationSet);
};

export const deleteTransformationSetAction = (id) => (dispatch) =>
  api.deleteTransformationSet(id);

const getGroupId = () => (getState) => {
  const transformationIdx = editSelectors.getSelectedTransformIndexSelector(
    getState()
  );
  const actionSetIdx = editSelectors.getSelectedActionSetIndexSelector(
    getState()
  );
  const transformation = editSelectors.getTransformationsSelector(getState());
  if (transformationIdx === -1 || actionSetIdx === -1) return;
  return transformation[transformationIdx].orderedConditionalActionSets[
    actionSetIdx
  ].actionSet.propertyGroupId;
};

export const setOrderedParametrizedActions =
  (orderedparamsdata) => (dispatch) => {
    dispatch(
      updateActionSet("actionSet.orderedParametrizedActions", orderedparamsdata)
    );
  };

// fetch business rules by taxony id and  trade item category code
export const getBusinessRulesByTaxonomyIdAndTradeItemAction =
  ({ tradeItemCategoryCode, taxonomyId, propertyGroupId }) => (dispatch) => {
    return getByTaxonomyIdAndTradeItemCategoryCode({
      tradeItemCategoryCode,
      propertyGroupId,
      taxonomyId,
    }).then((results) => {
      return dispatch({
        type: types.BUSINESS_SET_RULES,
        payload: results.data,
      });
    });
  };

export const editActionKey = (key, value) => (dispatch, getState) => {
  const newaction = editSelectors.getActionSelector(getState());
  newaction[key] = value;
  dispatch(editAction(newaction));
};

export const updateAction = (action) => (dispatch, getState) => {
  const transformationIdx = editSelectors.getSelectedTransformIndexSelector(
    getState()
  );
  const actionSetIdx = editSelectors.getSelectedActionSetIndexSelector(
    getState()
  );
  const selectedActionIndex = editSelectors.getSelectedActionSetIndexSelector(
    getState()
  );
  const transformation = editSelectors.getTransformationsSelector(getState());
  if (
    transformationIdx === -1 ||
    actionSetIdx === -1 ||
    selectedActionIndex === -1
  ) {
    return;
  }
  transformation[transformationIdx].orderedConditionalActionSets[
    actionSetIdx
  ].actionSet.orderedParametrizedActions[selectedActionIndex] = action;
  dispatch(setTransformationSetAction(transformation));
};

export const changeParamsValue = (value, index) => (dispatch, getState) => {
  const action = editSelectors.getActionSelector(getState());
  action.parameterValues[index] = {
    parameterCode: action.parametersDefinition[index].code,
    value,
  };
  dispatch(editAction(action));
};

export const propertyGroupLoaderAction = (value) => (dispatch, getState) => {
  dispatch({
    type: types.PROPERTY_GROUP_LOADER,
    payload: value,
  });
};

export const setPlaygroundTradeItemId = (tradeItemId) => (dispatch) =>
  dispatch({
    type: types.TRANSFORMATION_SET_PLAYGROUND_TRADE_ITEM_SELECTED,
    tradeItemId,
  });

export const doPlayground = (tradeItemId, actionSet) => (dispatch) =>
  processingApi.doPlaygroundProcess(tradeItemId, actionSet).then((res) => {
    dispatch({
      type: types.TRANSFORMATION_SET_PLAYGROUND_RESULT,
      result: res.data,
    });
  });

export const errorMessage = (msg) => (dispatch) =>
  dispatch({
    type: types.ERROR_MESSAGE,
    payload: msg,
  });
