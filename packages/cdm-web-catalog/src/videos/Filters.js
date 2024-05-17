import React, {useEffect, useMemo, useState} from "react";
import get from "lodash/get";
import keys from "lodash/keys";
import cloneDeep from "lodash/cloneDeep";
import debounce from "lodash/debounce";
import moment from "moment";
import {
  Input,
  Row,
  Col,
  Label,
  VirtualizedSelect,
} from "cdm-ui-components";
import { defaultFilters } from "./models";
import withUser from "cdm-shared/redux/hoc/withUser";
import { withLocalization } from "common/redux/hoc/withLocalization";
import DateRangePicker from "cdm-shared/component/DateRangePicker";
import NumberInput from "cdm-shared/component/NumberInput";
import {RangeInput} from "cdm-shared/component/styled/form-controls/RangeInput";

const Filters = ({
  filters: appliedFilters,
  filterOptions,
  onChange,
  currentParsedLocaleCode,
  translate,
}) => {
  const [filters, setFilters] = useState(appliedFilters || defaultFilters);

  const {
    categories, languages, exclusiveRetailers, mimeTypes, ratings, plungeAngles, facingTypes,
    sizeMin, sizeMax, widthMin, widthMax, heightMin, heightMax, indexMin, indexMax, densityXMin, densityXMax, densityYMin, densityYMax,
  } = useMemo(() => ({
    categories: keys(filterOptions?.categories || {}),
    languages: keys(filterOptions?.languages || {}),
    exclusiveRetailers: keys(filterOptions?.exclusiveRetailers || {}),
    mimeTypes: keys(filterOptions?.mimeTypes || {}),
    ratings: keys(filterOptions?.ratings || {}),
    plungeAngles: keys(filterOptions?.plungeAngles || {}),
    facingTypes: keys(filterOptions?.facingTypes || {}),
    sizeMin: filterOptions?.sizeMin || 0,
    sizeMax: filterOptions?.sizeMax || 0,
    widthMin: filterOptions?.widthMin || 0,
    widthMax: filterOptions?.widthMax || 0,
    heightMin: filterOptions?.heightMin || 0,
    heightMax: filterOptions?.heightMax || 0,
    indexMin: filterOptions?.indexMin || 0,
    indexMax: filterOptions?.indexMax || 0,
    densityXMin: filterOptions?.resolutionXMin || 0,
    densityXMax: filterOptions?.resolutionXMax || 0,
    densityYMin: filterOptions?.resolutionYMin || 0,
    densityYMax: filterOptions?.resolutionYMax || 0,
  }), [filterOptions]);

  useEffect(() => {
    setFilters(appliedFilters || defaultFilters);
  }, [appliedFilters]);

  const debouncedChangeHandler = useMemo(() => debounce(onChange, 1000), [onChange]);

  const updateFilter = (key, value, debounce = false) => {
    const newFilters = {
      ...cloneDeep(filters),
      [key]: value,
    };
    setFilters(newFilters);
    if (debounce) {
      debouncedChangeHandler(newFilters);
    } else {
      onChange(newFilters);
    }
  };

  return (
    <>
      <Row>
        <Col col>
          {/* Common filters */}
          {/* keyword */}
          <Label block>{translate("video.videosView.filters.quick")}</Label>
          <Input
            value={get(filters, "keyword") || ""}
            block
            onChange={(e) => updateFilter("keyword", e.target.value, true)}
          />
          <br/>

          {/* gtin */}
          <Label block>{translate("video.videosView.filters.gtin")}</Label>
          <Input
            value={get(filters, "gtin") || ""}
            block
            onChange={(e) => updateFilter("gtin", e.target.value, true)}
          />
          <br/>

          {/* MPN */}
          <Label block>
            {translate("video.videosView.filters.mpn")}
          </Label>
          <Input
            value={get(filters, "mpn") || ""}
            block
            onChange={(e) => updateFilter("mpn", e.target.value, true)}
          />
          <br/>

          {/* updated date */}
          <Label block>
            {translate("video.videosView.filters.updatedPeriod")}
          </Label>
          <DateRangePicker
            locale={currentParsedLocaleCode}
            startDate={get(filters, "updatedDateStart") || null}
            endDate={get(filters, "updatedDateEnd") || null}
            onStartDateChange={(d) =>
              updateFilter(
                "updatedDateStart",
                d ? moment(d).format("YYYY-MM-DD") : null
              )
            }
            onEndDateChange={(d) => {
              updateFilter(
                "updatedDateEnd",
                d ? moment(d).format("YYYY-MM-DD") : null
              )}
            }
          />
          <br/>

          {/* Category */}
          {!!categories.length && (
            <>
              <Label block>{translate("video.videosView.filters.category")}</Label>
              <VirtualizedSelect
                simpleValue
                isMulti
                placeholder=""
                closeMenuOnSelect={false}
                value={filters.categories || []}
                onChange={(v) => updateFilter("categories", v)}
                options={categories}
                getOptionLabel={(option) => translate(`video.meta.categories.${option}`)}
                classNamePrefix="cde-select"
                className="cde-select cde-select-full-width"
              />
              <br/>
            </>
          )}

          {/* Languages */}
          {!!languages.length && (
            <>
              <Label block>{translate("video.videosView.filters.language")}</Label>
              <VirtualizedSelect
                simpleValue
                isMulti
                placeholder=""
                closeMenuOnSelect={false}
                value={filters.languages || []}
                onChange={(v) => updateFilter("languages", v)}
                options={languages}
                classNamePrefix="cde-select"
                className="cde-select cde-select-full-width"
              />
              <br/>
            </>
          )}

          {/*/!* Exclusive retailers *!/*/}
          {/*{!!exclusiveRetailers.length && (*/}
          {/*  <>*/}
          {/*    <Label block>{translate("video.videosView.filters.exclusiveRetailer")}</Label>*/}
          {/*    <VirtualizedSelect*/}
          {/*      simpleValue*/}
          {/*      isMulti*/}
          {/*      placeholder=""*/}
          {/*      closeMenuOnSelect={false}*/}
          {/*      value={filters.exclusiveRetailers || []}*/}
          {/*      onChange={(v) => updateFilter("exclusiveRetailers", v)}*/}
          {/*      options={exclusiveRetailers}*/}
          {/*      classNamePrefix="cde-select"*/}
          {/*      className="cde-select cde-select-full-width"*/}
          {/*    />*/}
          {/*    <br/>*/}
          {/*  </>*/}
          {/*)}*/}

          {/*/!* Mime types *!/*/}
          {/*{!!mimeTypes.length && (*/}
          {/*  <>*/}
          {/*    <Label block>{translate("video.videosView.filters.mimeType")}</Label>*/}
          {/*    <VirtualizedSelect*/}
          {/*      simpleValue*/}
          {/*      isMulti*/}
          {/*      placeholder=""*/}
          {/*      closeMenuOnSelect={false}*/}
          {/*      value={filters.mimeTypes || []}*/}
          {/*      onChange={(v) => updateFilter("mimeTypes", v)}*/}
          {/*      options={mimeTypes}*/}
          {/*      classNamePrefix="cde-select"*/}
          {/*      className="cde-select cde-select-full-width"*/}
          {/*    />*/}
          {/*    <br/>*/}
          {/*  </>*/}
          {/*)}*/}

          {filters.type === 'video' && (
            <>
              {/* Rating */}
              {!!ratings.length && (
                <>
                  <Label block>{translate("video.videosView.filters.rating")}</Label>
                  <VirtualizedSelect
                    simpleValue
                    isMulti
                    placeholder=""
                    closeMenuOnSelect={false}
                    value={filters.ratings || []}
                    onChange={(v) => updateFilter("ratings", v)}
                    options={ratings}
                    classNamePrefix="cde-select"
                    className="cde-select cde-select-full-width"
                  />
                  <br/>
                </>
              )}

              {/* Width */}
              {widthMin < widthMax && (
                <div>
                  <Label block>{translate("video.videosView.filters.width")}</Label>
                  <RangeInput>
                    <NumberInput
                      value={get(filters, "minWidth")}
                      // min={widthMin}
                      // max={widthMax}
                      // validate
                      min={0}
                      autoAdjust
                      onChange={(e) => updateFilter("minWidth", e, true)}
                    />
                    ~
                    <NumberInput
                      value={get(filters, "maxWidth")}
                      // min={widthMin}
                      // max={widthMax}
                      // validate
                      min={0}
                      autoAdjust
                      onChange={(e) => updateFilter("maxWidth", e, true)}
                    />
                  </RangeInput>
                </div>
              )}
              <br/>

              {/* Height */}
              {heightMin < heightMax && (
                <div>
                  <Label block>{translate("video.videosView.filters.height")}</Label>
                  <RangeInput>
                    <NumberInput
                      value={get(filters, "minHeight")}
                      // min={heightMin}
                      // max={heightMax}
                      // validate
                      min={0}
                      autoAdjust
                      onChange={(e) => updateFilter("minHeight", e, true)}
                    />
                    ~
                    <NumberInput
                      value={get(filters, "maxHeight")}
                      // min={heightMin}
                      // max={heightMax}
                      // validate
                      min={0}
                      autoAdjust
                      onChange={(e) => updateFilter("maxHeight", e, true)}
                    />
                  </RangeInput>
                </div>
              )}
              <br/>
            </>
          )}

          {filters.type === 'image' && (
            <>
              {/* Plunge angle */}
              {!!plungeAngles.length && (
                <>
                  <Label block>{translate("video.videosView.filters.plungeAngle")}</Label>
                  <VirtualizedSelect
                    simpleValue
                    isMulti
                    placeholder=""
                    closeMenuOnSelect={false}
                    value={filters.plungeAngles || []}
                    onChange={(v) => updateFilter("plungeAngles", v)}
                    options={plungeAngles}
                    getOptionLabel={(option) => translate(`video.meta.plungeAngles.${option}`)}
                    classNamePrefix="cde-select"
                    className="cde-select cde-select-full-width"
                  />
                  <br/>
                </>
              )}

              {/* Facing type */}
              {!!facingTypes.length && (
                <>
                  <Label block>{translate("video.videosView.filters.facingType")}</Label>
                  <VirtualizedSelect
                    simpleValue
                    isMulti
                    placeholder=""
                    closeMenuOnSelect={false}
                    value={filters.facingTypes || []}
                    onChange={(v) => updateFilter("facingTypes", v)}
                    options={facingTypes}
                    getOptionLabel={(option) => translate(`video.meta.facingTypes.${option}`)}
                    classNamePrefix="cde-select"
                    className="cde-select cde-select-full-width"
                  />
                  <br/>
                </>
              )}

              {/* Has alpha */}
              <div className="whitespace-nowrap">
                <Input
                  id="has-alpha"
                  type="checkbox"
                  checked={get(filters, "hasAlpha") || false}
                  onChange={(e) => updateFilter("hasAlpha", !!e.target.checked)}
                />
                &nbsp;&nbsp;
                <Label htmlFor="has-alpha">{translate("video.videosView.filters.hasAlpha")}</Label>
              </div>
              <br/>

              {/* Index */}
              {indexMin < indexMax && (
                <div>
                  <Label block>{translate("video.videosView.filters.index")}</Label>
                  <RangeInput>
                    <NumberInput
                      value={get(filters, "minIndex")}
                      // min={indexMin}
                      // max={indexMax}
                      // validate
                      min={0}
                      autoAdjust
                      onChange={(e) => updateFilter("minIndex", e, true)}
                    />
                    ~
                    <NumberInput
                      value={get(filters, "maxIndex")}
                      // min={indexMin}
                      // max={indexMax}
                      // validate
                      min={0}
                      autoAdjust
                      onChange={(e) => updateFilter("maxIndex", e, true)}
                    />
                  </RangeInput>
                </div>
              )}
              <br/>

              {/* Size */}
              {sizeMin < sizeMax && (
                <div>
                  <Label block>{translate("video.videosView.filters.size")}</Label>
                  <RangeInput>
                    <NumberInput
                      value={get(filters, "minSize")}
                      // min={sizeMin}
                      // max={sizeMax}
                      // validate
                      min={0}
                      autoAdjust
                      onChange={(e) => updateFilter("minSize", e, true)}
                    />
                    ~
                    <NumberInput
                      value={get(filters, "maxSize")}
                      // min={sizeMin}
                      // max={sizeMax}
                      // validate
                      min={0}
                      autoAdjust
                      onChange={(e) => updateFilter("maxSize", e, true)}
                    />
                  </RangeInput>
                </div>
              )}
              <br/>

              {/* Width */}
              {widthMin < widthMax && (
                <div>
                  <Label block>{translate("video.videosView.filters.width")}</Label>
                  <RangeInput>
                    <NumberInput
                      value={get(filters, "minWidth")}
                      // min={widthMin}
                      // max={widthMax}
                      // validate
                      min={0}
                      autoAdjust
                      onChange={(e) => updateFilter("minWidth", e, true)}
                    />
                    ~
                    <NumberInput
                      value={get(filters, "maxWidth")}
                      // min={widthMin}
                      // max={widthMax}
                      // validate
                      min={0}
                      onChange={(e) => updateFilter("maxWidth", e, true)}
                    />
                  </RangeInput>
                </div>
              )}
              <br/>

              {/* Height */}
              {heightMin < heightMax && (
                <div>
                  <Label block>{translate("video.videosView.filters.height")}</Label>
                  <RangeInput>
                    <NumberInput
                      value={get(filters, "minHeight")}
                      // min={heightMin}
                      // max={heightMax}
                      // validate
                      min={0}
                      autoAdjust
                      onChange={(e) => updateFilter("minHeight", e, true)}
                    />
                    ~
                    <NumberInput
                      value={get(filters, "maxHeight")}
                      // min={heightMin}
                      // max={heightMax}
                      // validate
                      min={0}
                      autoAdjust
                      onChange={(e) => updateFilter("maxHeight", e, true)}
                    />
                  </RangeInput>
                </div>
              )}
              <br/>

              {/* DensityX */}
              {densityXMin < densityXMax && (
                <div>
                  <Label block>{translate("video.videosView.filters.densityX")}</Label>
                  <RangeInput>
                    <NumberInput
                      value={get(filters, "minDensityX")}
                      // min={densityXMin}
                      // max={densityXMax}
                      // validate
                      min={0}
                      autoAdjust
                      onChange={(e) => updateFilter("minDensityX", e, true)}
                    />
                    ~
                    <NumberInput
                      value={get(filters, "maxDensityX")}
                      // min={densityXMin}
                      // max={densityXMax}
                      // validate
                      min={0}
                      autoAdjust
                      onChange={(e) => updateFilter("maxDensityX", e, true)}
                    />
                  </RangeInput>
                </div>
              )}
              <br/>

              {/* DensityY */}
              {densityYMin < densityYMax && (
                <div>
                  <Label block>{translate("video.videosView.filters.densityY")}</Label>
                  <RangeInput>
                    <NumberInput
                      value={get(filters, "minDensityY")}
                      // min={densityYMin}
                      // max={densityYMax}
                      // validate
                      min={0}
                      autoAdjust
                      onChange={(e) => updateFilter("minDensityY", e, true)}
                    />
                    ~
                    <NumberInput
                      value={get(filters, "maxDensityY")}
                      // min={densityYMin}
                      // max={densityYMax}
                      // validate
                      min={0}
                      autoAdjust
                      onChange={(e) => updateFilter("maxDensityY", e, true)}
                    />
                  </RangeInput>
                </div>
              )}
              <br/>
            </>
          )}
        </Col>
      </Row>
    </>
  );
};

export default withUser(withLocalization(Filters));
