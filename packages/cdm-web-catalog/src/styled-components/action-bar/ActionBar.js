import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";
import AutoComplete from "catalog/filters/AutoComplete";

import styled from "styled-components";
import { getLang } from "cdm-shared/redux/localization";
import dotProp from "dot-prop-immutable";
import get from "lodash/get";
import { useStateValue } from "cdm-shared/hook/useStateValue";
import { triggerAnalyticsEvent } from "common/utils/analytics";
import { fullSearch } from "cdm-shared/services/product";

export const ActionBarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 8px 10px 1px rgba(0, 0, 0, 0.01),
    0 3px 14px 2px rgba(0, 0, 0, 0.1), 0 5px 5px -3px rgba(0, 0, 0, 0.03) !important;
  padding: 0.8rem 2rem;
  background-color: #fff;
  position: relative;
  z-index: 100;
  height: 60px;
`;

const ActionBar = ({
  children,
  showProductSearch = false,
  containerStyle = {},
}) => {
  const history = useHistory();
  const lang = getLang();

  // if state is not null, we are in the catalog
  const state = useStateValue();
  const isCatalog = !!state;

  const [{ filters, searchAfter, limit, userDefaultFilters }, dispatch] =
    state || [
      { filters: {}, searchAfter: null, limit: 20, userDefaultFilters: {} },
    ];

  // this is only used in the catalog
  const search = useCallback(
    (newFilters, loadMore) => {
      dispatch({ type: "setLoading", value: true });

      // send to analytics
      triggerAnalyticsEvent("Search", "Send indexer full search");

      fullSearch(lang, limit, loadMore ? searchAfter : null, newFilters)
        .then((res) => {
          dispatch({ type: "setSearchData", data: get(res, "data"), loadMore });
          dispatch({ type: "setFilters", value: newFilters, history });
        })
        .catch((err) => {
          console.error(err);
          dispatch({ type: "setLoading", value: false });
        });
    },
    [lang, limit, searchAfter, dispatch]
  );

  return (
    <ActionBarContainer className="action-bar-container" style={containerStyle}>
      {children}
      {showProductSearch && (
        <AutoComplete
          style={{ width: "300px" }}
          keyword={filters ? filters.keyword : ""}
          defaultValue={filters.keyword}
          onSubmit={(value) => {
            if (isCatalog) {
              search(dotProp.set(userDefaultFilters, "keyword", value));
            } else {
              history.push(`/catalog?keyword=${value}`);
            }
          }}
          onSelectRow={(row) =>
            history.push(`/product/${row.languageCode}/${row.tradeItemId}`)
          }
          lang={lang}
        />
      )}
    </ActionBarContainer>
  );
};

export default ActionBar;
