import React from "react";
import { Tooltip, Icon } from "cdm-ui-components";
import styled from "styled-components";
import {
  getColorByProductCategoryCode,
  getPlatformIconResource,
  getProductLinkCatalog,
  getProductLinkCms,
} from "./utils";
import { withLocalization } from "common/redux/hoc/withLocalization";
import useLocalization from "cdm-shared/hook/useLocalization";
import { compact, get } from "lodash";
import { calendar } from "react-icons-kit/fa/calendar";
import {
  getEditionFromProductVariant,
  getPlatfromFromProductVariant,
} from "../../helpers/product.helpers";

const DEFAULT_BACKGROUND_COLOR = "#3788d8";

const Container = styled.div`
  width: 100%;
  height: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  padding: 4px;
`;

const TitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
`;

const Title = styled.p`
  width: 65%;
  padding: 0;
  margin: 0;
  margin-right: 4px;
  font-size: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  cursor: pointer;
`;

const Variant = styled.p`
  width: 35%;
  padding: 0 2px 0 0;
  margin: 0;
  font-size: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  font-style: italic;
  text-align: right;
`;

const Footer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
`;

const Row = styled.div`
  display: flex;
  flexdirection: row;
  align-items: center;
`;

const TooltipContent = styled.div`
  padding: 4px 6px;
`;

const VariantImg = styled.img`
  width: 16px;
  height: 16px;
  margin-right: 2px;
`;

const EventItem = ({ eventInfo, rawEvent, isCms, translate }) => {
  const [locale] = useLocalization();

  let platform = !rawEvent.isMaster
    ? getPlatfromFromProductVariant(get(rawEvent, "variantDefinitions.0"))
    : null;
  let edition = !rawEvent.isMaster
    ? getEditionFromProductVariant(get(rawEvent, "variantDefinitions.0"))
    : null;

  const eventClickHandler = () => {
    if (rawEvent.tradeItemId) {
      let productLink = "";
      if (rawEvent.isMaster) {
        productLink = isCms
          ? getProductLinkCms(rawEvent.tradeItemId)
          : getProductLinkCatalog(rawEvent.tradeItemId, locale);
      } else {
        productLink = isCms
          ? getProductLinkCms(rawEvent.masterTradeItemId, rawEvent.tradeItemId)
          : getProductLinkCatalog(
              rawEvent.tradeItemId,
              locale,
              rawEvent.masterTradeItemId
            );
      }
      window.open(productLink);
    }
  };

  return (
    <Container
      style={{
        backgroundColor:
          eventInfo.event.backgroundColor ||
          getColorByProductCategoryCode(rawEvent.productCategoryCode) ||
          DEFAULT_BACKGROUND_COLOR,
        color: eventInfo.event.textColor || "#000000",
      }}
      className={!rawEvent.isPublished ? "event-publication-background" : ""}
    >
      <div onClick={eventClickHandler}>
        <TitleWrapper>
          <Tooltip html={<TooltipContent>{rawEvent.title}</TooltipContent>}>
            <Title style={{ width: edition ? "65%" : "100%" }}>
              <span>{rawEvent.title}</span>
              <br />
              <span>{rawEvent.manufacturerName}</span>
            </Title>
          </Tooltip>
          <Tooltip
            html={
              edition ? <TooltipContent>{edition}</TooltipContent> : undefined
            }
          >
            <Variant>{edition}</Variant>
          </Tooltip>
        </TitleWrapper>
      </div>

      <Footer>
        <Row>
          {!rawEvent.isMaster ? (
            <Tooltip
              html={
                platform ? (
                  <TooltipContent>{platform}</TooltipContent>
                ) : undefined
              }
            >
              <div className="cursor-pointer" onClick={eventClickHandler}>
                <VariantImg
                  src={getPlatformIconResource(platform)}
                  alt={rawEvent.title}
                />
              </div>
            </Tooltip>
          ) : (
            <TradeItems
              variantDefinitions={rawEvent.variantDefinitions}
              masterTradeItemId={rawEvent.tradeItemId}
              locale={locale}
              isCms={isCms}
            />
          )}
        </Row>
        <div>
          <Tooltip
            html={
              <TooltipContent>
                {rawEvent.hasReleaseDate && translate("agenda.releaseDate")}
                {rawEvent.hasReviewDate && translate("agenda.reviewDate")}
              </TooltipContent>
            }
          >
            <div>
              <Icon size={16} icon={calendar} />
            </div>
          </Tooltip>
        </div>
      </Footer>
    </Container>
  );
};

const TradeItems = ({
  variantDefinitions = [],
  locale,
  masterTradeItemId,
  isCms,
}) => {
  return variantDefinitions.map((variant) => {
    const platform = getPlatfromFromProductVariant(variant);
    const edition = getEditionFromProductVariant(variant);
    let icon = getPlatformIconResource(platform);

    const info = compact([platform, edition]).join(" - ");

    return (
      <div
        key={variant.tradeItemId}
        className="cursor-pointer"
        onClick={(e) => {
          console.log("masterTradeItemId", masterTradeItemId);
          const productLink = isCms
            ? getProductLinkCms(masterTradeItemId, variant.tradeItemId)
            : getProductLinkCatalog(
                variant.tradeItemId,
                locale,
                masterTradeItemId
              );
          variant.tradeItemId && window.open(productLink);
        }}
      >
        <Tooltip html={<TooltipContent>{info}</TooltipContent>}>
          <VariantImg src={icon} alt={info} />
        </Tooltip>
      </div>
    );
  });
};

export default withLocalization(EventItem);
