import * as types from "../actions/type";
import * as utils from "../../../cdm-web-cms/src/transformations/utils";

const initialState = {
  taxonomies: {
    didInvalidate: false,
    isFetching: false,
    results: [],
  },
  tradeItemCategories: {
    didInvalidate: false,
    isFetching: false,
    results: [],
  },
  tradeItemsProperties: {
    didInvalidate: false,
    isFetching: false,
    results: [],
  },

  transformationSet: utils.getDefaultTransformationSet(),
  selectedTransformation: -1,
  selectedActionSet: -1,
  action: null,
  selectedActionIndex: -1,
  get_action_definitions: [],
  businessRuleSets: [],
  get_property_groups: [],
  property_group_loader: false,
  tradeItemId: null,
  transformation_set_playground_result: null,
  error_message: null,
};

const transformation = (state = initialState, action) => {
  switch (action.type) {
    case types.TAXONOMIES_SUCCESS:
      return {
        ...state,
        taxonomies: {
          ...state.taxonomies,
          results: action.results,
          isFetching: false,
        },
      };
    case types.TAXONOMIES_REQUEST:
      return {
        ...state,
        taxonomies: {
          ...state.taxonomies,
          isFetching: true,
        },
      };
    case types.TAXONOMIES_FAILURE:
      return {
        ...state,
        taxonomies: {
          ...state.taxonomies,
          didInvalidate: true,
        },
      };
    case types.TAXONOMIES_RESET:
      return {
        ...state,
        taxonomies: {
          didInvalidate: false,
          isFetching: false,
          results: [],
        },
      };

    case types.TRADE_ITEM_CATEGORIES_SUCCESS:
      return {
        ...state,
        tradeItemCategories: {
          ...state.tradeItemCategories,
          results: action.results,
          isFetching: false,
        },
      };
    case types.TRADE_ITEM_CATEGORIES_REQUEST:
      return {
        ...state,
        tradeItemCategories: {
          ...state.tradeItemCategories,
          isFetching: true,
        },
      };
    case types.TRADE_ITEM_CATEGORIES_FAILURE:
      return {
        ...state,
        tradeItemCategories: {
          ...state.tradeItemCategories,
          didInvalidate: true,
        },
      };
    case types.TRADE_ITEM_CATEGORIES_RESET:
      return {
        ...state,
        tradeItemCategories: {
          didInvalidate: false,
          isFetching: false,
          results: [],
        },
      };

    case types.TRADE_ITEMS_PROPERTIES_SUCCESS:
      return {
        ...state,
        tradeItemsProperties: {
          ...state.tradeItemsProperties,
          results: action.results,
          isFetching: false,
        },
      };
    case types.TRADE_ITEMS_PROPERTIES_REQUEST:
      return {
        ...state,
        tradeItemsProperties: {
          ...state.tradeItemsProperties,
          isFetching: true,
        },
      };
    case types.TRADE_ITEMS_PROPERTIES_FAILURE:
      return {
        ...state,
        tradeItemsProperties: {
          ...state.tradeItemsProperties,
          didInvalidate: true,
        },
      };
    case types.TRADE_ITEMS_PROPERTIES_RESET:
      return {
        ...state,
        tradeItemsProperties: {
          didInvalidate: false,
          isFetching: false,
          results: [],
        },
      };

    case types.TRANSFORMATION_SET_RECEIVE:
      return {
        ...state,
        transformationSet: action.transformationSet,
      };
    case types.TRANSFORMATION_SET_UPDATE:
      return {
        ...state,
        transformationSet: {
          ...state.transformationSet,
          [action.key]: action.value,
        },
      };

    case types.TRANSFORMATION_SET_TRANSFORMATION_SELECTED:
      return {
        ...state,
        selectedTransformation: action.transformation,
      };

    case types.TRANSFORMATION_SET_ACTION_SET_SELECTED:
      return {
        ...state,
        selectedActionSet: action.actionSet,
      };

    case types.TRANSFORMATION_SET_ACTION_RECEIVED:
      return {
        ...state,
        action: action.action,
      };

    case types.INITIALIZE_TRADE_ITEM_TRANSFORMATION:
      return {
        ...state,
        transformationSet: utils.getDefaultTransformationSet(),
      };

    case types.SET_ACTION:
      return {
        ...state,
        action: action.payload,
      };
    case types.SELECTED_ACTION_INDEX:
      return {
        ...state,
        selectedActionIndex: action.payload,
      };
    case types.GET_ACTION_DEFINITIONS:
      return {
        ...state,
        get_action_definitions: action.payload,
      };
    case types.BUSINESS_SET_RULES:
      return {
        ...state,
        businessRuleSets: action.payload,
      };
    case types.TRADE_ITEMS_PROPERTIES:
      return {
        ...state,
        tradeItemsProperties: action.payload,
      };
    case types.PROPERTY_GROUP_LOADER:
      return {
        ...state,
        property_group_loader: action.payload,
      };

    case types.TRANSFORMATION_SET_PLAYGROUND_TRADE_ITEM_SELECTED:
      return {
        ...state,
        tradeItemId: action.tradeItemId,
      };
    case types.TRANSFORMATION_SET_PLAYGROUND_RESULT:
      return {
        ...state,
        transformation_set_playground_result: action.result,
      };
    case types.ERROR_MESSAGE:
      return {
        ...state,
        error_message: action.payload,
      };
    case types.GET_PROPERTY_GROUPS:
      return {
        ...state,
        get_property_groups: action.payload,
      };

    default:
      return state;
  }
};

export default transformation;
