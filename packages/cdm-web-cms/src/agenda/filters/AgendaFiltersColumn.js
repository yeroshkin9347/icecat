import React, { useEffect, useState } from "react";
import { Label, Input, VirtualizedSelect } from "cdm-ui-components";
import useInputTextDebounce from "cdm-shared/hook/useInputTextDebounce";
import { getCategoryAgendaForRetailerCms } from "cdm-shared/services/agenda";
import { ic_check } from "react-icons-kit/md/ic_check";
import { Icon } from "cdm-ui-components";
import { get, isEmpty } from "lodash";
import { getColorByProductCategoryCode } from "cdm-shared/component/calendars/utils";
import { getGroupsValuesByIdCms } from "cdm-shared/services/tradeItemProperties";
import { getAllRetailers } from "cdm-shared/services/retailer";

export const DATES_OPTIONS = [
  { id: "releaseDate", label: "Release date" },
  { id: "reviewDate", label: "Review date" },
];

const PUBLICATION_STATUS_OPTIONS = [
  { id: "final", label: "Published" },
  { id: "draft", label: "Not published" },
];

const AgendaFiltersColumn = ({ translate, filters = {}, setFilterField }) => {
  const [keyword, keywordDebounced, setKeyword] = useInputTextDebounce();
  const [categories, setCategories] = useState();
  const [editions, setEditions] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [retailers, setRetailers] = useState([]);

  const fetchEditions = () => {
    getGroupsValuesByIdCms("39dbf902-c0f3-408f-be38-f54f2eb1097b").then(
      (resp) => {
        setEditions(resp.data.values || []);
      }
    );
  };

  const fetchPlatforms = () => {
    getGroupsValuesByIdCms("96c773c0-89df-4316-8d21-01a7be4d6767").then(
      (resp) => {
        setPlatforms(resp.data.values || []);
      }
    );
  };

  const fetchRetailers = () => {
    getAllRetailers().then((resp) => {
      setRetailers(resp.data || []);
    });
  };

  useEffect(() => {
    fetchEditions();
    fetchPlatforms();
    fetchRetailers();
  }, []);

  useEffect(() => {
    if (
      (keywordDebounced && keywordDebounced.length >= 3) ||
      !keywordDebounced
    ) {
      setFilterField("keyword", keywordDebounced);
    }
  }, [keywordDebounced]);

  useEffect(() => {
    getCategoryAgendaForRetailerCms().then((res) => {
      setCategories(res.data);
    });
  }, []);

  return (
    <>
      <Label block>{translate("agenda.filters.keyword")}</Label>
      <Input
        onChange={(e) => setKeyword(e.target.value)}
        value={keyword}
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
        // getOptionLabel={(o) => o.name}
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
            <label>{o.name}</label>
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
        classNamePrefix="react-select-full-height"
        className="react-select-full-height"
      />

      <br />
      <Label block>{translate("agenda.filters.edition")}</Label>
      <VirtualizedSelect
        simpleValue
        placeholder=""
        isClearable
        isMulti
        value={filters.editions}
        onChange={(val) => setFilterField("editions", val)}
        options={editions}
        getOptionLabel={(o) => o.code}
        getOptionValue={(o) => o.code}
        classNamePrefix="react-select-full-height"
        className="react-select-full-height"
      />

      <br />
      <Label block>{translate("agenda.filters.platform")}</Label>
      <VirtualizedSelect
        simpleValue
        placeholder=""
        isClearable
        isMulti
        value={filters.platforms}
        onChange={(val) => setFilterField("platforms", val)}
        options={platforms}
        getOptionLabel={(o) => o.code}
        getOptionValue={(o) => o.code}
        classNamePrefix="react-select-full-height"
        className="react-select-full-height"
      />

      <br />
      <Label block>{translate("agenda.filters.publicationStatus")}</Label>
      <VirtualizedSelect
        simpleValue
        placeholder=""
        isClearable
        isMulti
        value={filters.publicationStatus}
        onChange={(val) => setFilterField("publicationStatus", val)}
        options={PUBLICATION_STATUS_OPTIONS}
        getOptionLabel={(o) => o.label}
        getOptionValue={(o) => o.id}
        classNamePrefix="react-select-full-height"
        className="react-select-full-height"
      />

      <br />
      <Label block>{translate("agenda.filters.dates")}</Label>
      <VirtualizedSelect
        simpleValue
        placeholder=""
        value={filters.dates}
        isClearable
        isMulti
        onChange={(val) => {
          if (isEmpty(val)) {
            setFilterField("dates", [DATES_OPTIONS[0]]);
          } else {
            setFilterField("dates", val);
          }
        }}
        options={DATES_OPTIONS}
        getOptionLabel={(o) => o.label}
        getOptionValue={(o) => o.id}
        classNamePrefix="react-select-full-height"
        className="react-select-full-height"
      />

      <br />
      <Label block>{translate("agenda.filters.retailer")}</Label>
      <VirtualizedSelect
        simpleValue
        placeholder=""
        isClearable
        isMulti
        value={filters.retailers}
        onChange={(val) => setFilterField("retailers", val)}
        options={retailers}
        getOptionLabel={(o) => o.name}
        getOptionValue={(o) => o.id}
        classNamePrefix="react-select-full-height"
        className="react-select-full-height"
      />
    </>
  );
};

export default AgendaFiltersColumn;
