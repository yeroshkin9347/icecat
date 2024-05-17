import { updateUrl, paramObject } from "../../utils/url";
import map from "lodash/map";
import filter from "lodash/filter";
import indexOf from "lodash/indexOf";
import get from "lodash/get";
import findIndex from "lodash/findIndex";
import slice from "lodash/slice";
import { DEFAULT_PAGE_SIZE, isDraftEmpty } from "./utils";
import { newRandomInt } from "../../utils/random";
import { localStorageSetItem } from "../../utils/localStorage";

export const MENU_ITEM_SELECTED_INBOX = 0;
export const MENU_ITEM_SELECTED_OUTBOX = 1;
export const MENU_ITEM_SELECTED_DRAFTS = 2;

const newDraftId = () => newRandomInt() + "" + Date.now();

const newDraft = message => {
  return {
    id: newDraftId(),
    visible: true,
    reduced: false,
    subject: message && message.subject ? message.subject : "",
    recipients:
      message && message.sender
        ? [
            {
              id: message.sender.companyId,
              name: message.sender.companyName,
              discriminator:
                message.sender.discriminator === "DetailedManufacturerUser"
                  ? "Manufacturer"
                  : message.sender.discriminator === "DetailedRetailerUser"
                  ? "Retailer"
                  : null
            }
          ]
        : [],
    collection: message && message.collection ? message.collection : null,
    body: "",
    creationTimestamp: Date.now(),
    editorContent: null
  };
};

const DEFAULT_FILTERS = {
  recipient: null
};

const initialState = {
  filters: DEFAULT_FILTERS,
  defaultFilters: {},
  pageNumber: 0,
  pageSize: DEFAULT_PAGE_SIZE,
  total: 0,
  inboxList: [],
  outboxList: [],
  inboxMessageSelected: null,
  outboxMessageSelected: null,
  drafts: [],
  menuItemSelected: MENU_ITEM_SELECTED_INBOX,
  recipients: [],
  collections: [],
  isLoading: false,
  user: null,
  refreshCounter: 0,
  templates: [],
  translate: m => `default ${m}`
};

const updateUrlFromState = state => {
  updateUrl({
    pageNumber: state.pageNumber,
    menuItemSelected: state.menuItemSelected,
    filters: JSON.stringify(state.filters)
  });
};

export const getFiltersFromUrl = () => {
  const urlFilters = paramObject();
  let f = DEFAULT_FILTERS;
  if (get(urlFilters, "filters")) {
    f = JSON.parse(urlFilters.filters);
  }

  const filtersResponse = {
    filters: f,
    menuItemSelected: get(urlFilters, "menuItemSelected")
      ? parseInt(urlFilters.menuItemSelected)
      : MENU_ITEM_SELECTED_INBOX,
    pageNumber: get(urlFilters, "pageNumber")
      ? parseInt(urlFilters.pageNumber)
      : 0
  };

  const refreshCounter = get(urlFilters, "refreshCounter")
    ? parseInt(urlFilters.refreshCounter)
    : null;

  return refreshCounter === null
    ? filtersResponse
    : { ...filtersResponse, refreshCounter };
};

// const updateStateFromUrl = state => {
//   return {
//     ...state,
//     ...getFiltersFromUrl()
//   };
// };

export const getDraftsStorageKey = user => `drafts-${user.sub}`;

export const saveState = (user, state) => {
  // save drafts
  localStorageSetItem(getDraftsStorageKey(user), JSON.stringify(state));
};

