import React, {useRef} from "react";
import {Label, P} from "cdm-ui-components";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import {FormField} from "cdm-shared/component/styled/form-controls/FormField";

export const EmailInput = ({
  label,
  value,
  required,
  error,
  onChange,
}) => {
  const inputRef = useRef(null);

  const onInputEmail = (email) => {
    onChange([...value, email]);
  };

  return (
    <FormField error={Boolean(error)}>
      <Label block>{label}{required && ' *'}</Label>
      <Autocomplete
        disablePortal
        freeSolo
        multiple
        value={value}
        options={[]}
        onChange={(e, value) => onChange(value)}
        renderInput={(params) =>
          <TextField
            {...params}
            ref={inputRef}
            variant="outlined"
            size="small"
            fullWidth
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const value = params.inputProps.value.trim();
                const emailRegex = /^[\w.%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
                if (!emailRegex.test(value)) {
                  e.stopPropagation();
                }
              } else if (e.key === ',') {
                e.preventDefault();
                e.stopPropagation();

                const value = params.inputProps.value.trim();
                const emailRegex = /^[\w.%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
                if (emailRegex.test(value)) {
                  onInputEmail(value);
                  params.inputProps.onChange({ target: { value: '' } });
                }
              }
            }}
          />
        }
      />
      {error && (<P>{error}</P>)}
    </FormField>
  );
};
