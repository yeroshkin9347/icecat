import React, { useState, useMemo } from "react";
import { DefaultSelect as Select } from "cdm-ui-components";
import styled from "styled-components";
import {
  TOP_ROW_DEFAULT_FILTER_WIDTH,
  TOP_ROW_DEFAULT_ITEMS_PADDING,
  FILTER_TYPE_COLLECTION,
  FILTER_TYPE_COMAPNY,
  FILTER_TYPE_FREE_SEARCH
} from "./utils";
import { useStateValue } from "../../hook/useStateValue";
import map from "lodash/map";

const InputWrapper = styled.span`
  display: inline-block;
  max-width: ${TOP_ROW_DEFAULT_FILTER_WIDTH};
  width: ${TOP_ROW_DEFAULT_FILTER_WIDTH};
  margin-right: ${TOP_ROW_DEFAULT_ITEMS_PADDING};
`;

function MessagingFilters() {
  const [
    { filters, recipients, collections, isLoading, translate },
    dispatch
  ] = useStateValue();
  const [rawValue, setRawValue] = useState(null);
  const fixedOptions = useMemo(() => {
    return [
      {
        label: translate("messaging.filters.company"),
        options: map(recipients, r => {
          return { id: r.id, name: r.name, type: FILTER_TYPE_COMAPNY };
        })
      },
      {
        label: translate("messaging.filters.collection"),
        options: map(collections, c => {
          return { id: c.id, name: c.name, type: FILTER_TYPE_COLLECTION };
        })
      }
    ];
  }, [recipients, collections, translate]);

  const groupedOptions = useMemo(
    () => [
      {
        label: translate("messaging.filters.subject"),
        options: rawValue
          ? [
              {
                id: "-1",
                name: rawValue,
                label: translate("messaging.filters.subjectContains", {
                  rawValue
                }),
                type: FILTER_TYPE_FREE_SEARCH
              }
            ]
          : []
      },
      ...fixedOptions
    ],
    [translate, fixedOptions, rawValue]
  );

  return (
    <>
      <InputWrapper>
        <Select
          placeholder={translate("messaging.filters.placeholder")}
          noOptionsMessage={() =>
            translate("messaging.filters.noOptionMessage")
          }
          name="filter-messages-select"
          inputId="filter-messages-select-input"
          options={groupedOptions}
          isClearable={true}
          isSearchable={true}
          hideSelectedOptions={true}
          blurInputOnSelect={false}
          isLoading={isLoading}
          onInputChange={(val, { action }) => {
            if (
              action === "set-value" ||
              action === "menu-close" ||
              action === "input-blur"
            )
              return;
            setRawValue(val);
          }}
          isMulti={true}
          closeMenuOnSelect={true}
          value={filters.recipient}
          onChange={(o, { action }) => {
            if (action === "clear") setRawValue(null);
            dispatch({
              type: "updateFilterRecipient",
              value: o
            });
          }}
          getOptionValue={o => o.id}
          getOptionLabel={o => o.label || o.name}
          small
        />
      </InputWrapper>
    </>
  );
}

export default MessagingFilters;
