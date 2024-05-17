import React, { useEffect, useMemo, useCallback } from "react";
import { withRouter } from "react-router-dom";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import map from "lodash/map";
import { P, Button, Row, Col } from "cdm-ui-components";
import { fullSearch } from "cdm-shared/services/product";
import Results from "./Results";
import { paramObject } from "cdm-shared/utils/url";
import { withLocalization } from "common/redux/hoc/withLocalization";
import {
  allowExportTradeItems,
  allowFullExportTradeItems,
} from "cdm-shared/redux/hoc/withAuth";
import withShoppingCart from "common/redux/hoc/withShoppingCart";
import ExportActionPicker from "../exportation/ExportActionPicker";
import LoadMore from "./LoadMore";
import { launchActionById, searchAndExport } from "cdm-shared/services/export";
import withTheme from "cdm-shared/redux/hoc/withTheme";
import FiltersColumn from "./filters/FiltersColumn";
import { reducer, getInitialState } from "./reducer";
import { StateProvider, useStateValue } from "cdm-shared/hook/useStateValue";
import { triggerAnalyticsEvent } from "common/utils/analytics";
import withUser from "cdm-shared/redux/hoc/withUser";
import LoaderOverlay from "cdm-shared/component/LoaderOverlay";
import { ModalStyled } from "cdm-shared/component/styled/modal/ModalStyled";
import { SinglePageLayout } from "styled-components/layout";
import FiltersModal from "./filters/FiltersModal";

function init(state) {
  const urlFilters = paramObject();
  const filters = isEmpty(urlFilters)
    ? state.filters
    : { ...state.filters, ...urlFilters };
  return {
    ...state,
    initialKeywordFromUrl: get(paramObject(), "keyword") || null,
    filters,
  };
}

// Catalog dedicated data provider;
// facilitate data sharing between components & concentrate the logic in a specific reducer
function Catalog({
  // common props
  user,
  currentLocaleCode,
  shoppingCart,
  theme,
  history,

  // common functions
  translate,
}) {
  return (
    <StateProvider
      initialState={getInitialState()}
      reducer={reducer}
      init={init}
    >
      <CatalogContent
        user={user}
        currentLocaleCode={currentLocaleCode}
        shoppingCart={shoppingCart}
        theme={theme}
        history={history}
        translate={translate}
      />
    </StateProvider>
  );
}