const localReducer = (state, action) => {
  switch (action.type) {
    case "markMessageAsRead":
      const idxMessageRead = findIndex(
        state.inboxList,
        n => n.id === action.id
      );
      if (idxMessageRead === -1) return state;
      return {
        ...state,
        inboxList: [
          ...slice(state.inboxList, 0, idxMessageRead),
          { ...state.inboxList[idxMessageRead], isRead: true },
          ...slice(state.inboxList, idxMessageRead + 1)
        ]
      };
    case "setTranslationFn":
      return { ...state, translate: action.translate };
    case "setTemplates":
      return { ...state, templates: action.templates || [] };
    case "loadTemplate":
      const idxTplDraft = findIndex(state.drafts, d => d.id === action.draftId);
      const newDraftTpl = {
        ...state.drafts[idxTplDraft],
        id: newDraftId(),
        subject: action.template.subject,
        body: action.template.body
      };
      return {
        ...state,
        drafts: [
          ...state.drafts.slice(0, idxTplDraft),
          newDraftTpl,
          ...state.drafts.slice(idxTplDraft + 1)
        ]
      };
    case "saveState":
      saveState(
        action.user,
        filter(state.drafts, d => !isDraftEmpty(d))
      );
      return state;
    case "reply":
      return {
        ...state,
        drafts: [
          newDraft(action.message),
          ...map(state.drafts, (d, i) => {
            return { ...d, visible: i === 0 ? d.visible : false };
          })
        ]
      };
    case "newMessageSent":
      return {
        ...state,
        refreshCounter: state.refreshCounter + 1,
        drafts: filter(state.drafts, d => d.id !== action.draft.id)
      };
    case "refresh":
      const newState = {
        ...state,
        refreshCounter: state.refreshCounter + 1,
        pageNumber: 0
      };
      updateUrlFromState(newState);
      return newState;
    case "setIsLoading":
      return { ...state, isLoading: action.value };
    case "setRecipients":
      return { ...state, recipients: action.recipients };
    case "setCollections":
      return { ...state, collections: action.collections };
    case "updateFilterValue":
      const newStateFv = { ...state, filters: { [action.key]: action.value } };
      updateUrlFromState(newStateFv);
      return newStateFv;
    case "updateFilterRecipient":
      // not more than one type
      let newVal = action.value;
      if (action.value.length > 1) {
        let arr = [...action.value.slice(0, action.value.length - 1)];
        const lastInserted = action.value[action.value.length - 1];
        const indexOfSameType = findIndex(
          arr,
          v => v.type === lastInserted.type
        );
        if (indexOfSameType !== -1) {
          arr[indexOfSameType] = lastInserted;
          newVal = arr;
        }
      }
      const newStateUFR = { ...state, filters: { recipient: newVal } };
      updateUrlFromState(newStateUFR);
      return newStateUFR;
    case "updateDraftValue":
      const idxUd = findIndex(state.drafts, d => d.id === action.draft.id);
      const currentDraft = state.drafts[idxUd];
      return {
        ...state,
        drafts: [
          ...state.drafts.slice(0, idxUd),
          { ...currentDraft, [action.key]: action.value },
          ...state.drafts.slice(idxUd + 1)
        ]
      };
    case "selectDraft":
      return {
        ...state,
        drafts: map(state.drafts, d => {
          return {
            ...d,
            visible: d.id === action.id,
            reduced: !(d.id === action.id)
          };
        })
      };
    case "toggleReduceDraft":
      const idxToggle = indexOf(state.drafts, action.draft);
      return {
        ...state,
        drafts: [
          ...state.drafts.slice(0, idxToggle),
          { ...action.draft, reduced: !action.draft.reduced },
          ...state.drafts.slice(idxToggle + 1)
        ]
      };
    case "hideDraft":
      const idx = indexOf(state.drafts, action.draft);
      return {
        ...state,
        drafts: [
          ...state.drafts.slice(0, idx),
          {
            ...state.drafts[idx],
            visible: false,
            ...(action.valuesToSave || {})
          },
          ...state.drafts.slice(idx + 1)
        ]
      };
    case "removeDraft":
      return {
        ...state,
        drafts: filter(state.drafts, d => d.id !== action.draft.id)
      };
    case "setDrafts":
      return {
        ...state,
        drafts: action.drafts
      };
    case "newMessage":
      return {
        ...state,
        drafts: [
          newDraft(),
          ...map(state.drafts, (d, i) => {
            return { ...d, visible: i === 0 ? d.visible : false };
          })
        ]
      };
    // mark as read in inbox list too
    case "setInboxMessageSelected":
      let newStateIMS = {
        ...state,
        inboxMessageSelected: { ...action.message, isRead: true }
      };

      const idxInboxMessageRead = findIndex(
        state.inboxList,
        n => n.id === action.message.id
      );
      if (idxInboxMessageRead === -1) return newStateIMS;
      return {
        ...newStateIMS,
        inboxList: [
          ...slice(newStateIMS.inboxList, 0, idxInboxMessageRead),
          { ...newStateIMS.inboxList[idxInboxMessageRead], isRead: true },
          ...slice(newStateIMS.inboxList, idxInboxMessageRead + 1)
        ]
      };
    case "setInboxMessages":
      return {
        ...state,
        inboxList: action.messages || [],
        total: action.total || 0
      };
    case "setOutboxMessages":
      return {
        ...state,
        outboxList: action.messages || [],
        total: action.total || 0
      };
    case "setOutboxMessageSelected":
      return { ...state, outboxMessageSelected: action.message };
    case "setPreviousPage":
      const newStatePP = {
        ...state,
        pageNumber: state.pageNumber - 1 < 0 ? 0 : state.pageNumber - 1
      };
      updateUrlFromState(newStatePP);
      return newStatePP;
    case "setNextPage":
      if (state.pageSize * (state.pageNumber + 1) >= state.total) return state;
      const newStateNP = { ...state, pageNumber: state.pageNumber + 1 };
      updateUrlFromState(newStateNP);
      return newStateNP;
    case "setMenuItemSelected":
      const newStateMIS = {
        ...state,
        menuItemSelected: action.value,
        filters: { ...DEFAULT_FILTERS },
        pageNumber: 0,
        pageSize: DEFAULT_PAGE_SIZE,
        refreshCounter: 0
      };
      updateUrlFromState(newStateMIS);
      return newStateMIS;
    case "setFilters":
      return { ...state, filters: action.value };
    case "setFilter":
      let newFilters = { ...state.filters, [action.key]: action.value };
      return { ...state, filters: newFilters };
    case "setFilterValues":
      newFilters = { ...state.filters, ...action.values };
      return { ...state, filters: newFilters };
    case "resetFilters":
      return { ...state, filters: { ...state.defaultFilters } };

    default:
      return state;
  }
};

export { initialState, localReducer };
