import React, { useMemo } from "react";
import styled from "styled-components";
import map from "lodash/map";
import filter from "lodash/filter";
import { useStateValue } from "../../../hook/useStateValue";
import Draft from "./Draft";
import reverse from "lodash/reverse";

const DraftsZone = styled.div`
  position: fixed;
  display: inline-block;
  bottom: -2px;
  right: 0;
  z-index: 8;
`;

const DraftWrapper = styled.div`
  display: inline-block;
  position: relative;
  margin-right: 2rem;
`;

function DraftsContainer() {
  const [
    { drafts, recipients, collections, templates, user, translate },
    dispatch,
  ] = useStateValue();
  const visibleDrafts = useMemo(
    () => reverse(filter(drafts, (d) => d.visible)),
    [drafts]
  );

  return (
    <DraftsZone>
      {map(visibleDrafts, (d) => (
        <DraftWrapper key={`draft-zone-item-${d.id}`}>
          <Draft
            draft={d}
            dispatch={dispatch}
            recipients={recipients}
            collections={collections}
            templates={templates}
            user={user}
            translate={translate}
          />
        </DraftWrapper>
      ))}
    </DraftsZone>
  );
}

export default DraftsContainer;