// Catalog main content under a dedicated provider;
// also under several common legacy HoC
function CatalogContent({
  user,
  currentLocaleCode,
  shoppingCart,
  theme,
  history,

  // functions
  translate,
}) {
  const [
    {
      results,
      filters,
      emptyFilters,
      currentSize,
      areFiltersEmpty,
      loading,
      total,
      searchAfter,
      limit,
      showFilters,
      showBasketExportModal,
      showSearchExportModal,
      exportActionRunning,
      manufacturers,
      collections,
      categoryNames,
      npdCategories,
      brands,
    },
    dispatch,
  ] = useStateValue();

  // show overlay loading on the first fetching
  const showOverlayLoading = !searchAfter && loading;

  const canExport = useMemo(
    () =>
      !!(
        total &&
        (allowFullExportTradeItems(user) ||
          (allowExportTradeItems(user) && !areFiltersEmpty))
      ),
    [total, user, areFiltersEmpty]
  );
  const canExportBasket = useMemo(
    () =>
      !isEmpty(shoppingCart) &&
      (allowFullExportTradeItems(user) || allowExportTradeItems(user)),
    [shoppingCart, user]
  );

  // search products from our catalog
  const search = useCallback(
    (newFilters, loadMore) => {
      dispatch({ type: "setLoading", value: true });

      // send to analytics
      triggerAnalyticsEvent("Search", "Send indexer full search");

      fullSearch(
        currentLocaleCode,
        limit,
        loadMore ? searchAfter : null,
        newFilters
      )
        .then((res) => {
          dispatch({ type: "setSearchData", data: get(res, "data"), loadMore });
          dispatch({ type: "setFilters", value: newFilters });
        })
        .catch((err) => {
          console.error(err);
          dispatch({ type: "setLoading", value: false });
        });
    },
    [currentLocaleCode, limit, searchAfter, dispatch]
  );

  // quick filtering
  const quickFilter = useCallback(
    (key, value, doSearch = true) => {
      dispatch({ type: "setFilter", key, value });

      const newFilters = { ...filters, [key]: value };
      if (doSearch) search(newFilters);
    },
    [filters, search, dispatch]
  );

  // export action's products form basket
  const exportTradeItemsFromBasket = (exportActionId, exportActionParams) => {
    const filterCollectionCode = get(filters, 'collections');
    const params = {
      TradeItemIds: map(shoppingCart, (i) => i.tradeItemId) || null,
      CollectionCodes: filterCollectionCode ? [filterCollectionCode] : null,
      Gtins: null,
      ...(exportActionParams || {}),
    };

    triggerAnalyticsEvent("Export", "Export from basket");

    launchActionById(exportActionId, params).then((exportActionResult) => {
      if (get(exportActionResult, "status") !== "Failed")
        dispatch({ type: "setRunningExportAction", value: exportActionResult });
      else if (get(exportActionResult, "status") === "Failed")
        alert(translate("catalog.filters.exportError"));
    });
  };

  // export action's product using search filters
  const exportTradeItemsFromSearch = (exportActionId, exportActionParams) => {
    const _exportActionParams = {
      ...exportActionParams,
      PeriodEnd: undefined,
      PeriodStart: undefined,
      CollectionIds: undefined,
    };

    const _filters = {
      ...filters,
      CollectionIds: exportActionParams.CollectionIds,
    };

    triggerAnalyticsEvent("Export", "Export from search");

    // todo add export action params
    searchAndExport(
      currentLocaleCode,
      _filters,
      exportActionId,
      _exportActionParams
    ).then((exportActionResult) => {
      if (get(exportActionResult, "status") !== "Failed")
        dispatch({ type: "setRunningExportAction", value: exportActionResult });
      else if (get(exportActionResult, "status") === "Failed")
        alert(translate("catalog.filters.exportError"));
    });
  };

  const triggerSearchExport = () => {
    // const exportAuthorizedActions = getExportAuthorizedActions(user);

    // if (size(exportAuthorizedActions) > 1)
    dispatch({ type: "showSearchExportModal", value: true });
    // else exportTradeItemsFromSearch(exportAuthorizedActions[0]);
  };

  const triggerBasketExport = () => {
    // const exportAuthorizedActions = getExportAuthorizedActions(user);

    // if (size(exportAuthorizedActions) > 1)
    dispatch({ type: "showBasketExportModal", value: true });
    // else exportTradeItemsFromBasket(exportAuthorizedActions[0]);
  };

  const updateUpdateDateFilter = useCallback(
    (updateDate) => {
      if (filters.updatedDateStart === updateDate) {
        quickFilter("updatedDateStart", "", true);
      } else {
        quickFilter("updatedDateStart", updateDate, true);
      }
    },
    [filters.updatedDateStart, quickFilter]
  );

  // on component mount
  // we force eslint to shush because search & filters are initialized
  useEffect(() => {
    search(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {showOverlayLoading && <LoaderOverlay />}
      <SinglePageLayout
        title="Catalog"
        breadcrumbs={[
          { title: translate("header.nav.home"), route: "/" },
          { title: "Catalog" },
        ]}
        sidebar={
          <FiltersColumn
            currentSize={currentSize}
            canExport={canExport}
            canExportBasket={canExportBasket}
            theme={theme}
            history={history}
            currentLocaleCode={currentLocaleCode}
            emptyFilters={emptyFilters}
            user={user}
            search={search}
            onShowFilters={showFilters}
            triggerBasketExport={triggerBasketExport}
            triggerSearchExport={triggerSearchExport}
            quickFilter={quickFilter}
            updateUpdateDateFilter={updateUpdateDateFilter}
            translate={translate}
          />
        }
      >
        {/* Grid */}
        <Results
          loading={loading}
          results={results}
          user={user}
          history={history}
        />
        {/* Load more + loading */}
        <LoadMore
          loading={loading}
          currentSize={currentSize}
          results={results}
          total={total}
          filters={filters}
          search={search}
          translate={translate}
          className={"background-main"}
        />
      </SinglePageLayout>

      <FiltersModal
        manufacturers={manufacturers}
        brands={brands}
        collections={collections}
        categoryNames={categoryNames}
        npdCategories={npdCategories}
        filters={filters}
        search={search}
      />

      {/* Export basket action chooser */}
      {showBasketExportModal && (
        <ModalStyled
          style={{ overflow: "initial" }}
          sm
          title={translate("catalog.filters.exportBasket")}
        >
          <ExportActionPicker
            filterCollectionCode={get(filters, 'collections')}
            onSubmit={(exportActionId, exportActionParams) => {
              exportTradeItemsFromBasket(exportActionId, exportActionParams);
              dispatch({ type: "showBasketExportModal", value: false });
            }}
            onCancel={() =>
              dispatch({ type: "showBasketExportModal", value: false })
            }
          />
        </ModalStyled>
      )}

      {/* Export from search */}
      {showSearchExportModal && (
        <ModalStyled
          style={{ overflow: "initial" }}
          sm
          title={translate("catalog.filters.exportResults")}
        >
          <ExportActionPicker
            filters={filters}
            onSubmit={(exportActionId, exportActionParams) => {
              exportTradeItemsFromSearch(exportActionId, exportActionParams);
              dispatch({ type: "showSearchExportModal", value: false });
            }}
            onCancel={() =>
              dispatch({ type: "showSearchExportModal", value: false })
            }
          />
        </ModalStyled>
      )}

      {/* Is exporting modal */}
      {exportActionRunning && (
        <ModalStyled
          sm
          title={translate("catalog.filters.exportResults")}
          onClose={() =>
            dispatch({ type: "setRunningExportAction", value: null })
          }
        >
          <Row>
            <Col col center>
              <P>{translate("catalog.filters.isExporting")}</P>
              <br />
              <Button onClick={() => history.push("/export")} primary shadow>
                {translate("catalog.filters.viewMyExports")}
              </Button>
            </Col>
          </Row>
        </ModalStyled>
      )}
    </>
  );
}

export default withRouter(
  withUser(withLocalization(withTheme(withShoppingCart(Catalog))))
);
