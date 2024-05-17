import React from "react";
import styled from "styled-components";
import get from "lodash/get";
import map from "lodash/map";
import compact from "lodash/compact";
import join from "lodash/join";
import isEmpty from "lodash/isEmpty";
import { Zone, Row, Col } from "cdm-ui-components";
import withTheme from "cdm-shared/redux/hoc/withTheme";
import { withTargetMarketsLocalContext } from "../store/TargetMarketProvider";
import { withRetailersLocalContext } from "../store/RetailerProvider";
import { parseDate } from "cdm-shared/utils/date";
import LoaderOverlay from "../../LoaderOverlay";
import { IconButton } from "@mui/material";
import {
  Edit as EditIcon,
  CopyAllOutlined,
  Delete as DeleteIcon,
} from "@mui/icons-material";

const ChannelRowItemWrapper = styled(Zone)`
  padding: 10px 14px 10px 14px;
  cursor: pointer;
  border: 1px dashed #f5f5f5;

  &:hover {
    border-color: ${(props) =>
      get(props, "theme.color.primary", null)
        ? `rgb(${get(props, "theme.color.primary")})`
        : "blue"};
  }
`;

class ChannelRowItem extends React.Component {
  render() {
    const {
      channel,
      translate,
      onDelete,
      onEdit,
      onDuplicate,
      theme,
      targetMarkets,
      retailers,
      isFetchingTargetMarkets,
      isFetchingRetailers,
      ...otherProps
    } = this.props;

    if (isFetchingTargetMarkets || isFetchingRetailers)
      return <LoaderOverlay />;

    return (
      <ChannelRowItemWrapper left borderRadius {...otherProps}>
        <Row>
          {/* Target markets */}
          <Col col>
            {isEmpty(get(channel, "targetMarketIds", [])) &&
              translate("tradeItemCrud.channel.modalNoTargetMarket")}
            {!isEmpty(get(channel, "targetMarketIds", [])) &&
              join(
                map(channel.targetMarketIds, (tmId) =>
                  get(targetMarkets, `${tmId}`, tmId)
                ),
                ", "
              )}
          </Col>

          {/* Retailers */}
          <Col col>
            {isEmpty(get(channel, "retailerIds", [])) &&
              translate("tradeItemCrud.channel.modalNoRetailer")}
            {!isEmpty(get(channel, "retailerIds", [])) &&
              join(
                compact(
                  map(channel.retailerIds, (rId) => get(retailers, `${rId}`))
                ),
                ", "
              )}
          </Col>

          {/* Start date */}
          <Col col>
            {get(channel, "startDate") === null &&
              translate("tradeItemCrud.channel.modalNoStartDate")}
            {get(channel, "startDate") && parseDate(get(channel, "startDate"))}
          </Col>

          {/* End date */}
          <Col col>
            {get(channel, "endDate") === null &&
              translate("tradeItemCrud.channel.modalNoEndDate")}
            {get(channel, "endDate") && parseDate(get(channel, "endDate"))}
          </Col>

          {/* Actions */}
          <Col right col>
            {/* Edit channel */}
            <IconButton
              color="primary"
              size="large"
              aria-label="Edit channel"
              sx={{
                padding: 0.5,
              }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onEdit && onEdit();
              }}
            >
              <EditIcon fontSize="medium" />
            </IconButton>

            {/* Duplicate group */}
            <IconButton
              color="primary"
              size="large"
              aria-label="Duplicate group"
              sx={{
                padding: 0.5,
              }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDuplicate && onDuplicate();
              }}
            >
              <CopyAllOutlined fontSize="medium" />
            </IconButton>

            {/* Remove channel */}
            <IconButton
              color="error"
              size="large"
              aria-label="Remove channel"
              sx={{
                padding: 0.5,
              }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete && onDelete();
              }}
            >
              <DeleteIcon fontSize="medium" />
            </IconButton>
          </Col>
        </Row>
      </ChannelRowItemWrapper>
    );
  }
}

export default withTheme(
  withRetailersLocalContext(withTargetMarketsLocalContext(ChannelRowItem))
);
