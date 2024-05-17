import React from "react";
import map from "lodash/map";
import { useStateValue } from "../../../hook/useStateValue";
import ListScrollableWrapper from "../common/ScrollableWrapper";
import { Padding } from "cdm-ui-components";
import DraftListItem from "./DraftListItem";

function DraftsList() {
  const [{ drafts, translate }, dispatch] = useStateValue();

  return (
    <ListScrollableWrapper>
      {drafts.length === 0 && (
        <Padding all={3}>{translate("messaging.draft.noDraft")}</Padding>
      )}
      {map(drafts, draft => (
        <DraftListItem
          key={`draft-list-${draft.id}`}
          {...draft}
          selected={draft.visible}
          onClick={() => dispatch({ type: "selectDraft", id: draft.id })}
        />
      ))}
    </ListScrollableWrapper>
  );
}

export default DraftsList;
