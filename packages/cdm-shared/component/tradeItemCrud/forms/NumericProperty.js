import React from "react";
import { Input } from "cdm-ui-components";
import toNumber from "lodash/toNumber";

const NumericProperty = ({ property, value, onChange }) => (
  <>
    <Input
      type="text"
      onChange={e => {
        onChange(e.target.value === "" ? null : toNumber(e.target.value));
      }}
      value={value || ""}
    />
  </>
);

export default NumericProperty;
