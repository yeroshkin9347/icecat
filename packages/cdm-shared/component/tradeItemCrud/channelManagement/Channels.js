import React, { useEffect } from "react";
import get from "lodash/get";
import map from "lodash/map";
import compact from "lodash/compact";
import isEmpty from "lodash/isEmpty";
import Table from "cdm-shared/component/Table";
import Tooltip from "@mui/material/Tooltip";
import { withTargetMarketsLocalContext } from "../store/TargetMarketProvider";
import { withLocalization } from "common/redux/hoc/withLocalization";
import { TableActionsWrapper } from "../table/styles";
import { parseDate } from "../../../utils/date";
import { withRetailersLocalContext } from "../store/RetailerProvider";
import { BLUELIGHT } from "../../color";
import { IconButton } from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  CopyAllOutlined,
} from "@mui/icons-material";

const Channels = ({
  tradeItem,
  currentGroupKey,
  selectedGroupItemIndex,
  targetMarkets,
  retailers,
  // functions
  onEdit,
  removeTradeItemValue,
  addTradeItemValue,
  setSelectedGroupItemIndex,
  setIsDuplicatingChannel,
  translate,
}) => {
  useEffect(() => {
    const defaultTargetMarket = Object.entries(targetMarkets).find(
      ([id, value]) => value === "INT"
    );
    if (!defaultTargetMarket) {
      return;
    }
    const selectedIndex = tradeItem[currentGroupKey].findIndex((item) =>
      get(item, "channels.0.targetMarketIds", []).includes(
        defaultTargetMarket[0]
      )
    );
    if (setSelectedGroupItemIndex !== selectedIndex && selectedIndex !== -1)
      setSelectedGroupItemIndex(selectedIndex);
  }, [targetMarkets]);

  const duplicate = (currentGroup) => {
    setIsDuplicatingChannel(true);
    const newGroup = {
      ...currentGroup,
      channels: map(get(currentGroup, "channels"), (channel) => {
        const { id, ...newChannel } = channel;
        return newChannel;
      }),
    };

    addTradeItemValue(currentGroupKey, newGroup);
    setSelectedGroupItemIndex(selectedGroupItemIndex + 1);
  };

  const columns = [
    {
      Header: translate("tradeItemCrud.channel.modalTargetMarket"),
      id: "targetMarketIds",
      Cell: ({ original }) => {
        const values = map(original.channels, (channel) =>
          compact(
            map(get(channel, "targetMarketIds"), (id) => targetMarkets[id])
          ).join(", ")
        );
        const content = values.map((val) => <div>{val}</div>);

        return (
          <Tooltip title={content}>
            <div>{content}</div>
          </Tooltip>
        );
      },
    },
    {
      Header: translate("tradeItemCrud.channel.modalRetailer"),
      id: "retailers",
      Cell: ({ original }) => {
        const values = map(original.channels, (channel) =>
          compact(map(get(channel, "retailerIds"), (id) => retailers[id])).join(
            ", "
          )
        );
        const content = values.map((val) => <div>{val}</div>);
        return (
          <Tooltip title={content}>
            <div>{content}</div>
          </Tooltip>
        );
      },
    },
    {
      Header: translate("tradeItemCrud.channel.modalStartDate"),
      id: "startDate",
      Cell: ({ original }) => {
        const values = map(original.channels, (channel) =>
          parseDate(get(channel, "startDate", null))
        );
        const content = values.map((val) => <div>{val}</div>);
        return (
          <Tooltip title={content}>
            <div>{content}</div>
          </Tooltip>
        );
      },
    },
    {
      Header: translate("tradeItemCrud.channel.modalEndDate"),
      id: "endDate",
      Cell: ({ original }) => {
        const values = map(original.channels, (channel) =>
          parseDate(get(channel, "endDate", null))
        );
        const content = values.map((val) => <div>{val}</div>);
        return (
          <Tooltip title={content}>
            <div>{content}</div>
          </Tooltip>
        );
      },
    },
    {
      Header: "Actions",
      id: "actions",
      Cell: ({ index, original }) => {
        const channels = original.channels;
        return (
          <TableActionsWrapper>
            {!isEmpty(channels) && (
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
                  onEdit(index);
                }}
              >
                <EditIcon fontSize="medium" />
              </IconButton>
            )}
            {!isEmpty(channels) && (
              <IconButton
                color="primary"
                size="large"
                aria-label="Duplicate channel"
                sx={{
                  padding: 0.5,
                }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  duplicate(original);
                }}
              >
                <CopyAllOutlined fontSize="medium" />
              </IconButton>
            )}

            <IconButton
              color="error"
              size="large"
              aria-label="Delete channel"
              sx={{
                padding: 0.5,
              }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                removeTradeItemValue(currentGroupKey, index);
              }}
            >
              <DeleteIcon fontSize="medium" />
            </IconButton>
          </TableActionsWrapper>
        );
      },
    },
  ];

  return (
    <Table
      columns={columns}
      data={tradeItem[currentGroupKey]}
      manual
      sortable={false}
      showFilters={false}
      showPagination={false}
      showPageSizeOptions={false}
      defaultPageSize={0}
      getTrProps={(state, rowInfo) => ({
        onClick: () => {
          setSelectedGroupItemIndex(rowInfo.index);
        },
        style:
          selectedGroupItemIndex === rowInfo.index
            ? { backgroundColor: BLUELIGHT, cursor: "pointer" }
            : { cursor: "pointer" },
      })}
    />
  );
};

export default React.memo(
  withTargetMarketsLocalContext(
    withRetailersLocalContext(withLocalization(Channels))
  )
);
