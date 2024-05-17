import React, {useCallback, useMemo, useState} from "react";
import debounce from "lodash/debounce";
import {Autocomplete, TextField} from "@mui/material";
import {BackgroundImage, Icon} from "cdm-ui-components";
import {ic_search} from "react-icons-kit/md/ic_search";
import {searchManufacturerDigitalAssets} from "cdm-shared/services/videos";
import noimage from "cdm-shared/assets/noimage.svg";

function VideoAutocomplete({
  type,
  onChange,
  ...props
}) {
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState(undefined);
  const [options, setOptions] = useState([]);

  const searchOptions = useCallback((search) => {
    if (!search) {
      setOptions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    searchManufacturerDigitalAssets(type, 10, 0, { freeText: search }).then((res) => {
      setOptions(res.data.results);
      setLoading(false);
    }).catch(() => {
      setOptions([]);
      setLoading(false);
    });
  }, [type]);

  const debouncedSearch = useMemo(() => debounce(searchOptions, 500), [searchOptions]);

  const onSearchChange = (value, debounced) => {
    value = value.trim();
    if (value) {
      const option = options.find((item) => item.title === value);
      if (option) {
        setLoading(false);
        return;
      }
    }

    if (search === value) {
      return;
    }

    setLoading(true);
    setSearch(value);
    if (debounced) {
      debouncedSearch(value);
    } else {
      searchOptions(value);
    }
  };

  const onValueChange = (value) => {
    if (onChange) {
      const option = options.find((item) => item.id === value);
      onChange(option);
    }
  };

  return (
    <Autocomplete
      loading={loading}
      disableCloseOnSelect={props.multiple}
      options={loading? [] : options.map((item) => item.id)}
      value={props.multiple ? (props.value || []) : (props.value || null)}
      renderOption={(props, value) => {
        const option = options.find((item) => item.id === value);
        if (!option) {
          return null;
        }
        return (
          <div {...props}>
            <BackgroundImage
              src={option.thumbUrl || noimage}
              width="45px"
              height="45px"
              cover={!option.thumbUrl}
              style={{
                marginRight: '10px',
              }}
            />
            <span>{option.title}</span>
          </div>
        );
      }}
      forcePopupIcon={false}
      renderInput={(props) => <TextField {...props} InputProps={{ ...props.InputProps, endAdornment: <Icon icon={ic_search} /> }} />}
      onOpen={() => onSearchChange(search || '', false)}
      onInputChange={(e, search) => onSearchChange(search, true)}
      onChange={(e, newValue) => onValueChange(newValue)}
      {...props}
    />
  );
}

export default VideoAutocomplete;
