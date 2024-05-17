import React from "react";
import { Container, H1, Padding, H4 } from "cdm-ui-components";
import { withLocalization } from "common/redux/hoc/withLocalization";
import { initialState, reducer } from "./reducer";
import { StateProvider } from "cdm-shared/hook/useStateValue";
import ManufacturerDashboardContent from "./ManufacturerDashboardContent";

// const GiftSvg = () => (
// <svg preserveAspectRatio="xMinYMin meet" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M448 0l-63 64 63 63 64-63zm0 0" fill="#6e6e6e"/><path d="M470 148l42 43-21 21-43-42zm0 0M431 197l21 63-28 10-22-64zm0 0" fill="#ffbd86"/><path d="M321 0l43 42-22 22-42-43zm0 0M315 81l-9 29-64-22 10-28zm0 0" fill="#fed2a4"/><path d="M313 348l-35 35-45-2-102-102-2-45 35-35 106-21 14 50 50 14zm0 0M191 470l-43 42L0 364l42-43 96 53zm0 0" fill="#00dd7b"/><path d="M480 32l32 32-64 63-31-32zm0 0" fill="#5a5a5a"/><path d="M313 348l-35 35-45-2-51-51 102-102 50 14zm0 0M138 374l53 96-43 42-74-74zm0 0" fill="#00ab5e"/><path d="M278 383l-87 87L42 321l87-87 45 45a45 45 0 0159 59zm0 0" fill="#ffd400"/><path d="M278 383l-87 87-74-75 108-108c14 14 17 35 8 51zm0 0" fill="#fdbf00"/><path d="M427 148l-93 94-71 7 7-71 94-93zm0 0" fill="#ffd400"/><path d="M334 242l-71 7 132-132 32 31zm0 0" fill="#fdbf00"/></svg>
// )

const ManufacturerDashboard = ({
  currentParsedLocaleCode,
  // functions
  translate
}) => {
  return (
    <div className="background-main">
      {/* Main content */}
      <Container>
        <StateProvider initialState={initialState} reducer={reducer}>
          <Padding top={5} bottom={5}>
            <H1>{translate("dashboard.manufacturer.title")}</H1>

            <H4 style={{ fontWeight: 200 }} lightgray noMargin>
              {translate("dashboard.manufacturer.subtitle")}
            </H4>

            <Padding vertical={5}>
              <ManufacturerDashboardContent />
            </Padding>
          </Padding>
        </StateProvider>
      </Container>
    </div>
  );
};

export default withLocalization(ManufacturerDashboard);
