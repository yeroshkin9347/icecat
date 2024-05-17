import React, { useEffect, useState } from "react";
import { Padding, Label, Input, VirtualizedSelect } from "cdm-ui-components";
import useInputTextDebounce from "cdm-shared/hook/useInputTextDebounce";
import { getCategoryAgendaForRetailer } from "cdm-shared/services/agenda";
import { ic_check } from "react-icons-kit/md/ic_check";
import { Icon } from "cdm-ui-components";
import { get, isEmpty, set } from "lodash";
import styled from "styled-components";
import { getColorByProductCategoryCode } from "cdm-shared/component/calendars/utils";
import useLocalization from "cdm-shared/hook/useLocalization";

const CategoryLabel = styled.label`
  color: #000000;
`;

const AgendaFiltersColumn = ({ translate, filters = {}, setFilterField }) => {
  const [keyword, keywordDebounced, setKeyword] = useInputTextDebounce();
  const [gtin, gtinDebounced, setGtin] = useInputTextDebounce();
  const [manufacturerRef, manufacturerRefDebounced, setManufacturerRef] =
    useInputTextDebounce();
  const [categories, setCategories] = useState();
  const [locale] = useLocalization();

  useEffect(() => {
    if (
      (keywordDebounced && keywordDebounced.length >= 3) ||
      !keywordDebounced
    ) {
      setFilterField("keyword", keywordDebounced);
    }
  }, [keywordDebounced]);

  useEffect(() => {
    setFilterField("gtin", gtinDebounced);
  }, [gtinDebounced]);

  useEffect(() => {
    setFilterField("tradeItemManufacturerCode", manufacturerRef);
  }, [manufacturerRefDebounced]);

  useEffect(() => {
    getCategoryAgendaForRetailer(locale).then((res) => {
      setCategories(res.data);
    });
  }, [locale]);

  useEffect(() => {
    if (!isEmpty(categories) && !isEmpty(filters.productCategory)) {
      const newProductCategory = filters.productCategory;
      newProductCategory.forEach((cat) => {
        const newCat = categories.find(
          (c) => get(c, "code.code") === get(cat, "code.code")
        );
        if (newCat) {
          set(cat, "name", newCat.name);
        }
      });
      setFilterField("productCategory", newProductCategory);
    }
  }, [categories]);

  return (
    <>
      <Padding
        style={{
          zIndex: -1,
        }}
        vertical={5}
        right={4}
      >
        <>
          <Label block>{translate("agenda.filters.keyword")}</Label>
          <Input
            onChange={(e) => setKeyword(e.target.value)}
            value={keyword}
            block
          />
          <br />

          {/* gtin */}
          <Label block>{translate("agenda.filters.gtin")}</Label>
          <Input onChange={(e) => setGtin(e.target.value)} value={gtin} block />
          <br />
          {/* tradeItemManufacturerCode */}
          <Label block>{translate("agenda.filters.ref")}</Label>
          <Input
            value={manufacturerRef}
            onChange={(e) => setManufacturerRef(e.target.value)}
            block
          />
          <br />
          <Label block>{translate("agenda.filters.productCategory")}</Label>
          <VirtualizedSelect
            simpleValue
            placeholder=""
            isClearable
            isMulti
            value={filters.productCategory}
            onChange={(val) => setFilterField("productCategory", val)}
            options={categories}
            getOptionLabel={(o) => (
              <div
                style={{
                  justifyContent: "space-between",
                  display: "flex",
                  backgroundColor: getColorByProductCategoryCode(
                    get(o, "code.code")
                  ),
                }}
              >
                <CategoryLabel>{o.name}</CategoryLabel>
                {get(o, "code.code") ===
                  get(filters, "productCategory.code.code") && (
                  <Icon
                    icon={ic_check}
                    size={14}
                    style={{ color: "#000", marginLeft: "4px" }}
                  />
                )}
              </div>
            )}
            styles={{
              option: (styles, { data, isDisabled, isFocused, isSelected }) => {
                return {
                  ...styles,
                  backgroundColor: getColorByProductCategoryCode(
                    get(data, "code.code")
                  ),
                  color: "#FFF",
                  cursor: isDisabled ? "not-allowed" : "default",
                };
              },
            }}
            getOptionValue={(o) => o.code.code}
            classNamePrefix="cde-select"
            className="cde-select react-select-full-height"
          />
          <br />
        </>
      </Padding>
    </>
  );
};

export default AgendaFiltersColumn;
