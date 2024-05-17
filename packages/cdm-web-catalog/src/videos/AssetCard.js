import React, {useMemo} from "react";
import styled from "styled-components";
import LinesEllipsis from "react-lines-ellipsis";
import get from "lodash/get";
import {
  Padding,
  Card,
  BackgroundImage,
  RoundedButton
} from "cdm-ui-components";
import { getIcecatContentToken } from "cdm-shared/redux/hoc/withAuth";
import DocumentIcon from "./DocumentIcon";
import { Download, RemoveShoppingCart, ShoppingCart } from "@mui/icons-material";
import { DARK } from "cdm-shared/component/color";

const MetadataContainer = styled.div`
  position: relative;
  display: inline-block;
  max-height: 70px;
  width: 100%;
  overflow: hidden;
`;

const CategoriesMetadata = styled.div`
  font-size: 11px;
  margin-top: 6px;
`;

const ActionsRow = styled.div`
  position: absolute;
  left: -6px;
  bottom: -17px;
  z-index: 1;
`;

export const Background = styled(BackgroundImage)`
  position: relative;
  background-image: linear-gradient(45deg, #F0F0F0 25%, transparent 25%), linear-gradient(-45deg, #F0F0F0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #F0F0F0 75%), linear-gradient(-45deg, transparent 75%, #F0F0F0 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
  background-repeat: repeat;
  &::after {
    position: absolute;
    content: "";
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-image: url(${(props) => props.src});
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
  }
`;

const AssetCard = ({
  assetType,
  asset,
  height,
  children,
  isExportable,
  isAddedToBasket,
  user,
  // function
  onClick,
  onExport,
  onAddAssetToBasket,
  onRemoveAssetFromBasket,
}) => {
  const previewUrl = useMemo(() => {
    let thumbUrl = get(asset, "thumbUrl") || get(asset, "prePictureFullUri") || "";
    if (thumbUrl.endsWith("?ContentToken="))
      thumbUrl += getIcecatContentToken(user);
    else if (thumbUrl && !thumbUrl.includes("?"))
      thumbUrl += "?ContentToken=" + getIcecatContentToken(user);
    return thumbUrl;
  }, [user, asset]);

  const categories = useMemo(() => (
    (get(asset, "categories") || get(asset, "videoCategories"))?.join(', ')
  ), [asset]);

  return (
    <Card
      style={{ cursor: "pointer" }}
      pointer
      height={height || "270px"}
      transition
    >
      {/* Image */}
      <Background
        height="200px"
        cover
        src={previewUrl}
        onClick={onClick}
      >
        {assetType === 'document' && (
          <DocumentIcon asset={asset} size={72} />
        )}
        <ActionsRow>
          {/* Add to cart */}
          <RoundedButton
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              if (isAddedToBasket) {
                onRemoveAssetFromBasket();
              } else {
                onAddAssetToBasket();
              }
            }}
            light={!isAddedToBasket}
            danger={isAddedToBasket}
          >
            {
              isAddedToBasket ? (
                <RemoveShoppingCart fontSize="small" sx={{ color: "#fff" }} />
              ) : (
                <ShoppingCart fontSize="small" sx={{ color: DARK }} />
              )
            }
          </RoundedButton>

          {/* Export asset */}
          {isExportable && (
            <RoundedButton
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                onExport && onExport();
              }}
              light
            >
              <Download fontSize="small" sx={{ color: DARK }} />
            </RoundedButton>
          )}
        </ActionsRow>
      </Background>

      {/* Meta */}
      <Padding horizontal={3} vertical={3}>
        <MetadataContainer>
          <LinesEllipsis
            text={get(asset, "title") || ''}
            ellipsis="..."
            trimRight
            basedOn="letters"
          />
          {categories && (
            <CategoriesMetadata>
              <LinesEllipsis
                text={categories}
                ellipsis="..."
                trimRight
                basedOn="letters"
              />
            </CategoriesMetadata>
          )}
          {children}
        </MetadataContainer>
      </Padding>
    </Card>
  );
}

export default AssetCard;
