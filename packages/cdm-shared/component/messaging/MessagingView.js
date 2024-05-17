import React from "react";
import { Container } from "cdm-ui-components";
import { withLocalization } from "common/redux/hoc/withLocalization";
import MessagingActions from "./MessagingActions";
import styled from "styled-components";
import MessagingMainView from "./MessagingMainView";
import { localReducer, initialState, getFiltersFromUrl } from "./reducer";
import { StateProvider } from "../../hook/useStateValue";
import DraftsContainer from "./draft/DraftsContainer";
import DataLoader from "./DataLoader";
import DataSaver from "./DataSaver";
import withUser from "../../redux/hoc/withUser";

// Tri-Zone layout (1-3-8)
function MessagingView({ user, currentLocaleCode, translate }) {
  return (
    <StateProvider
      initialState={{
        ...initialState,
        user,
        translate,
        ...getFiltersFromUrl()
      }}
      reducer={localReducer}
    >
      {/* Data dependencies */}
      <DataLoader currentLocaleCode={currentLocaleCode} translate={translate} />
      {/* Save data on quit */}
      <DataSaver />
      {/* Actions/Filters/Pagination on top */}
      <MessagingActions />
      {/* Main content */}
      <MessagingMainView />
      {/* Drafts */}
      <DraftsContainer />
    </StateProvider>
  );
}

export default withUser(withLocalization(MessagingView));
