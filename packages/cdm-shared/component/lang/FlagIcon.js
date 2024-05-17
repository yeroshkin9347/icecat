import * as React from "react";
import split from "lodash/split";
import last from "lodash/last";

const FlagIcon = ({ code, ...otherProps }) => (
  <div
    className={`flag flag-${last(split(code.toLowerCase(), "-"))}`}
    {...otherProps}
  />
);

export default FlagIcon;
