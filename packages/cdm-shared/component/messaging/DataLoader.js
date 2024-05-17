import React, { useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { useStateValue } from "../../hook/useStateValue";
import {
  fetchCollections,
  fetchRecipients,
  fetchTemplates,
  fetchInboxMessageById
} from "./actions";
import { getDraftsStorageKey } from "./reducer";
import map from "lodash/map";
import queryString from "query-string";
import { localStorageGetItem } from "../../utils/localStorage";

function DataLoader({ currentLocaleCode, translate }) {
  const [{ user }, dispatch] = useStateValue();
  const location = useLocation();
  const history = useHistory();

  useEffect(() => {
    dispatch({ type: "setTranslationFn", translate });
  }, [translate, dispatch]);

  useEffect(() => {
    // fetch recipients
    fetchRecipients(user, dispatch)(currentLocaleCode);

    // fetch collections
    fetchCollections(user, dispatch)();

    // templates
    fetchTemplates(user, dispatch)();

    // set drafts from localstorage
    const draftsStr = localStorageGetItem(getDraftsStorageKey(user));
    if (draftsStr) {
      dispatch({
        type: "setDrafts",
        drafts: map(JSON.parse(draftsStr), d => {
          return { ...d, visible: false };
        })
      });
    }
  }, [user, dispatch, currentLocaleCode]);

  // load message
  useEffect(() => {
    const params = queryString.parse(location.search);
    if (params.selectedInboxMessageId) {
      fetchInboxMessageById(user, dispatch)(params.selectedInboxMessageId);
      const { selectedInboxMessageId, ...newParams } = params;
      history.push({
        pathname: "messaging",
        search: queryString.stringify(newParams)
      });
    }
  }, [location.search, user, dispatch, history.push]);

  return <></>;
}

export default DataLoader;
