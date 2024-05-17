import React from "react";
import size from "lodash/size";
import styled from "styled-components";
import { RoundedButton, Tooltip, Tag } from "cdm-ui-components";
import withShoppingCart from "common/redux/hoc/withShoppingCart";
import { Box } from "@mui/material";
import { DeleteSweep, Download, RemoveShoppingCart, ShoppingCart } from "@mui/icons-material";
import { DARK } from "cdm-shared/component/color";

const NumberOfShoppingCartItems = styled(Tag)`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 2px 4px;
  border-radius: 0;
  margin: 0;
  font-size: 0.75rem;
  text-align: center;
`;

const StyledRoundedButton = styled(RoundedButton)`
  margin: 0;
  height: auto;
  aspect-ratio: 1 / 1;
`;

const CatalogActionsRow = ({
  emptyFilters,
  shoppingCart,
  isExportAllowed,
  isBasketExportAllowed,
  // functions
  onShowFilters,
  onEmptyFilters,
  onBasketExportRequested,
  onSearchExportRequested,
  clearShoppingCart,
  translate,
}) => (
  <Box display="flex" alignItems="center" gap={1} flexWrap="nowrap">
    {/* Clear filters */}
    {!emptyFilters && (
      <Tooltip interactive html={translate("catalog.filters.clearFilters")}>
        <StyledRoundedButton large onClick={onEmptyFilters} light>
          <DeleteSweep fontSize="medium" color={DARK} />
        </StyledRoundedButton>
      </Tooltip>
    )}

    {/* Export shopping cart */}
    {isBasketExportAllowed && (
      <Tooltip interactive html={translate("catalog.filters.exportBasket")}>
        <StyledRoundedButton
          large
          onClick={() => onBasketExportRequested()}
          secondary
        >
          <ShoppingCart fontSize="medium" color={'#fff'} />
          <NumberOfShoppingCartItems rounded primary small>
            {size(shoppingCart)}
          </NumberOfShoppingCartItems>
        </StyledRoundedButton>
      </Tooltip>
    )}

    {/* Clear shopping cart */}
    {isBasketExportAllowed && (
      <Tooltip interactive html={translate("catalog.filters.emptyBasket")}>
        <StyledRoundedButton large onClick={() => clearShoppingCart()} danger>
          <RemoveShoppingCart fontSize="medium" color={'#fff'} />
        </StyledRoundedButton>
      </Tooltip>
    )}

    {/* Export search results */}
    {isExportAllowed && (
      <Tooltip interactive html={translate("catalog.filters.exportResults")}>
        <StyledRoundedButton large onClick={() => onSearchExportRequested()} primary>
          <Download fontSize="medium" color={'#fff'} />
        </StyledRoundedButton>
      </Tooltip>
    )}
  </Box>
);

export default withShoppingCart(CatalogActionsRow);
