import React from "react";
import { DatePicker } from "cdm-ui-components";
import { date } from "cdm-shared/utils/date";
import { withLocalization } from "common/redux/hoc/withLocalization";

const DateProperty = ({
  property,
  value,
  currentParsedLocaleCode,
  onChange
}) => (
  <>
    <DatePicker
      onChange={d => onChange(d && d.format("YYYY-MM-DD"))}
      value={date(value)}
      locale={currentParsedLocaleCode}
    />
  </>
);

export default withLocalization(DateProperty);
