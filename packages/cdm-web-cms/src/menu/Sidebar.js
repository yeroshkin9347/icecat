import React, { useState } from "react";
import { DarkZone, List, ListItem, Icon, Tooltip } from "cdm-ui-components";
import styled, { css } from "styled-components";
import { ic_mail_outline } from "react-icons-kit/md/ic_mail_outline";
import { ic_toys } from "react-icons-kit/md/ic_toys";
import { ic_video_call } from "react-icons-kit/md/ic_video_call";
import { ic_transform } from "react-icons-kit/md/ic_transform";
import { ic_call_made } from "react-icons-kit/md/ic_call_made";
import { ic_call_received } from "react-icons-kit/md/ic_call_received";
import { caretSquareORight } from "react-icons-kit/fa/caretSquareORight";
import { gift } from 'react-icons-kit/fa/gift'
import { link } from "react-icons-kit/ionicons/link";
import { plug } from "react-icons-kit/fa/plug";
import { wrench } from "react-icons-kit/fa/wrench";
import { chevronDown } from "react-icons-kit/fa/chevronDown";
import { chevronUp } from "react-icons-kit/fa/chevronUp";
import { Link, useLocation } from "react-router-dom";
import { SIDEBAR_WIDTH, MENU_HEIGHT } from "menu";
import { withLocalization } from "common/redux/hoc/withLocalization";

const Wrapper = styled(DarkZone)`
  position: fixed;
  left: 0;
  top: 0;
  width: ${SIDEBAR_WIDTH};
  height: 100%;
  padding: ${MENU_HEIGHT} 0.5rem;
  border-radius: 0 0;

  &:before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    height: ${MENU_HEIGHT};
    width: 100%;
    background-color: rgba(0, 0, 0, 0.6);
  }
`;

const CustomListItem = styled(ListItem)`
  padding: 0 0 0 0;
  margin-top: 0.5rem;
  ${(props) =>
    props.selected &&
    css`
      border: none;
      background-color: rgb(${props.theme.color.primary});

      > ${MenuItem} {
        color: ${props.theme.body.bg};
      }

      &:before {
        display: none;
      }

      &:hover {
        background-color: rgb(${props.theme.color.primary});
      }
    `}
`;

const MenuItem = styled(Link)`
  padding: 1.1rem 1rem 1rem 1rem;
  text-decoration: none;
  color: #fff;
  width: 100%;
  height: 50px;
  display: inline-block;
  margin: 0 auto;
  text-align: center;
`;

const TooltipContent = styled.div`
  padding: 0.2rem 1rem;
`;

