import { isRetailer, isManufacturer } from "../../redux/hoc/withAuth";
import get from "lodash/get";
import map from "lodash/map";
import reduce from "lodash/reduce";
import orderBy from "lodash/orderBy";
import {
  getMessagesForRetailerInbox,
  getMessagesForManufacturerInbox,
  getMessagesForRetailerOutbox,
  getMessagesForManufacturerOutbox,
  createMessageByRetailer,
  createMessageByManufacturer,
  getMessageDetailForManufacturerInbox,
  getMessageDetailForRetailerInbox,
  getMessageDetailForManufacturerOutbox,
  getMessageDetailForRetailerOutbox,
  getRetailerMessagingTemplate,
  getManufacturerMessagingTemplate,
  getRetailerMessagingTemplates,
  getManufacturerMessagingTemplates,
  getMessagesForCmsInbox,
  getMessagesForCmsOutbox,
  getMessageDetailForCmsInbox,
  createMessageByCms,
  getCmsMessagingTemplates,
  getCmsMessagingTemplate,
  getMessageDetailForCmsOutbox
} from "../../services/messaging";
import { getCollections } from "../../services/collection";
import {
  getLinkedRetailers,
  getLinkedManufacturers
} from "../../services/subscription";
import {
  FILTER_TYPE_COLLECTION,
  FILTER_TYPE_COMAPNY,
  FILTER_TYPE_FREE_SEARCH
} from "./utils";
import { fromEditorContentToHtml } from "../htmlEditor/HTMLEditor";
import { MENU_ITEM_SELECTED_INBOX } from "./reducer";
import { getRetailersAllLight } from "../../services/retailer";
import { getAllManufacturers } from "../../services/manufacturer";
import { CDM_MESSAGE_MAX_SIZE } from "../../redux/message";

export const getMethodForUser = (
  user,
  retailerMethod,
  manufacturerMethod,
  cmsMethod
) => {
  if (isRetailer(user)) return retailerMethod;
  else if (isManufacturer(user)) return manufacturerMethod;
  else return cmsMethod;
};

const convertUiFiltersIntoBackFilters = (filters, isInbox) => {
  return reduce(
    filters.recipient,
    (result, value) => {
      if (value === null) return result;
      if (value.type === FILTER_TYPE_COLLECTION)
        return { ...result, tags: value.name };
      if (value.type === FILTER_TYPE_COMAPNY)
        return { ...result, [isInbox ? "senderId" : "recipientId"]: value.id };
      if (value.type === FILTER_TYPE_FREE_SEARCH)
        return { ...result, subject: value.name };
    },
    {}
  );
};

const convertDraftToMessage = draft => {
  return {
    recipients: draft.recipients,
    subject: draft.subject,
    body: fromEditorContentToHtml(draft.body),
    tags: draft.collection ? [draft.collection.name] : []
  };
};

export const fetchLastestInboxMessages = user => () => {
  const method = getMethodForUser(
    user,
    getMessagesForRetailerInbox,
    getMessagesForManufacturerInbox,
    getMessagesForCmsInbox
  );
  return method(0, CDM_MESSAGE_MAX_SIZE, 30, { isRead: false });
};

export const fetchInboxMessages = (user, dispatch) => (
  pageNumber,
  pageSize,
  bodyLength,
  filters
) => {
  dispatch({ type: "setIsLoading", value: true });
  const method = getMethodForUser(
    user,
    getMessagesForRetailerInbox,
    getMessagesForManufacturerInbox,
    getMessagesForCmsInbox
  );
  method(
    pageNumber,
    pageSize,
    bodyLength,
    convertUiFiltersIntoBackFilters(filters, true)
  )
    .then(res => {
      dispatch({ type: "setIsLoading", value: false });
      dispatch({
        type: "setInboxMessages",
        messages: get(res, "data.results"),
        total: get(res, "data.total")
      });
    })
    .catch(e => {
      dispatch({ type: "setIsLoading", value: false });
      console.error(e);
    });
};

export const fetchOutboxMessages = (user, dispatch) => (
  pageNumber,
  pageSize,
  bodyLength,
  filters
) => {
  dispatch({ type: "setIsLoading", value: true });
  const method = getMethodForUser(
    user,
    getMessagesForRetailerOutbox,
    getMessagesForManufacturerOutbox,
    getMessagesForCmsOutbox
  );
  method(
    pageNumber,
    pageSize,
    bodyLength,
    convertUiFiltersIntoBackFilters(filters, false)
  )
    .then(res => {
      dispatch({ type: "setIsLoading", value: false });
      dispatch({
        type: "setOutboxMessages",
        messages: get(res, "data.results"),
        total: get(res, "data.total")
      });
    })
    .catch(e => {
      dispatch({ type: "setIsLoading", value: false });
      console.error(e);
    });
};

