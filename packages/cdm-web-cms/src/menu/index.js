import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { LightZone, Row, Col, Switch, Text } from "cdm-ui-components";
import styled from "styled-components";
import withTheme from "cdm-shared/redux/hoc/withTheme";
import { withLocalization } from "common/redux/hoc/withLocalization";
import { isCurrentThemeDark } from "cdm-shared/redux/theme";
import MessagingLink from "cdm-shared/component/messaging/MessagingLink";
import Logo from "cdm-shared/component/Logo";
import TradeItemSelector from "cdm-shared/component/tradeitem/TradeItemSelector";
import { useHistory } from "react-router-dom";
import { updateUrl } from "cdm-shared/utils/url";
import { newRandomInt } from "cdm-shared/utils/random";

export const MENU_HEIGHT = "56px";
export const SIDEBAR_WIDTH = "64px";

const Wrapper = styled(LightZone)`
  padding: 0.6rem 0rem;
  border-radius: 0 0;
  background-color: ${(props) => `rgb(${props.theme.color.white})`};
  height: ${MENU_HEIGHT};
  max-height: ${MENU_HEIGHT};
  overflow: hidden;
`;

const AlignedItemsRow = styled(Row)`
  flex-wrap: nowrap;
  margin: 0;
  align-items: center;
  padding-left: ${SIDEBAR_WIDTH};
`;

const WrapperInput = styled.span`
  padding-left: 1.4rem;
  display: inline-block;
  width: 300px;
`;

const LeftCol = styled(Col)`
  padding-left: 2rem;
`;

const RightCol = styled(Col)`
  display: flex;
  align-item: center !important;
  justify-content: flex-end;
  padding-right: 2rem;

  > * {
    margin-left: 1rem;
  }
`;

function Menu({ theme, translate }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const params = new URLSearchParams(window.location.search);
  const hideMenu = params.get('hideMenu') === 'true';

  const switchToLightTheme = useCallback(
    () => dispatch({ type: "MOD_THEME_SWITCH_LIGHT" }),
    [dispatch]
  );
  const switchToDarkTheme = useCallback(
    () => dispatch({ type: "MOD_THEME_SWITCH_DARK" }),
    [dispatch]
  );
  const goToProduct = useCallback(
    (ti) => {
      const tradeItemId = ti.tradeItemId;
      const masterTradeItemId = ti.masterTradeItemId;
      const updateProductUri = masterTradeItemId
        ? `/update-product/${masterTradeItemId}?variantId=${tradeItemId}`
        : `/update-product/${tradeItemId}`;
  
      history.push(updateProductUri);
    },
    [history]
  );
  const goToSearch = useCallback(
    (filters) => {
      updateUrl({ ...filters, refresh: newRandomInt() }, history, "/products");
    },
    [history]
  );

  return (
    <Wrapper>
      <AlignedItemsRow>
        <LeftCol col={8}>
          <Text bold inline style={{padding: '0 24px'}}>
            <Logo size={35} dark={!isCurrentThemeDark()} />
          </Text>
          <WrapperInput>
            {!hideMenu && <TradeItemSelector
              placeholder={translate("menu.searchplaceholder")}
              exitOnSelect={true}
              onTradeItemSelected={goToProduct}
              onEnter={goToSearch}
              onSearch={goToSearch}
            />}
          </WrapperInput>
        </LeftCol>
        <RightCol col>
          {/* messages */}
          <MessagingLink />
          {/* light/dark theme */}
          <Switch
            lg
            name="theme-switch"
            onChange={(checked) =>
              checked ? switchToLightTheme() : switchToDarkTheme()
            }
            checked={!isCurrentThemeDark()}
          />
        </RightCol>
      </AlignedItemsRow>
    </Wrapper>
  );
}

export default withTheme(withLocalization(Menu));
