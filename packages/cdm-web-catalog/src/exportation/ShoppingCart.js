import React from "react";
import map from "lodash/map";
import get from "lodash/get";
import withShoppingCart from "common/redux/hoc/withShoppingCart";
import Link from "cdm-shared/component/Link";
import { BackgroundImage, List, ListItem, Icon, Text } from "cdm-ui-components";
import { getImageLink } from "cdm-shared/utils/url";
import noimage from "cdm-shared/assets/noimage.svg";
import { ic_delete } from "react-icons-kit/md/ic_delete";

const ShoppingCart = ({
  shoppingCart,
  // function
  clearShoppingCart,
  removeItemFromShoppingCart,
  styles = {},
}) => (
  <>
    <List style={{ maxHeight: "300px", overflowY: "scroll", ...styles }} stacked>
      {map(shoppingCart, (shoppingCartItem, shoppingCartItemKey) => (
        <ListItem
          key={`shopping-cart-item-${shoppingCartItemKey}`}
          style={{
            position: "relative",
            padding: 0,
            height: "40px"
          }}
        >
          <Link
            style={{
              display: "inline-block",
              height: "100%",
              width: "100%",
              overflow: "hidden",
              paddingLeft: "40px"
            }}
            to={`/product/${get(shoppingCartItem, "languageCode")}/${get(
              shoppingCartItem,
              "tradeItemId"
            )}`}
          >
            <BackgroundImage
              style={{
                position: "absolute",
                left: 0,
                top: 0
              }}
              height="40px"
              width="40px"
              cover={!get(shoppingCartItem, "tradeItemMediumImagePath")}
              src={
                get(shoppingCartItem, "tradeItemMediumImagePath")
                  ? getImageLink(
                      get(shoppingCartItem, "tradeItemMediumImagePath"),
                      "-small"
                    )
                  : noimage
              }
            />

            <Text
              style={{
                verticalAlign: "top",
                paddingTop: "1.355em",
                paddingLeft: "1em"
              }}
              small
            >
              <Icon
                onClick={e => {
                  e.preventDefault();
                  removeItemFromShoppingCart(shoppingCartItemKey);
                }}
                style={{ float: "right", color: "rgb(211, 47, 47)" }}
                size={16}
                icon={ic_delete}
              />

              {get(shoppingCartItem, "title")}
            </Text>
          </Link>
        </ListItem>
      ))}
    </List>
    <br />
  </>
);

export default withShoppingCart(ShoppingCart);
