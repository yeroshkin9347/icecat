import React, {useEffect, useMemo, useState} from "react";
import Autocomplete, {createFilterOptions} from '@mui/material/Autocomplete';
import TextField from "@mui/material/TextField";
import {getTaxonomies} from "../../../services/taxonomy";

const TaxonomyAutocomplete = ({
  value,
  onChange,
}) => {
  const [options, setOptions] = useState([]);

  const selectedOption = useMemo(() => {
    return options.find((item) => item.id === value) || null;
  }, [options, value]);

  useEffect(() => {
    getTaxonomies().then((res) => {
      setOptions(res.data);
    });
  }, []);

  return (
    <Autocomplete
      autoComplete
      includeInputInList
      disableClearable
      value={selectedOption}
      options={options}
      getOptionLabel={(o) => o.name || ""}
      filterOptions={createFilterOptions({
        matchFrom: "any",
        limit: 20,
        stringify: (o) => o.name,
      })}
      renderInput={(params) =>
        <TextField
          {...params}
          className="form-field"
          size="small"
          hiddenLabel
          fullWidth
        />
      }
      onChange={(e, v) => onChange(v)}
    />
  );
}

export default TaxonomyAutocomplete;
