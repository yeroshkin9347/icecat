import React from "react";
import styled from "styled-components";
import { Icon, Tooltip } from "cdm-ui-components";
import { ic_new_releases } from "react-icons-kit/md/ic_new_releases";

const WarningMarkIcon = styled(Icon)`
  display: block !important;
  color: ${props => `rgb(${props.theme.color.red})`};
  margin: 0 4px;
  line-height: 2;
  cursor: pointer;
`;

const WarningMark = React.memo(({ text }) => (
  <Tooltip interactive={false} html={text}>
    <WarningMarkIcon size={20} icon={ic_new_releases} />
  </Tooltip>
));

export default WarningMark;
