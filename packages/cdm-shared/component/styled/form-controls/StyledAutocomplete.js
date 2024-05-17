import React from "react";
import styled from "styled-components";
import {Autocomplete, TextField} from "@mui/material";
import {KeyboardArrowDown} from "@mui/icons-material";

export const StyledAutocomplete = styled(Autocomplete)`
  .MuiInputBase-root {
    border: ${props => (props.error ? '1px solid #ff4c52' : '0')};
    font-size: 12px;
    padding: 6px;
    box-shadow: 0 0 transparent, inset 0 0 0 1px rgb(17 42 134 / 20%) !important;
    cursor: default;

    & > .MuiSvgIcon-root {
      width: auto;
      color: #cfd4d8;
      border-left: 1px solid #cfd4d8;
      font-size: 24px;
      padding-left: 6px;
      transition: color 150ms;

      &:hover {
        color: #999;
      }
    }
  }

  .MuiOutlinedInput-notchedOutline {
    display: none;
  }
`;

export const VirtualizedAutocomplete = ({ inputProps, placeholder, ...props }) => (
  <StyledAutocomplete
    disableClearable
    disableCloseOnSelect={Boolean(props.multiple)}
    renderInput={(params) => (
      <TextField
        {...params}
        InputProps={{ ...params.InputProps, endAdornment: <KeyboardArrowDown /> }}
        placeholder={placeholder}
        {...inputProps}
      />
    )}
    {...props}
  />
);
