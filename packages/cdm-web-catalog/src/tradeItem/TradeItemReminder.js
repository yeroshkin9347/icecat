import React from "react";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import { Padding, P, Text, BackgroundImage, Zone } from "cdm-ui-components";
import { getImageLink } from "cdm-shared/utils/url";
import onlyUpdateForKeys from "cdm-shared/utils/onlyUpdateForKeys";
import noimage from "cdm-shared/assets/noimage.svg";
import TradeItemActions from "./TradeItemActions";
import { formatEan } from "cdm-shared/utils/format";
import { getImageResourceMetadatasFromTradeItem } from "./utils";
import { isRetailer } from "cdm-shared/redux/hoc/withAuth";

const TradeItemReminder = ({
  tradeItem,
  user,
  // functions
  onExportPdf,
  gtin,
  tradeItemManufacturerCode
}) => {
  const imageResourceMetadatas = getImageResourceMetadatasFromTradeItem(tradeItem, isRetailer(user));
  const title = get(tradeItem, "marketing.values.title", "");
  const manufacturer =
    get(tradeItem, "marketing.values.manufacturer", null) ||
    get(tradeItem, "manufacturer.name", "");

  return (
    <Padding horizontal={4}>
      <BackgroundImage
        style={{ height: "18em" }}
        alignLeft
        noShadow
        cover={false}
        src={
          !isEmpty(imageResourceMetadatas)
            ? getImageLink(
              get(
                imageResourceMetadatas,
                "0.publicUrl",
                ""
              ),
              "-small",
              get(imageResourceMetadatas, "0.colorSpace", null)
            )
            : noimage
        }
      />

      <Zone noPadding noShadow transparent center>
        <P>{title}</P>

        <Padding top={2} />

        <Text uppercase light small spaced>
          {manufacturer}
        </Text>

        <Padding top={3} />

        <Text>
          {formatEan(gtin)} / {tradeItemManufacturerCode}
        </Text>
      </Zone>

      <br />
      <br />

      <TradeItemActions
        block
        tradeItem={tradeItem}
        onExportPdf={() => onExportPdf()}
      />
    </Padding>
  );
};

export default onlyUpdateForKeys(["tradeItem", "gtin", "tradeItemManufacturerCode"])(TradeItemReminder);
