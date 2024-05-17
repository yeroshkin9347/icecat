import React from "react";
import { withLocalization } from "common/redux/hoc/withLocalization";
import { Link } from "react-router-dom/cjs/react-router-dom";
import styled from "styled-components";
import { H4 } from "cdm-ui-components";
import { PRIMARY } from "cdm-shared/component/color";

export const TitleStyled = styled(H4)`
  font-weight: 500;
`;

export const LinkStyled = styled(Link)`
  color: ${PRIMARY};
  text-decoration: none;
`;

const CollectionImportStarted = ({ translate }) => {
  return (
    <>
      <TitleStyled>{translate("collections.importPriceStarted")}</TitleStyled>

      <LinkStyled to="/import-reports/all">
        {translate("collections.followTheImport")}
      </LinkStyled>
    </>
  );
};

export default withLocalization(CollectionImportStarted);
