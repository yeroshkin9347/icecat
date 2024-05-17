import React, { useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  position: relative;

  &:focus,
  &:hover,
  &:visited,
  &:link,
  &:active {
    text-decoration: none;
    color: inherit;
  }
`;

const PrimaryLink = styled(StyledLink)`
  color: ${props => `rgba(${props.theme.color.primary})`};

  &:focus,
  &:hover,
  &:visited,
  &:link,
  &:active {
    color: ${props => `rgba(${props.theme.color.primary})`};
  }
`;

const DefaultLink = styled.a`
  color: inherit;
  text-decoration: underline;
  cursor: pointer;

  &:focus,
  &:hover,
  &:visited,
  &:link,
  &:active {
    color: inherit;
  }
`;

const ExternalLink = styled.a`
  text-decoration: none;
  color: ${props => `rgba(${props.theme.color.primary})`};

  &:focus,
  &:hover,
  &:visited,
  &:link,
  &:active {
    color: ${props => `rgba(${props.theme.color.primary})`};
  }
`;

const AnchorLink = ({ href, children, offset, onClick, ...otherProps }) => {
  useEffect(() => {
    require("smoothscroll-polyfill").polyfill();
  }, []);

  const smoothScroll = e => {
    e.preventDefault();
    e.stopPropagation();
    let _offset = () => 0;
    if (typeof offset !== "undefined") {
      if (!!(offset && offset.constructor && offset.apply)) {
        _offset = offset;
      } else {
        _offset = () => parseInt(offset);
      }
    }
    const id = e.currentTarget.getAttribute("href").slice(1);
    const $anchor = document.getElementById(id);
    if (!$anchor) return;
    const offsetTop = $anchor.getBoundingClientRect().top + window.pageYOffset;
    window.scroll({
      top: offsetTop - _offset(),
      behavior: "smooth"
    });
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <div {...otherProps} href={href} onClick={smoothScroll}>
      {children}
    </div>
  );
};

export { DefaultLink, PrimaryLink, ExternalLink, AnchorLink };
export default StyledLink;
