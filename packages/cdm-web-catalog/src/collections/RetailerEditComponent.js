import React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { useGridApiContext } from "@mui/x-data-grid-premium";
import classNames from "classnames";
import { isString } from "lodash";

const RetailerEditComponent = ({
  className,
  value,
  selectedRetailers,
  retailers = [],
  property,
  ...props
}) => {
  const { id, field, onChange } = props;
  const apiRef = useGridApiContext();
  const formatedValue = isString(value) ? selectedRetailers : value;

  const handleValueChange = (e, newValue) => {
    apiRef.current.setEditCellValue({
      id,
      field,
      value: newValue,
    });
    onChange(id, field, newValue);
  };

  return (
    <div style={{ minWidth: "100%" }}>
      <Autocomplete
        multiple
        autoComplete
        size="small"
        readOnly={property?.isReadOnly}
        includeInputInList
        disableCloseOnSelect
        value={formatedValue || []}
        onChange={handleValueChange}
        options={retailers}
        getOptionLabel={(option) => (option ? option.retailerName : "")}
        renderInput={(params) => (
          <TextField
            className={classNames("form-field", className)}
            {...params}
            size="small"
            hiddenLabel
            fullWidth
          />
        )}
      />
    </div>
  );
};

export default RetailerEditComponent;
