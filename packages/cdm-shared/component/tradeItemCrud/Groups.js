import React, { useCallback } from "react";
import map from "lodash/map";
import capitalize from "lodash/capitalize";
import { List, ListItem, Text } from "cdm-ui-components";
import { ALLOWED_GROUPS } from "./manager";
import { withGroupLocalContext } from "./store/PropertyGroupProvider";
import { withLocalization } from "common/redux/hoc/withLocalization";
import { withTradeItemLocalContext } from "./store/TradeItemProvider";
import { onlyUpdateForKeys } from "recompose";

const Groups = ({
  groupSelected,
  tradeItem,
  isAdmin,
  // functions
  translate,
  setGroupSelected,
}) => {
  const allowedGroups = { ...ALLOWED_GROUPS };
  const isIceCatTaxonomy =
    tradeItem.taxonomyId === "b7021c08-b322-4aef-87a9-a56e1a86a38c";
  const iceCatAvailableGroup = ["MARKETING", "IMAGES", "DOCUMENTS", "STATUS"];

  if (isIceCatTaxonomy) {
    Object.keys(allowedGroups).map((key) => {
      if (!iceCatAvailableGroup.includes(key)) {
        delete allowedGroups[key];
      }
    });
  }
  if (!isAdmin) {
    delete allowedGroups["STATUS"];
  }

  const memoizedGroupChanged = useCallback(
    (groupName) => {
      setGroupSelected(groupName);
    },
    [setGroupSelected, tradeItem]
  );

  return (
    <List style={{ fontSize: "1.2em" }}>
      {map(allowedGroups, (groupIndex, groupName) => (
        <ListItem
          key={`trade-item-crud-${groupIndex}-${groupName}`}
          selected={groupSelected === groupName}
          onClick={() => memoizedGroupChanged(groupName)}
        >
          <Text>
            {capitalize(translate(`tradeItemCrud.groups.${groupName}`))}
          </Text>
        </ListItem>
      ))}
    </List>
  );
};

export default onlyUpdateForKeys(["groupSelected", "currentLocaleCode"])(
  withLocalization(
    withTradeItemLocalContext(withGroupLocalContext(Groups))
  )
);
