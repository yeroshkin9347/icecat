import React, { useMemo } from "react";
import map from "lodash/map";
import ListItemMessage from "../common/ListItemMessage";

function DraftListItem({ recipients, ...otherProps }) {
  const recipientsDraft = useMemo(
    () =>
      map(recipients, r => {
        return { ...r, companyName: r.name };
      }),
    [recipients]
  );
  return (
    <ListItemMessage
      {...otherProps}
      noPreview={true}
      recipients={recipientsDraft}
      isRead={true}
    />
  );
}

export default DraftListItem;
