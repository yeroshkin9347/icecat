import React from "react";
import styled from "styled-components";
import get from "lodash/get";
import {
  Padding,
  Card,
  Text,
  BackgroundImage,
  RoundedButton
} from "cdm-ui-components";
import { Tooltip } from "@mui/material";
import { getImageLink } from "cdm-shared/utils/url";
import Link from "cdm-shared/component/Link";
import noimage from "cdm-shared/assets/noimage.svg";
import onlyUpdateForKeys from "cdm-shared/utils/onlyUpdateForKeys";
import draft from "../assets/draft.png";
import { Edit, RemoveShoppingCart, ShoppingCart } from "@mui/icons-material";
import { DARK } from "cdm-shared/component/color";

const ActionsRow = styled.div`
  position: absolute;
  left: -6px;
  bottom: -17px;
`;

const TextTruncate = styled(Text)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
  width: 100%;
`;

const isDraft = (tradeItem) => {
  return tradeItem.isDraft;
}

const TradeItemCard = ({
  tradeItem,
  height,
  isInCart,
  allowAddToCart,
  allowEdit,
  // functions
  onAddToCart,
  onEdit,
  onRemoveFromCart
}) => {
  const formatIdentity = (gtin, manufacturerCode) => {
    if (gtin && manufacturerCode) {
      return `${gtin} / ${manufacturerCode}`;
    } else if (gtin) {
      return gtin;
    } else if (manufacturerCode) {
      return manufacturerCode;
    }
    return "";
  };

  return (
    <Card
      onError={e => console.log("ok")}
      height={height || "300px"}
      transition
    >
      {/* Image */}
      <Link
        to={`/product/${get(tradeItem, "languageCode")}/${get(
          tradeItem,
          "tradeItemId"
        )}`}
      >
        <BackgroundImage
          background="#fff"
          height="200px"
          cover={!get(tradeItem, "tradeItemMediumImagePath")}
          src={
            get(tradeItem, "tradeItemMediumImagePath") ? getImageLink(get(tradeItem, "tradeItemMediumImagePath"), "-small") : noimage
          }
        >
          {isDraft(tradeItem) &&(
            <BackgroundImage
              height="200px"
              cover={!get(tradeItem, "tradeItemMediumImagePath")}
              src={draft}
            ></BackgroundImage>
          )}
          <ActionsRow>
            {/* Add to cart */}
            {allowAddToCart && !isInCart && (
              <RoundedButton
                onClick={e => {
                  e.preventDefault();
                  onAddToCart();
                }}
                light
              >
                <ShoppingCart fontSize="small" sx={{ color: DARK }} />
              </RoundedButton>
            )}

            {/* Remove to cart */}
            {allowAddToCart && isInCart && (
              <RoundedButton
                onClick={e => {
                  e.preventDefault();
                  onRemoveFromCart();
                }}
                danger
              >
                <RemoveShoppingCart fontSize="small" sx={{ color: "#fff" }} />
              </RoundedButton>
            )}

            {/* Remove to cart */}
            {allowEdit && (
              <RoundedButton
                onClick={e => {
                  e.preventDefault();
                  onEdit && onEdit();
                }}
                light
              >
                <Edit fontSize="small" sx={{ color: DARK }} />
              </RoundedButton>
            )}
          </ActionsRow>
        </BackgroundImage>
      </Link>

      {/* Meta */}
      <Padding horizontal={3} vertical={3}>
        {/* Manufacturer */}
        <Text spaced light uppercase small>
          {get(tradeItem, "manufacturerName")}
        </Text>
        <br />

        {/* Title */}
        <Link
          to={`/product/${get(tradeItem, "languageCode")}/${get(
            tradeItem,
            "tradeItemId"
          )}`}
        >
          <Tooltip title={get(tradeItem, "title")} placement="top">
            <div className="truncate">{get(tradeItem, "title") || ''}</div>
          </Tooltip>
        </Link>
        <Padding horizontal={3} vertical={2}>
          {/* EAN/Reference */}
          {get(tradeItem, "identities", []).length > 0 && (
            <TextTruncate light small>
              {formatIdentity(get(tradeItem, "identities.0.gtin.value"), get(tradeItem, "identities.0.tradeItemManufacturerCode")) }
            </TextTruncate>
          )}
        </Padding>
      </Padding>
    </Card>
  );
};

export default onlyUpdateForKeys([
  "tradeItem",
  "height",
  "isInCart",
  "allowAddToCart"
])(TradeItemCard);
