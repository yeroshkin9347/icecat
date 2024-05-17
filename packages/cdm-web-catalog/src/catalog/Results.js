import React, { memo, useCallback } from "react";
import map from "lodash/map";
import styled from "styled-components";
import { Zone, Padding } from "cdm-ui-components";
import TradeItemCard from "./TradeItemCard";
import { allowShoppingCart, allowCrud } from "cdm-shared/redux/hoc/withAuth";
import withShoppingCart from "common/redux/hoc/withShoppingCart";
import { getUpdateProductLinkWithMasterTradeItemId } from "cdm-shared/component/calendars/utils";

const StyledZone = styled(Zone)`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));

  @media (max-width: 2000px) {
    grid-template-columns: repeat(6, minmax(0, 1fr));
  }

  @media (max-width: 1870px) {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }

  @media (max-width: 1520px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  @media (max-width: 1130px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  
  @media (max-width: 770px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  
  @media (max-width: 450px) {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
`

const Results = ({
  results,
  user,
  history,
  shoppingCart,
  // functions
  isInShoppingCart,
  addItemToShoppingCart,
  findAndRemoveItemFromShoppingCart
}) => {
  const findIndexInCart = useCallback(
    tradeItemId => isInShoppingCart(ti => tradeItemId === ti.tradeItemId),
    [isInShoppingCart]
  );

  return (
    <StyledZone noPadding noShadow left>
      {map(results, (result, keyIndex) => (
        <Padding
          key={`catalog-search-result-${keyIndex}`}
          inline
          all={3}
          style={{ width: "100%", verticalAlign: "top" }}
        >
          <TradeItemCard
            isInCart={findIndexInCart(result.tradeItemId)}
            allowAddToCart={allowShoppingCart(user)}
            allowEdit={allowCrud(user)}
            onAddToCart={() => addItemToShoppingCart(result)}
            onEdit={() => {
              const updateProductUrl = getUpdateProductLinkWithMasterTradeItemId(result.tradeItemId, result.masterTradeItemId, false);
              history.push(updateProductUrl)
            }}
            onRemoveFromCart={() =>
              findAndRemoveItemFromShoppingCart(
                item => item.tradeItemId === result.tradeItemId
              )
            }
            tradeItem={result}
            height="300px"
          />
        </Padding>
      ))}
    </StyledZone>
  );
};

function areEqual(prevProps, nextProps) {
  return (
    prevProps.results === nextProps.results &&
    prevProps.shoppingCart !== nextProps.shoppingCart
  );
}

export default memo(withShoppingCart(Results), areEqual);
