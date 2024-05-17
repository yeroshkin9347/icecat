import React, { useState } from "react";
import { get } from "lodash";
import { Padding, Text, Label, Margin } from "cdm-ui-components";
import CatalogActionsRow from "catalog/CatalogActionsRow";
import UpdateDateButton from "catalog/buttons/UpdateDateButton";
import {
  getYesterdayDateTime,
  getLastWeekDateTime,
  getLastMonthDateTime,
} from "cdm-shared/utils/date";
import { useStateValue } from "cdm-shared/hook/useStateValue";
import { defaultFilters } from "catalog/reducer";
import Filters from "cdm-shared/component/product/filter/Filters";
import FilterValueBar from "styled-components/filter/FilterValueBar";

const FiltersColumn = ({
  canExport,
  canExportBasket,
  // common props
  user,
  // functions
  search,
  triggerBasketExport,
  triggerSearchExport,
  quickFilter,
  updateUpdateDateFilter,
  // common functions
  translate,
}) => {
  const [
    {
      currentSize,
      areFiltersEmpty,
      userDefaultFilters,
      loading,
      total,
      manufacturers,
      filters,
      showFilters,
      collections,
      categoryNames,
      npdCategories,
      brands,
    },
    dispatch,
  ] = useStateValue();
  const [shouldUpdateChildFilters, setShouldUpdateChildFilters] =
    useState(false);

  return (
    <>
      {/* Total results */}
      {!loading && currentSize === 0 && total === 0 && (
        <Text> {translate("catalog.products.found.none")} </Text>
      )}
      {!loading && currentSize === 1 && total === 1 && (
        <Text>
          <Text id="span-catalog-total" inline></Text> {total}{" "}
          {translate("catalog.products.found.singular")}
        </Text>
      )}
      {!loading && currentSize > 1 && total > 1 && (
        <Text>
          <Text>
            {currentSize} {translate("catalog.products.displayed.plural")},{" "}
            <Text id="span-catalog-total" inline>
              {total}
            </Text>{" "}
            {translate("catalog.products.found.plural")}
          </Text>
        </Text>
      )}

      <FilterValueBar
        filters={[
          {
            key: "gtin",
            value: get(filters, "gtin") ? get(filters, "gtin") : null,
            label: translate("catalog.filters.gtin"),
          },
          {
            key: "tradeItemManufacturerCode",
            value: get(filters, "tradeItemManufacturerCode")
              ? get(filters, "tradeItemManufacturerCode")
              : null,
            label: translate("catalog.filters.ref"),
          },
          {
            key: "keyword",
            value: get(filters, "keyword") ? get(filters, "keyword") : null,
            label: translate("catalog.filters.keyword"),
          },
          {
            key: "releaseDateStart",
            value: get(filters, "releaseDateStart")
              ? get(filters, "releaseDateStart")
              : null,
            label: translate("catalog.filters.releaseDateStart"),
          },
          {
            key: "releaseDateEnd",
            value: get(filters, "releaseDateEnd")
              ? get(filters, "releaseDateEnd")
              : null,
            label: translate("catalog.filters.releaseDateEnd"),
          },
          {
            key: "discontinuedDateStart",
            value: get(filters, "discontinuedDateStart"),
            label: translate("catalog.filters.discontinuedDateStart"),
          },
          {
            key: "discontinuedDateEnd",
            value: get(filters, "discontinuedDateEnd"),
            label: translate("catalog.filters.discontinuedDateEnd"),
          },
          {
            key: "updatedDateStart",
            value: get(filters, "updatedDateStart"),
            label: translate("catalog.filters.updatedDateStart"),
          },
          {
            key: "updatedDateEnd",
            value: get(filters, "updatedDateEnd"),
            label: translate("catalog.filters.updatedDateEnd"),
          },
          {
            key: "manufacturers",
            value:
              get(filters, "manufacturers") &&
              get(filters, "manufacturers").length !== 0
                ? get(filters, "manufacturers")
                : null,
            label: translate("catalog.filters.manufacturers"),
          },
          {
            key: "brands",
            value:
              get(filters, "brands") && get(filters, "brands").length !== 0
                ? get(filters, "brands")
                : null,
            label: translate("catalog.filters.brands"),
          },
          {
            key: "collections",
            value:
              get(filters, "collections") &&
              get(filters, "collections").length !== 0
                ? get(filters, "collections")
                : null,
            label: translate("catalog.filters.collections"),
          },
          {
            key: "categoryNames",
            value:
              get(filters, "categoryNames") &&
              get(filters, "categoryNames").length !== 0
                ? get(filters, "categoryNames")
                : null,
            label: translate("catalog.filters.categoryNames"),
          },
          {
            key: "npdCategories",
            value: get(filters, "npdCategories")
              ? get(filters, "npdCategories").length !== 0 &&
                get(filters, "npdCategories")
              : null,
            label: translate("catalog.filters.npd"),
          },
          {
            key: "hasImages",
            value: get(filters, "hasImages") ? "Yes" : null,
            label: translate("catalog.filters.hasImages"),
          },
          {
            key: "hasNoImages",
            value: get(filters, "hasNoImages") ? "Yes" : null,
            label: translate("catalog.filters.hasNoImages"),
          },
          {
            key: "hasVideos",
            value: get(filters, "hasVideos") ? "Yes" : null,
            label: translate("catalog.filters.hasVideos"),
          },
          {
            key: "hasNoVideos",
            value: get(filters, "hasNoVideos") ? "Yes" : null,
            label: translate("catalog.filters.hasNoVideos"),
          },
          {
            key: "isDraft",
            value: get(filters, "isDraft") ? "Yes" : null,
            label: translate("catalog.filters.isDraft"),
          },
        ]}
        onRemoveFilter={(key) => {
          const newFilters = { ...filters, [key]: null };
          search(newFilters);
          setShouldUpdateChildFilters(true);
        }}
      />

      {/* Actions */}
      <Padding vertical={4} style={{ display: "block" }}>
        <CatalogActionsRow
          emptyFilters={areFiltersEmpty}
          isExportAllowed={canExport}
          isBasketExportAllowed={canExportBasket}
          // functions
          onShowFilters={(e) => dispatch({ type: "showFilters", value: true })}
          onEmptyFilters={(e) => {
            search(userDefaultFilters);
          }}
          translate={translate}
          onBasketExportRequested={() => triggerBasketExport()}
          onSearchExportRequested={() => triggerSearchExport()}
        />
      </Padding>

      <>

        {/* Update date */}
        <Label block>{translate("catalog.filters.updateDate")}</Label>
        <UpdateDateButton
          left
          light
          small
          active={filters.updatedDateStart === getYesterdayDateTime()}
          onClick={(e) => {
            updateUpdateDateFilter(getYesterdayDateTime());
            setShouldUpdateChildFilters(true);
          }}
        >
          {translate("catalog.filters.updateDateOneDay")}
        </UpdateDateButton>
        <UpdateDateButton
          middle
          light
          small
          active={filters.updatedDateStart === getLastWeekDateTime()}
          onClick={(e) => {
            updateUpdateDateFilter(getLastWeekDateTime());
            setShouldUpdateChildFilters(true);
          }}
        >
          {translate("catalog.filters.updateDateOneWeek")}
        </UpdateDateButton>
        <UpdateDateButton
          right
          light
          small
          active={filters.updatedDateStart === getLastMonthDateTime()}
          onClick={(e) => {
            updateUpdateDateFilter(getLastMonthDateTime());
            setShouldUpdateChildFilters(true);
          }}
        >
          {translate("catalog.filters.updateDateOneMonth")}
        </UpdateDateButton>
      </>

      <Margin top={4} bottom={4} />

      <Filters
        onCancel={() => dispatch({ type: "showFilters", value: false })}
        onUpdate={(newFilters) => {
          dispatch({ type: "resetSearchData" });
          dispatch({ type: "showFilters", value: false });
          search(newFilters);
        }}
        reload={showFilters}
        manufacturers={manufacturers}
        brands={brands}
        collections={collections}
        categoryNames={categoryNames}
        npdCategories={npdCategories}
        filters={filters}
        shouldUpdateChildFilters={shouldUpdateChildFilters}
        setShouldUpdateChildFilters={setShouldUpdateChildFilters}
        areFiltersEmpty={areFiltersEmpty}
        defaultFilters={defaultFilters}
      />
    </>
  );
};

export default FiltersColumn;
