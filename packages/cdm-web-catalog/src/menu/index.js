import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import styled, { css } from "styled-components";
import get from "lodash/get";
import filter from "lodash/filter";
import includes from "lodash/includes";
import { ic_add_circle } from "react-icons-kit/md/ic_add_circle";
import { ic_home } from "react-icons-kit/md/ic_home";
import {
  Zone,
  Row,
  Col,
  Text,
  List,
  ListItem,
  Padding,
  Icon,
  Tooltip,
  RoundedButton,
} from "cdm-ui-components";
import Logo from "cdm-shared/component/Logo";
import { withLocalization } from "common/redux/hoc/withLocalization";
import {
  isManufacturer,
  allowVideos,
  allowImportReports,
  allowExportTradeItems,
  allowCrud,
  allowUserManagement,
  allowSettings,
  allowStatistics,
  allowMessaging,
  isRetailer,
  doHardLogout,
} from "cdm-shared/redux/hoc/withAuth";
import Link from "cdm-shared/component/Link";
import withTheme from "cdm-shared/redux/hoc/withTheme";
import ChangeLanguage from "./ChangeLanguage";
import MessagingLink from "cdm-shared/component/messaging/MessagingLink";
import withUser from "cdm-shared/redux/hoc/withUser";
import { getManufacturerFeatureToggle } from "cdm-shared/services/collection";
import { isEqual } from "lodash";
import { Logout, Settings } from "@mui/icons-material";

export const MENU_MAIN_HEIGHT_NUMBER = 55;
export const MENU_MAIN_HEIGHT = `${MENU_MAIN_HEIGHT_NUMBER}px`;
const DARK_TEXT_COLOR = "#050505";

const MenuWrapper = styled.div`
  height: ${MENU_MAIN_HEIGHT};
`;

const MenuZone = styled(Zone)`
  position: fixed;
  z-index: 9999;
  top: 0;
  border-bottom: 1px solid ${(props) => `rgb(${props.theme.border.color})`};
  border-radius: 0;
  background-color: rgb(33, 39, 47) !important;
  padding: 0 1rem;
  box-shadow: 0 8px 10px 1px rgba(0, 0, 0, 0.01),
    0 3px 14px 2px rgba(0, 0, 0, 0.1), 0 5px 5px -3px rgba(0, 0, 0, 0.03) !important;
`;

const FlagContainer = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-44%);
  right: 10px;
`;

const MenuLinkA = styled(Link)`
  padding-top: 1.4rem;
  padding-bottom: 1.4rem;
  display: inline-block;
  color: #fff !important;

  ${(props) =>
    props.home &&
    css`
      padding-top: 1rem;
      padding-bottom: 1rem;
    `}

  ${(props) =>
    props.small &&
    css`
      padding-top: 0.2em;
      padding-bottom: 0.2em;
    `}
`;

const InfoCol = styled(Col)`
  border-left: 1px solid ${(props) => `rgb(${props.theme.border.color})`};
  color: #fff;
`;

const MenuLink = styled(ListItem)`
  padding-top: 0;
  padding-bottom: 0;
  position: relative;
  border-radius: 0 !important;
  padding-left: 1.2rem;
  padding-right: 1.2rem;
  background-color: transparent !important;
  height: ${MENU_MAIN_HEIGHT};

  ${(props) =>
    props &&
    props.selected &&
    css`
      ::before {
        bottom: -2px;
      }
    `}

  ${(props) =>
    props &&
    props.block &&
    css`
      display: block;
    `}

    ${(props) =>
    props &&
    props.highlighted &&
    css`
      background-color: rgb(${props.theme.color.secondary});
      color: #fff;
      &:hover {
        background-color: rgb(${props.theme.color.secondary});
        color: #fff;
      }
      ::before {
        display: none !important;
      }
      ::after {
        content: "";
        width: 100%;
        display: inline-block;
        position: absolute;
        background-color: rgb(${props.theme.color.secondary});
        height: 2px;
        bottom: -1px;
        left: 0;
      }
    `}

    ${MenuLinkA.selector} {
    font-weight: 400;
    font-size: 0.8rem;
    letter-spacing: initial;
    font-family: Montserrat, sans-serif;
    // color: #222 !important;
    ${(props) =>
      props.selected &&
      css`
        // color: #222 !important;
      `}
  }
