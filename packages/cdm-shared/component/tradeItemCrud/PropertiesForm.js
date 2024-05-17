import React, { useMemo, useState } from "react";
import get from "lodash/get";
import map from "lodash/map";
import debounce from "lodash/debounce";
import isString from "lodash/isString";
import isNumber from "lodash/isNumber";
import orderBy from "lodash/orderBy";
import toString from "lodash/toString";
import TextField from "@mui/material/TextField";
import { Icon, P } from "cdm-ui-components";
import { ic_search } from "react-icons-kit/md/ic_search";
import TradeItemProperty from "./properties/TradeItemProperty";
import { isPropertyNested } from "./manager";
import {
  PRODUCT_EDITION_KEY,
  PRODUCT_PLATFORM_KEY,
} from "../../constants/product";
import { withLocalization } from "common/redux/hoc/withLocalization";

const PropertiesForm = ({
  propertyFamilies,
  properties,
  currentLocaleCode,
  isEditable,
  getTradeItemPropertyValue,
  onChangeFormValue,
  tradeItemCategoryCode,
  manufacturerId,
  translate,
}) => {
  const [search, setSearch] = useState("");
  const debounceSetSearch = debounce(setSearch, 500);

  const formGroups = useMemo(() => {
    let filteredProperties = properties;
    const keyword = search.trim().toLowerCase();
    if (keyword) {
      filteredProperties = filteredProperties.filter((item) => {
        const value = getTradeItemPropertyValue(item.code);
        let valueStr = "";
        if (isString(value) || isNumber(value)) {
          valueStr = toString(value).toLowerCase();
        }
        return (
          item.name?.toLowerCase()?.includes(keyword) ||
          item?.code?.includes(keyword) ||
          valueStr.includes(keyword)
        );
      });
    }

    const groups = [];
    if (filteredProperties.length) {
      const noFamily = filteredProperties.filter(
        (propertyEdit) =>
          propertyEdit.propertyFamilyId ===
          "00000000-0000-0000-0000-000000000000"
      );
      if (noFamily.length) {
        groups.push({
          id: "0",
          name: "General Information",
          propertyFamily: null,
          properties: noFamily,
        });
      }

      propertyFamilies.forEach((propertyFamily) => {
        const propertyFamilyId = get(propertyFamily, "id");
        const propertyFamilyName = get(
          get(propertyFamily, "name.values", []).find(
            (value) => value.languageCode === currentLocaleCode
          ),
          "value",
          ""
        );
        let properties = filteredProperties.filter(
          (propertyEdit) =>
            get(propertyEdit, "propertyFamilyId") === propertyFamilyId
        );
        properties = orderBy(properties, (p) => p.displayIndex, "desc");
        if (properties.length) {
          groups.push({
            id: propertyFamilyId,
            name: propertyFamilyName,
            propertyFamily,
            properties,
          });
        }
      });
    }

    return groups;
  }, [search, properties, propertyFamilies, currentLocaleCode]);

  const onSearchChange = (e) => {
    debounceSetSearch(e.target.value);
  };

  return (
    <div>
      <div style={{ marginTop: "1rem", width: 250 }}>
        <TextField
          placeholder=""
          variant="outlined"
          size="small"
          className="form-field"
          InputProps={{
            endAdornment: (
              <Icon icon={ic_search} style={{ marginRight: 4 }} />
            ),
            sx: {
              borderRadius: "12.6em",
            }
          }}
          onChange={onSearchChange}
        />
      </div>
      {tradeItemCategoryCode ? (
        <div style={{ columnCount: 2, columnGap: "2rem", marginTop: "2rem" }}>
          {formGroups.map((group) => (
            <div key={group.id} style={{ breakInside: "avoid-column" }}>
              <h2 style={{ margin: 0 }}>{group.name}</h2>
              <hr style={{ border: 0, borderTop: "1px solid #ccc" }} />
              <div style={{ padding: "1rem 0" }}>
                {map(group.properties, (property) => {
                  if (
                    isPropertyNested(property) ||
                    property.code === PRODUCT_EDITION_KEY ||
                    property.code === PRODUCT_PLATFORM_KEY
                  ) {
                    return null;
                  }
                  return (
                    <div key={property.id}>
                      <TradeItemProperty
                        value={getTradeItemPropertyValue(property.code)}
                        onChange={(newVal) =>
                          onChangeFormValue(property, newVal)
                        }
                        property={property}
                        isEditable={isEditable}
                        tradeItemCategoryCode={tradeItemCategoryCode}
                        manufacturerId={manufacturerId}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <P style={{ textAlign: "center", padding: "40px" }}>
          {translate("tradeItemCrud.create.selectCategory")}
        </P>
      )}
    </div>
  );
};

export default withLocalization(PropertiesForm);