export const fetchInboxMessage = (user, dispatch) => message => {
  const method = getMethodForUser(
    user,
    getMessageDetailForRetailerInbox,
    getMessageDetailForManufacturerInbox,
    getMessageDetailForCmsInbox
  );

  dispatch({
    type: "setInboxMessageSelected",
    message: message
  });

  method(message.id)
    .then(res => {
      dispatch({
        type: "setInboxMessageSelected",
        message: get(res, "data")
      });
    })
    .catch(e => {
      console.error(e);
    });
};

export const fetchInboxMessageById = (user, dispatch) => id => {
  const method = getMethodForUser(
    user,
    getMessageDetailForRetailerInbox,
    getMessageDetailForManufacturerInbox,
    getMessageDetailForCmsInbox
  );

  dispatch({ type: "setMenuItemSelected", value: MENU_ITEM_SELECTED_INBOX });

  method(id)
    .then(res => {
      dispatch({
        type: "setInboxMessageSelected",
        message: get(res, "data")
      });
    })
    .catch(e => {
      console.error(e);
    });
};

export const fetchOutboxMessage = (user, dispatch) => message => {
  const method = getMethodForUser(
    user,
    getMessageDetailForRetailerOutbox,
    getMessageDetailForManufacturerOutbox,
    getMessageDetailForCmsOutbox
  );

  dispatch({
    type: "setOutboxMessageSelected",
    message: message
  });

  method(message.id)
    .then(res => {
      dispatch({
        type: "setOutboxMessageSelected",
        message: get(res, "data")
      });
    })
    .catch(e => {
      console.error(e);
    });
};

export const fetchRecipients = (user, dispatch) => currentLocaleCode => {
  // for retailers - load manufacturers
  if (isRetailer(user)) {
    getLinkedManufacturers()
      .then(res => {
        dispatch({
          type: "setRecipients",
          recipients: map(res.data, d => {
            return {
              id: d.manufacturerId,
              name: d.manufacturerName,
              discriminator: "Manufacturer"
            };
          })
        });
      })
      .catch(e => {
        console.error(e);
      });
  } else if (isManufacturer(user)) {
    getLinkedRetailers()
      .then(res => {
        dispatch({
          type: "setRecipients",
          recipients: map(res.data, d => {
            return {
              id: d.retailerId,
              name: d.retailerName,
              discriminator: "Retailer"
            };
          })
        });
      })
      .catch(e => {
        console.error(e);
      });
  } else {
    // cms user
    Promise.all([getRetailersAllLight(), getAllManufacturers()]).then(
      ([retailers, manufacturers]) => {
        dispatch({
          type: "setRecipients",
          recipients: orderBy(
            [
              ...map(retailers.data, r => ({
                ...r,
                discriminator: "Retailer"
              })),
              ...map(manufacturers.data, m => ({
                ...m,
                discriminator: "Manufacturer"
              }))
            ],
            ["name"],
            ["asc"]
          )
        });
      }
    );
  }
};

export const fetchCollections = (user, dispatch) => () => {
  getCollections()
    .then(res => {
      dispatch({
        type: "setCollections",
        collections: get(res, "data")
      });
    })
    .catch(e => {
      console.error(e);
    });
};

export const fetchTemplates = (user, dispatch) => () => {
  const method = getMethodForUser(
    user,
    getRetailerMessagingTemplates,
    getManufacturerMessagingTemplates,
    getCmsMessagingTemplates
  );
  method()
    .then(res => {
      dispatch({
        type: "setTemplates",
        templates: get(res, "data")
      });
    })
    .catch(e => {
      console.error(e);
    });
};

export const createMessageFromDraft = (user, dispatch) => draft => {
  const method = getMethodForUser(
    user,
    createMessageByRetailer,
    createMessageByManufacturer,
    createMessageByCms
  );

  const message = convertDraftToMessage(draft);

  return method(message)
    .then(res => {
      dispatch({
        type: "newMessageSent",
        draft
      });
      return res;
    })
    .catch(e => {
      alert("An error occured, please retry in a few seconds");
      throw e;
    });
};

export const loadTemplateForDraft = (user, dispatch) => (
  draftId,
  templateId
) => {
  const method = getMethodForUser(
    user,
    getRetailerMessagingTemplate,
    getManufacturerMessagingTemplate,
    getCmsMessagingTemplate
  );

  method(templateId)
    .then(res => {
      dispatch({ type: "loadTemplate", draftId, template: res.data });
    })
    .catch(e => {
      console.error(e);
    });
};

export const markMessageAsRead = (user, dispatch) => messageId => {
  dispatch({
    type: "markMessageAsRead",
    id: messageId
  });
};
