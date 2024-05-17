import React from "react";
import { Tag } from "cdm-ui-components";

function PrecomputingStatus({ status }) {
  return (
    <Tag
      noMargin
      success={status === "PreComputed"}
      info={status !== "PreComputed"}
    >
      {status}
    </Tag>
  );
}

export default React.memo(PrecomputingStatus);