`;

class Menu extends Component {
  state = {
    showCollections: false,
    showCollectionsLoaded: false,
  };

  componentWillReceiveProps(nextProps) {
    if (
      isManufacturer(nextProps.user) &&
      (!this.state.showCollectionsLoaded ||
        !isEqual(nextProps.user, this.props.user))
    ) {
      this.setState({ showCollectionsLoaded: true });
      getManufacturerFeatureToggle().then((res) => {
        this.setState({ showCollections: res.data });
      });
    }
  }

  render() {
    const { user, location, availableLanguages } = this.props;

    const { currentLocaleCode, changeActiveLanguage, translate } = this.props;

    const { showCollections } = this.state;

    const langs = filter(availableLanguages, (al) => al !== currentLocaleCode);

    return (
      <MenuWrapper>
        <Padding top={4}>&nbsp;</Padding>
        <MenuZone noShadow noPadding>
          <Row>
            {/* Cedemo's logo */}
            <Col col={2}>
              <Text
                style={{
                  verticalAlign: "top",
                  top: "50%",
                  left: "3em",
                  transform: "translateY(-50%)",
                }}
                uppercase
                spaced
                inline
                bold
              >
                <Logo size={40} />
              </Text>
            </Col>

            <Col col center>
              <List style={{ fontSize: ".9em" }}>
                {/* Dashboard  */}
                {isManufacturer(user) && (
                  <MenuLink
                    selected={location.pathname === "/"}
                    style={{ height: 56 }}
                  >
                    <MenuLinkA id="products-link" to={`/`}>
                      <Icon size={18} icon={ic_home} />
                    </MenuLinkA>
                  </MenuLink>
                )}

                {/* Catalog */}
                {isRetailer(user) && (
                  <MenuLink
                    selected={
                      location.pathname === "/dashboard" ||
                      includes(location.pathname, "/dashboard")
                    }
                  >
                    <MenuLinkA id="dashboard-link" to={`/dashboard`}>
                      <Text uppercase>{translate("header.nav.agenda")}</Text>
                    </MenuLinkA>
                  </MenuLink>
                )}

                {/* Catalog */}
                <MenuLink
                  selected={
                    location.pathname === "/catalog" ||
                    includes(location.pathname, "/product")
                  }
                >
                  <MenuLinkA id="products-link" to={`/catalog`}>
                    <Text uppercase>{translate("header.nav.catalog")}</Text>
                  </MenuLinkA>
                </MenuLink>

                {/* Videos */}
                {allowVideos(user) && (
                  <MenuLink selected={location.pathname === "/digital-assets-management"}>
                    <MenuLinkA to="/digital-assets-management">
                      <Text uppercase>{translate("header.nav.videos")}</Text>
                    </MenuLinkA>
                  </MenuLink>
                )}

                {/* Collections */}
                {showCollections && isManufacturer(user) && (
                  <MenuLink
                    selected={
                      location.pathname === "/collections" ||
                      includes(location.pathname, "/collections")
                    }
                  >
                    <MenuLinkA id="collections-link" to={`/collections`}>
                      <Text uppercase>
                        {translate("header.nav.collections")}
                      </Text>
                    </MenuLinkA>
                  </MenuLink>
                )}

                {/* Import */}
                {(allowImportReports(user) || isManufacturer(user)) && (
                  <Tooltip
                    placement="bottom"
                    appendTo="parent"
                    interactive
                    html={
                      <>
                        {allowImportReports(user) && (
                          <MenuLink block>
                            <MenuLinkA to={`/import-reports/all`}>
                              <Text uppercase color={DARK_TEXT_COLOR}>
                                {translate("header.nav.importReports")}
                              </Text>
                            </MenuLinkA>
                          </MenuLink>
                        )}
                        {isManufacturer(user) && (
                          <MenuLink block>
                            <MenuLinkA to={`/upload-matrix`}>
                              <Text uppercase color={DARK_TEXT_COLOR}>
                                {translate("header.nav.uploadMatrix")}
                              </Text>
                            </MenuLinkA>
                          </MenuLink>
                        )}
                      </>
                    }
                  >
                    <MenuLink
                      selected={includes(location.pathname, "/import-reports")}
                    >
                      <MenuLinkA
                        to={`/`}
                        onClick={(e) => {
                          e.preventDefault();
                          return false;
                        }}
                      >
                        <Text uppercase>{translate("header.nav.import")}</Text>
                      </MenuLinkA>
                    </MenuLink>
                  </Tooltip>
                )}

                {isRetailer(user) && allowExportTradeItems(user) && (
                  <>
                    {/* Export retailers */}
                    <MenuLink selected={location.pathname === "/export"}>
                      <MenuLinkA to={`/export`}>
                        <Text uppercase>{translate("header.nav.exports")}</Text>
                      </MenuLinkA>
                    </MenuLink>
                    <MenuLink
                      selected={location.pathname === "/export-requests"}
                    >
                      <MenuLinkA to={`/export-requests`}>
                        <Text uppercase>
                          {translate("header.nav.requests")}
                        </Text>
                      </MenuLinkA>
                    </MenuLink>
                  </>
                )}

                {/* Export manufacturers */}
                {isManufacturer(user) && (
                  <Tooltip
                    placement="bottom"
                    appendTo="parent"
                    interactive
                    html={
                      <>
                        <MenuLink block>
                          <MenuLinkA to={`/export`}>
                            <Text uppercase color={DARK_TEXT_COLOR}>
                              {translate("header.nav.export")}
                            </Text>
                          </MenuLinkA>
                        </MenuLink>
                        <MenuLink block>
                          <MenuLinkA to={`/network-status`}>
                            <Text uppercase color={DARK_TEXT_COLOR}>
                              {translate("header.nav.productsDistribution")}
                            </Text>
                          </MenuLinkA>
                        </MenuLink>
                      </>
                    }
                  >
                    <MenuLink
                      selected={
                        location.pathname === "/export" ||
                        location.pathname === "/network-status"
                      }
                    >
                      <MenuLinkA
                        to={`/`}
                        onClick={(e) => {
                          e.preventDefault();
                          return false;
                        }}
                      >
                        <Text uppercase>{translate("header.nav.export")}</Text>
                      </MenuLinkA>
                    </MenuLink>
                  </Tooltip>
                )}

                {/* Statistics */}
                {allowStatistics(user) && (
                  <Tooltip
                    placement="bottom"
                    appendTo="parent"
                    interactive
                    html={
                      <>
                        {/* Export stats */}
                        <MenuLink block>
                          <MenuLinkA to={`/statistics`}>
                            <Text uppercase color={DARK_TEXT_COLOR}>
                              {translate("header.nav.exportStats")}
                            </Text>
                          </MenuLinkA>
                        </MenuLink>
                      </>
                    }
                  >
                    <MenuLink
                      selected={includes(location.pathname, "/statistics")}
                    >
                      <MenuLinkA
                        to={`/`}
                        onClick={(e) => {
                          e.preventDefault();
                          return false;
                        }}
                      >
                        <Text uppercase>{translate("header.nav.stats")}</Text>
                      </MenuLinkA>
                    </MenuLink>
                  </Tooltip>
                )}

                {allowCrud(user) && (
                  <MenuLink
                    selected={
                      location.pathname === "/create-product" ||
                      includes(location.pathname, "/create-product")
                    }
                  >
                    <MenuLinkA
                      id="create-product-link"
                      to={`/create-product`}
                      style={{ padding: "1.1rem 0.6rem" }}
                    >
                      <Icon
                        style={{
                          color: "#fff",
                        }}
                        size={19}
                        icon={ic_add_circle}
                      />
                    </MenuLinkA>
                  </MenuLink>
                )}

                {/* CRUD */}
                {/* {allowCrud(user) && (
                  <MenuLink
                    style={{ padding: "0 0 0 0" }}
                    highlighted
                    selected={location.pathname === "/create-product"}
                  >
                    <MenuLinkA
                      style={{
                        display: "inline-block",
                        width: "4rem",
                      }}
                      to={`/create-product`}
                    >
                      <Text spaced uppercase inline></Text>
                      <Icon
                        style={{
                          position: "absolute",
                          left: "20px",
                          top: "50%",
                          transform: "translateY(-51%)",
                          color: "#fff",
                        }}
                        size={14}
                        icon={ic_add_circle}
                      />
                    </MenuLinkA>
                  </MenuLink>
                )} */}
              </List>
            </Col>

            {/* lang + settings + messaging*/}
            <Col col={1}>
              {/* messaging */}
              {allowMessaging(user) && (
                <span
                  style={{
                    position: "absolute",
                    top: "50%",
                    transform: "translateY(-50%)",
                    right:
                      allowSettings(user) && allowUserManagement(user)
                        ? "96px"
                        : "56px",
                    cursor: "pointer",
                  }}
                >
                  <MessagingLink color="#fff" />
                </span>
              )}

              {/* settings */}
              {allowSettings(user) && allowUserManagement(user) && (
                <span
                  style={{
                    position: "absolute",
                    top: "50%",
                    transform: "translateY(-50%)",
                    right: "56px",
                    cursor: "pointer",
                  }}
                >
                  <Link to={`/users`}>
                    <Settings fontSize="large" style={{ color: "#fff" }} />
                  </Link>
                </span>
              )}

              {/* change language */}
              <FlagContainer>
                <ChangeLanguage
                  currentLanguageCode={currentLocaleCode}
                  languages={langs}
                  onLanguageClicked={(langCode) =>
                    changeActiveLanguage(langCode)
                  }
                />
              </FlagContainer>
            </Col>

            {/* Account + login */}
            <InfoCol col={1}>
              <Padding top={3} />
              <Text
                style={{ fontSize: ".55rem", marginBottom: ".25rem" }}
                small
                uppercase
              >
                {get(user, "organization_name")}
              </Text>

              <Text bold small>
                {get(user, "given_name")}
              </Text>

              <RoundedButton
                id="link-logout"
                onClick={(e) => doHardLogout()}
                style={{
                  boxShadow: `0 0.3125rem 0.625rem 0 rgba(0,0,0, .25)`,
                  position: "absolute",
                  right: "2rem",
                  top: "18%",
                }}
                primary
                noMargin
              >
                <Logout fontSize="small" color="inherit" />
              </RoundedButton>
            </InfoCol>
          </Row>
          <Row></Row>
        </MenuZone>
      </MenuWrapper>
    );
  }
}

export default withUser(
  withRouter(withLocalization(withTheme(Menu)))
);
