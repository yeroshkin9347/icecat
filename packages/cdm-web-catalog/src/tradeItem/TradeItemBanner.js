import React, { useMemo } from "react";
import styled from "styled-components";
import get from "lodash/get";
import map from "lodash/map";
import isEmpty from "lodash/isEmpty";
import uniq from "lodash/uniq";
import {
  BackgroundZone,
  Overlay,
  Padding,
  H1,
  H5,
  Text,
  Tag,
} from "cdm-ui-components";
import { CDM_SIMPLE_BANNER_WEB } from "common/environment";
import { getImageResourceMetadatasFromTradeItem, isConsistent } from "./utils";
import { getImageLink } from "cdm-shared/utils/url";
import { formatEan } from "cdm-shared/utils/format";
import { isRetailer } from "cdm-shared/redux/hoc/withAuth";
import SelectableFlag from "cdm-shared/component/tradeItemCrud/translations/SelectableFlag";

const NotConsistencyStatusFlag = styled.div`
  position: absolute;
  top: 25px;
  left: -50px;
  background-color: ${(props) => `rgb(${props.theme.color.red})`};
  color: #fff;
  width: 200px;
  text-align: center;
  line-height: 50px;
  letter-spacing: 1px;
  transform: rotate(-45deg);
`;

const LangsWrapper = styled(Text)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LangFlag = styled(SelectableFlag)`
  display: flex;
  justify-content: center;
  align-items: center;

  &:after {
    bottom: 5px;
  }
`;

const TradeItemBanner = ({
  tradeItem,
  gtin,
  manufacturerCode,
  user,
  activeLanguage,
  // functions
  changeActiveLanguage,
  onExportPdf,
  translate,
}) => {
  const imageResourceMetadatas = getImageResourceMetadatasFromTradeItem(
    tradeItem,
    isRetailer(user)
  );

  const langs = useMemo(() => {
    let langs = get(tradeItem, "marketing.translations", []).map(
      (translation) => translation.languageCode
    );
    const defaultLanguageCode = get(tradeItem, "defaultLanguageCode");

    return uniq([defaultLanguageCode, ...langs]).sort();
  }, [tradeItem]);

  const bannerImg = get(imageResourceMetadatas, "0.publicUrl")
    ? getImageLink(get(imageResourceMetadatas, "0.publicUrl"), "-large")
    : CDM_SIMPLE_BANNER_WEB;

  return (
    <BackgroundZone
      noShadow
      style={{
        // height: "90vh",
        width: "100%",
        position: "relative",
        padding: 0,
      }}
      url={bannerImg}
    >
      <Overlay gradient>
        {false && !isConsistent(tradeItem) && (
          <NotConsistencyStatusFlag>
            {translate(
              `tradeitem.consistency.${get(tradeItem, "consistencyStatus")}`
            )}
          </NotConsistencyStatusFlag>
        )}

        <Padding
          style={{ textAlign: "center", paddingTop: "6vh", paddingBottom: '5rem' }}
          vertical={7}
        >
          {/* Gtin */}
          <Tag secondary medium>
            {formatEan(gtin)} / {manufacturerCode}
          </Tag>
          <br />
          <br />

          {/* Title */}
          <H1
            style={{
              letterSpacing: "-2px",
              fontSize: "3.5em",
              textShadow: "4px 3px 0px #3c3c3c, 9px 8px 0px rgba(0,0,0,0.15)",
            }}
            color="#fff"
          >
            {get(tradeItem, "marketing.values.title", "")}
          </H1>

          {/* SubTitle */}
          <H5
            style={{
              fontWeight: "200",
              letterSpacing: ".4em",
            }}
            uppercase
            color="#fff"
          >
            {get(tradeItem, "marketing.values.manufacturer", null) ||
              get(tradeItem, "manufacturer.name", "")}
          </H5>
          <br />

          {/* Langs */}
          {!isEmpty(langs) && (
            <>
              <LangsWrapper>
                {map(langs, (l, kLang) => (
                  <Padding key={`banner-change-lang-${kLang}`} inline right={2} >
                    <LangFlag code={l} onClick={(e) => changeActiveLanguage(l)} selected={activeLanguage === l} />
                  </Padding>
                ))}
              </LangsWrapper>
              <br />
              <br />
            </>
          )}

        </Padding>
      </Overlay>
    </BackgroundZone>
  );
};

export default TradeItemBanner;
