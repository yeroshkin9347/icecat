import React from "react";
import { Select } from "cdm-ui-components";

function RecipientsSelect(props) {
  return (
    <Select
      tabSelectsValue={false}
      closeMenuOnSelect={false}
      isMulti
      isClearable={true}
      hideSelectedOptions={true}
      small
      {...props}
    />
  );
}

export default RecipientsSelect;
