import React, { useEffect, useMemo, useState } from "react";
import debounce from "lodash/debounce";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import {
  searchTradeItemCategories,
  searchTradeItemCategoriesCMS,
} from "../../../services/tradeItemCategories";

const CategoryAutocomplete = ({ value, isAdmin, localeCode, onChange }) => {
  const [search, setSearch] = useState(value);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const debounceSetSearch = debounce(setSearch, 500);

  const categoryOptions = useMemo(() => {
    return options.map((item) => item.code?.code).filter((code) => !!code);
  }, [options]);

  useEffect(() => {
    const getTradeItemCategoriesApi = isAdmin
      ? searchTradeItemCategoriesCMS
      : searchTradeItemCategories;

    setLoading(true);
    getTradeItemCategoriesApi(localeCode, {
      PageIndex: 0,
      PageSize: 20,
      freeTextCriteria: search,
    })
      .then((res) => {
        const sortedResults = res.data.results.sort((a, b) => {
          if (a.name < b.name) {
            return -1;
          }
          return 1;
        });
        setOptions(sortedResults);
      })
      .catch(() => {
        setOptions([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [search, isAdmin, localeCode]);

  const getOptionLabel = (value) => {
    if (!value) {
      return "";
    }
    const option = options.find((item) => item.code?.code === value);
    return option?.name || value;
  };

  const onSearchChange = (value) => {
    if (value) {
      const option = options.find((item) => item.name === value);
      if (option) {
        return;
      }
    }
    debounceSetSearch(value);
  };

  return (
    <Autocomplete
      disablePortal
      autoComplete
      includeInputInList
      disableClearable
      loading={loading}
      value={value}
      options={loading ? [] : categoryOptions}
      getOptionLabel={getOptionLabel}
      renderInput={(params) => (
        <TextField
          {...params}
          size="small"
          className="form-field"
          hiddenLabel
          fullWidth
        />
      )}
      onInputChange={(e, newValue) => onSearchChange(newValue)}
      onChange={(e, v) => onChange(v)}
    />
  );
};

export default CategoryAutocomplete;