function Sidebar({ translate }) {
  const location = useLocation();
  const [toggleSelect, setToggleSelect] = useState(false);

  return (
    <Wrapper noShadow>
      <List stacked>
        {/* Messages */}
        <CustomListItem selected={location.pathname === "/users-messages"}>
          <Tooltip
            placement="right"
            offset={[0, 8]}
            html={
              <TooltipContent>{translate("menu.userMessages")}</TooltipContent>
            }
          >
            <MenuItem to={`/users-messages`}>
              <Icon icon={ic_mail_outline} size={16} />
            </MenuItem>
          </Tooltip>
        </CustomListItem>

        {/* Products */}
        <CustomListItem selected={location.pathname === "/products"}>
          <Tooltip
            placement="right"
            html={<TooltipContent>{translate("menu.products")}</TooltipContent>}
          >
            <MenuItem to={`/products`}>
              <Icon icon={ic_toys} size={16} />
            </MenuItem>
          </Tooltip>
        </CustomListItem>

        {/* Videos */}
        <CustomListItem selected={location.pathname === "/videos"}>
          <Tooltip
            placement="right"
            html={<TooltipContent>{translate("menu.videos")}</TooltipContent>}
          >
            <MenuItem to={`/videos`}>
              <Icon icon={ic_video_call} size={16} />
            </MenuItem>
          </Tooltip>
        </CustomListItem>

        {/* Trade Item Transformations */}
        <CustomListItem selected={location.pathname === "/transformations"}>
          <Tooltip
            placement="right"
            html={<TooltipContent>{translate("menu.transformations")}</TooltipContent>}
          >
            <MenuItem to={`/transformations`}>
              <Icon icon={ic_transform} size={16} />
            </MenuItem>
          </Tooltip>
        </CustomListItem>
  
        <CustomListItem
            onClick={() => {
              setToggleSelect(!toggleSelect);
            }}
        >
          <Tooltip
              placement="right"
              html={
                <TooltipContent>{translate("menu.subscription")}</TooltipContent>
              }
          >
            <MenuItem>
              <Icon icon={caretSquareORight} size={16} />
              {toggleSelect ? (
                  <Icon icon={chevronUp} size={14} />
              ) : (
                  <Icon icon={chevronDown} size={14} />
              )}
            </MenuItem>
          </Tooltip>
        </CustomListItem>
  
        {toggleSelect && (
          <>
            <CustomListItem selected={location.pathname === "/offers"}>
              <Tooltip
                  placement="right"
                  html={
                    <TooltipContent>{translate("menu.offers")}</TooltipContent>
                  }
              >
                <MenuItem to={`/offers`}>
                  <Icon icon={gift} size={16} />
                </MenuItem>
              </Tooltip>
            </CustomListItem>
            <CustomListItem selected={location.pathname === "/subscriptions"}>
              <Tooltip
                  placement="right"
                  html={
                    <TooltipContent>
                      {translate("menu.subscriptions")}
                    </TooltipContent>
                  }
              >
                <MenuItem to={`/subscriptions`}>
                  <Icon icon={caretSquareORight} size={16} />
                </MenuItem>
              </Tooltip>
            </CustomListItem>
            <CustomListItem selected={location.pathname === "/connectors"}>
              <Tooltip
                placement="right"
                html={
                  <TooltipContent>
                    {translate("menu.connectors")}
                  </TooltipContent>
                }
              >
                <MenuItem to={`/connectors`}>
                  <Icon icon={plug} size={16} />
                </MenuItem>
              </Tooltip>
            </CustomListItem>
            <CustomListItem selected={location.pathname === "/connections"}>
              <Tooltip
                placement="right"
                html={
                  <TooltipContent>
                    {translate("menu.connections")}
                  </TooltipContent>
                }
              >
                <MenuItem to={`/connections`}>
                  <Icon icon={link} size={16} />
                </MenuItem>
              </Tooltip>
            </CustomListItem>
            <CustomListItem
              selected={location.pathname === "/connections-mass-tool"}
            >
              <Tooltip
                placement="right"
                html={
                  <TooltipContent>
                    {translate("menu.connections_mass_tool")}
                  </TooltipContent>
                }
              >
                <MenuItem to={`/connections-mass-tool`}>
                  <Icon icon={wrench} size={16} />
                </MenuItem>
              </Tooltip>
            </CustomListItem>
            <CustomListItem
                selected={location.pathname === "/connectors-mass-tool"}
            >
              <Tooltip
                  placement="right"
                  html={
                    <TooltipContent>
                      {translate("menu.connectors_mass_tool")}
                    </TooltipContent>
                  }
              >
                <MenuItem to={`/connectors-mass-tool`}>
                  <Icon icon={wrench} size={16} />
                </MenuItem>
              </Tooltip>
            </CustomListItem>
          </>
        )}

        {/* Imports */}
        <CustomListItem selected={location.pathname === "/imports"}>
          <Tooltip
            placement="right"
            html={<TooltipContent>{translate("menu.imports")}</TooltipContent>}
          >
            <MenuItem to={`/imports`}>
              <Icon icon={ic_call_received} size={16} />
            </MenuItem>
          </Tooltip>
        </CustomListItem>

        {/* Exports */}
        <CustomListItem selected={location.pathname === "/exports"}>
          <Tooltip
            placement="right"
            html={<TooltipContent>{translate("menu.exports")}</TooltipContent>}
          >
            <MenuItem to={`/exports`}>
              <Icon icon={ic_call_made} size={16} />
            </MenuItem>
          </Tooltip>
        </CustomListItem>
      </List>
    </Wrapper>
  );
}

export default withLocalization(Sidebar);
