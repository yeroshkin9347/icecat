import React, { useEffect, useMemo, useState } from "react";
import keys from "lodash/keys";
import indexOf from "lodash/indexOf";
import filter from "lodash/filter";
import map from "lodash/map";
import find from "lodash/find";
import intersectionWith from "lodash/intersectionWith";
import debounce from "lodash/debounce";
import get from "lodash/get";
import { Input, Row, Col, Label, VirtualizedSelect } from "cdm-ui-components";
import withUser from "cdm-shared/redux/hoc/withUser";
import { isManufacturer } from "cdm-shared/redux/hoc/withAuth";
import DateRangePicker from "cdm-shared/component/DateRangePicker";
import { withLocalization } from "common/redux/hoc/withLocalization";
import moment from "moment";

const Filters = ({
  onUpdate,
  manufacturers,
  brands,
  collections,
  categoryNames,
  npdCategories,
  filters,
  currentParsedLocaleCode,
  translate,
  user,
  shouldUpdateChildFilters,
  setShouldUpdateChildFilters,
  areFiltersEmpty,
  defaultFilters,
}) => {
  const [filtersLocal, setFilters] = useState(filters);

  const debouncedChangeHandler = useMemo(
    () => debounce(onUpdate, 1000),
    [onUpdate]
  );

  const updateFilter = (key, value, debounce = false) => {
    const newFilters = {
      ...filtersLocal,
      [key]: value,
    };
    setFilters(newFilters);
    if (debounce) {
      debouncedChangeHandler(newFilters);
    } else {
      onUpdate(newFilters);
    }
  };

  const collectionsForSelection = useMemo(() => {
    return keys(collections ?? {}).map((key) => ({
      label: `${key} - (${collections[key]})`,
      value: key,
    }));
  }, [collections]);

  const manufacturersForSelection = useMemo(() => {
    return keys(manufacturers ?? {}).map((key) => ({
      label: `${key} - (${manufacturers[key]})`,
      value: key,
    }));
  }, [manufacturers]);

  const brandsForSelection = useMemo(() => {
    return keys(brands ?? {}).map((key) => ({
      label: `${key} - (${brands[key]})`,
      value: key,
    }));
  }, [brands]);

  const categoriesForSelection = useMemo(() => {
    return keys(categoryNames ?? {}).map((key) => ({
      label: `${key} - (${categoryNames[key]})`,
      value: key,
    }));
  }, [categoryNames]);

  useEffect(() => {
    if (areFiltersEmpty) {
      setFilters(defaultFilters);
    }
    if (shouldUpdateChildFilters) {
      setFilters(filters);
      setShouldUpdateChildFilters(false);
    }
  }, [filters]);

  return (
    <Row>
      <Col col>
        {/* Common filters */}
        {/* gtin */}
        <div>
          <Label block>{translate("catalog.filters.gtin")}</Label>
          <Input
            onChange={(e) => updateFilter("gtin", e.target.value, true)}
            value={get(filtersLocal, "gtin") || ""}
            block
          />
        </div>
        <br />
        {/* tradeItemManufacturerCode */}
        <Label block>{translate("catalog.filters.ref")}</Label>
        <Input
          onChange={(e) =>
            updateFilter("tradeItemManufacturerCode", e.target.value, true)
          }
          value={get(filtersLocal, "tradeItemManufacturerCode") || ""}
          block
        />
        <br />
        {/* keyword */}
        <Label block>{translate("catalog.filters.keyword")}</Label>
        <Input
          onChange={(e) => updateFilter("keyword", e.target.value, true)}
          value={get(filtersLocal, "keyword") || ""}
          block
        />
        <br />
        {/* Manufacturers */}
        {!isManufacturer(user) && (
          <>
            <Label block>{translate("catalog.filters.manufacturers")}</Label>
            <VirtualizedSelect
              simpleValue
              isMulti
              placeholder=""
              closeMenuOnSelect={false}
              value={
                filters.manufacturers
                  ? intersectionWith(
                      manufacturersForSelection,
                      filters.manufacturers,
                      (coll, fil) => {
                        return coll.value === fil;
                      }
                    )
                  : null
              }
              onChange={(value) => {
                updateFilter(
                  "manufacturers",
                  map(value, (item) => item.value)
                );
              }}
              getOptionValue={({ value }) => value}
              getOptionLabel={({ label }) => label}
              options={manufacturersForSelection}
              classNamePrefix="cde-select"
              className="cde-select"
            />
            <br />
          </>
        )}
        {/* Brands */}
        {
          <>
            <Label block>{translate("catalog.filters.brands")}</Label>
            <VirtualizedSelect
              simpleValue
              isMulti
              placeholder=""
              value={
                filters.brands
                  ? intersectionWith(
                      brandsForSelection,
                      filters.brands,
                      (coll, fil) => {
                        return coll.value === fil;
                      }
                    )
                  : null
              }
              closeMenuOnSelect={false}
              onChange={(value) => {
                updateFilter(
                  "brands",
                  map(value, (item) => item.value)
                );
              }}
              getOptionValue={({ value }) => value}
              getOptionLabel={({ label }) => label}
              options={brandsForSelection}
              classNamePrefix="cde-select"
              className="cde-select cde-select-full-width"
            />
          </>
        }
        <br />
        {/* Collections */}
        {
          <>
            <Label block>{translate("catalog.filters.collections")}</Label>
            <VirtualizedSelect
              placeholder=""
              closeMenuOnSelect={false}
              value={
                filters.collections
                  ? find(collectionsForSelection, ({ value }) => {
                      value == filters.collections;
                    })
                  : null
              }
              onChange={({ value }) => {
                updateFilter("collections", value);
              }}
              getOptionValue={({ value }) => value}
              getOptionLabel={({ label }) => label}
              options={collectionsForSelection}
              classNamePrefix="cde-select"
              className="cde-select cde-select-full-width"
            />
            <br />
          </>
        }
        {/* Icecat category */}
        <Label block>{translate("catalog.filters.categoryNames")}</Label>
        <VirtualizedSelect
          simpleValue
          isMulti
          placeholder=""
          closeMenuOnSelect={false}
          value={
            filters.categoryNames
              ? intersectionWith(
                  categoriesForSelection,
                  filters.categoryNames,
                  (coll, fil) => {
                    return coll.value === fil;
                  }
                )
              : null
          }
          onChange={(values) => {
            updateFilter(
              "categoryNames",
              map(values, (item) => item.value)
            );
          }}
          getOptionValue={({ value }) => value}
          getOptionLabel={({ label }) => label}
          options={categoriesForSelection}
          classNamePrefix="cde-select"
          className="cde-select cde-select-full-width"
        />
        <br />
        {/* release date */}
        <div>
          <Label block>{translate("catalog.filters.releaseDatePeriod")}</Label>
          <DateRangePicker
            locale={currentParsedLocaleCode}
            onStartDateChange={(d) => {
              updateFilter(
                "releaseDateStart",
                d ? moment(d).format("YYYY-MM-DD") : null
              );
            }}
            startDate={filters.releaseDateStart}
            onEndDateChange={(d) => {
              updateFilter("releaseDateEnd", d ? moment(d).format("YYYY-MM-DD") : null);
            }}
            endDate={filters.releaseDateEnd}
          />
        </div>
        <br />
        {/* discontinued date */}
        <div>
          <Label block>{translate("catalog.filters.discontinuedPeriod")}</Label>
          <DateRangePicker
            locale={currentParsedLocaleCode}
            onStartDateChange={(d) => {
              updateFilter(
                "discontinuedDateStart",
                d ? moment(d).format("YYYY-MM-DD") : null
              );
            }}
            startDate={filters.discontinuedDateStart}
            onEndDateChange={(d) => {
              updateFilter(
                "discontinuedDateEnd",
                d ? moment(d).format("YYYY-MM-DD") : null
              );
            }}
            endDate={filters.discontinuedDateEnd}
          />
        </div>
        <br />
        {/* updated date */}
        <div>
          <Label block>{translate("catalog.filters.lastUpdatedPeriod")}</Label>
          <DateRangePicker
            locale={currentParsedLocaleCode}
            onStartDateChange={(d) => {
              updateFilter(
                "updatedDateStart",
                d ? moment(d).format("YYYY-MM-DD") : null
              );
            }}
            startDate={filters.updatedDateStart}
            onEndDateChange={(d) => {
              updateFilter("updatedDateEnd", d ? moment(d).format("YYYY-MM-DD") : null);
            }}
            endDate={filters.updatedDateEnd}
          />
        </div>
        <br />
        {/* NPD category */}
        {npdCategories && keys(npdCategories).length !== 0 && (
          <>
            <Label block>{translate("catalog.toysFilters.npd")}</Label>
            <VirtualizedSelect
              simpleValue
              isMulti
              placeholder=""
              closeMenuOnSelect={false}
              value={
                filters.npdCategories
                  ? filter(
                      keys(npdCategories),
                      (m) => indexOf(filters.npdCategories, m) !== -1
                    )
                  : null
              }
              onChange={(v) => {
                updateFilter(
                  "npdCategories",
                  map(v, (r) => r)
                );
              }}
              options={keys(npdCategories)}
              classNamePrefix="cde-select"
              className="cde-select"
            />
            <br />
          </>
        )}
        {/* image no image */}
        <Row>
          {/* with image */}
          <Col col={4} className="whitespace-nowrap">
            <Input
              id="with-image"
              type="checkbox"
              onChange={(e) => {
                updateFilter("hasImages", e.target.checked);
              }}
              isChecked={filtersLocal.hasImages}
            />
            &nbsp;&nbsp;
            <Label htmlFor="with-image">
              {translate("catalog.filters.hasImages")}
            </Label>
          </Col>

          {/* with no image */}
          <Col col={4} className="whitespace-nowrap">
            <Input
              id="with-no-image"
              type="checkbox"
              onChange={(e) => updateFilter("hasNoImages", e.target.checked)}
              isChecked={filtersLocal.hasNoImages}
            />
            &nbsp;&nbsp;
            <Label htmlFor="with-no-image">
              {translate("catalog.filters.hasNoImages")}
            </Label>
          </Col>

          {/* with video */}
          <Col col={4} className="whitespace-nowrap">
            <Input
              id="with-video"
              type="checkbox"
              onChange={(e) => updateFilter("hasVideos", e.target.checked)}
              isChecked={filtersLocal.hasVideos}
            />
            &nbsp;&nbsp;
            <Label htmlFor="with-video">
              {translate("catalog.filters.hasVideos")}
            </Label>
          </Col>

          {/* with no videos */}
          <Col col={4} className="whitespace-nowrap">
            <Input
              id="with-no-videos"
              type="checkbox"
              onChange={(e) => updateFilter("hasNoVideos", e.target.checked)}
              isChecked={filtersLocal.hasNoVideos}
            />
            &nbsp;&nbsp;
            <Label htmlFor="with-no-videos">
              {translate("catalog.filters.hasNoVideos")}
            </Label>
          </Col>

          {/* draft only */}
          <Col col={4} className="whitespace-nowrap">
            <Input
              id="draft-only"
              type="checkbox"
              onChange={(e) => updateFilter("isDraft", e.target.checked)}
              isChecked={filtersLocal.isDraft}
            />
            &nbsp;&nbsp;
            <Label htmlFor="draft-only">
              {translate("catalog.filters.isDraft")}
            </Label>
          </Col>
        </Row>
        <br />
      </Col>
    </Row>
  );
};

export default withUser(withLocalization(Filters));
