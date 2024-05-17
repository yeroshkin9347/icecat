import React from "react";
import get from "lodash/get";
import { Row } from "cdm-ui-components";
import ActionsButtons from "./ActionsButtons";
import Groups from "../Groups";
import withTheme from "cdm-shared/redux/hoc/withTheme";
import CancelButton from "./CancelButton";

const ActionsRow = ({
  createMode,
  showProduct,
  isAdmin,
  theme,
  // functions
  onSave,
  preCompute,
  onCancel,
  onDelete,
}) => (
  <Row
    style={{
      paddingTop: "0.5rem",
      paddingBottom: "2em",
      borderBottom: `1px solid rgb(${get(theme, "color.light", "#eee")})`,
      justifyContent: "space-between",
    }}
  >
    {/* Menus group */}
    <div style={{ padding: "4px 1rem" }}>
      <Groups isAdmin={isAdmin} />
    </div>

    <div style={{ textAlign: "right" }}>
      {/* Actions (create or save) */}
      <div
        style={{
          display: "grid",
          gridGap: "1rem",
          gridAutoFlow: "column",
          marginLeft: "auto",
          padding: "0 1rem",
        }}
      >
        {showProduct && !createMode && <CancelButton onCancel={onCancel} />}
        <ActionsButtons
          isAdmin={isAdmin}
          onSave={onSave}
          preCompute={preCompute}
          createMode={createMode}
          onDelete={onDelete}
        />
      </div>
    </div>
  </Row>
);

export default withTheme(ActionsRow);
