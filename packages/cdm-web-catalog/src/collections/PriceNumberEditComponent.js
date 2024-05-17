import { TextField } from "@mui/material";
import { useGridApiContext } from "@mui/x-data-grid-premium";
import { toNumber } from "lodash";
import React, { useCallback, useState } from "react";
import classNames from "classnames";

const PriceNumberEditComponent = ({ className, value, onChange, ...props }) => {
  const { id, field, property } = props;
  const isReadOnly = property?.isReadOnly;
  const [prevValue] = useState(value);
  const apiRef = useGridApiContext();

  const handleValueChange = useCallback((e) => {
    const newValue =
      e.target.value !== "" &&
      e.target.value !== null &&
      e.target.value !== undefined
        ? toNumber(e.target.value)
        : null;
    apiRef.current.setEditCellValue({
      id,
      field,
      value: newValue,
    });
  }, [id, field]);

  const handleBlur = useCallback(() => {
    if (prevValue !== value) {
      onChange(value);
    }
  }, [prevValue, value, onChange]);

  return (
    <TextField
      className={classNames("form-field", className)}
      type="number"
      readOnly={isReadOnly}
      defaultValue={value}
      onChange={handleValueChange}
      onBlur={handleBlur}
    />
  );
};

export default PriceNumberEditComponent;
