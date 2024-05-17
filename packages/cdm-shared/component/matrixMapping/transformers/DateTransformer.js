import React from "react";
import get from "lodash/get";
import { getDefaultTransformer } from "../transformers";
import { Input } from "cdm-ui-components";

const getTransformation = (value, apply) =>
  apply.trim()
    ? Object.assign({}, value || getDefaultTransformer(), {
        type: "date",
        value: apply,
      })
    : null;

const DateTransformer = ({ value, onChange }) => (
  <React.Fragment>
    <Input
      placeholder="dd/mm/YYYY"
      onChange={(e) => onChange(getTransformation(value, e.target.value))}
      value={get(value, "value", "")}
      className="form-control"
    />
  </React.Fragment>
);

export default DateTransformer;
