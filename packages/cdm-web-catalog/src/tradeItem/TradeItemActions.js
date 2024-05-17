import React, { useMemo } from "react";
import { Link, useLocation, withRouter } from "react-router-dom";
import get from "lodash/get";
import { Button, Padding } from "cdm-ui-components";
import {
  allowShoppingCart,
  allowPdf,
  allowCrud
} from "cdm-shared/redux/hoc/withAuth";
import withUser from "cdm-shared/redux/hoc/withUser";
import { withLocalization } from "common/redux/hoc/withLocalization";
import withShoppingCart from "common/redux/hoc/withShoppingCart";
import { buildReductedTradeItem } from "./models";
import { RemoveShoppingCart, ShoppingCart } from "@mui/icons-material";

const TradeItemActions = ({
  block,
  user,
  tradeItem,
  match,
  // functions
  translate,
  onExportPdf,
  isInShoppingCart,
  findAndRemoveItemFromShoppingCart,
  addItemToShoppingCart,
}) => {
  const location = useLocation();
  const masterTradeItemId = useMemo(() => new URLSearchParams(location.search).get("master"), [location])
  const lang = match.params.lang;
  const tradeItemId =  get(tradeItem, "tradeItemId");
  const updateProductUri = masterTradeItemId
    ? `/update-product/${masterTradeItemId}?variantId=${tradeItemId}`
    : `/update-product/${tradeItemId}`;

  return (
    <>
      {/* add to cart */}
      {allowShoppingCart(user) &&
        !isInShoppingCart(
          ti => get(tradeItem, "tradeItemId") === ti.tradeItemId
        ) && (
          <Button
            onClick={e =>
              addItemToShoppingCart(
                buildReductedTradeItem(tradeItem, match.params.lang)
              )
            }
            secondary
            small
            noMargin={block || !allowPdf(user)}
            block={block}
            style={{ marginRight: "10px" }}
          >
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              <ShoppingCart fontSize="small" />
              &nbsp;&nbsp;
              {translate("tradeitem.cart.add")}
            </div>
          </Button>
        )}
  
      {/* remove from cart */}
      {allowShoppingCart(user) &&
        isInShoppingCart(
          ti => get(tradeItem, "tradeItemId") === ti.tradeItemId
        ) && (
          <Button
            onClick={e =>
              findAndRemoveItemFromShoppingCart(
                ti => get(tradeItem, "tradeItemId") === ti.tradeItemId
              )
            }
            danger
            small
            noMargin={block || !allowPdf(user)}
            block={block}
          >
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              <RemoveShoppingCart fontSize="small" />
              &nbsp;&nbsp;
              {translate("tradeitem.cart.remove")}
            </div>
          </Button>
        )}
  
      {/* edit product */}
      {allowCrud(user) && (
        <>
          {block && <Padding top={3} />}
          <Button
            as={Link}
            to={updateProductUri}
            onClick={e => onExportPdf()}
            primary
            small
            block={block}
          >
            {translate("tradeitem.edit.update")}
          </Button>
        </>
      )}
  
      {/* download pdf */}
      {allowPdf(user) && (
        <>
          {block && <Padding top={3} />}
          <Button
            onClick={e => onExportPdf()}
            primary
            small
            noMargin={!masterTradeItemId}
            block={block}
          >
            {translate("tradeitem.pdf.generate")}
          </Button>
        </>
      )}
  
       {!!masterTradeItemId && (
        <>
          {block && <Padding top={3} />}
          <Button
            as={Link}
            to={`/product/${lang}/${masterTradeItemId}`}
            warning
            small
            block={block}
          >
            {translate("tradeitem.banner.viewMasterProduct")}
          </Button>
        </>
      )}
    </>
  )
};

export default withRouter(
  withUser(withLocalization(withShoppingCart(TradeItemActions)))
);
